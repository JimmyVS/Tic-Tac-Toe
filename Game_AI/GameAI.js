// GameAI.js - TensorFlow.js Tic-Tac-Toe AI Implementation (Fixed)

class TicTacToeAI {
    constructor() {
        this.model = null;
        this.isTraining = false;
        this.trainingData = [];
        this.modelLoaded = false;
        this.initializationPromise = this.initializeModel();
    }

    // Initialize the neural network model
    async initializeModel() {
        try {
            console.log('Creating new AI model...');
            this.createModel();
            await this.preTrainModel();
            console.log('AI model ready!');
        } catch (error) {
            console.error('Error initializing AI model:', error);
            // Create a simple fallback model
            this.createSimpleModel();
        }
    }

    // Create the neural network architecture
    createModel() {
        this.model = tf.sequential({
            layers: [
                // Input layer: 9 positions (board state) + 1 (current player)
                tf.layers.dense({
                    inputShape: [10],
                    units: 64,
                    activation: 'relu',
                    kernelInitializer: 'randomNormal'
                }),
                tf.layers.dropout({ rate: 0.2 }),
                
                tf.layers.dense({
                    units: 32,
                    activation: 'relu',
                    kernelInitializer: 'randomNormal'
                }),
                
                // Output layer: 9 positions (move probabilities)
                tf.layers.dense({
                    units: 9,
                    activation: 'softmax'
                })
            ]
        });

        // Compile the model
        this.model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        this.modelLoaded = true;
    }

    // Create a simpler fallback model
    createSimpleModel() {
        this.model = tf.sequential({
            layers: [
                tf.layers.dense({
                    inputShape: [10],
                    units: 16,
                    activation: 'relu'
                }),
                tf.layers.dense({
                    units: 9,
                    activation: 'softmax'
                })
            ]
        });

        this.model.compile({
            optimizer: 'adam',
            loss: 'categoricalCrossentropy'
        });

        this.modelLoaded = true;
    }

    // Pre-train the model with strategic knowledge
    async preTrainModel() {
        console.log('Pre-training AI with strategic knowledge...');
        
        const trainingExamples = this.generateStrategicTrainingData();
        
        if (trainingExamples.length > 0) {
            const xs = tf.tensor2d(trainingExamples.map(ex => ex.input));
            const ys = tf.tensor2d(trainingExamples.map(ex => ex.output));
            
            try {
                await this.model.fit(xs, ys, {
                    epochs: 20,
                    batchSize: 8,
                    validationSplit: 0.1,
                    verbose: 0
                });
            } catch (error) {
                console.warn('Pre-training failed, using untrained model:', error);
            }
            
            xs.dispose();
            ys.dispose();
        }
        
        console.log('Pre-training completed');
    }

    // Generate strategic training data
    generateStrategicTrainingData() {
        const examples = [];
        
        // Center preference on empty board
        examples.push({
            input: [0,0,0,0,0,0,0,0,0,1], // Empty board, AI turn
            output: [0,0,0,0,1,0,0,0,0]  // Take center
        });

        // Corner preference when center is taken
        examples.push({
            input: [0,0,0,0,-1,0,0,0,0,1], // Opponent has center
            output: [1,0,0,0,0,0,0,0,0]   // Take corner
        });

        // Winning move examples
        examples.push({
            input: [1,1,0,0,0,0,0,0,0,1], // Two in a row, can win
            output: [0,0,1,0,0,0,0,0,0]  // Complete the row
        });

        examples.push({
            input: [1,0,0,1,0,0,0,0,0,1], // Two in a column, can win
            output: [0,0,0,0,0,0,1,0,0]  // Complete the column
        });

        // Blocking moves
        examples.push({
            input: [-1,-1,0,0,0,0,0,0,0,1], // Opponent has two in a row
            output: [0,0,1,0,0,0,0,0,0]    // Block them
        });

        return examples;
    }

    // Convert board state to neural network input
    boardToInput(board, currentPlayer) {
        const input = new Array(10);
        
        // Convert board to neural network input
        for (let i = 0; i < 9; i++) {
            const cellValue = board[i];
            if (cellValue === 'Empty') {
                input[i] = 0;
            } else if (cellValue === 'Player X') {
                input[i] = currentPlayer === 'Player X' ? 1 : -1;
            } else if (cellValue === 'Player O') {
                input[i] = currentPlayer === 'Player O' ? 1 : -1;
            }
        }
        
        // Add current player indicator
        input[9] = currentPlayer === 'Player X' ? 1 : -1;
        
        return input;
    }

    // Get available moves
    getAvailableMoves(board) {
        const moves = [];
        for (let i = 0; i < 9; i++) {
            if (board[i] === 'Empty') {
                moves.push(i);
            }
        }
        return moves;
    }

