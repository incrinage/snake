import {
    BLOCK_HEIGHT,
    BLOCK_WIDTH, GAME_SCREEN_HEIGHT, GAME_SCREEN_WIDTH
} from '../common/GameContext';
import Sprite from '../common/Sprite';

import DarkGrass from '../grass/sprites/dark-grass.png';

import LightGrass from '../grass/sprites/grass.png';

const darkTileSprite = new Sprite(DarkGrass, false);
const lightTileSprite = new Sprite(LightGrass, false);
export default class SquareBoard {



    board = [[]];
    entities = []
    constructor(squareSize, tileWidth, tileHeight) {
        this.boardSize = squareSize;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }

    addEntity(locatableEntity) {
        this.entities.push(locatableEntity)
    }

    emptyTile(row, col) {
        return !board[row, col];
    }

    drawBoard() {
        let count = 0;
        for (let x = 0; x < this.tileWidth * this.boardSize; x += this.tileWidth) {
            for (let y = 0; y < this.tileHeight * this.boardSize; y += this.tileHeight) {
                if (count % 2 == 0) {
                    darkTileSprite.draw(x, y, this.tileWidth, this.tileHeight);
                } else {
                    lightTileSprite.draw(x, y, this.tileWidth, this.tileHeight);
                }
                count++;
            }
            count++;
        }
    }

    draw() {
        this.drawBoard();
    }

    //replace with map
    update() {

        this.board = [[]];

        this.entities.forEach((entity, entityIdx) => {
            const entityLocation = entity.getLocation();

            for (let x = 0; x < this.tileWidth * this.boardSize; x += this.tileWidth) {
                for (let y = 0; y < this.tileHeight * this.boardSize; y += this.tileHeight) {
                    entityLocation.forEach((location, idx) => {
                        //check if within the bounds of x and y using tile width and tile height
                        if (location.x >= x && location.x < x + this.tileWidth && location.y >= y && location.y < y + this.tileHeight) {
                            //calculate x and y index in board and assign entity index;
                            let col = (x / this.tileWidth);
                            let row = (y / this.tileHeight);
                            if (!this.board[row]) {
                                this.board[row] = [];
                            }
                            this.board[row][col] = entityIdx;
                        };
                    });
                }
                //validate that they are valid coordinates?
            }
        });
    }
}

