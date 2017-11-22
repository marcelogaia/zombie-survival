/* jslint browser:true, esversion: 6 */
class HUD {

    constructor(context) {
        this.context = context;
        this.drops = [];
        this.maxDrops = 150;
        this.messages = [];
        //this.context.translate(stage.width/2,stage.height/2);
    }

    draw() {
        this.context.clearRect(0,0,stage.width,stage.height);
        this.makeItRain();
        this.drawShadow();
        this.drawExperienceBar();
    }

    drawPlayerInfo() {

    }

    drawWeapons() {

    }

    makeItRain() {
        let ctx = this.context;
        ctx.save();
        ctx.translate(stage.xMid,stage.yMid);
        ctx.strokeStyle = "rgba(235,235,255,0.5)";
        ctx.lineWidth = this.maxDrops > 300 ? 1 : 2;

        while(this.drops.length < this.maxDrops) {
            this.drops.push({
                x : Math.random()*stage.width*2 - stage.width,
                y : Math.random()*stage.height*2 - stage.height
            });
        }

        for(let i in this.drops) {
            let d = this.drops[i];
            let pDirection = Math.atan2((player.y - d.y),(player.x - d.x));

            let yDist = Math.abs(player.y - d.y);
            let xDist = Math.abs(player.x - d.x);
            let actualDist = Math.sqrt(yDist*yDist + xDist*xDist);

            d.x += Math.cos(pDirection) * actualDist/10;
            d.y += Math.sin(pDirection) * actualDist/10;
            
            let minDistance  = Math.random()*300 - 100;
            let maxDistance = 600;

            if(actualDist < minDistance || actualDist > maxDistance) {
                this.drops.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.moveTo(d.x,d.y);
            ctx.lineTo(
                d.x + (Math.cos(pDirection) * actualDist/20),
                d.y + (Math.sin(pDirection) * actualDist/20)
            );

            ctx.stroke();
        }

        ctx.restore();
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
            300,
            player.x+stage.xMid,
            player.y+stage.yMid,
            0
        );

        gradient.addColorStop(0, 'rgba(0,0,0,0.9)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.5)');

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

