import Block, { SNAKE_BLOCK } from "./Block";
import { GREEN } from "./Color";
import { DOWN, LEFT, RIGHT, UP } from "./KeyEvent";
import SnakeHead from './snake-head.png'
import Sprite from "./Sprite";
import SnakeBodyCurved from "./snake-body-curved.png";
import SnakeBodyStraight from "./snake-body-straight.png";
import SnakeTail from "./snake-body-tail.png";

const headSprite = new Sprite(SnakeHead, false);
const headSpriteAngleMap = {
    [RIGHT] : 0,
    [LEFT] : 180,
    [DOWN] : 90,
    [UP] : 270
}

const tailSprite = new Sprite(SnakeTail, false);
const tailSpriteAngleMap = {
    [UP]: 270,
    [DOWN]: 90,
    [RIGHT]: 0,
    [LEFT]: 180
};

const  straightSprite = new Sprite(SnakeBodyStraight, false);
const straightSpriteAngleMap = {
    [UP]: 90,
    [DOWN]: 270,
    [RIGHT]: 0,
    [LEFT]: 180
}

const curvedSprite = new Sprite(SnakeBodyCurved, false);
const curvedSpriteAngleMap = {
    [RIGHT]: {
        [UP]: -90,
        [DOWN]: 180
    },
    [LEFT]: {
        [UP]: 0,
        [DOWN]: -270,
    },
    [UP]: {
        [LEFT]: 180,
        [RIGHT]: -270,
    },
    [DOWN]: {
        [RIGHT]: 0,
        [LEFT]: -90
    }
}

export default function Snake(x, y, w, h) {
    this.v = 20; //velocity
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.alive = true;
    this.direction = '';

    //default body 
    this.body = [new SnakeBlock(this.x, this.y, this.w, this.h, SNAKE_BLOCK, GREEN, RIGHT)];

    //draw snake blocks
    this.draw = function () {
        this.body[0].draw(this.direction, 0, this.body.length);
        for(let i = 1; i < this.body.length; i ++){
            this.body[i].draw(this.body[i-1].direction, i, this.body.length);
        }
 
    };


    //eat block
    this.eat = function (block) {
        const s = new SnakeBlock(block.x, block.y, block.w, block.h)
        s.color = GREEN;
        s.type = SNAKE_BLOCK;
        s.direction = this.direction;
        s.length = this.body.length;
        this.body.push(s);
    };


    //update tail to head
    //update current head to curved body if up : 90degrees if down : 
    this.moveLeft = function () {
        const nextHead = this.body.pop();
        const tailPos = { x: nextHead.x, y: nextHead.y };
        nextHead.direction = LEFT;
        this.x -= this.v;
        nextHead.x = this.x;
        nextHead.y = this.y;
        this.body = [nextHead].concat(this.body);

        return tailPos;
    };
    this.moveRight = function () {
        const nextHead = this.body.pop();
        const tailPos = { x: nextHead.x, y: nextHead.y };
        nextHead.direction = RIGHT;
        this.x += this.v;
        nextHead.x = this.x;
        nextHead.y = this.y;
        this.body = [nextHead].concat(this.body);
        return tailPos;

    };
    this.moveUp = function () {
        const nextHead = this.body.pop();
        const tailPos = { x: nextHead.x, y: nextHead.y };
        nextHead.direction = UP;

        this.y -= this.v;
        nextHead.x = this.x;
        nextHead.y = this.y;
        this.body = [nextHead].concat(this.body);
        return tailPos;
    };

    this.moveDown = function () {
        const nextHead = this.body.pop();
        const tailPos = { x: nextHead.x, y: nextHead.y };
        this.y += this.v;
      
        nextHead.direction = DOWN;

        nextHead.x = this.x;
        nextHead.y = this.y;
        this.body = [nextHead].concat(this.body);
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
        this.prevDirection = this.direction;
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
}

class SnakeBlock extends Block {
    constructor(x, y, w, h, type, color, dir) {
        super(x, y, w, h, type, color)
        this.direction = dir;
    }

    draw(nextDirection, idx, len) {
        if(idx == 0 ){
            headSprite.rotate(this.x, this.y, this.w, this.h, headSpriteAngleMap[this.direction]);
        }
        else if (idx == len - 1 ) {
            tailSprite.rotate(this.x, this.y, this.w, this.h, tailSpriteAngleMap[nextDirection]);
        }
        else if(nextDirection == this.direction) {
            straightSprite.rotate(this.x, this.y, this.w, this.h, straightSpriteAngleMap[this.direction]);
        } else if (this.direction != nextDirection ){
            curvedSprite.rotate(this.x, this.y, this.w, this.h, curvedSpriteAngleMap[this.direction][nextDirection]);
        }

    }
}   