import React, {Component} from 'react';
import Grid from './Grid';

const messages = {
  stop:
    'Simulation stops when there are no live cells or when the simulation is paused.',
  start: 'Simulation has started.',
  instruction: 'Select any number cells to be live and click start.',
  pause: 'Click pause to stop the simulation.',
};

const Header = () => <h1> Conway's Game of Life </h1>;

const Instructions = () => (
  <div className="instructions">
    <h2> Instructions </h2>
    <ul>
      <li> All cells are initially dead. </li>
      <li>
        {' '}
        <b>Click</b> any number of cells to be live.{' '}
      </li>
      <li> Then press start to begin the simulation. </li>
    </ul>
  </div>
);

const Rules = () => (
  <div className="rules">
    <h3> Rules of Life </h3>
    <ul>
      <li> Any live cell with less than two live neighbours dies. </li>
      <li>Any live cell with two or three live neighbours remains living.</li>
      <li>Any live cell with more than three live neighbours dies.</li>
      <li>
        Any dead cell with exactly three live neighbours becomes a live cell.
      </li>
    </ul>
  </div>
);

const GameButton = ({text, click, customStyles, disabled}) => (
  <div className={`game-button ${customStyles}`}>
    <button onClick={click} disabled={disabled}>
      <b>{text}</b>
    </button>
  </div>
);

const MessageHeader = ({hasStarted}) => {
  if (hasStarted) {
    return (
      <b>
        <p>{messages.start}</p>
        <p>{messages.pause}</p>
      </b>
    );
  }
  return (
    <b>
      <p>{messages.stop}</p>
      <p>{messages.instruction}</p>
    </b>
  );
};

class App extends Component {
  state = {
    liveCells: {},
    hasStarted: false,
    numRows: 15,
    numCols: 15,
  };

  componentDidMount() {
    setInterval(() => {
      const {hasStarted} = this.state;
      if (hasStarted) {
        this.tick();
      }
    }, 1000);
  }

  findNeighbours(i, j) {
    const {liveCells} = this.state;
    let liveNeighbours = [];
    let deadNeighbours = [];

    for (let currRow = i - 1; currRow <= i + 1; currRow++) {
      for (let currCol = j - 1; currCol <= j + 1; currCol++) {
        if (i === currRow && j === currCol) continue;
        try {
          if (liveCells[currRow][currCol] !== undefined) {
            liveNeighbours.push({
              x: currRow,
              y: currCol,
            });
          } else {
            // Consider case where column element
            // does not exist in this row.
            deadNeighbours.push({
              x: currRow,
              y: currCol,
            });
          }
        } catch (e) {
          deadNeighbours.push({
            x: currRow,
            y: currCol,
          });
        }
      }
    }

    return {
      liveNeighbours,
      deadNeighbours,
    };
  }

  insertCell(i, j, cells) {
    // console.log(i, j, cells);
    try {
      // There are other live cells in that row.
      cells[i][j] = true;
    } catch (e) {
      // First live cell in this row.
      cells[i] = {};
      cells[i][j] = true;
    }
  }

  removeCell(i, j, cells) {
    try {
      // Suppose you deleted the last cell of this row,
      // remove empty object in this row.
      if (Object.keys(cells[i]).length <= 1) {
        delete cells[i];
      } else {
        delete cells[i][j];
      }
    } catch (e) {
      // Row does not have any live cells.
    }
  }

  countTotalLiveCells() {
    const {liveCells} = this.state;
    let total = 0;
    Object.keys(liveCells).forEach(rowStr => {
      total += Object.keys(liveCells[rowStr]).length;
    });
    return total;
  }

  tick() {
    // 1. Any live cell with < 2 live neighbours die.
    // 2. Any live cell with 2 or 3 live neighbours live.
    // 3. Any live cell with > 3 live neighbours die.
    // 4. Any dead cell with exactly 3 live neighbours becomes live.
    const {liveCells} = this.state;
    let newLiveCells = {};
    Object.keys(liveCells).forEach(rowStr => {
      Object.keys(liveCells[rowStr]).forEach(colStr => {
        let [i, j] = [parseInt(rowStr), parseInt(colStr)];
        const {liveNeighbours, deadNeighbours} = this.findNeighbours(i, j);
        // If live cell stays alive, insert it into newLiveCells.
        if (liveNeighbours.length >= 2 && liveNeighbours.length <= 3) {
          this.insertCell(i, j, newLiveCells);
        }

        // Dead neighbours becoming live.
        // What if 2 live cell share the same dead neighbours???
        deadNeighbours.forEach(deadCell => {
          const {liveNeighbours} = this.findNeighbours(deadCell.x, deadCell.y);
          if (liveNeighbours.length === 3) {
            // If a cell is already inserted, the method should
            // not double add.
            this.insertCell(deadCell.x, deadCell.y, newLiveCells);
          }
        });
      });
    });

    this.setState({
      liveCells: newLiveCells,
    });
  }

  toggleLife = () => {
    this.setState(state => ({
      hasStarted: !state.hasStarted,
    }));
  };

  toggleCell = (i, j) => {
    const {liveCells} = this.state;
    let newCells = Object.assign({}, liveCells);

    try {
      if (newCells[i][j]) {
        this.removeCell(i, j, newCells);
      } else {
        throw 'insert cell';
      }
    } catch (e) {
      this.insertCell(i, j, newCells);
    }

    this.setState({
      liveCells: newCells,
    });
  };

  clearLiveCells = () => {
    this.setState({liveCells: {}});
  };

  render() {
    const {numRows, numCols, liveCells, hasStarted} = this.state;

    return (
      <React.Fragment>
        <Header />
        <MessageHeader hasStarted={hasStarted} />
        <p>Number of Live Cells : {this.countTotalLiveCells()}</p>
        <Grid
          numRows={numRows}
          numCols={numCols}
          liveCells={liveCells}
          click={this.toggleCell}
          disabled={hasStarted}
        />
        <GameButton
          text={hasStarted ? 'pause' : 'start'}
          click={this.toggleLife}
          customStyles={hasStarted ? 'pause' : ''}
        />
        <GameButton
          text={hasStarted ? '--' : 'clear'}
          click={this.clearLiveCells}
          disabled={hasStarted}
        />
        <Instructions />
        <Rules />
      </React.Fragment>
    );
  }
}

export default App;
