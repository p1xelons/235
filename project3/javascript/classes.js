"use strict";

// snake class
class Snake {
    constructor(startX, startY, gridSize, cellSize) {
        // create 3 segments in a row
        this.segments = [
            {x: startX, y: startY},
            {x: startX - 1, y: startY},
            {x: startX - 2, y: startY}
        ];
        this.direction = {x: 1, y:0},
        this.nextDirection = { x: 1, y: 0 };
        this.gridSize = gridSize;
        this.cellSize = cellSize;
        this.growing = false;
    }

    // updates snake direction for movement
    setDirection(x,y) {
        // if not trying to go backwards
        if (this.direction.x !== -x && this.direction.y !== -y) {
            this.nextDirection = {x,y};
        }
    }

    // moves snake in direction
    move() {
        this.direction = {...this.nextDirection};

        // update at the head segment
        const head = {...this.segments[0]};
        head.x += this.direction.x;
        head.y += this.direction.y;

        this.segments.unshift(head);

        if (!this.growing) {
            this.segments.pop();
        }
        this.growing = false;

        return head;
    }

    // makes grow on next move
    grow() {
        this.growing = true;
    }

    // sees if snake hit itself
    checkSelfCollision() {
        const head = this.segments[0];
        return this.segments.slice(1).some(segment => 
            segment.x === head.x && segment.y === head.y);
    }

    // check for wall hits
    checkWallCollision() {
        const head = this.segments[0];
        return head.x < 0 || head.x >= this.gridSize ||
        head.y < 0 || head.y >= this.gridSize;
    }

    // gets head position
    getHead() {
        return this.segments[0];
    }

    // reset snake
    reset(startX, startY) {  // ✅ Fixed: was "statrtX"
        this.segments = [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.growing = false;
    }
}

// food class
class Food {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.position = { x: 0, y: 0 };
        this.spawn();
    }

    // spawn food
    spawn(snakeSegments = []) {
        let validPosition = false;

        // while not at valid pos
        while (!validPosition) {
            this.position = {
                // get new random pos
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
            validPosition = !snakeSegments.some(segment => 
                segment.x === this.position.x && segment.y === this.position.y
            );
        }
    }

    // checks if food is at given position
    isAt(x, y) {
        return this.position.x === x && this.position.y === y;
    }
}

// manages current state of game
class GameState {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.highScore = this.loadHighScore();
        this.isRunning = false;
        this.isPaused = false;
        this.difficulty = 'normal';
    }

    // add to score
    addScore(points) {
        this.score += points;
    }

    // reset game state
    reset() {
        this.score = 0;
        this.level = 1;
        this.isRunning = false;
        this.isPaused = false;
    }

    // save high score
    saveHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore.toString());
            return true;
        }
        return false;
    }

    // display high score
    loadHighScore() {
        const saved = localStorage.getItem('snakeHighScore');
        return saved ? parseInt(saved) : 0;
    }

    // speed based on difficulty
    getSpeed() {
        const baseSpeed = {
            easy: 200,
            normal: 150,
            hard: 100
        }[this.difficulty];
        
        return baseSpeed;
    }

    // sets the difficulty
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }
}