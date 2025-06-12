// Enhanced game.js with TensorFlow.js AI integration

const params = new URLSearchParams(window.location.search);
const playerSymbol = params.get('symbol');
const difficulty = params.get('difficulty');

const cell1 = document.getElementById('1');
const cell2 = document.getElementById('2');
const cell3 = document.getElementById('3');
const cell4 = document.getElementById('4');
const cell5 = document.getElementById('5');
const cell6 = document.getElementById('6');
const cell7 = document.getElementById('7');
const cell8 = document.getElementById('8');
const cell9 = document.getElementById('9');

const gameTitle = document.getElementById('title');

let cell1Value = 'Empty';
let cell2Value = 'Empty';
let cell3Value = 'Empty';
let cell4Value = 'Empty';
let cell5Value = 'Empty';
let cell6Value = 'Empty';
let cell7Value = 'Empty';
let cell8Value = 'Empty';
let cell9Value = 'Empty';

const startAgainButton = document.getElementById('start-again-button');
const changeGameButton = document.getElementById('change-game-button');
const roundCount = document.getElementById('round-count');
const turnDisplay = document.getElementById('turn-title');

const players = ['Player X', 'Player O'];

let randomPlayer;
let playerTurn;
let round = 1;
let gameEnabled = true;

let playerOscore = 0;
let playerXscore = 0;

// AI learning variables
let gameHistory = [];
let currentGameMoves = [];

randomPlayer = players[Math.floor(Math.random() * players.length)];
playerTurn = randomPlayer;

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function clearBoard() {
    document.querySelectorAll('.bx-circle').forEach(el => el.remove());
    document.querySelectorAll('.bx-x').forEach(el => el.remove());

    cell1Value = 'Empty';
    cell2Value = 'Empty';
    cell3Value = 'Empty';
    cell4Value = 'Empty';
    cell5Value = 'Empty';
    cell6Value = 'Empty';
    cell7Value = 'Empty';
    cell8Value = 'Empty';
    cell9Value = 'Empty';
    
    // Reset move tracking
    currentGameMoves = [];
}

function nextMove() {
    if (playerTurn === 'Player X') {
        playerTurn = 'Player O';
    } else {
        playerTurn = 'Player X';
    }
    turnDisplay.textContent = `${playerTurn} turn`;
}

function newRound() {
    gameEnabled = true;
    round += 1;

    if (playerTurn === 'Player X') {
        playerTurn = 'Player O';
    } else {
        playerTurn = 'Player X';
    }

    turnDisplay.textContent = `${playerTurn} turn`;
    roundCount.textContent = `Round ${round}`;

    clearBoard();
    printScore();
}

function restart() {
    round = 1;
    playerOscore = 0;
    playerXscore = 0;
    gameEnabled = true;

    clearBoard();

    if (playerTurn === 'Player X') {
        playerTurn = 'Player O';
    } else {
        playerTurn = 'Player X';
    }

    gameTitle.style.color = '#333';
    roundCount.textContent = 'Round 1';
    turnDisplay.textContent = `${playerTurn} turn`;
    gameTitle.textContent = 'Tic-Tac-Toe';

    document.querySelectorAll('.scoreNum').forEach(el => el.remove());
}

function printScore() {
    const playerXDiv = document.querySelector('.player-X-score');
    const playerODiv = document.querySelector('.player-O-score');

    let newRedScore = document.createElement('h1');
    newRedScore.textContent = `${playerXscore}`;
    newRedScore.className = 'scoreNum';
    playerXDiv.appendChild(newRedScore);

    let newBlueScore = document.createElement('h1');
    newBlueScore.textContent = `${playerOscore}`;
    newBlueScore.className = 'scoreNum';
    newBlueScore.id = 'paddingBlue';
    playerODiv.appendChild(newBlueScore);
}

// Track moves for AI learning
function trackMove(cellIndex, player) {
    if (difficulty === 'Players') return; // Don't track for 2-player games
    
    const board = [
        cell1Value, cell2Value, cell3Value,
        cell4Value, cell5Value, cell6Value,
        cell7Value, cell8Value, cell9Value
    ];
    
    // Store the board state before the move
    const boardBeforeMove = [...board];
    boardBeforeMove[cellIndex] = 'Empty'; // Set the move position to empty for the "before" state
    
    currentGameMoves.push({
        board: boardBeforeMove,
        player: player,
        move: cellIndex
    });
}

