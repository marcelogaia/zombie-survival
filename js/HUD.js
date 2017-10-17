/* jslint browser:true, esversion: 6 */
class HUD {

    constructor(context) {
        this.context = context;
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
        // @TODO: Animation (text floating upwards and disapearing);
        this.context.clearRect(0,0,stage.width,stage.height);
        this.context.font = "15px Arial";
        this.context.fillStyle = "white";
        this.context.textAlign = "center";
        this.context.lineWidth = 3;
        this.context.strokeText(message,x, y + 25);
        this.context.fillText(message,x, y + 25);
    }
}

