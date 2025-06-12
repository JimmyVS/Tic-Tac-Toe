const easyDifficulty = document.getElementById('Easy');
const hardDifficulty = document.getElementById('Hard');
const PlayersDifficulty = document.getElementById('Players');

const playerX = document.getElementById('x-player');
const playerO = document.getElementById('o-player');

const startButton = document.getElementById('start-Button');

let difficulty = "Easy";
let player = "Player X";

easyDifficulty.addEventListener('click', () => {
    difficulty = "Easy";
});

hardDifficulty.addEventListener('click', () => {
    difficulty = "Hard";
});

PlayersDifficulty.addEventListener('click', () => {
    difficulty = "Players";
});

playerX.addEventListener('click', () => {
    player = "Player X";
});

playerO.addEventListener('click', () => {
    player = "Player O";
});

setInterval(() => {
    if (difficulty === "Easy") {
        easyDifficulty.style.backgroundColor = '#333';
        easyDifficulty.style.color = 'white';
        easyDifficulty.style.borderColor = '#333';

        hardDifficulty.style.backgroundColor = 'white';
        hardDifficulty.style.color = '#333';
        hardDifficulty.style.borderColor = '#333';

        PlayersDifficulty.style.backgroundColor = 'white';
        PlayersDifficulty.style.color = '#333';
        PlayersDifficulty.style.borderColor = '#333';
    }

    if (difficulty === "Hard") {
        easyDifficulty.style.backgroundColor = 'white';
        easyDifficulty.style.color = '#333';
        easyDifficulty.style.borderColor = '#333';

        PlayersDifficulty.style.backgroundColor = 'white';
        PlayersDifficulty.style.color = '#333';
        PlayersDifficulty.style.borderColor = '#333';

        hardDifficulty.style.backgroundColor = '#333';
        hardDifficulty.style.color = 'white';
        hardDifficulty.style.borderColor = '#333';
    }

    if (difficulty === "Players") {
        PlayersDifficulty.style.backgroundColor = '#333';
        PlayersDifficulty.style.color = 'white';
        PlayersDifficulty.style.borderColor = '#333';

        hardDifficulty.style.backgroundColor = 'white';
        hardDifficulty.style.color = '#333';
        hardDifficulty.style.borderColor = '#333';

        easyDifficulty.style.backgroundColor = 'white';
        easyDifficulty.style.color = '#333';
        easyDifficulty.style.borderColor = '#333';
    }

    if (player === "Player X") {
        playerX.style.backgroundColor = 'rgb(236, 0, 0)';
        playerX.style.color = 'white';
        playerX.style.borderColor = 'rgb(236, 0, 0)';

        playerO.style.backgroundColor = 'white';
        playerO.style.color = 'rgb(0, 99, 212)';
        playerO.style.borderColor = 'rgb(0, 99, 212)';
    }

    if (player === "Player O") {
        playerX.style.backgroundColor = 'white';
        playerX.style.color = 'rgb(236, 0, 0)';
        playerX.style.borderColor = 'rgb(236, 0, 0)';

        playerO.style.backgroundColor = 'rgb(0, 99, 212)';
        playerO.style.color = 'white';
        playerO.style.borderColor = 'rgb(0, 99, 212)';
    }

    startButton.addEventListener('click', () => {
        const url = `game.html?symbol=${player}&difficulty=${difficulty}`;
        window.location.href = url;
    });

}, 100);
