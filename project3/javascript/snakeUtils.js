"use strict";

function updateScoreDisplay(score) {
    const scoreElement = querySelector('#score');
    scoreElement.textContent = score;
}

// updates the high score ui
function updateHighScoreDisplay(highScore) {
    const highScoreElement = querySelector('#highScore');
    highScoreElement.textContent = highScore;
}

// displays game over w score
function showGameOverScreen(score, isNewHighScore) {
    const gameOverScreen = querySelector('#gameOverScreen');
    const finalScoreElement = querySelector('#finalScore');
    const highScoreMsg = querySelector('#highScoreMsg');
    
    finalScoreElement.textContent = `Your Score: ${score}`;
    
    if (isNewHighScore) {
        highScoreMsg.textContent = '🎉 New High Score! 🎉';
        highScoreMsg.style.display = 'block';
    } else {
        highScoreMsg.style.display = 'none';
    }
    
    gameOverScreen.style.display = 'flex';
}

// hides game over
function hideGameOverScreen() {
    const gameOverScreen = querySelector('#gameOverScreen');
    gameOverScreen.style.display = 'none';
}

// shows start
function showStartScreen() {
    const startScreen = querySelector('#startScreen');
    startScreen.style.display = 'flex';
}

// hides start
function hideStartScreen() {
    const startScreen = querySelector('#startScreen');
    startScreen.style.display = 'none';
}

// shows pause
function showPauseScreen() {
    const pauseScreen = querySelector('#pauseScreen');
    pauseScreen.style.display = 'flex';
}

// hides pause
function hidePauseScreen() {
    const pauseScreen = querySelector('#pauseScreen');
    pauseScreen.style.display = 'none';
}

// helper method for querySelector
function querySelector(selector) {
    return document.querySelector(selector);
}

// helper method for querySelectorAll
function querySelectorAll(selector) {
    return document.querySelectorAll(selector);
}

/// get difficulty from user
function getSelectedDifficulty() {
    const difficultySelect = querySelector('#difficulty');
    return difficultySelect.value;
}

// web audio api, get audio
function playBeep(frequency, duration, volume = 0.3) {
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
}

function playEatSound() {
    playBeep(800, 100, 0.2);
    setTimeout(() => playBeep(1000, 80, 0.15), 50);
}

function playGameOverSound() {
    playBeep(400, 150, 0.3);
    setTimeout(() => playBeep(300, 150, 0.3), 150);
    setTimeout(() => playBeep(200, 300, 0.3), 300);
}

function playLevelUpSound() {
    playBeep(600, 100, 0.2);
    setTimeout(() => playBeep(700, 100, 0.2), 100);
    setTimeout(() => playBeep(900, 150, 0.25), 200);
}