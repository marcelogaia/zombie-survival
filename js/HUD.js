/* jslint browser:true, esversion: 6 */
class HUD {

    constructor(context) {
        this.context = context;

        this.messages = [];
        //this.context.translate(stage.width/2,stage.height/2);
    }

    draw() {
        this.context.clearRect(0,0,stage.width,stage.height);
        this.drawShadow();
        this.drawExperienceBar();
    }

    drawPlayerInfo() {

    }

    drawWeapons() {

    }

    drawExperienceBar() {
        let exp = player.exp / player.nextLevel();
        let expPerc = (exp * 100).toFixed(2);

        // Drawing the EXP bar
        this.context.beginPath();
        this.context.lineCap = "round";
        this.context.strokeStyle = "#DDD";
        this.context.lineWidth = 30;
        this.context.moveTo(30,stage.height-2);
        this.context.lineTo(stage.width-30,stage.height-2);
        this.context.stroke();

        this.context.beginPath();
        this.context.strokeStyle = "black";
        this.context.moveTo(32,stage.height-1);
        this.context.lineTo(stage.width-32,stage.height-1);
        this.context.stroke();

        let gradient = this.context.createLinearGradient(
            120,stage.height-10,stage.width-160,5
        );

        gradient.addColorStop(0, '#b97538');
        gradient.addColorStop(1, '#faa257');

        this.context.beginPath();
        this.context.fillStyle = gradient;

        this.context.rect(120,stage.height-11,(stage.width-160)*exp,7);
        this.context.fill();

        this.context.beginPath();
        this.context.strokeStyle = "#ffefe2";
        this.context.lineWidth = 1;
        this.context.rect(119,stage.height-12,stage.width-158,8);
        this.context.stroke();

        this.context.beginPath();
        this.context.strokeStyle = "rgba(255,255,255,0.7)";
        this.context.moveTo(120,stage.height-10);
        this.context.lineTo(stage.width-40,stage.height-10);
        this.context.stroke();

        this.context.beginPath();
        this.context.strokeStyle = "rgba(0,0,0,0.7)";
        this.context.moveTo(120,stage.height-5);
        this.context.lineTo(stage.width-40,stage.height-5);
        this.context.stroke();

        for(let i = 1; i<10; i++) {
            this.context.beginPath();
            this.context.moveTo(120 + (stage.width-160)*i/10, stage.height-12);
            this.context.lineTo(120 + (stage.width-160)*i/10, stage.height-4);
            this.context.stroke();
        }

        this.context.font = "12px Arial";
        this.context.strokeStyle = "black";
        this.context.fillStyle = "#fad69d";
        this.context.textAlign = "left";
        this.context.lineWidth = 2;
        this.context.strokeText("Exp: "+ expPerc + "%", 35, stage.height-3);
        this.context.fillText("Exp: "+ expPerc + "%", 35, stage.height-3);

    }

    drawShadow() {

        let gradient = this.context.createRadialGradient(
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
        context.strokeStyle = "black";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.lineWidth = 3;
        context.strokeText(message,x, y + 5);
        context.fillText(message,x, y + 5);
    }

    message(message, color = "white", size = 15) {
        // @TODO: Animation (text floating upwards and disapearing);
        this.messages.push(new StatusMessage(this.context, message, color, size));
    }
}

