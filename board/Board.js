import Sprite from '../common/Sprite';

import DarkGrass from '../grass/sprites/dark-grass.png';

import LightGrass from '../grass/sprites/grass.png';

const darkTileSprite = new Sprite(DarkGrass, false);
const lightTileSprite = new Sprite(LightGrass, false);
export default class SquareBoard {




    entities = []
    constructor(squareSize, tileWidth, tileHeight) {
        this.squareSize = squareSize;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.clearBoard();

    }

    addEntity(locatableEntity) {
        this.entities.push(locatableEntity)
    }

    emptyTile(row, col) {
        return !this.board[row][col];
    }

    getUnocupiedLocations() {
        const availableLocations = []
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (!this.board[i][j]) {
                    availableLocations.push({ y: i * this.tileWidth, x: j * this.tileHeight });
                }
            }
        }
        return availableLocations;
    }

    drawBoard() {
        let count = 0;
        for (let x = 0; x < this.tileWidth * this.squareSize; x += this.tileWidth) {
            for (let y = 0; y < this.tileHeight * this.squareSize; y += this.tileHeight) {
                if (count % 2 == 0) {
                    darkTileSprite.draw(x, y, this.tileWidth, this.tileHeight);
                } else {
                    lightTileSprite.draw(x, y, this.tileWidth, this.tileHeight);
                }
                count++;
            }
        }
    }

    draw() {
        this.drawBoard();
    }

    update() {
        //create empty matrix
        this.clearBoard();
        this.entities.forEach((entity, entityIdx) => {
            const entityLocation = entity.getLocation();
            entityLocation.forEach((location) => {
                const { x, y } = location;
                let col = (x / this.tileWidth);
                let row = (y / this.tileHeight);
                if (!this.board[row]) {
                    this.board[row] = [];
                }
                this.board[row][col] = entityIdx;
            });

        });
    }

    clearBoard() {
        this.board = new Array(this.squareSize);
        for (let i = 0; i < this.squareSize; i++) {
            this.board[i] = new Array(this.squareSize);
        }
    }
}

