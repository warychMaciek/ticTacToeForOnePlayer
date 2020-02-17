const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageText = document.querySelector('[data-winning-message-text]');
const winningMessageContainer = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
let oTurn;

startGame();

function startGame() {
    oTurn = (Math.random() >= 0.5);
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.addEventListener('click', handleClick, {once: true});
    })
    if (oTurn) {
        aITurn();
    }
    setBoardHoverClass();
    winningMessageContainer.classList.remove('show');
}

restartButton.addEventListener('click', startGame);

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    oTurn = !oTurn;
    if (oTurn) {
        aITurn();
    }
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (oTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        })
    })
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    })
}

function endGame(draw) {
    if (draw) {
        winningMessageText.innerText = 'Draw!';
    } else {
        winningMessageText.innerText = `You ${oTurn ? 'lose' : 'won'}!`;
    }
    winningMessageContainer.classList.add('show');
}

// AI section

function aITurn() {
        const bestSpot = minimax(checkBoardState(), oTurn).index;
        cellElements[bestSpot].click();
}

function checkBoardState() {
    const boardState = [...cellElements];
    
    for(let i = 0; i < boardState.length; i++) {
        if (boardState[i].classList.contains(X_CLASS)) {
            boardState[i] = 'x';
        } else if (boardState[i].classList.contains(O_CLASS)) {
            boardState[i] = 'o';
        } else {
            boardState[i] = 'empty';
        }
    }
    return boardState;
}

function minimax(boardState, player) {
    const currentPlayer = player ? O_CLASS : X_CLASS;
    const emptyCells = [];
    const checkOWinning = [];
    const checkXWinning = [];

    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === 'empty') {
            emptyCells.push(i);
        } else if (boardState[i] === 'o') {
            checkOWinning.push(i);
        } else {
            checkXWinning.push(i);
        }
    }
    
    if (checkWinMinimax(checkOWinning)) {
        return {score: 10};
    } else if (checkWinMinimax(checkXWinning)) {
        return {score: -10};
    } else if (emptyCells.length === 0) {
        return {score: 0};
    }
    
    const moves = [];
    for (let i = 0; i < emptyCells.length; i++) {
        const helpingBoard = [...boardState];
        let move = {};
        move.index = emptyCells[i];
        helpingBoard[emptyCells[i]] = currentPlayer;
        move.player = currentPlayer;
        const result = (minimax(helpingBoard, !player));
        move.score = result.score;  
        moves.push(move);
    }
    
    let bestMove;
    if (currentPlayer === O_CLASS) {
        let bestScore = -1000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {       
                bestScore = moves[i].score;
                bestMove = i;
            }
        }                            
    } else {
        let bestScore = 1000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function checkWinMinimax(markedCells) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(element => {
            return markedCells.includes(element);
        })
    })
}




