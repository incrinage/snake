import InputPublisher from './common/Keyboard.js';
import Snake, { tailSprite } from './snake/Snake';
import { ctx } from './index';
import { DOWN, LEFT, RIGHT, SPACE_BAR, UP } from './common/KeyEvent';
import { BLACK, RED } from './common/Color';
import {
    BOT_Y_BOUNDARY, CANVAS_HEIGHT, CANVAS_WIDTH, BLOCK_HEIGHT,
    BLOCK_WIDTH, GAME_SCREEN_HEIGHT, GAME_SCREEN_WIDTH, LEFT_X_BOUNDARY,
    MIN_FRAME_TIME, RIGHT_X_BOUNDARY, TOP_Y_BOUNDARY, START_X, START_Y, NUM_FRAME_BOUNDARY_PROTECTION, NUM_FRAME_SELF_COLLIDE_PROTECTION
} from './common/GameContext';
import Mouse from './mouse/Mouse';
import SquareBoard from './board/Board.js';


//TODO Meal class to hold food and spawn food


//nice to have	
//TODO fix available space , food still spawns on snake 
//TODO snake moveTo refactor - move from head
//TODO fix overlapping snake with low speed
//TODO add eating audio
//TODO refactor game class - modal class, SnakeEye class
//TODO reset snake body completely when hit boundary , there was a bug that made the snake go outside the board when moving a certain way
//TODO add buffer before hitting wall
//TODO separate hit box from physical dimensions
//TODO snake animations 2

const playModalBtn = document.getElementById('play-btn');
const playModal = document.getElementById("play-modal");
const leftEye = document.getElementById("left-eye");
const rightEye = document.getElementById("right-eye");
const leftEyeBoundingRect = leftEye.getBoundingClientRect();
const rightEyeBoundingRect = rightEye.getBoundingClientRect();
const leftEyePupil = document.getElementById("left-eye-pupil");
const rightEyePupil = document.getElementById("right-eye-pupil");




document.addEventListener('mousemove', eyeMovement);

function eyeMovement(e) {
    const leftEyeCenterOffset = leftEyeBoundingRect.width / 5;
    const rightEyeCenterOffset = rightEyeBoundingRect.width / 5;

    let rightPupilAngle = Math.atan2(e.clientY - rightEyeBoundingRect.y, e.clientX - rightEyeBoundingRect.x);
    let leftPupilAngle = Math.atan2(e.clientY - leftEyeBoundingRect.y, e.clientX - leftEyeBoundingRect.x);

    rightEyePupil.style.marginLeft = 4 * Math.cos(rightPupilAngle) + rightEyeCenterOffset + "px";
    rightEyePupil.style.marginTop = 4 * Math.sin(rightPupilAngle) + rightEyeCenterOffset + 8 + "px";
    leftEyePupil.style.marginLeft = 4 * Math.cos(leftPupilAngle) + leftEyeCenterOffset + "px";
    leftEyePupil.style.marginTop = 4 * Math.sin(leftPupilAngle) + leftEyeCenterOffset + 8 + "px";
}

playModalBtn.onclick = () => {
    if (gameOver) {
        restart();
    }
    playModal.style.visibility = "hidden";
};



let snake = getSnake();
const board = new SquareBoard(50, BLOCK_WIDTH, BLOCK_HEIGHT, 0, 0);
const spacepbulisher = new InputPublisher('keydown', [SPACE_BAR]);
let paused = false;
let gameOver = true;
board.addEntity(snake);
function loop(time) {

    if (spacepbulisher.getNext() === SPACE_BAR) {
        paused = !paused;
        inputPublisher.getNext();//clear direction queue
    }

    if (!snake.alive) gameOver = true;

    if (!paused) {

        if (gameOver) {
            playModal.style.visibility = "visible";
        }

        update(time);

    }

    render();

    requestAnimationFrame(loop);
}

const availableSpace = {};

function getAvailableSpace() {
    const snakeBlockSet = {};
    snake.body.forEach(b => {
        const { x, y } = b;
        snakeBlockSet[`${x}-${y}`] = true;
    })

    for (let i = LEFT_X_BOUNDARY; i < RIGHT_X_BOUNDARY; i += BLOCK_WIDTH) {
        for (let j = TOP_Y_BOUNDARY; j < BOT_Y_BOUNDARY; j += BLOCK_HEIGHT) {
            if (!snakeBlockSet[`${i}-${j}`]) {
                availableSpace[`${i}-${j}`] = true;
            }
        }
    }
}

const inputPublisher = new InputPublisher('keydown', [LEFT, RIGHT, DOWN, UP]);
let lastTime = 0;

