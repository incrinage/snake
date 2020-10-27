
export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext('2d');

import Game from './Game.js'
import { CANVAS_HEIGHT, CANVAS_WIDTH, LEFT_X_BOUNDARY } from './common/GameContext.js';

ctx.canvas.width = LEFT_X_BOUNDARY + CANVAS_WIDTH;
ctx.canvas.height = CANVAS_HEIGHT;
Game.start();