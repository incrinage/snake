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
    [RIGHT]: 0,
    [LEFT]: 180,
    [DOWN]: 90,
    [UP]: 270
}

const tailSprite = new Sprite(SnakeTail, false);
const tailSpriteAngleMap = {
    [UP]: 270,
    [DOWN]: 90,
    [RIGHT]: 0,
    [LEFT]: 180
};

const straightSprite = new Sprite(SnakeBodyStraight, false);
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
    this.alive = true;
    this.direction = '';

    //default body 
    this.body = [
        new SnakeBlock(x, y, w, h, GREEN, RIGHT),
        new SnakeBlock(x - w, y, w, h, GREEN, RIGHT),
        new SnakeBlock(x - w * 2, y, w, h, GREEN, RIGHT)
    ];

    this.head = this.body[0];

    this.getDirection = function(){
        return this.direction;
    }

    this.getX = function(){
        return this.head.x;
    }

    this.getY = function(){
        return this.head.y;
    }

    this.setAsHead = function (snakeBlock) {
        this.head = snakeBlock;
        this.body = [snakeBlock].concat(this.body);
        
    }

    //draw snake blocks
    this.draw = function () {
        this.body[0].draw(this.direction, 0, this.body.length);
        for (let i = 1; i < this.body.length; i++) {
            this.body[i].draw(this.body[i - 1].direction, i, this.body.length);
        }
    };

    //add eating animation
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
        const directionScalar = directionMap[dir];
        nextHead.x = this.head.getX();
        nextHead.y = this.head.getY();
        nextHead.x += this.v * directionScalar.x;
        nextHead.y += this.v * directionScalar.y;
        this.setAsHead(nextHead);
        return tailPos;
    }



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

    this.setDirection

    this.move = function () {
        switch (this.direction) {
            case LEFT:
            case RIGHT:
            case UP:
            case DOWN:
                return this.moveTo(this.direction);
        }
        return undefined;
    }


    this.draw = this.draw.bind(this);
}

class SnakeBlock extends Block {
    constructor(x, y, w, h, color, dir) {
        super(x, y, w, h, color)
        this.direction = dir;
    }

    draw(nextDirection, idx, len) {
        if (idx == 0) {
            headSprite.rotate(this.x, this.y, this.w, this.h, headSpriteAngleMap[this.direction]);
        }
        else if (idx == len - 1) {
            tailSprite.rotate(this.x, this.y, this.w, this.h, tailSpriteAngleMap[nextDirection]);
        }
        else if (nextDirection == this.direction) {
            straightSprite.rotate(this.x, this.y, this.w, this.h, straightSpriteAngleMap[this.direction]);
        } else if (this.direction != nextDirection) {
            curvedSprite.rotate(this.x, this.y, this.w, this.h, curvedSpriteAngleMap[this.direction][nextDirection]);
        }

    }
}   