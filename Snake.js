import Block, { FOOD_BLOCK, SNAKE_BLOCK } from "./Block";
import { GREEN } from "./Color";
import { DOWN, LEFT, RIGHT, UP } from "./KeyEvent";

export default function Snake(x, y) {
    this.v = 20; //velocity
    this.x = x;
    this.y = y;
    this.alive = true;
    this.direction = '';

    //default body 
    this.body = [new Block(this.x, this.y, SNAKE_BLOCK, GREEN)];

    //draw snake blocks
    this.draw = function () {
        this.body.forEach((block) => block.draw());
    };

    //eat block
    this.eat = function (block) {
        switch (block.type) {
            //eat:
            //food snake grows
            case FOOD_BLOCK:
                block.color = GREEN;
                block.type = SNAKE_BLOCK;
                this.body.push(block);
                break;
            //snake dies if it eats self (assumed to be the only snake)
            case SNAKE_BLOCK:
                this.setAlive(false);
                break;
            default:
                //noop
                console.log("can't eat that");
        }
    };

    this.setAlive = function (alive) {
        this.alive = alive;
    };



    this.isAlive = function () {
        return this.alive;
    };

    this.moveLeft = function () {
        const tail = this.body.pop();
        const tailPos = { x: tail.x, y: tail.y };
        this.x -= this.v;
        tail.x = this.x;
        tail.y = this.y;
        this.body = [tail].concat(this.body);
        return tailPos;
    };
    this.moveRight = function () {
        const tail = this.body.pop();
        const tailPos = { x: tail.x, y: tail.y };
        this.x += this.v;
        tail.x = this.x;
        tail.y = this.y;
        this.body = [tail].concat(this.body);
        return tailPos;

    };
    this.moveUp = function () {
        const tail = this.body.pop();
        const tailPos = { x: tail.x, y: tail.y };
        this.y -= this.v;
        tail.x = this.x;
        tail.y = this.y;
        this.body = [tail].concat(this.body);
        return tailPos;
    };

    this.moveDown = function () {
        const tail = this.body.pop();
        const tailPos = { x: tail.x, y: tail.y };
        this.y += this.v;
        tail.x = this.x;
        tail.y = this.y;
        this.body = [tail].concat(this.body);
        return tailPos;
    };

    this.setDirection = function (dir) {
        if (!dir) return;
        if (this.direction == LEFT && dir == RIGHT ||
            this.direction == RIGHT && dir == LEFT ||
            this.direction == UP && dir == DOWN ||
            this.direction == DOWN && dir == UP) {
            return;
        }

        this.direction = dir;
    }

    this.move = function () {
        switch (this.direction) {
            case LEFT:
                return this.moveLeft();
            case RIGHT:
                return this.moveRight();
            case UP:
                return this.moveUp();
            case DOWN:
                return this.moveDown();
        }
        return undefined;
    }


    this.draw = this.draw.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.isAlive = this.isAlive.bind(this);
    this.setAlive = this.setAlive.bind(this);
}
