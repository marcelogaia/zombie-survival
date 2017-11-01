/* jslint browser:true, esversion: 6 */
class HUD {

    constructor(context) {
        this.context = context;

        this.messages = [];
    }

    draw() {
        
    }

    drawPlayerInfo() {

    }

    drawWeapons() {

    }

    drawExperienceBar() {


    }

    drawStatusMessage(x,y,message) {
        // this.context.save();
        this.context.clearRect(0,0,stage.width,stage.height);
        this.context.font = "15px Arial";
        this.context.fillStyle = "white";
        this.context.textAlign = "center";
        this.context.lineWidth = 3;
        this.context.strokeText(message,x, y + 25);
        this.context.fillText(message,x, y + 25);
        // this.context.restore();
    }

    message(message) {
        // @TODO: Animation (text floating upwards and disapearing);
        this.messages.push(new StatusMessage(this.context, message));
    }
}

