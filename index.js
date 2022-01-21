const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8080;

app.use(express.json())
app.use(cors({
    origin : "*"
}))

app.listen(
    PORT,
    () => console.log('Running on http://localhost:8080')
)

// app.get('/aiturn', (req, res) => {
//     res.status(200).send(
//         ["X", "O"]
//     )
// });

app.get('/aiturn', (req, res) => {
    let temp = req.query.board;
    if(!temp) {
        res.status(400).send(
            {msg: "No board sent"}
        )
        return
    }
    const boardSTR = temp.toUpperCase();

    temp = req.query.player;
    if(!temp) {
        res.status(400).send(
            {msg: "No player sent"}
        )
        return
    }
    const player = temp.toUpperCase();
    console.log("Board: " + boardSTR + ", " + "player: " + player)

    // board state should have 9 elements "-" if empty box
    if(boardSTR && player) {
        if(boardSTR.length != 9) {
            res.status(400).send(
                {msg: "Invalid board state"}
            )
            return
        } else if(player != 'X' && player != 'O') {
            res.status(400).send(
                {msg: "Invalid player type, should be X or O"}
            )
            return
        }
    } else {
        res.status(400).send(
            {msg: "req should have params[board and player]"}
        )
        return
    }
    //
    
    const board = createBoard(boardSTR)
    console.log(board)
    if(!board) {
        res.status(400).send(
            {msg: "Board countain invalid type"}
        )
        return
    }

    let bestMove = -1;
    // let bestScore = 0;
    if(player === 'X') {
        let bestScore = Number.NEGATIVE_INFINITY;
        for(let i = 0; i < board.length; i++) {
            if(board[i] === '-') {
                board[i] = player;
                let score = minimax(board, 0, 'O');
                board[i] = '-';
                if(score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
    } else {
        let bestScore = Number.POSITIVE_INFINITY;
        for(let i = 0; i < board.length; i++) {
            if(board[i] === '-') {
                board[i] = player;
                let score = minimax(board, 0, 'X');
                board[i] = '-';
                if(score < bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
    }

    
    console.log(bestMove);
    if(bestMove != -1)
        board[bestMove] = player;
    console.log(board);
    res.send(
        {bestMove: bestMove}
    )
});

function createBoard(boardSTR) {
    let board = [];
    for (let i = 0; i < boardSTR.length; i++) {
        if(boardSTR[i] != 'X' && boardSTR[i] != 'O' && boardSTR[i] != '-') {
            return null
        }
        board.push(boardSTR[i])
    }
    return board
}

function minimax(board, depth, player) {
    let result = isGameOver(board);
    // console.log(board);
    
    if(result === 'X') {
        return 10;
    } else if(result === 'O') {
        return -10;
    } else if(result === 'T') {
        return 0;
    }
    

    if(player === 'X') {
        let bestScore = Number.NEGATIVE_INFINITY;
        for(let i = 0; i < board.length; i++) {
            if(board[i] === '-') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, 'O');
                board[i] = '-';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Number.POSITIVE_INFINITY;
        for(let i = 0; i < board.length; i++) {
            if(board[i] === '-') {
                board[i] = "O";
                let score = minimax(board, depth + 1, 'X');
                board[i] = '-';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function isGameOver(board) {
    if(board.indexOf('-') === -1) {
        return 'T';
    }
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

        if ( (board[a] && board[a] === board[b] && board[a] === board[c]) && 
             (board[a] != '-' && board[b] != '-' && board[c] != '-')) {
           
            return board[a];
        }
      }
      return null;
}