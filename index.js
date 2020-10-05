
export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext('2d');

import Game from './Game.js'

ctx.canvas.width = 600;
ctx.canvas.height = 600;


Game.start();