/* jslint browser:true, esversion: 6 */
// Simple sprite drawing function
// Based on: http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/
class Sprite {

    constructor(options) {
        for(let i in options) {
            this[i] = options[i];
        }

        this.currFrame = 0;

        if(this.animationSpeed > 0){
            this.interval = setInterval(() => {
                if(this.currFrame+1 >= this.frames) {
                    this.currFrame = 0;
                } else {
                    this.currFrame += 1;
                }
            }, 1000/this.animationSpeed);
        }
    }

    draw(x, y, context = this.context, rotation = 0, alpha = 1) {
        context.save();
        context.translate(stage.xMid, stage.yMid);
        context.globalAlpha = alpha;

        if (this.image.complete) {
            context.translate(x+this.scale/2,y+this.scale/2);
            context.rotate(rotation);
            context.drawImage(
                this.image,                     // img      Specifies the image, canvas, or video element to use   

                this.currFrame * (this.image.width / this.frames),    // sx       Optional. The x coordinate where to start clipping
                0,                              // sy       Optional. The y coordinate where to start clipping

                (this.image.width / this.frames),                     // swidth   Optional. The width of the clipped image
                this.height,                    // sheight  Optional. The height of the clipped image

                -this.scale,                    // x        The x coordinate where to place the image on the canvas
                -this.scale,                    // y        The y coordinate where to place the image on the canvas

                this.scale*2,                 // width    Optional. The width of the image to use (stretch or reduce the image)
                this.scale*2                  // height   Optional. The height of the image to use (stretch or reduce the image)
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

    destroy() {
        clearInterval(this.interval);
        for(let i in this) {
            this[i] = null;
        }
    }
}