// Learn from completed game
async function learnFromCompletedGame(winner) {
    if (window.gameAI && currentGameMoves.length > 0 && difficulty !== 'Players') {
        await window.gameAI.learnFromGame(currentGameMoves, winner);
        
        // Periodically save the model
        if (Math.random() < 0.1) { // 10% chance to save after each game
            await window.gameAI.saveModel();
        }
    }
    currentGameMoves = []; // Reset for next game
}

async function checkEnd() {
    let winner = null;
    
    if (cell1Value === 'Player X' && cell2Value === 'Player X' && cell3Value === 'Player X' ||
        cell4Value === 'Player X' && cell5Value === 'Player X' && cell6Value === 'Player X' ||
        cell7Value === 'Player X' && cell8Value === 'Player X' && cell9Value === 'Player X' ||
        cell1Value === 'Player X' && cell4Value === 'Player X' && cell7Value === 'Player X' ||
        cell2Value === 'Player X' && cell5Value === 'Player X' && cell8Value === 'Player X' ||
        cell3Value === 'Player X' && cell6Value === 'Player X' && cell9Value === 'Player X' ||
        cell1Value === 'Player X' && cell5Value === 'Player X' && cell9Value === 'Player X' ||
        cell3Value === 'Player X' && cell5Value === 'Player X' && cell7Value === 'Player X') {
        
        playerXscore += 1;
        gameEnabled = false;
        winner = 'Player X';
        
        await learnFromCompletedGame(winner);
        await wait(1000);
        newRound();
        
    } else if (cell1Value === 'Player O' && cell2Value === 'Player O' && cell3Value === 'Player O' ||
        cell4Value === 'Player O' && cell5Value === 'Player O' && cell6Value === 'Player O' ||
        cell7Value === 'Player O' && cell8Value === 'Player O' && cell9Value === 'Player O' ||
        cell1Value === 'Player O' && cell4Value === 'Player O' && cell7Value === 'Player O' ||
        cell2Value === 'Player O' && cell5Value === 'Player O' && cell8Value === 'Player O' ||
        cell3Value === 'Player O' && cell6Value === 'Player O' && cell9Value === 'Player O' ||
        cell1Value === 'Player O' && cell5Value === 'Player O' && cell9Value === 'Player O' ||
        cell3Value === 'Player O' && cell5Value === 'Player O' && cell7Value === 'Player O') {

        playerOscore += 1;
        gameEnabled = false;
        winner = 'Player O';
        
        await learnFromCompletedGame(winner);
        await wait(1000);
        newRound();
        
    } else if (cell1Value !== 'Empty' && cell2Value !== 'Empty' && cell3Value !== 'Empty' && 
               cell4Value !== 'Empty' && cell5Value !== 'Empty' && cell6Value !== 'Empty' && 
               cell7Value !== 'Empty' && cell8Value !== 'Empty' && cell9Value !== 'Empty') {
        
        gameEnabled = false;
        winner = 'draw';
        
        await learnFromCompletedGame(winner);
        await wait(1000);
        newRound();
        
    } else {
        nextMove();
    }

    if (round === 5) {
        if (playerXscore > playerOscore) {
            printScore();
            gameTitle.textContent = 'Player X wins';
            gameTitle.style.color = 'rgb(236, 0, 0)';
        } else if (playerOscore > playerXscore) {
            printScore();
            gameTitle.textContent = 'Player O wins';
            gameTitle.style.color = 'rgb(0, 99, 212)';
        } else {
            printScore();
            gameTitle.textContent = 'It\'s a draw';
            gameTitle.style.color = '#333';
        }
        
        turnDisplay.textContent = 'Press start again to play again';
        gameEnabled = false;
    }
}

async function handleAITurn() {
    if (!gameEnabled) return;

    const isAI = (playerTurn === 'Player X' && playerSymbol !== 'Player X') ||
                 (playerTurn === 'Player O' && playerSymbol !== 'Player O');

    if (isAI) {
        await wait(400); // Give some delay so user sees the transition
        
        if (difficulty === 'Easy') {
            await makeRandomAIMove();
        } else if (difficulty === 'Hard') {
            await makeSmartAIMove();
        }
    }
}