    // Strategic move evaluation (fallback for when neural network fails)
    evaluateStrategicMove(board, currentPlayer) {
        const availableMoves = this.getAvailableMoves(board);
        if (availableMoves.length === 0) return -1;

        // Check for winning moves
        for (const move of availableMoves) {
            const testBoard = [...board];
            testBoard[move] = currentPlayer;
            if (this.checkWin(testBoard, currentPlayer)) {
                return move;
            }
        }

        // Check for blocking moves
        const opponent = currentPlayer === 'Player X' ? 'Player O' : 'Player X';
        for (const move of availableMoves) {
            const testBoard = [...board];
            testBoard[move] = opponent;
            if (this.checkWin(testBoard, opponent)) {
                return move; // Block opponent's winning move
            }
        }

        // Prefer center
        if (availableMoves.includes(4)) {
            return 4;
        }

        // Prefer corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(corner => availableMoves.includes(corner));
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        // Return random available move
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    // Check if a player has won
    checkWin(board, player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winPatterns.some(pattern => 
            pattern.every(index => board[index] === player)
        );
    }

    // Make a move using the AI model
    async makeMove(board, currentPlayer, difficulty = 'Hard') {
        // Wait for initialization to complete
        await this.initializationPromise;

        const availableMoves = this.getAvailableMoves(board);
        if (availableMoves.length === 0) return -1;

        // For easy mode, use more random moves
        if (difficulty === 'Easy') {
            if (Math.random() < 0.6) {
                return availableMoves[Math.floor(Math.random() * availableMoves.length)];
            }
        }

        try {
            if (this.modelLoaded && this.model) {
                // Convert board to model input
                const input = this.boardToInput(board, currentPlayer);
                const inputTensor = tf.tensor2d([input]);
                
                // Get move probabilities from model
                const prediction = this.model.predict(inputTensor);
                const probabilities = await prediction.data();
                
                // Clean up tensors
                inputTensor.dispose();
                prediction.dispose();

                // Select move from probabilities
                const moveIndex = this.selectMoveFromProbabilities(probabilities, availableMoves);
                return moveIndex;
            }
        } catch (error) {
            console.warn('Neural network prediction failed, using strategic fallback:', error);
        }

        // Fallback to strategic move
        return this.evaluateStrategicMove(board, currentPlayer);
    }

    // Select move based on model probabilities
    selectMoveFromProbabilities(probabilities, availableMoves) {
        // Filter probabilities for available moves only
        const moveProbs = availableMoves.map(move => ({
            move,
            prob: probabilities[move] || 0
        }));

        // Sort by probability (highest first)
        moveProbs.sort((a, b) => b.prob - a.prob);

        // Use weighted random selection for top moves
        const topMoves = moveProbs.slice(0, Math.min(3, moveProbs.length));
        const totalProb = topMoves.reduce((sum, move) => sum + move.prob, 0);
        
        if (totalProb === 0) {
            // If all probabilities are 0, return random move
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
        
        let random = Math.random() * totalProb;
        for (const move of topMoves) {
            random -= move.prob;
            if (random <= 0) {
                return move.move;
            }
        }
        
        return topMoves[0].move; // Fallback to best move
    }

    // Learn from game outcome (simplified - no persistence)
    async learnFromGame(gameHistory, winner) {
        if (!this.modelLoaded || gameHistory.length === 0) return;

        const trainingData = [];
        
        // Process each move in the game
        for (let i = 0; i < gameHistory.length; i++) {
            const { board, player, move } = gameHistory[i];
            
            // Create training example
            const input = this.boardToInput(board, player);
            const output = new Array(9).fill(0.1); // Small baseline reward
            
            // Reward the move based on game outcome
            let reward = 0.1;
            if (winner === player) {
                reward = 0.8; // Win
            } else if (winner === 'draw') {
                reward = 0.5; // Draw
            } else {
                reward = 0.2; // Loss
            }
            
            output[move] = reward;
            trainingData.push({ input, output });
        }

        // Train the model with this game data (single epoch to avoid overfitting)
        if (trainingData.length > 0) {
            try {
                const xs = tf.tensor2d(trainingData.map(ex => ex.input));
                const ys = tf.tensor2d(trainingData.map(ex => ex.output));
                
                await this.model.fit(xs, ys, {
                    epochs: 1,
                    verbose: 0
                });
                
                xs.dispose();
                ys.dispose();
            } catch (error) {
                console.warn('Learning from game failed:', error);
            }
        }
    }

    // Check if AI is ready
    isReady() {
        return this.modelLoaded && this.model !== null;
    }
}

// Global AI instance
let gameAI = null;

// Initialize AI when page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing TensorFlow.js AI...');
    gameAI = new TicTacToeAI();
    
    // Wait a bit for initialization
    setTimeout(async () => {
        await gameAI.initializationPromise;
        console.log('AI initialization completed, ready to play!');
    }, 1000);
});

// Export for global access
window.gameAI = gameAI;
