import Block from "../common/Block";
import Sprite from "../common/Sprite";
import MousePNG from './sprites/mouse-3.png'

export default class Mouse extends Block {
    constructor(x, y, w, h, color) {
        super(x, y, w, h, color);
    }

    mouseSprite = new Sprite(MousePNG, false);

    draw() {
        this.mouseSprite.draw(this.x, this.y, this.w, this.h);
    }

    getLocation(){
        return super.getLocation();
    }
}