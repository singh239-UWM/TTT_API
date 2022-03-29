# Tic Tac Toe API

This API GET a board and player (O or X), and return the best move to play.

## Installation

Clone the repo, and install dependencies by using npm command

```bash
npm install
```

## Running server

Run the server.

```bash
npm run dev
```

## Usage

Borad and player can be sent to this API using params

The following code is being used in app.

```js
const player = 'X'
const board = "X---OOX--" //this will represent above board
let url = "http://localhost:8080/aiturn?board=" + board + "&player=" + player;
      fetch(url)
      .then(res => res.json())
      .then((result) => {
        console.log(result.bestMove); // this will return 3, since the best move is in box 3(from left to right, then top to down
      })
```
