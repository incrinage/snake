import Block from "./Block";

export default function Snake(x, y) {
    this.v = 20; //velocity
    this.x = x;
    this.y = y;
    this.alive = true;

    //default body 
    let body = [new Block(this.x, this.y, 'snake', 'green'), new Block(this.x - 20, this.y - 20, 'snake', 'green')];

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
        this.prevX = this.x;
        this.prevY = this.y;
        this.y += this.v;
        tail.x = this.x;
        tail.y = this.y;
        body = [tail].concat(body);
    };


    this.draw = this.draw.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.isAlive = this.isAlive.bind(this);
    this.setAlive = this.setAlive.bind(this);
    this.getBody = this.getBody.bind(this);
}