// Enhanced AI move using TensorFlow.js
async function makeSmartAIMove() {
    if (!gameEnabled) return;
    
    const isAI = (playerTurn === 'Player X' && playerSymbol !== 'Player X') ||
                 (playerTurn === 'Player O' && playerSymbol !== 'Player O');
    
    if (!isAI) return;

    // Check if AI is available
    if (!window.gameAI || !window.gameAI.modelLoaded) {
        console.log('AI not ready, falling back to random move');
        await makeRandomAIMove();
        return;
    }

    // Get current board state
    const board = [
        cell1Value, cell2Value, cell3Value,
        cell4Value, cell5Value, cell6Value,
        cell7Value, cell8Value, cell9Value
    ];

    try {
        const moveIndex = await window.gameAI.makeMove(board, playerTurn, 'Hard');
        
        if (moveIndex === -1) return; // No valid moves

        // Track the move for learning
        trackMove(moveIndex, playerTurn);

        // Execute the move
        const cellId = (moveIndex + 1).toString();
        const cell = document.getElementById(cellId);
        
        // Update cell value
        switch (moveIndex) {
            case 0: cell1Value = playerTurn; break;
            case 1: cell2Value = playerTurn; break;
            case 2: cell3Value = playerTurn; break;
            case 3: cell4Value = playerTurn; break;
            case 4: cell5Value = playerTurn; break;
            case 5: cell6Value = playerTurn; break;
            case 6: cell7Value = playerTurn; break;
            case 7: cell8Value = playerTurn; break;
            case 8: cell9Value = playerTurn; break;
        }

        // Add visual element
        const newMark = document.createElement('i');
        newMark.className = playerTurn === 'Player O' ? 'bxr bx-circle' : 'bxr bx-x';
        cell.appendChild(newMark);

        await wait(300);
        checkEnd();
        
    } catch (error) {
        console.error('Error in AI move:', error);
        await makeRandomAIMove(); // Fallback to random move
    }
}

// Original random AI move (for Easy mode)
async function makeRandomAIMove() {
    if (!gameEnabled) return;
    
    const isAI = (playerTurn === 'Player X' && playerSymbol !== 'Player X') ||
                 (playerTurn === 'Player O' && playerSymbol !== 'Player O');
    
    if (!isAI) return;

    const emptyCells = [];

    if (cell1Value === 'Empty') emptyCells.push(1);
    if (cell2Value === 'Empty') emptyCells.push(2);
    if (cell3Value === 'Empty') emptyCells.push(3);
    if (cell4Value === 'Empty') emptyCells.push(4);
    if (cell5Value === 'Empty') emptyCells.push(5);
    if (cell6Value === 'Empty') emptyCells.push(6);
    if (cell7Value === 'Empty') emptyCells.push(7);
    if (cell8Value === 'Empty') emptyCells.push(8);
    if (cell9Value === 'Empty') emptyCells.push(9);

    if (emptyCells.length === 0) return;

    const choice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const cell = document.getElementById(String(choice));
    
    // Track the move for learning (convert to 0-based index)
    trackMove(choice - 1, playerTurn);
    
    switch (choice) {
        case 1: cell1Value = playerTurn; break;
        case 2: cell2Value = playerTurn; break;
        case 3: cell3Value = playerTurn; break;
        case 4: cell4Value = playerTurn; break;
        case 5: cell5Value = playerTurn; break;
        case 6: cell6Value = playerTurn; break;
        case 7: cell7Value = playerTurn; break;
        case 8: cell8Value = playerTurn; break;
        case 9: cell9Value = playerTurn; break;
    }

    const newMark = document.createElement('i');
    newMark.className = playerTurn === 'Player O' ? 'bxr bx-circle' : 'bxr bx-x';
    cell.appendChild(newMark);

    await wait(300);
    checkEnd();
}

