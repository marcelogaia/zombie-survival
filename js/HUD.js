/* jslint browser:true, esversion: 6 */
class HUD {

    constructor(context) {
        this.context = context;

        this.messages = [];
        //this.context.translate(stage.width/2,stage.height/2);
    }

    draw() {
        this.context.clearRect(0,0,stage.width,stage.height);
        //this.drawShadow();
        //this.drawExperienceBar();
    }

    drawPlayerInfo() {

    }

    drawWeapons() {

    }

    drawExperienceBar() {
        // Drawing the EXP bar
        console.log(stage);

        this.context.fillStyle = "red";
        this.context.rect(
            0, 
            stage.height - 100, 
            stage.width, 
            stage.height
        );

        this.context.fill();

        this.context.fillStyle = "yellow";
        this.context.rect(
            0, 
            stage.height - 10, 
            stage.width * player.exp / player.nextLevel(), 
            stage.height
        );

        this.context.fill();

        this.context.fillStyle = "black";
        this.context.rect(10,10,100,100);
        this.context.fill();

    }

    drawShadow() {

        var gradient = this.context.createRadialGradient(
            player.x+stage.xMid,
            player.y+stage.yMid,
            400,
            player.x+stage.xMid,
            player.y+stage.yMid,
            0
        );
        gradient.addColorStop(0, 'black');
        gradient.addColorStop(0.9, 'rgba(0,0,0,0.3)');
        gradient.addColorStop(1, 'transparent');
        this.context.fillStyle = gradient;
        this.context.fillRect(0,0,stage.width,stage.height);
    }

    // Mostly for the FPS counter (maybe remove later)
    static drawStatusMessage(x,y,message, context) {
        context.font = "15px Arial";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.lineWidth = 3;
        context.strokeText(message,x, y + 25);
        context.fillText(message,x, y + 25);
    }

    message(message, color = "white", size = 15) {
        // @TODO: Animation (text floating upwards and disapearing);
        this.messages.push(new StatusMessage(this.context, message, color, size));
    }
}

