import Block from "./Block";

export default function Snake(x, y) {
    this.v = 20; //velocity
    this.x = x;
    this.y = y;
    this.alive = true;
    this.direction = 'ArrowRight';

    //default body 
    let body = [new Block(this.x, this.y, 'snake', 'green')];

    //draw snake blocks
    this.draw = function () {
        body.forEach((block) => block.draw());
    };

    //eat block
    this.eat = function (block) {
        switch (block.type) {
            //eat:
            //food snake grows
            case 'food':
                block.color = 'green';
                block.type = 'snake';
                body.push(block);
                break;
            //snake dies if it eats self (assumed to be the only snake)
            case 'snake':
                this.setAlive(false);
                break;
            default:
                //noop
                console.log("can't eat that");
        }
    };

    this.setAlive = function (alive) {
        this.alive = alive;
    };

    this.getBody = function () {
        return body;
    };

    this.isAlive = function () {
        return this.alive;
    };

    this.moveLeft = function () {
        const tail = body.pop();
        this.x -= this.v;
        tail.x = this.x;
        tail.y = this.y;
        body = [tail].concat(body);
    };
    this.moveRight = function () {
        const tail = body.pop();
        this.x += this.v;
        tail.x = this.x;
        tail.y = this.y;
        body = [tail].concat(body);

    };
    this.moveUp = function () {
        const tail = body.pop();
        this.y -= this.v;
        tail.x = this.x;
        tail.y = this.y;
        body = [tail].concat(body);

    };

    this.moveDown = function () {
        const tail = body.pop();
        this.y += this.v;
        tail.x = this.x;
        tail.y = this.y;
        body = [tail].concat(body);
    };

    this.setDirection = function (dir) {
        if (this.direction == 'ArrowLeft' && dir == 'ArrowRight' ||
            this.direction == 'ArrowRight' && dir == 'ArrowLeft' ||
            this.direction == 'ArrowUp' && dir == 'ArrowDown' ||
            this.direction == 'ArrowDown' && dir == 'ArrowUp') {
            return;
        }

        this.direction = dir;
    }

    this.move = function () {
        switch (this.direction) {
            case 'ArrowLeft':
                this.moveLeft();
                break;
            case 'ArrowRight':
                this.moveRight();
                break;
            case 'ArrowUp':
                this.moveUp();
                break;
            case 'ArrowDown':
                this.moveDown();
                break;
        }
    }


    this.draw = this.draw.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.isAlive = this.isAlive.bind(this);
    this.setAlive = this.setAlive.bind(this);
    this.getBody = this.getBody.bind(this);
}
