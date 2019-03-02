import React from 'react';

const GridRow = ({numCols, liveCells, disabled, click, row}) => {
  var cells = [];
  let button;

  for (var i = 0; i < numCols; i++) {
    button = <button disabled={disabled} onClick={click.bind(this, row, i)} />;

    let cell;
    let classNames = 'grid-cell';
    classNames += !disabled ? ' hover' : '';

    try {
      if (liveCells[row][i]) {
        classNames += ' live';
      }
    } catch (e) {}

    cell = (
      <div className={classNames} key={i}>
        {button}
      </div>
    );

    cells.push(cell);
  }
  return <div className="grid-row"> {cells}</div>;
};

const Grid = props => {
  var rows = [];
  for (var i = 0; i < props.numRows; i++) {
    rows.push(<GridRow key={i} row={i} {...props} />);
  }
  return <div className="grid">{rows}</div>;
};

export default Grid;
