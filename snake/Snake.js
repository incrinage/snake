import { GREEN } from "../common/Color";
import { DOWN, LEFT, RIGHT, UP } from "../common/KeyEvent";
import SnakeHead from './sprites/snake-head.png'
import Sprite from "../common/Sprite";
import SnakeTail from "./sprites/snake-body-tail.png";
import { SnakeBlock } from "./SnakeBlock";
import { BLOCK_HEIGHT } from "../common/GameContext";

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


export default function Snake(x, y, w, h) {
    this.v = BLOCK_HEIGHT; //velocity
    this.alive = true;
    this.direction = RIGHT;

    //default body 
    this.body = [
        new SnakeBlock(x, y, w, h, GREEN, RIGHT),
        new SnakeBlock(x - w, y, w, h, GREEN, RIGHT),
        new SnakeBlock(x - w * 2, y, w, h, GREEN, RIGHT)
    ];

    this.isStopped = false;

    this.head = this.body[0];

    this.getDirection = function () {
        return this.direction;
    }

    this.getX = function () {
        return this.head.x;
    }

    this.getY = function () {
        return this.head.y;
    }

    this.setAsHead = function (snakeBlock) {
        this.head = snakeBlock;
        this.body = [snakeBlock].concat(this.body);

    }

    this.stop = function () {
        this.isStopped = true;
    }

    this.draw = function () {
        this.drawSegmentsBasedOnPriorSegmentDirection();
    };

    this.eat = function (block) {
        const s = new SnakeBlock(block.getX(), block.getY(), this.head.w, this.head.h, null, this.direction)
        this.setAsHead(s)
    };

    const directionMap = {
        [UP]: { x: 0, y: -1 },
        [DOWN]: { x: 0, y: 1 },
        [LEFT]: { x: -1, y: 0 },
        [RIGHT]: { x: 1, y: 0 }
    };

    this.moveTo = (dir) => {
        const nextHead = this.body.pop();
        const tailPos = { x: nextHead.x, y: nextHead.y };
        nextHead.direction = dir;
        const direction = directionMap[dir];
        nextHead.x = this.head.getX();
        nextHead.y = this.head.getY();
        nextHead.x += this.v * direction.x;
        nextHead.y += this.v * direction.y;
        this.setAsHead(nextHead);
        return tailPos;
    }



    this.setDirection = function (dir) {

        if (this.direction == LEFT && dir == RIGHT ||
            this.direction == RIGHT && dir == LEFT ||
            this.direction == UP && dir == DOWN ||
            this.direction == DOWN && dir == UP) {
            return;
        }
        this.direction = dir;
    }

    this.drawSegmentsBasedOnPriorSegmentDirection = () => {
        this.body[0].draw(this.direction, 0, this.body.length);
        for (let i = 1; i < this.body.length; i++) {
            this.body[i].draw(this.body[i - 1].direction, i, this.body.length);
        }
    }


    this.move = function () {
        if (this.isStopped) {
            this.isStopped = false;
            return undefined;
        };

        switch (this.direction) {
            case LEFT:
            case RIGHT:
            case UP:
            case DOWN:
                return this.moveTo(this.direction);
        }
        return undefined;
    }

    this.getLocation = function () {
        const location = [];
        this.body.forEach((segment) => {
            location.push({ x: segment.getX(), y: segment.getY() });
        });
        return location;
    }
}