function checkPlayerCells() {
    cell1.addEventListener('click', () => {
        if (cell1Value === 'Empty' && gameEnabled === true) {
            cell1Value = playerTurn;
            trackMove(0, playerTurn); // Track move for learning

            const newCrossing = document.createElement('i');
            newCrossing.className = playerTurn === 'Player O' ? 'bxr bx-circle' : 'bxr bx-x';

            cell1.appendChild(newCrossing);
            checkEnd().then(handleAITurn);
        }
    });
    
    cell2.addEventListener('click', () => {
        if (cell2Value === 'Empty' && gameEnabled === true) {
            cell2Value = playerTurn;
            trackMove(1, playerTurn);

            const newCrossing = document.createElement('i');
            newCrossing.className = playerTurn === 'Player O' ? 'bxr bx-circle' : 'bxr bx-x';

            cell2.appendChild(newCrossing);
            checkEnd().then(handleAITurn);
        }
    });
    
    cell3.addEventListener('click', () => {
        if (cell3Value === 'Empty' && gameEnabled === true) {
            cell3Value = playerTurn;
            trackMove(2, playerTurn);

            const newCrossing = document.createElement('i');
            newCrossing.className = playerTurn === 'Player O' ? 'bxr bx-circle' : 'bxr bx-x';

            cell3.appendChild(newCrossing);
            checkEnd().then(handleAITurn);
        }
    });
    
    cell4.addEventListener('click', () => {
        if (cell4Value === 'Empty' && gameEnabled === true) {
            cell4Value = playerTurn;
            trackMove(3, playerTurn);

            const newCrossing = document.createElement('i');
            newCrossing.className = playerTurn === 'Player O' ? 'bxr bx-circle' : 'bxr bx-x';

            cell4.appendChild(newCrossing);
            checkEnd().then(handleAITurn);
        }
    });
    
    cell5.addEventListener('click', () => {
        if (cell5Value === 'Empty' && gameEnabled === true) {
            cell5Value = playerTurn;
            trackMove(4, playerTurn);

            const newCrossing = document.createElement('i');
            newCrossing.className = playerTurn === 'Player O' ? 'bxr bx-circle' : 'bxr bx-x';

            cell5.appendChild(newCrossing);
            checkEnd().then(handleAITurn);
        }
    });
    
    cell6.addEventListener('click', () => {
        if (cell6Value === 'Empty' && gameEnabled === true) {
            cell6Value = playerTurn;
            trackMove(5, playerTurn);

            const newCrossing = document.createElement('i');
            newCrossing.className = playerTurn === 'Player O' ? 'bxr bx-circle' : 'bxr bx-x';

            cell6.appendChild(newCrossing);
            checkEnd().then(handleAITurn);
        }
    });
    
    cell7.addEventListener('click', () => {
        if (cell7Value === 'Empty' && gameEnabled === true) {
            cell7Value = playerTurn;
            trackMove(6, playerTurn);

            const newCrossing = document.createElement('i');
            newCrossing.className = playerTurn === 'Player O' ? 'bxr bx-circle' : 'bxr bx-x';

            cell7.appendChild(newCrossing);
            checkEnd().then(handleAITurn);
        }
    });
    
    cell8.addEventListener('click', () => {
        if (cell8Value === 'Empty' && gameEnabled === true) {
            cell8Value = playerTurn;
            trackMove(7, playerTurn);

            const newCrossing = document.createElement('i');
            newCrossing.className = playerTurn === 'Player O' ? 'bxr bx-circle' : 'bxr bx-x';

            cell8.appendChild(newCrossing);
            checkEnd().then(handleAITurn);
        }
    });
    
    cell9.addEventListener('click', () => {
        if (cell9Value === 'Empty' && gameEnabled === true) {
            cell9Value = playerTurn;
            trackMove(8, playerTurn);

            const newCrossing = document.createElement('i');
            newCrossing.className = playerTurn === 'Player O' ? 'bxr bx-circle' : 'bxr bx-x';

            cell9.appendChild(newCrossing);
            checkEnd().then(handleAITurn);
        }
    });
}

// game.js
// ... (existing code) ...

window.onload = async () => { // Make window.onload async
    changeGameButton.addEventListener('click', () => {
        const url = 'index.html';
        window.location.href = url;
    });

    startAgainButton.addEventListener('click', () => {
        restart();
    });

    // Display AI status
    if (difficulty === 'Hard') {
        console.log('Hard AI mode activated - using TensorFlow.js neural network');
    } else if (difficulty === 'Easy') {
        console.log('Easy AI mode activated - using random moves with some AI influence');
    }
    
    // Ensure AI is ready before starting the game flow that might involve AI
    if (difficulty !== 'Players') { // Only wait if AI is involved
        console.log('Waiting for AI to initialize...');
        // Wait for the global gameAI instance to finish its initialization
        if (window.gameAI && typeof window.gameAI.initializationPromise !== 'undefined') {
            await window.gameAI.initializationPromise;
            console.log('AI is now fully initialized and ready!');
        } else {
            console.warn('window.gameAI or its initializationPromise is not available. AI might not function correctly.');
        }
    }

    // Initialize game based on difficulty and player choice
    if (difficulty === 'Players') {
        // Two-player mode
        checkPlayerCells();
    } else {
        // AI mode
        checkPlayerCells();
        
        // If AI goes first, make the first move
        if ((playerTurn === 'Player X' && playerSymbol === 'Player O') ||
            (playerTurn === 'Player O' && playerSymbol === 'Player X')) {
            handleAITurn();
        }
    }
};
