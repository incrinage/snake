import Block from "../common/Block";
import { SnakeCurve } from "./SnakeCurve";
import { SnakeStraight } from "./SnakeStraight";
import { headSprite, headSpriteAngleMap, tailSprite, tailSpriteAngleMap } from "./Snake";

export class SnakeBlock extends Block {
    constructor(x, y, w, h, color, dir) {
        super(x, y, w, h, color);
        this.direction = dir;
        this.curvedBody = new SnakeCurve();
        this.straightBody = new SnakeStraight();
    }


    draw(nextDirection, idx, len) {
        if (idx == 0) {
            headSprite.rotate(this.x, this.y, this.w, this.h, headSpriteAngleMap[this.direction]);
        } else if (idx == len - 1) {
            tailSprite.rotate(this.x, this.y, this.w, this.h, tailSpriteAngleMap[nextDirection]);
        } else if (nextDirection == this.direction) {
            this.straightBody.draw(this.x, this.y, this.w, this.h, this.direction);
        } else if (this.direction != nextDirection) {
            this.curvedBody.draw(this.x, this.y, this.w, this.h, this.direction, nextDirection);
        }
    }

    getLocation(){
      return super.getLocation();
    }
}
