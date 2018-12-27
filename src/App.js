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

const StartPauseButton = ({hasStarted, click}) => {
  let classes = 'game-button';
  if (hasStarted) {
    classes += ' pause';
  }
  return (
    <div className={classes}>
      <button onClick={click}>
        <b>{hasStarted ? 'pause' : 'start'}</b>
      </button>
    </div>
  );
};

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
  constructor() {
    super();

    const numRows = 10;
    const numCols = 10;
    let gridState = [];
    for (var i = 0; i < numRows; i++) {
      gridState.push([]);
      for (var j = 0; j < numCols; j++) {
        gridState[i].push(false);
      }
    }

    this.state = {
      rows: numRows,
      cols: numCols,
      numLiveCells: 0,
      gridState: gridState,
      hasStarted: false,
    };
  }

  toggleCell = (row, col) => {
    this.setState(state => {
      let newState = Object.assign({}, state);
      if (!newState.gridState[row][col]) {
        newState.numLiveCells++;
      } else {
        newState.numLiveCells--;
      }
      newState.gridState[row][col] = !newState.gridState[row][col];
      return newState;
    });
  };

  isWithinBounds(i, j) {
    return i >= 0 && i < this.state.rows && j >= 0 && j < this.state.cols;
  }

  calcNewGridState() {
    // 1. Any live cell with < 2 live neighbours die.
    // 2. Any live cell with 2 or 3 live neighbours live.
    // 3. Any live cell with > 3 live neighbours die.
    // 4. Any dead cell with exactly 3 live neighbours becomes live.
    let newGridState = [];
    let newTotalLiveCells = 0;
    for (var i = 0; i < this.state.rows; i++) {
      newGridState.push([]);
      for (var j = 0; j < this.state.cols; j++) {
        let newCellState = false;
        let numLiveNeighbours = 0;

        // Count number of live neighbours surrounding current cell i,j.
        for (var k = i - 1; k <= i + 1; k++) {
          for (var l = j - 1; l <= j + 1; l++) {
            if (this.isWithinBounds(k, l) && (k !== i || l !== j)) {
              if (this.state.gridState[k][l]) {
                numLiveNeighbours++;
              }
            }
          }
        }

        if (this.state.gridState[i][j]) {
          if (numLiveNeighbours < 2 || numLiveNeighbours > 3) {
            // Live cell dies
            newCellState = false;
          } else {
            // Live cell stays alive.
            newCellState = true;
          }
        } else {
          // Dead cell becomes live when exactly 3 live neighbours.
          newCellState = numLiveNeighbours === 3;
        }

        if (newCellState) {
          newTotalLiveCells++;
        }

        newGridState[i].push(newCellState);
      }
    }

    let newStateUpdates = {};
    newStateUpdates.gridState = newGridState;
    newStateUpdates.totalLiveCells = newTotalLiveCells;
    return newStateUpdates;
  }

  componentDidMount() {
    setInterval(() => {
      if (this.state.hasStarted) {
        this.setState(state => {
          let newState = Object.assign({}, state);
          if (state.numLiveCells === 0) {
            newState.hasStarted = false;
            console.log('There are no live cells, so why start?');
            return newState;
          }
          let newStateUpdates = this.calcNewGridState();
          newState.gridState = newStateUpdates.gridState;
          if (newStateUpdates.totalLiveCells === 0) {
            newState.hasStarted = false;
          }
          newState.numLiveCells = newStateUpdates.totalLiveCells;
          return newState;
        });
      }
    }, 1000);
  }

  toggleLife = () => {
    this.setState(state => ({
      hasStarted: !state.hasStarted,
    }));
  };

  render() {
    let totalCells = this.state.rows * this.state.cols;
    let numLiveCells = this.state.numLiveCells;
    return (
      <div>
        <Header />
        <p>Live Cells : {numLiveCells}</p>
        <p>Dead Cells : {totalCells - numLiveCells}</p>
        <MessageHeader hasStarted={this.state.hasStarted} />
        <Grid
          numRows={this.state.rows}
          numCols={this.state.cols}
          gridState={this.state.gridState}
          click={this.toggleCell}
          disabled={this.state.hasStarted}
        />
        <StartPauseButton
          click={this.toggleLife}
          hasStarted={this.state.hasStarted}
        />
        <Instructions />
        <Rules />
      </div>
    );
  }
}

export default App;
