var board = {
  lastPlay: "",
  posArr: [],
  magicSquare: [
    4, 9, 2, 3, 5, 7, 8, 1, 6
  ],
  gameOver: false,
  possibleWins: {
    row0: {score: 0, values: [0, 1, 2]},
    row3: {score: 0, values: [3, 4, 5]},
    row6: {score: 0, values: [6, 7, 8]},
    col1: {score: 0, values: [0, 3, 6]},
    col2: {score: 0, values: [1, 4, 7]},
    col3: {score: 0, values: [2, 5, 8]},
    diag1: {score: 0, values: [0, 4, 8]},
    diag2: {score: 0, values: [2, 4, 6]}
  },
  /*
   This function recalculates the scores of the players
   */
  calculateScores: function() {
    'use strict';
    var
      i, j, tempScore = 0;
    // Calculate row scores
    for (i = 0; i < 9; i += 3) {
      for (j = i; j < i + 3; j += 1) {
        tempScore += board.posArr[j] || 0;
      }
      board.possibleWins["row" + i].score = tempScore;
      tempScore = 0;
    }

    // Calculate column scores
    for (i = 0; i < 3; i += 1) {
      for (j = i; j < 9; j += 3) {
        tempScore += board.posArr[j] || 0;
      }
      board.possibleWins["col" + (i + 1) ].score = tempScore;
      tempScore = 0;
    }

    // Calculate diagonals scores
    board.possibleWins.diag1.values.map(function (value) {
      tempScore += board.posArr[value] || 0;
    });
    board.possibleWins.diag1.score = tempScore;
    tempScore = 0;

    // Calculate diagonals scores
    board.possibleWins.diag2.values.map(function (value) {
      tempScore += board.posArr[value] || 0;
    });
    board.possibleWins.diag2.score = tempScore;

    for (var move in board.possibleWins) {
      if (board.possibleWins.hasOwnProperty(move)) {
        if (board.possibleWins[move].score === 3) {
          alert("you win");
          console.log("you");
          board.gameOver = true;
        } else if (board.possibleWins[move].score === -3) {
          alert("I win");
          console.log("I");
          board.gameOver = true;
        }
      }
    }

    return;

  },
  /*
   This function gets an available element from the array.
   */
  getEmptyElement: function(rowValues) {
    "use strict";

    for (var i = 0; i < rowValues.length; i += 1) {
      if
        (board.posArr[rowValues[i]] === undefined) {
        return rowValues[i];
      }
    }
    return 10;
  },
  /*
   This function places the actual element on the page
   */
  setElement: function (position, character, value) {
    "use strict";

    var temp;
    if (position > 8) {
      return false;
    }
    temp = document.getElementById(position);
    temp.innerHTML = character;
    board.posArr[parseInt(position)] = value;
    board.calculateScores();
    return true;
  },
  /*
   This function fills in a random square after calculating which would minize the players odds
   */
  fillRandomSquare: function (playedPosition) {
    "use strict";

    var emptyElem, status = false, randRow;
    switch (true) {
      case playedPosition < 3:
        emptyElem = board.getEmptyElement(board.possibleWins.row0.values);
        status = board.setElement(emptyElem, "O", -1);
        return status;
      case (playedPosition >= 3 && playedPosition < 6):
        emptyElem = board.getEmptyElement(board.possibleWins.row3.values);
        status = board.setElement(emptyElem, "O", -1);
        return status;
      case (playedPosition >= 6 && playedPosition < 8):
        emptyElem = board.getEmptyElement(board.possibleWins.row6.values);
        status = board.setElement(emptyElem, "O", -1);
        return status;
      default:
        randRow = Math.floor(Math.random() * 3) * 3;
        emptyElem = board.getEmptyElement(board.possibleWins['row' + randRow].values);
        status = board.setElement(emptyElem, "O", -1);
        return status;
    }
    return status;
  },

  makeWinningMove: function(playedPosition, move) {
    "use strict";

    var done = false;
    // Win the game if possible
    board.possibleWins[move].values.map(function (value) {
      if (board.posArr[value] === undefined && done === false) {
        board.setElement(value, "O", -1);
        done = true;
      }
    });
    return done;
  },

  playNextMove: function(playedPosition) {
    "use strict";

    var done = false, status = false;

    if (board.gameOver === true) {
      return;
    }

    if (board.gameOver === false) {
      if (board.posArr.filter(function(value){return value !== undefined;}).length === 9) {
        alert("That was a tie");
        return;
      }
    }

    board.calculateScores();


    for (var move in board.possibleWins) {
      if (board.possibleWins.hasOwnProperty(move)) {

        if (board.possibleWins[move].score === -2) {
          // Win the game if possible
          done = board.makeWinningMove(playedPosition, move);
        }

        if (done === true) {
          return;
        }

        // Block the player from winning the game
        if (board.possibleWins[move].score === 2) {
          done = board.makeWinningMove(playedPosition, move);
        }
      }
    }

    // Make a move so that the odds of the player winning are minimized. This involves selecting a square on which the player already has a piece
    if (done === false) {
      done = board.fillRandomSquare(playedPosition);
      console.log(done);
      if (done === false) {
        board.playNextMove(10);
      }
    }

  },

  handleClick: function(event) {
    "use strict";

    if (event.target.innerHTML === "") {
      board.setElement(event.target.id, "X", 1);
      board.playNextMove(event.target.id);
    } else {
      alert("The square is already taken. Please choose another one.")
    }
  }

};

var table = document.getElementById("board");
table.addEventListener("click", board.handleClick);