function update(time) {
    const dir = inputPublisher.getNext();
    board.update();

    if (snake.alive) {
        //need to set direction of the snake first or will die 
        //on next frame if then after the boundary check
        if (dir) {
            snake.setDirection(dir);
        }

        boundaryCheck(snake.direction, snake.getX(), snake.getY());

        checkIfSnakeAteSelf(snake.direction);

        spawnFoodIfNone();

        checkIfAteFood(snake.direction);
    }

    //second check for alive snake because previous checks could kill snake
    //and the snake shouldn't move if its dead
    if (snake.alive) {
        let tailPos = null;
        if (time - lastTime >= MIN_FRAME_TIME && !gameOver) {
            tailPos = snake.move();
            lastTime = time;
        }

        if (tailPos) {
            availableSpace[`${tailPos.x}-${tailPos.y}`] = true;
            delete availableSpace[`${snake.x}-${snake.y}`];
        }
    }

}

function restart() {
    gameOver = false;
    snake = getSnake();
    food = [];
    foodCount = 0;
    score.innerText = foodCount;
}

function getSnake() {
    return new Snake(START_X, START_Y, BLOCK_WIDTH, BLOCK_HEIGHT);
}



function render() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawBorder();
    board.draw();
    drawFood();
    snake.draw();
}


function drawFood() {
    food.forEach((f) => {
        f.draw();
    });
}

function drawBorder() {
    ctx.strokeStyle = BLACK;
    ctx.strokeRect(LEFT_X_BOUNDARY + 0.5, TOP_Y_BOUNDARY + 0.5, GAME_SCREEN_WIDTH, GAME_SCREEN_HEIGHT);
}

let hitWallCounter = 0;

function boundaryCheck(direction, x, y) {
    if (direction == RIGHT && x + BLOCK_WIDTH == RIGHT_X_BOUNDARY ||
        direction == LEFT && x == LEFT_X_BOUNDARY ||
        direction == UP && y == 0 ||
        direction == DOWN && y + BLOCK_WIDTH == BOT_Y_BOUNDARY
    ) {
        if (hitWallCounter >= NUM_FRAME_BOUNDARY_PROTECTION) {
            snake.alive = false;
        }
        snake.stop();
        hitWallCounter++;

    } else {
        hitWallCounter = 0;
    }
}

let hitSelfCounter = 0;
function checkIfSnakeAteSelf(dir) {
    let current = hitSelfCounter;
    for (let i = 1; i < snake.body.length; i++) {
        if (dir == RIGHT && snake.getX() + BLOCK_WIDTH == snake.body[i].getX() && snake.getY() == snake.body[i].getY() ||
            dir == LEFT && snake.getX() - BLOCK_WIDTH == snake.body[i].getX() && snake.getY() == snake.body[i].getY() ||
            dir == UP && snake.getY() - BLOCK_WIDTH == snake.body[i].getY() && snake.getX() == snake.body[i].getX() ||
            dir == DOWN && snake.getY() + BLOCK_WIDTH == snake.body[i].getY() && snake.getX() == snake.body[i].getX()
        ) {
            if (hitSelfCounter >= NUM_FRAME_SELF_COLLIDE_PROTECTION) {
                snake.alive = false;
            }
            snake.stop();
            hitSelfCounter++;
        }
    }

    //check if still
    if (current == hitSelfCounter) {
        hitSelfCounter = 0;
    }

}

let food = [];
let foodCount = 0;
const score = document.getElementById("score");
score.innerText = foodCount;
const scoreBoard = document.getElementById("score-board");

scoreBoard.style.width = GAME_SCREEN_WIDTH;
scoreBoard.style.height = BLOCK_HEIGHT;


function spawnFoodIfNone() {
    if (food.length == 0) {
        //get entries
        const entryKeys = Object.keys(availableSpace);
        //random index
        const index = Math.floor(entryKeys.length * Math.random());
        //get entry coordinates
        const coordinates = entryKeys[index].split('-');
        //delete from availableSpace
        delete availableSpace[`${coordinates[0]}-${coordinates[1]}`];
        food.push(new Mouse(parseInt(coordinates[0]), parseInt(coordinates[1]), BLOCK_WIDTH, BLOCK_HEIGHT, RED));
    }
}

function checkIfAteFood(dir) {
    for (let i = 0; i < food.length; i++) {
        if (dir == RIGHT && snake.getX() + BLOCK_WIDTH == food[i].getX() && snake.getY() == food[i].getY() ||
            dir == LEFT && snake.getX() - BLOCK_WIDTH == food[i].getX() && snake.getY() == food[i].getY() ||
            dir == UP && snake.getY() - BLOCK_WIDTH == food[i].getY() && snake.getX() == food[i].getX() ||
            dir == DOWN && snake.getY() + BLOCK_WIDTH == food[i].getY() && snake.getX() == food[i].getX()
        ) {
            snake.eat(food[i]);
            food = food.slice(0, i).concat(food.slice(i + 1));
            foodCount++;
            score.innerText = foodCount;
        }
    }
}

export default {
    start: function () {
        getAvailableSpace();
        requestAnimationFrame(loop);
    }
}
