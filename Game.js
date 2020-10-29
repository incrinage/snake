import InputPublisher from './common/Keyboard.js';
import Snake from './snake/Snake';
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
import Meal from './common/Meal.js';



//Bugs
// food spawns on snake - in progress
// snake segments overlap                       <- velocity bug
// snake body leaves board depending on speed   <- velocity bug

//Refactor
// Modal Class 
// have hit box as it's own object in Block (entity)
// snake moveTo refactor 
// keep board and avoid instantiating a new board

//Notes
// board update works for nice coordinate numbers that are multiple of the board tile dimensions
// but doesn't take shape into account
// write automated test

//Features
// audio
// snake animations
// fill the board with snake to win or eat certain amount

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


let meal = new Meal();

let snake = getSnake();
const board = new SquareBoard(25, BLOCK_WIDTH, BLOCK_HEIGHT, 0, 0);
const spacepbulisher = new InputPublisher('keydown', [SPACE_BAR]);
let paused = false;
let gameOver = true;

board.addEntity(meal);
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


const inputPublisher = new InputPublisher('keydown', [LEFT, RIGHT, DOWN, UP]);
let lastTime = 0;

function update(time) {
    const dir = inputPublisher.getNext();

    if (snake.alive) {

        //need to set direction of the snake first or will die 
        //on next frame if then after the boundary check
        if (dir) {
            snake.setDirection(dir);
        }

        boundaryCheck(snake.direction, snake.getX(), snake.getY());

        // checkIfSnakeAteSelf(snake.direction);

        if (!gameOver)
            spawnFoodIfNone();

        checkIfAteFood(snake.direction);

        //clear board after so to acquire up to date info
        board.update();

    }

    //second check for alive snake because previous checks could kill snake
    //and the snake shouldn't move if its dead
    if (snake.alive) {
        if (time - lastTime >= MIN_FRAME_TIME && !gameOver) {
            snake.move();
            lastTime = time;
        }

    }

}

function restart() {
    gameOver = false;
    snake.reset();
    meal.reset();
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
    if (!gameOver) {
        drawFood();
        snake.draw();
    }

}


function drawFood() {
    meal.foods.forEach((f) => {
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
            // snake.alive = false;
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

let foodCount = 0;

//TODO score board class 
const score = document.getElementById("score");
score.innerText = foodCount;
const scoreBoard = document.getElementById("score-board");

scoreBoard.style.width = GAME_SCREEN_WIDTH;
scoreBoard.style.height = BLOCK_HEIGHT;


function spawnFoodIfNone() {
    if (meal.foods.length == 0) {
        const locations = board.getUnocupiedLocations();
        const randomIndex = Math.floor(Math.random() * locations.length);
        const { x, y } = locations[randomIndex];
        meal.foods.push(new Mouse(x, y, BLOCK_WIDTH, BLOCK_HEIGHT, RED));
    }
}

function checkIfAteFood(dir) {
    for (let i = 0; i < meal.foods.length; i++) {
        if (dir == RIGHT && snake.getX() + BLOCK_WIDTH == meal.foods[i].getX() && snake.getY() == meal.foods[i].getY() ||
            dir == LEFT && snake.getX() - BLOCK_WIDTH == meal.foods[i].getX() && snake.getY() == meal.foods[i].getY() ||
            dir == UP && snake.getY() - BLOCK_WIDTH == meal.foods[i].getY() && snake.getX() == meal.foods[i].getX() ||
            dir == DOWN && snake.getY() + BLOCK_WIDTH == meal.foods[i].getY() && snake.getX() == meal.foods[i].getX()
        ) {
            snake.eat(meal.foods[i]);
            meal.foods = meal.foods.slice(0, i).concat(meal.foods.slice(i + 1));
            foodCount++;
            score.innerText = foodCount;
        }
    }
}

export default {
    start: function () {
        requestAnimationFrame(loop);
    }
}
