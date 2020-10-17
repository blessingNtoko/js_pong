let canvas;
let ctx;

let DIRECTION = {
    STOPPED: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4,
}

class Paddle {
    constructor(side) {
        this.width = 15;
        this.height = 65;
        this.x = side === 'left' ? 150 : canvas.width - 150;
        this.y = canvas.height / 2;
        this.score = 0;
        this.move = DIRECTION.STOPPED;
        this.speed = 11;
    }
}

class Ball {
    constructor(newSpeed) {
        this.width = 15;
        this.height = 15;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.moveX = DIRECTION.STOPPED;
        this.moveY = DIRECTION.STOPPED;
        this.speed = newSpeed;
    }
}

let player;
let aiPlayer;
let ball;
let running = false;
let gameOver = false;
let delayAmount;
let targetForBall;
let beepSound;

document.addEventListener("DOMContentLoaded", setupCanvas);

function setupCanvas() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    canvas.width = 1400;
    canvas.height = 1000;
    player = new Paddle("left");
    aiPlayer = new Paddle("right");
    ball = new Ball(7);
    aiPlayer.speed = 7;
    targetForBall = player;
    delayAmount = (new Date()).getTime();
    beepSound = document.getElementById("beepSound");
    beepSound.src = "beepSound.wav";
    document.addEventListener("keydown", movePlayerPaddle);
    document.addEventListener("keyup", stopPlayerPaddle);
    drawOnCanvas();
}

function drawOnCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillRect(aiPlayer.x, aiPlayer.y, aiPlayer.width, aiPlayer.height);
    ctx.fillRect(ball.x, ball.y, ball.width, ball.height);

    ctx.font = "80px Arial";
    ctx.textAlign = "center";
    ctx.fillText(player.score.toString(), (canvas.width / 2) - 300, 100);
    ctx.fillText(aiPlayer.score.toString(), (canvas.width / 2) + 300, 100);

    if (player.score === 3) {
        ctx.fillText("Player Wins", canvas.width / 2, 300);
        gameOver = true;
    }

    if (aiPlayer.score === 3) {
        ctx.fillText("AI Wins", canvas.width / 2, 300);
        gameOver = true;
    }
    

}

function updateCanvas() {
    if (!gameOver) {
        if (ball.x <= 0) {
            resetBall(aiPlayer, player);
        }

        if (ball.x >= canvas.width - ball.wdith) {
            resetBall(player, aiPlayer);
        }

        if (ball.y <= 0) {
            ball.moveY = DIRECTION.DOWN;
        }

        if (ball.y >= canvas,height = ball.height) {
            ball.moveY = DIRECTION.UP;
        }

        if (player.move === DIRECTION.DOWN) {
            player.y += player.speed;
        } else if (player.move === DIRECTION.UP) {
            player.y -= player.speed;
        }
    }
}

function movePlayerPaddle() {

}

function stopPlayerPaddle() {

}

function resetBall(whoScored, whoLost) {
    whoScored.score++;
    let newBallSpeed = ball.speed + .2;
    ball = new Ball(newBallSpeed);
    targetForBall = whoLost;
    delayAmount = (new Date()).getTime();
}

function gameLoop() {

}

function addDelay() {

}