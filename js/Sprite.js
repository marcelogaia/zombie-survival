/* jslint browser:true, esversion: 6 */
// Simple sprite drawing function
// Based on: http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/
class Sprite {

    constructor(options) {
        for(let i in options) {
            this[i] = options[i];
        }
    }

    draw(x,y,frame,context = this.context, rotation = 0) {
        context.globalCompositeOperation = "source-atop";

        if (this.image.complete) {
            context.translate(x,y);
            context.rotate(rotation);
            context.drawImage(
                this.image,

                frame * this.width,
                0,
                this.width,
                this.height,

                - (this.width * this.scale)/2,
                - (this.height * this.scale)/2,
                (this.width * this.scale),
                (this.height * this.scale)
            );
        }
    }

    drawRand(x,y) {
        let ctx = this.context;
        ctx.save();
        ctx.globalAlpha = 0.8;

        let imageIndex = Math.floor(Math.random() * this.frames);
        let randRotation = Math.random() * Math.PI * 2;

        this.draw(x,y,imageIndex,ctx,randRotation);
        ctx.restore();
        
    }
}

