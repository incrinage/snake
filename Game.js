import Block from './Block';
import InputPublisher from './Keyboard.js';
import Snake from './Snake';
import { ctx, canvas } from './index';

//starting food
//last pressed direction for snake to move
//TODO put everything into its own file
//TODO keep track of tiles the snake is on and tiles that are free for rewind feature
//TODO add width and height as params to block to control proper spacing of snake blocks
//TODO create constant for desired block size so that random coordinates and block size scales 
//nice to have
//TODO smooth animation/movement
//TODO rewind snake upon collision
//TODO consider making the blocks smaller? 
const snake = new Snake(100, 100);
let lastTime = 0;
function loop(time) {
    if (time - lastTime > 80) {
        update();
        lastTime = time;
        render();
    }
    requestAnimationFrame(loop);
}
function update() {

    checkIfSnakeHitBoundary();

    checkIfSnakeAteSelf();

    spawnFoodIfNone();

    checkIfAtFood();

    moveSnake();
}
function render() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = "15px Arial";
    ctx.fillText("food: " + foodCount, 20, 20);
    food.forEach((f) => {
        f.draw();
    });
    snake.draw();
    ctx.strokeStyle = 'black';
    ctx.strokeRect(100, 0, 500, 600);
}
let food = [new Block(100, 0, 'food', 'red')];
let foodCount = 0;
function checkIfSnakeHitBoundary() {
    if (snake.x < 100 || snake.x + 20 > 600 || snake.y + 20 > 600 || snake.y < 0) {
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
function spawnFoodIfNone() {
    if (food.length == 0) {
        let randomX = Math.random() * (canvas.width - 100 - 20) + 100;
        let randomY = Math.random() * (canvas.height - 100 - 20) + 100;
        randomX = randomX - (randomX % 20); //set randomX to a multiple of 20
        randomY = randomY - (randomY % 20); //set randomY to a multiple of 20


        food.push(new Block(randomX, randomY, 'food', 'red'));
    }
}
function checkIfAtFood() {
    for (let i = 0; i < food.length; i++) {
        if (food[i].x == snake.x && food[i].y == snake.y) {
            snake.eat(food[i]);
            food = food.slice(0, i).concat(food.slice(i + 1));
            foodCount++;
        }
    }
}
let lastPressedDirection = 'ArrowRight';
let previouslyPressed = lastPressedDirection;
const inputPublisher = new InputPublisher('keydown', ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp']);
function moveSnake() {
    lastPressedDirection = inputPublisher.getNext() || lastPressedDirection;
    if (snake.isAlive()) {
        switch (lastPressedDirection) {
            case 'ArrowLeft':
                if (previouslyPressed == 'ArrowRight') {
                    lastPressedDirection = previouslyPressed;
                    snake.moveRight();
                } else {
                    snake.moveLeft();
                }
                break;
            case 'ArrowRight':
                if (previouslyPressed == 'ArrowLeft') {
                    lastPressedDirection = previouslyPressed;
                    snake.moveLeft();
                } else {
                    snake.moveRight();
                }
                break;
            case 'ArrowUp':
                if (previouslyPressed == 'ArrowDown') {
                    lastPressedDirection = previouslyPressed;
                    snake.moveDown();
                } else {
                    snake.moveUp();
                }
                break;
            case 'ArrowDown':
                if (previouslyPressed == 'ArrowUp') {
                    lastPressedDirection = previouslyPressed;
                    snake.moveUp();
                } else {
                    snake.moveDown();
                }
                break;
            default:
            //snake stopped moving
        }
    }

    previouslyPressed = lastPressedDirection;
}
export default {
    start: function () {
        requestAnimationFrame(loop);
    }
}
