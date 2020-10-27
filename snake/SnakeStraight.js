import { DOWN, LEFT, RIGHT, UP } from "../common/KeyEvent";
import Sprite from "../common/Sprite";
import SnakeBodyStraight from "./sprites/snake-body-straight.png";

export function SnakeStraight() {
    const straightSprite = new Sprite(SnakeBodyStraight, false);
    const straightSpriteAngleMap = {
        [UP]: 90,
        [DOWN]: 270,
        [RIGHT]: 0,
        [LEFT]: 180
    };
    this.draw = function (x, y, w, h, currentDirection) {
        straightSprite.rotate(x, y, w, h, straightSpriteAngleMap[currentDirection]);
    };
}
