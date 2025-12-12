"use strict";

// game constants
const GridSize = 20;
const CellSize = 20;
const GameWidth = GridSize * CellSize;
const GameHeight = GridSize * CellSize;

// start the pixiJS app
const app = new PIXI.Application({
    width: GameWidth,
    height: GameHeight,
    backgroundColor: 0x000000
});

// get gameCanvas area
document.querySelector('#gameCanvas').appendChild(app.view);

// game variables
let stage;
let snakeContainer;
let foodGraphics;
let snake;
let food;
let gameState;
let lastUpdateTime = 0;

function init() {
    // initialze game and listeners
    stage = app.stage;

    // create containers
    snakeContainer = new PIXI.Container();
    stage.addChild(snakeContainer);
    foodGraphics = new PIXI.Graphics();
    stage.addChild(foodGraphics);

    // initilize game objects
    snake = new Snake(10,10,GridSize,CellSize);
    food = new Food(GridSize);
    gameState = new GameState();

    // update displays
    updateHighScoreDisplay(gameState.highScore);

    setUpEventListeners();
    
    // start timer
    app.ticker.add(gameLoop);
}

// event listeners for buttons
function setUpEventListeners() {
    document.querySelector('#startBtn').addEventListener('click', startGame);  // Fixed selector
    document.querySelector('#restartBtn').addEventListener('click', restartGame);
    window.addEventListener('keydown', handleKeyDown);
}

// keyboard input
function handleKeyDown(e) {
    if (!gameState.isRunning) return;
    
    // movement key
    switch(e.key) {
        case 'ArrowUp':
            snake.setDirection(0, -1);
            e.preventDefault();
            break;
        case 'ArrowDown':
            snake.setDirection(0, 1);
            e.preventDefault();
            break;
        case 'ArrowLeft':
            snake.setDirection(-1, 0);
            e.preventDefault();
            break;
        case 'ArrowRight':
            snake.setDirection(1, 0);
            e.preventDefault();
            break;
        case ' ':
            togglePause();
            e.preventDefault();
            break;
    }
}

// start new game
function startGame() {
    const difficulty = getSelectedDifficulty();  
    gameState.setDifficulty(difficulty);

    gameState.reset();
    snake.reset(10, 10);
    food.spawn(snake.segments);

    gameState.isRunning = true;
    gameState.isPaused = false;
    lastUpdateTime = 0;

    hideStartScreen();
    hideGameOverScreen();
    updateScoreDisplay(gameState.score);

    snakeContainer.removeChildren();
    foodGraphics.clear();

    drawSnake();
    drawFood();
}


function restartGame() {
    startGame();
}

/**
 * Toggles the pause state
 */
function togglePause() {
    if (!gameState.isRunning) return;
    
    gameState.isPaused = !gameState.isPaused;
    
    if (gameState.isPaused) {
        showPauseScreen();
    } else {
        hidePauseScreen();
    }
}

/**
 * Main game loop called every frame
 */
function gameLoop() {
    if (!gameState.isRunning || gameState.isPaused) return;
    
    lastUpdateTime += app.ticker.elapsedMS;
    
    const speed = gameState.getSpeed();
    
    if (lastUpdateTime >= speed) {
        updateGame();
        lastUpdateTime = 0;
    }
}

/**
 * Updates the game state each tick
 */
function updateGame() {
    // Move snake
    const newHead = snake.move();
    
    // Check collisions
    if (snake.checkWallCollision() || snake.checkSelfCollision()) {
        endGame();
        return;
    }
    
    // Check food collision
    if (food.isAt(newHead.x, newHead.y)) {
        snake.grow();
        
        const leveledUp = gameState.addScore(10);
        updateScoreDisplay(gameState.score);
        
        if (leveledUp) {
            updateLevelDisplay(gameState.level);
            playLevelUpSound();
        } else {
            playEatSound();
        }
        
        food.spawn(snake.segments);
    }
    
    // Redraw
    drawSnake();
    drawFood();
}

// draw snake on canvas
function drawSnake() {
    snakeContainer.removeChildren();
    
    snake.segments.forEach((segment, index) => {
        const graphics = new PIXI.Graphics();
        
        // make head brighter
        if (index === 0) {
            graphics.beginFill(0x00ff88);
        } else {
            // gradient effect
            const alpha = 1 - (index / snake.segments.length) * 0.3;
            graphics.beginFill(0x00cc66);
            graphics.alpha = alpha;
        }
        
        graphics.drawRoundedRect(
            segment.x * CellSize + 1,
            segment.y * CellSize + 1,
            CellSize - 2,
            CellSize - 2,
            3
        );
        graphics.endFill();
        
        snakeContainer.addChild(graphics);
    });
}

// draw food
function drawFood() {
    foodGraphics.clear();
    
    // glowing effect
    const time = Date.now() / 200;
    const pulse = Math.sin(time) * 0.3 + 0.7;
    
    // border glow
    foodGraphics.beginFill(0xff4757, 0.3 * pulse);
    foodGraphics.drawCircle(
        food.position.x * CellSize + CellSize / 2,
        food.position.y * CellSize + CellSize / 2,
        CellSize / 2 + 2
    );
    foodGraphics.endFill();
    
    // food color
    foodGraphics.beginFill(0xff4757);
    foodGraphics.drawCircle(
        food.position.x * CellSize + CellSize / 2,
        food.position.y * CellSize + CellSize / 2,
        CellSize / 2 - 2
    );
    foodGraphics.endFill();
}

// end game and show game over
function endGame() {
    gameState.isRunning = false;
    playGameOverSound();
    
    const isNewHighScore = gameState.saveHighScore();
    updateHighScoreDisplay(gameState.highScore);
    
    showGameOverScreen(gameState.score, isNewHighScore);
}

// init game
init();