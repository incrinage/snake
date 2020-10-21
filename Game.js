import Block, { FOOD_BLOCK, SNAKE_BLOCK } from './Block';
import InputPublisher from './Keyboard.js';
import Snake from './Snake';
import { ctx } from './index';
import { DOWN, LEFT, RIGHT, SPACE_BAR, UP } from './KeyEvent';
import { BLACK, RED } from './Color';
import {
    BOT_Y_BOUNDARY, CANVAS_HEIGHT, CANVAS_WIDTH, BLOCK_HEIGHT,
    BLOCK_WIDTH, GAME_SCREEN_HEIGHT, GAME_SCREEN_WIDTH, LEFT_X_BOUNDARY,
    MIN_FRAME_TIME, RIGHT_X_BOUNDARY, TOP_Y_BOUNDARY, START_X, START_Y
} from './GameContext';



//TODO Make food sprite



//nice to have	
//TODO make modal nice ( add border )
//TODO add eating audio
//TODO add buffer before hitting wall
//TODO have consistently centered modal
//TODO slow down snake for animations - think about how to force the snake to be at the center of the block


const playModalBtn = document.getElementById('play-btn');
const playModal = document.getElementById("play-modal");


playModalBtn.onclick = () => {
    if (!snake.alive) {
        restart();
    }
    playModal.style.visibility = "hidden";
};



let snake = getSnake();
const spacepbulisher = new InputPublisher('keydown', [SPACE_BAR]);
let paused = false;
function loop(time) {

        if (spacepbulisher.getNext() === SPACE_BAR) {
            paused = !paused;
            inputPublisher.getNext();//clear direction queue
        }

        if (!paused) {
            update(time);
            if (!snake.alive) {
                playModal.style.visibility = "visible";
            }
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

    if (snake.alive) {

        //need to set direction of the snake first or will die 
        //on next frame if then after the boundary check
        snake.setDirection(dir);

        boundaryCheck(snake.direction, snake.getX(), snake.getY());

        checkIfSnakeAteSelf(snake.direction);

        spawnFoodIfNone();

        checkIfAteFood(snake.direction);
    }

    //second check for alive snake because previous checks could kill snake
    //and the snake shouldn't move if its dead
    if (snake.alive) {

        let tailPos = null;
        if(time - lastTime >= MIN_FRAME_TIME){
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
        if (dir == RIGHT && snake.getX() + BLOCK_WIDTH == snake.body[i].getX() && snake.getY() == snake.body[i].getY() ||
            dir == LEFT && snake.getX() - BLOCK_WIDTH == snake.body[i].getX() && snake.getY() == snake.body[i].getY() ||
            dir == UP && snake.getY() - BLOCK_WIDTH == snake.body[i].getY() && snake.getX() == snake.body[i].getX() ||
            dir == DOWN && snake.getY() + BLOCK_WIDTH == snake.body[i].getY() && snake.getX() == snake.body[i].getX()
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

        food.push(new Block(parseInt(coordinates[0]), parseInt(coordinates[1]), BLOCK_WIDTH, BLOCK_HEIGHT, RED));
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
