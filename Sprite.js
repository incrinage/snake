import { ctx } from './index';

export default function Sprite(filename, pattern) {
    this.image = null;
    this.pattern = pattern;

    if (filename) {
        this.image = new Image();
        this.image.src = filename;
    } else {
        throw new Error("filename not provided for sprite");
    }

    this.draw = function (x, y, w, h) {
        if (this.pattern) {
            ctx.fillStyle = this.pattern;
            ctx.fillRect(x, y, w, h);
        } else {
            ctx.drawImage(this.image, x, y, w || this.image.width, h || this.image.height)
        }
    }

    this.rotate = function(x,y,w,h, angle) {
        ctx.save();
        ctx.translate(x + w/2,y + h/2);
        ctx.rotate(angle * Math.PI/180 );
        ctx.drawImage(this.image, -(this.image.width/2),-(this.image.height/2));
        ctx.restore();
    }

}