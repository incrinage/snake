import { GREEN } from "../common/Color";
import { DOWN, LEFT, RIGHT, UP } from "../common/KeyEvent";
import SnakeHead from './sprites/snake-head.png'
import Sprite from "../common/Sprite";
import SnakeTail from "./sprites/snake-body-tail.png";
import { SnakeBlock } from "./SnakeBlock";
import { BLOCK_HEIGHT, BLOCK_WIDTH } from "../common/GameContext";

export const headSprite = new Sprite(SnakeHead, false);
export const headSpriteAngleMap = {
    [RIGHT]: 0,
    [LEFT]: 180,
    [DOWN]: 90,
    [UP]: 270
}

export const tailSprite = new Sprite(SnakeTail, false);
export const tailSpriteAngleMap = {
    [UP]: 270,
    [DOWN]: 90,
    [RIGHT]: 0,
    [LEFT]: 180
};


export default class Snake {


    constructor(x, y, w, h) {
        this.xVelocity = BLOCK_WIDTH;
        this.yVelocity = BLOCK_HEIGHT
        this.alive = true;
        this.direction = RIGHT;
        this.isStopped = false;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.reset();
    }

    //default body 
    reset = function () {
        this.body = [];
        this.body.push(new SnakeBlock(this.x, this.y, this.w, this.h, GREEN, RIGHT));
        this.body.push(new SnakeBlock(this.x - this.w, this.y, this.w, this.h, GREEN, RIGHT));
        this.body.push(new SnakeBlock(this.x - this.w * 2, this.y, this.w, this.h, GREEN, RIGHT));
        this.alive = true;
        this.direction = RIGHT;
        this.isStopped = false;
        this.head = this.body[0];

    };



    getDirection = function () {
        return this.direction;
    }

    getX = function () {
        return this.head.x;
    }

    getY = function () {
        return this.head.y;
    }

    setAsHead = function (snakeBlock) {
        this.head = snakeBlock;
        this.body = [snakeBlock].concat(this.body);
    }

    stop = function () {
        this.isStopped = true;
    }

    draw = function () {
        this.drawSegmentsBasedOnPriorSegmentDirection();
    };

    eat = function (block) {
        const s = new SnakeBlock(block.getX(), block.getY(), this.head.w, this.head.h, null, this.direction)
        this.setAsHead(s)
    };



    moveTo = (dir) => {

        const directionMap = {
            [UP]: { x: 0, y: -1 },
            [DOWN]: { x: 0, y: 1 },
            [LEFT]: { x: -1, y: 0 },
            [RIGHT]: { x: 1, y: 0 }
        };
        const nextHead = this.body.pop();
        nextHead.direction = dir;
        const direction = directionMap[dir];
        nextHead.x = this.head.getX();
        nextHead.y = this.head.getY();
        nextHead.x += this.xVelocity * direction.x;
        nextHead.y += this.yVelocity * direction.y;
        this.setAsHead(nextHead);
    }

    setDirection = function (dir) {

        if (this.direction == LEFT && dir == RIGHT ||
            this.direction == RIGHT && dir == LEFT ||
            this.direction == UP && dir == DOWN ||
            this.direction == DOWN && dir == UP) {
            return;
        }
        this.direction = dir;
    }

    drawSegmentsBasedOnPriorSegmentDirection = () => {
        this.body[0].draw(this.direction, 0, this.body.length);
        for (let i = 1; i < this.body.length; i++) {
            this.body[i].draw(this.body[i - 1].direction, i, this.body.length);
        }
    }



    move = function () {
        if (this.isStopped) {
            this.isStopped = false;
            return undefined;
        };

        switch (this.direction) {
            case LEFT:
            case RIGHT:
            case UP:
            case DOWN:
                this.moveTo(this.direction);
        }
    }

    getLocation = function () {
        let location = [];

        for (let i = 0; i < this.body.length; i++) {
            location = location.concat(this.body[i].getLocation());
        }

        return location;
    }
}


