import { BLACK } from './Color';
import { ctx } from '../index';

//basic entity 
export default class Block {

    constructor(x, y, w, h, color) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 20;
        this.h = h || 20;
        this.color = color || BLACK;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }


    //draw block
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeStyle = BLACK;
        ctx.strokeRect(this.x - 0.5, this.y - 0.5, this.w, this.h);
    };

    getLocation() {
        return [{ x: this.x, y: this.y }];
    }
}

