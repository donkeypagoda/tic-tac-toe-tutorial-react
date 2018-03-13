import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }


  render() {
    let boardArr = []
    let count = 0
    for (let i = 0; i < 3; i++){
      boardArr.push('<div className="board-row">')
      for (let j = 0; j < 3; j++){
        boardArr.push("{this.renderSquare(count)}")
        count++
      }
      boardArr.push("</div>")
    }
    boardArr = boardArr.join("")
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        rowCol: [null, null]
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    const rowCol = this.state.history[this.state.history.length - 1].rowCol.slice();

    if (this.state.history.length > 0){
      let index = null
      let prev = this.state.history[this.state.stepNumber] ? this.state.history[this.state.stepNumber].squares : null
      let last = squares
      if (prev === null) index = last.findIndex(i => i !== null)
      else {
        for (let i = 0; i < 10; i++){
          if (prev[i] !== last[i]) index = i
        }
      }
      if (index > -1 && index < 3){
        rowCol[0] = 1
        rowCol[1] = index + 1
      }
      if (index > 2 && index < 6){
        rowCol[0] = 2
        rowCol[1] = index - 2
      }
      if (index > 5){
        rowCol[0] = 3
        rowCol[1] = index - 5
      }
    }

    this.setState({
      history: history.concat([{
        squares: squares,
        rowCol: rowCol
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }




  rowCol(current, prev) {
    let index = null
    if (!prev) index = current.squares.indexOf(!null)
    else {
      index = current.findIndex(move => {
        for (let i = 0; i < prev.length; i++){
          if (current[move] !== prev[i]) {
            return i
          }
        }
      })
    }
    return index
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      let isBold = this.state.stepNumber === move ? "bold" : " "
      const desc = move ? "Go to move #" + move + " Row:" + history[move].rowCol[0] + " Col:" + history[move].rowCol[1] : "Go to game start"
      return (
        <li className={isBold} key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
