import Board from '../board/Board.js';
import Mouse from '../mouse/Mouse.js';
import Snake from '../snake/Snake.js';


function shouldNotHaveOccupiedTiles(){
    const board = new Board(25, 20, 20);

    const snake = new Snake(20*25, 20*5, 20, 20);
    const snakeLocations = snake.getLocation();
    const mouse = new Mouse(20*2, 20*2, 20);
    const mouseLocations = mouse.getLocation();
    board.addEntity(snake);
    board.addEntity(mouse);

    const boardAvailableSpace = board.getUnocupiedLocations();

    for(let i = 0; i < snakeLocations.length; i++){
        for(let j = 0; j < boardAvailableSpace; j++){
            if(snakeLocations[i].x == boardAvailableSpace[j].x && snakeLocations[i].y == boardAvailableSpace[j]){
                throw new Error("available space has snake location")
            } 
        }
    }

    for(let i = 0 ; i < snakeLocations.length; i++){
        for(let j = 0; j < mouseLocations.length; j++ ){
             if (snakeLocations[i].x == mouseLocations[j].x && snakeLocations[i].y == mouseLocations[j]){
                throw new Error("mouse has snake location")

            }
        }
    }

     console.log('success')
}

shouldNotHaveOccupiedTiles();