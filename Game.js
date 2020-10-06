import Block from './Block';
import InputPublisher from './Keyboard.js';
import Snake from './Snake';
import { ctx, canvas } from './index';


//TODO make constant class for direction, canvas width and height, and blocks
//TODO spawn food where the snake isn't
//TODO restart and retry button

//nice to have
//TODO add width and height as params to block to control proper spacing of snake blocks
//TODO create constant for desired block size so that random coordinates and block size scales 
//TODO smooth animation/movement
//TODO consider making the blocks smaller? 

const snake = new Snake(100, 100);
let lastTime = 0;
function loop(time) {
    if (time - lastTime > 80) {
        update();
        render();
        lastTime = time;
    }
    requestAnimationFrame(loop);
}


const inputPublisher = new InputPublisher('keydown', ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp']);

function update() {
    const dir = inputPublisher.getNext() || snake.direction;

    if (snake.isAlive()) {

        boundaryCheck(snake.direction, snake.x, snake.y);

        checkIfSnakeAteSelf();

        spawnFoodIfNone();

        checkIfAteFood();
    }

    if (snake.isAlive()) {
        snake.setDirection(dir);
        snake.move();
    }

}

function render() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = "15px Arial";
    ctx.fillText("food: " + foodCount, 20, 20);

    ctx.fillStyle = 'black';
    ctx.font = "15px Arial";
    if (!snake.isAlive()) {

        ctx.fillText("game over! ", 20, 80);
    }

    food.forEach((f) => {
        f.draw();
    });
    snake.draw();
    ctx.strokeStyle = 'black';
    ctx.strokeRect(100, 0, 500, 600);

}

function boundaryCheck(direction, x, y) {
    if (direction == 'ArrowRight' && x + 20 == 600 ||
        direction == "ArrowLeft" && x == 100 ||
        direction == "ArrowUp" && y == 0 ||
        direction == "ArrowDown" && y + 20 == 600
    ) {
        snake.setAlive(false);
    }
}
function checkIfSnakeAteSelf() {
    for (let i = 1; i < snake.getBody().length; i++) {
        if (snake.getBody()[i].x == snake.x && snake.getBody()[i].y == snake.y) {
            snake.setAlive(false);
        }
    }
}

let food = [];
let foodCount = 0;
function spawnFoodIfNone() {
    if (food.length == 0) {
        let randomX = Math.random() * (canvas.width - 100 - 20) + 100;
        let randomY = Math.random() * (canvas.height - 100 - 20) + 100;
        randomX = randomX - (randomX % 20); //set randomX to a multiple of 20
        randomY = randomY - (randomY % 20); //set randomY to a multiple of 20


        food.push(new Block(randomX, randomY, 'food', 'red'));
    }
}
function checkIfAteFood() {
    for (let i = 0; i < food.length; i++) {
        if (food[i].x == snake.x && food[i].y == snake.y) {
            snake.eat(food[i]);
            food = food.slice(0, i).concat(food.slice(i + 1));
            foodCount++;
        }
    }
}

export default {
    start: function () {
        requestAnimationFrame(loop);
    }
}
