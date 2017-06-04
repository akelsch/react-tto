import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

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
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let board = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        row.push(this.renderSquare((i * 3) + j));
      }
      board.push(<div key={i} className="board-row">{row}</div>);
    }
    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          coordinates: Array(2).fill(null),
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      sortedHistory: [],
      sorted: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";

    let x = (i % 3) + 1;
    let y = Math.floor(i / 3) + 1;

    this.setState({
      history: history.concat([
        {
          squares: squares,
          coordinates: [x, y],
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  sortMoves(history) {
    let sorted = this.state.sorted;

    history.sort((a, b) => {
      if (a.coordinates[0] === b.coordinates[0]) {
        return sorted ?
          a.coordinates[1] - b.coordinates[1] :
          b.coordinates[1] - a.coordinates[1];
      }
      return sorted ?
        a.coordinates[0] - b.coordinates[0] :
        b.coordinates[0] - a.coordinates[0];
    });

    this.setState({
      sortedHistory: history,
      sorted: !sorted,
    });
  }

  render() {
    const history = this.state.history;
    const sortedHistory = this.state.sortedHistory.filter(
      e => e.coordinates[0] || e.coordinates[1]
    );
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const x = step.coordinates[0];
      const y = step.coordinates[1];
      const desc = move ? "Move (" + x + ", " + y + ")" : "Game start";
      const bold = (move === this.state.stepNumber) ? {fontWeight: "bold"} : {};
      return (
        <li key={move}>
          <a href="#" style={bold} onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    const sortedMoves = sortedHistory.map((step, move) => {
      const x = step.coordinates[0];
      const y = step.coordinates[1];
      const desc = "Move (" + x + ", " + y + ")";
      return (
        <li key={move}>
          <a href="#">{desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
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
          <ol start="0">{moves}</ol>
          <button onClick={() => this.sortMoves(history.slice())}>
            Sort
          </button>
        </div>
        <div className="game-info">
          <div>Sorted Moves</div>
          <ol>{sortedMoves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

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
