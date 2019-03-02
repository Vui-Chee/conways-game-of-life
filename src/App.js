import React, {Component} from 'react';
import Grid from './Grid';

const messages = {
  stop: 'Use arrow keys to move window.',
  start: 'Simulation has started.',
  instruction: 'Select any number cells to be live and click start.',
  pause: 'Click pause to stop the simulation.',
};

const DOWN_KEYCODE = 40;
const UP_KEYCODE = 38;
const LEFT_KEYCODE = 37;
const RIGHT_KEYCODE = 39;

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
    startingCorner: {
      x: 0,
      y: 0,
    },
    liveCells: {},
    hasStarted: false,
    numRows: 12,
    numCols: 12,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.moveWindow);

    setInterval(() => {
      const {hasStarted} = this.state;
      if (hasStarted) {
        this.tick();
      }
    }, 1000);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.moveWindow);
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

  countTotalLiveCells(cells) {
    let total = 0;
    Object.keys(cells).forEach(rowStr => {
      total += Object.keys(cells[rowStr]).length;
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
      hasStarted: this.countTotalLiveCells(newLiveCells) > 0,
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

  moveWindow = e => {
    // Prevents scrolling when using arrow keys.
    e.preventDefault();

    let newStartingCorner = {
      x: this.state.startingCorner.x,
      y: this.state.startingCorner.y,
    };

    if (e.keyCode === DOWN_KEYCODE) {
      newStartingCorner.x++;
    } else if (e.keyCode === UP_KEYCODE) {
      newStartingCorner.x--;
    } else if (e.keyCode === LEFT_KEYCODE) {
      newStartingCorner.y--;
    } else if (e.keyCode === RIGHT_KEYCODE) {
      newStartingCorner.y++;
    } else {
      // Don't updating state.
      return;
    }

    this.setState({startingCorner: newStartingCorner});
  };

  render() {
    const {
      numRows,
      numCols,
      liveCells,
      hasStarted,
      startingCorner,
    } = this.state;

    return (
      <React.Fragment>
        <h1> Conway's Game of Life </h1>
        <MessageHeader hasStarted={hasStarted} />
        <p>Number of Live Cells : {this.countTotalLiveCells(liveCells)}</p>
        <Grid
          startingCorner={startingCorner}
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
      </React.Fragment>
    );
  }
}

export default App;
