import { BLACK } from './Color';
import { ctx } from './index';

//basic entity 
export default function Block(x, y, type, color) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = 20;
    this.h = 20;
    this.type = type || '';
    this.color = color || BLACK;

    //draw block
    this.draw = function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeStyle = BLACK;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    };
}

export const SNAKE_BLOCK = 'snake';
export const FOOD_BLOCK = 'food';

