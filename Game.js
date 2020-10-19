import Block, { FOOD_BLOCK } from './Block';
import InputPublisher from './Keyboard.js';
import Snake from './Snake';
import { ctx } from './index';
import { DOWN, LEFT, RIGHT, SPACE_BAR, UP } from './KeyEvent';
import { BLACK, RED } from './Color';
import {
    BOT_Y_BOUNDARY, CANVAS_HEIGHT, CANVAS_WIDTH, BLOCK_HEIGHT,
    BLOCK_WIDTH, GAME_SCREEN_HEIGHT, GAME_SCREEN_WIDTH, LEFT_X_BOUNDARY,
    REFRESH_RATE_MILLIS, RIGHT_X_BOUNDARY, TOP_Y_BOUNDARY, START_X, START_Y
} from './GameContext';



//TODO generic move snake function

//nice to have	
//TODO add buffer before hitting wall
//TODO generalize premptive block check	
//TODO have the available space map be the game grid and render it updating

const playModalBtn = document.getElementById('play-btn');
const playModal = document.getElementById("play-modal");


playModalBtn.onclick = () => {
    if (!snake.alive) {
        restart();
    }
    playModal.style.visibility = "hidden";
};



let snake = getSnake();
let lastTime = 0;
const spacepbulisher = new InputPublisher('keydown', [SPACE_BAR]);
let paused = false;
function loop(time) {
    if (time - lastTime > REFRESH_RATE_MILLIS) {

        if (spacepbulisher.getNext() === SPACE_BAR) {
            paused = !paused;
            inputPublisher.getNext();//clear direction queue
        }

        if (!paused) {
            update();
            render();
            if (!snake.alive) {
                playModal.style.visibility = "visible";
            }
            lastTime = time;
        }


    }
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
function update() {
    const dir = inputPublisher.getNext();

    if (snake.alive) {

        //need to set direction of the snake first or will die 
        //on next frame if then after the boundary check
        snake.setDirection(dir);

        boundaryCheck(snake.direction, snake.x, snake.y);

        checkIfSnakeAteSelf(snake.direction);

        spawnFoodIfNone();

        checkIfAteFood(snake.direction);
    }

    //second check for alive snake because previous checks could kill snake
    //and the snake shouldn't move if its dead
    if (snake.alive) {

        const tailPos = snake.move();

        if (tailPos) {
            availableSpace[`${tailPos.x}-${tailPos.y}`] = true;
            delete availableSpace[`${snake.x}-${snake.y}`];
        }
    }

}

function restart() {
    snake = getSnake();
    food = [];
    foodCount = 0;
    score.innerText = foodCount;
}

function getSnake() {
    return new Snake(START_X, START_Y);
}

function render() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    food.forEach((f) => {
        f.draw();
    });    
    snake.draw();
    ctx.strokeStyle = BLACK;
    ctx.strokeRect(LEFT_X_BOUNDARY + 0.5, TOP_Y_BOUNDARY + 0.5, GAME_SCREEN_WIDTH, GAME_SCREEN_HEIGHT);
}


function boundaryCheck(direction, x, y) {
    if (direction == RIGHT && x + BLOCK_WIDTH == RIGHT_X_BOUNDARY ||
        direction == LEFT && x == LEFT_X_BOUNDARY ||
        direction == UP && y == 0 ||
        direction == DOWN && y + BLOCK_WIDTH == BOT_Y_BOUNDARY
    ) {
        snake.alive = false;
    }
}
function checkIfSnakeAteSelf(dir) {
    for (let i = 1; i < snake.body.length; i++) {
        if (dir == RIGHT && snake.x + BLOCK_WIDTH == snake.body[i].x && snake.y == snake.body[i].y ||
            dir == LEFT && snake.x - BLOCK_WIDTH == snake.body[i].x && snake.y == snake.body[i].y ||
            dir == UP && snake.y - BLOCK_WIDTH == snake.body[i].y && snake.x == snake.body[i].x ||
            dir == DOWN && snake.y + BLOCK_WIDTH == snake.body[i].y && snake.x == snake.body[i].x
        ) {
            snake.alive = false;
        }
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

        food.push(new Block(coordinates[0], coordinates[1], BLOCK_WIDTH, BLOCK_HEIGHT, FOOD_BLOCK, RED));
    }
}

function checkIfAteFood(dir) {
    for (let i = 0; i < food.length; i++) {
        if (dir == RIGHT && snake.x + BLOCK_WIDTH == food[i].x && snake.y == food[i].y ||
            dir == LEFT && snake.x - BLOCK_WIDTH == food[i].x && snake.y == food[i].y ||
            dir == UP && snake.y - BLOCK_WIDTH == food[i].y && snake.x == food[i].x ||
            dir == DOWN && snake.y + BLOCK_WIDTH == food[i].y && snake.x == food[i].x
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
