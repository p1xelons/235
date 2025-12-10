// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";

const app = new PIXI.Application({
    width: 400,
    height: 400,
    backgroundColor: 0x000000
});
document.getElementById('gameContainer').appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;
const gridSize = 20;
const cellSize = 20;
const initialSpeed = 150;

// aliases
let stage;

// game variables
let snakeContainer;
let foodGraphics;
let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = {};
let score = 0;
let gameRunning = false;
let lastUpdateTime = 0;

function setup() {
    stage = app.stage;
    
    // #1 - Create the snake container
    snakeContainer = new PIXI.Container();
    stage.addChild(snakeContainer);
    
    // #2 - Create the food graphics
    foodGraphics = new PIXI.Graphics();
    stage.addChild(foodGraphics);
    
    // #3 - Initialize game state
    initGame();
    
    // #4 - Start update loop
    app.ticker.add(gameLoop);
    
    // #5 - Start listening for keyboard events
    window.addEventListener('keydown', onKeyDown);
    
    // #6 - Setup restart button
    document.getElementById('restartBtn').addEventListener('click', restartGame);
}

function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    gameRunning = true;
    lastUpdateTime = 0;
    
    updateScore();
    spawnFood();
    document.getElementById('gameOver').style.display = 'none';
}

function spawnFood() {
    let validPosition = false;
    while (!validPosition) {
        food = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
        validPosition = !snake.some(segment => 
            segment.x === food.x && segment.y === food.y
        );
    }
}

function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

function drawSnake() {
    snakeContainer.removeChildren();
    
    snake.forEach((segment, index) => {
        const graphics = new PIXI.Graphics();
        
        if (index === 0) {
            graphics.beginFill(0x00ff88);
        } else {
            graphics.beginFill(0x00cc66);
        }
        
        graphics.drawRect(
            segment.x * cellSize + 1,
            segment.y * cellSize + 1,
            cellSize - 2,
            cellSize - 2
        );
        graphics.endFill();
        
        snakeContainer.addChild(graphics);
    });
}

function drawFood() {
    foodGraphics.clear();
    foodGraphics.beginFill(0xff4757);
    foodGraphics.drawCircle(
        food.x * cellSize + cellSize / 2,
        food.y * cellSize + cellSize / 2,
        cellSize / 2 - 2
    );
    foodGraphics.endFill();
}

function updateGame() {
    if (!gameRunning) return;

    direction = { ...nextDirection };

    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;

    // Check wall collision
    if (head.x < 0 || head.x >= gridSize || 
        head.y < 0 || head.y >= gridSize) {
        endGame();
        return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        spawnFood();
    } else {
        snake.pop();
    }

    drawSnake();
    drawFood();
}

function endGame() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = `Final Score: ${score}`;
    document.getElementById('gameOver').style.display = 'block';
}

function restartGame() {
    initGame();
}

function onKeyDown(e) {
    if (!gameRunning) return;

    switch(e.key) {
        case 'ArrowUp':
            if (direction.y === 0) nextDirection = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) nextDirection = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) nextDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) nextDirection = { x: 1, y: 0 };
            break;
    }
}

function gameLoop() {
    if (!gameRunning) return;
    
    lastUpdateTime += app.ticker.elapsedMS;
    
    if (lastUpdateTime >= initialSpeed) {
        updateGame();
        lastUpdateTime = 0;
    }
}

// Start the game
setup();