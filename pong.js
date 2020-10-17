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

        if (player.y < 0) {
            player.y = 0;
        } else if (player.y >= (canvas.height - player.height)) {
            player.y = canvas.height - player.height;
        }

        if (addDelay() && targetForBall) {
            ball.moveX = targetForBall === player ? DIRECTION.LEFT : DIRECTION.RIGHT;

            ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
            ball.y = canvas.height / 2;
            targetForBall = null;
        }

        if (ball.moveY === DIRECTION.UP) {
            ball.y -= ball.speed;
        } else if (ball.moveY === DIRECTION.DOWN) {
            ball.y += ball.speed;
        }

        if (ball.moveX === DIRECTION.LEFT) {
            ball.x -= ball.speed;
        } else if (ball.moveX === DIRECTION.RIGHT) {
            ball.x += ball.speed;
        }

        if (aiPlayer.y > ball.y - (aiPlayer.height / 2)) {
            if (ball.moveX === DIRECTION.RIGHT) {
                aiPlayer.y -= aiPlayer.speed;
            }
        }

        if (aiPlayer.y < ball.y - (aiPlayer.height / 2)) {
            if (ball.moveX === DIRECTION.RIGHT) {
                aiPlayer.y += aiPlayer.speed;
            }
        }

        if (aiPlayer.y < 0) {
            aiPlayer.y = 0;
        } else if (aiPlayer.y >= (canvas.height - aiPlayer.height)) {
            aiPlayer.y = canvas.height - aiPlayer.height;
        }

        if (ball.x - ball.width <= player.x && ball.x >= player.x - player.width) {
            if (ball.y <= player.y + player.height && ball.y + ball.height >= player.y) {
                ball.moveX = DIRECTION.RIGHT;
                beepSound.play();
            }
        }

        if (ball.x - ball.width <= aiPlayer.x && ball.x >= aiPlayer.x - aiPlayer.width) {
            if (ball.y <= aiPlayer.y + aiPlayer.height && ball.y + ball.height >= aiPlayer.y) {
                ball.moveX = DIRECTION.LEFT;
                beepSound.play();
            }
        }
    }
}

function movePlayerPaddle(key) {
    if (running === false) {
        running = true;
        window.requestAnimationFrame(gameLoop);
    }

    if (key.keyCode === 38 || key.keyCode === 87) player.move = DIRECTION.UP;
    if (key.keyCode === 40 || key.keyCode === 83) player.move = DIRECTION.DOWN;
}

function stopPlayerPaddle(evt) {
    player.move = DIRECTION.STOPPED;
}

function resetBall(whoScored, whoLost) {
    whoScored.score++;
    let newBallSpeed = ball.speed + .2;
    ball = new Ball(newBallSpeed);
    targetForBall = whoLost;
    delayAmount = (new Date()).getTime();
}

function gameLoop() {
    updateCanvas();
    drawOnCanvas();
    if (!gameOver) requestAnimationFrame(gameLoop);
}

function addDelay() {
    return ((new Date()).getTime() - delayAmount >= 1000);
}