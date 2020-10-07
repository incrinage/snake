import Block, { FOOD_BLOCK } from './Block';
import InputPublisher from './Keyboard.js';
import Snake from './Snake';
import { ctx } from './index';
import { DOWN, LEFT, RIGHT, UP } from './Direction';
import { BLACK, RED } from './Color';
import {
    BOT_Y_BOUNDARY, CANVAS_HEIGHT, CANVAS_WIDTH, BLOCK_HEIGHT,
    BLOCK_WIDTH, GAME_SCREEN_HEIGHT, GAME_SCREEN_WIDTH, LEFT_X_BOUNDARY,
    REFRESH_RATE_MILLIS, RIGHT_X_BOUNDARY, TOP_Y_BOUNDARY
} from './GameContext';


//TODO make a SnakeBlock that decorates an existing block
//TODO add eyes to snake direction
//TODO restart and retry button
//TODO generalize premptive block check

//nice to have
//TODO pass game context to game class and make everything scale
//TODO pass canvas 2d context
//TODO translate coordinates based on offsets/boundary locations
//TODO add width and height as params to block to control proper spacing of snake blocks
//TODO smooth animation/movement
//TODO consider making the blocks smaller? 
//TODO have the available space map be the game grid and render it updating


const snake = new Snake(100, 100);
let lastTime = 0;
function loop(time) {
    if (time - lastTime > REFRESH_RATE_MILLIS) {
        update();
        render();
        lastTime = time;
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

    if (snake.isAlive()) {

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
    if (snake.isAlive()) {

        const tailPos = snake.move();

        if (tailPos) {
            availableSpace[`${tailPos.x}-${tailPos.y}`] = true;
            delete availableSpace[`${snake.x}-${snake.y}`];
        }

        console.log(availableSpace);
    }

}

function render() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = BLACK;
    ctx.font = "15px Arial";
    ctx.fillText("food: " + foodCount, 20, 20);

    ctx.fillStyle = BLACK;
    ctx.font = "15px Arial";
    if (!snake.isAlive()) {

        ctx.fillText("game over! ", 20, 80);
    }

    food.forEach((f) => {
        f.draw();
    });
    snake.draw();
    ctx.strokeStyle = BLACK;
    ctx.strokeRect(LEFT_X_BOUNDARY, 0, GAME_SCREEN_WIDTH, GAME_SCREEN_HEIGHT);

}

function boundaryCheck(direction, x, y) {
    if (direction == RIGHT && x + BLOCK_WIDTH == RIGHT_X_BOUNDARY ||
        direction == LEFT && x == LEFT_X_BOUNDARY ||
        direction == UP && y == 0 ||
        direction == DOWN && y + BLOCK_WIDTH == BOT_Y_BOUNDARY
    ) {
        snake.setAlive(false);
    }
}
function checkIfSnakeAteSelf(dir) {
    for (let i = 1; i < snake.body.length; i++) {
        if (dir == RIGHT && snake.x + BLOCK_WIDTH == snake.body[i].x && snake.y == snake.body[i].y ||
            dir == LEFT && snake.x - BLOCK_WIDTH == snake.body[i].x && snake.y == snake.body[i].y ||
            dir == UP && snake.y - BLOCK_WIDTH == snake.body[i].y && snake.x == snake.body[i].x ||
            dir == DOWN && snake.y + BLOCK_WIDTH == snake.body[i].y && snake.x == snake.body[i].x
        ) {
            snake.setAlive(false);
        }
    }
}

let food = [];
let foodCount = 0;
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

        food.push(new Block(coordinates[0], coordinates[1], FOOD_BLOCK, RED));
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
        }
    }
}

export default {
    start: function () {
        getAvailableSpace();
        requestAnimationFrame(loop);
    }
}
