/* jslint browser:true, esversion: 6 */
// Simple sprite drawing function
// Based on: http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/
class Sprite {

    constructor(options) {
        for(let i in options) {
            this[i] = options[i];
        }

        this.currFrame = 0;

        setInterval(function(){
            if(this.currFrame+1 >= this.frames) {
                this.currFrame = 0;
            } else {
                this.currFrame += 1;
            }
        }.bind(this), 1000/this.animationSpeed);
    }

    draw(x, y, context = this.context, rotation = 0, alpha = 1) {

        context.save();
        context.translate(stage.xMid, stage.yMid);
        // context.globalCompositeOperation = "source-atop";
        context.globalAlpha = alpha;

        if (this.image.complete) {
            context.translate(x,y);
            context.rotate(rotation);
            context.drawImage(
                this.image,

                this.currFrame * this.width, 
                0,

                this.width, 
                this.height,

                -this.scale,
                -this.scale,

                this.scale * 2,
                this.scale * 2
            );
        }

        context.restore();
    }

    drawRand(x,y) {
        let imageIndex = Math.floor(Math.random() * this.frames);
        this.currFrame = imageIndex;
        let randRotation = Math.random() * Math.PI * 2;

        this.draw(x,y,this.context,randRotation,0.7);
    }
}

