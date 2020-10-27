import { DOWN, LEFT, RIGHT, UP } from "../common/KeyEvent";
import Sprite from "../common/Sprite";
import SnakeBodyCurved from "./sprites/snake-body-curved.png";

export function SnakeCurve() {

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
    };

    this.draw = function (x, y, w, h, currentDirection, nextDirection) {
        curvedSprite.rotate(x, y, w, h, curvedSpriteAngleMap[currentDirection][nextDirection]);
    };
}
