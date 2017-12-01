/* jslint browser:true, esversion: 6 */
class HUD {

    constructor(context) {
        this.context = context;
        this.messages = [];
    }

    draw() {
        this.context.clearRect(0,0,stage.width,stage.height);
        this.drawWeapons();
        this.drawPlayerInfo();
        this.drawExperienceBar();
    }

    drawPlayerInfo() {
        let ctx = this.context;

        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.fillStyle = "black";
        ctx.lineWidth = 1;
        ctx.moveTo(80,65);
        ctx.lineTo(370,65);
        ctx.lineTo(360,75);
        ctx.lineTo(90,75);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        let ratio = player.hp / player.maxHp;
        ctx.beginPath();
        ctx.fillStyle = "rgb(160,0,0)";
        ctx.lineWidth = 1;
        ctx.moveTo(80,65);
        ctx.lineTo(290*ratio + 80,65);
        ctx.lineTo(280*ratio + 80,75);
        ctx.lineTo(90,75);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.lineCap="round";
        ctx.moveTo(80,66);
        ctx.lineTo(367,66);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,0,0,0.4)";
        ctx.lineCap="round";
        ctx.moveTo(80,74);
        ctx.lineTo(359,74);
        ctx.stroke();

        ctx.font = "11px Arial";
        ctx.strokeStyle = "black";
        ctx.fillStyle = "rgba(255,240,240,1)";
        ctx.textAlign = "center";
        ctx.lineWidth = 4;
        ctx.strokeText(player.hp + "  / " + player.maxHp,225,73);
        ctx.fillText(player.hp + "  / " + player.maxHp,225,73);

        ctx.beginPath();
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient
        var gradient = ctx.createRadialGradient(60, 60, 60, 60, 60, 0);
        gradient.addColorStop(0, '#faa257');
        gradient.addColorStop(1, '#a96528');

        ctx.fillStyle = gradient;
        ctx.strokeStyle = "'#995518'";
        ctx.lineWidth = 2;
        ctx.ellipse(60, 70, 40, 20, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();

        ctx.drawImage(
            portraitImage,
            0, 0, 452, 452,
            25, 3, 85, 85
        );
    }

    drawWeapons() {
        let ctx = this.context;
        ctx.save();
        ctx.translate(stage.width/2,stage.height - 100);

        let weaponImg = new Array(10);
        
        weaponImg[1] = pistolImage;
        weaponImg[2] = uziImage;
        weaponImg[3] = shotgunImage;
        weaponImg[4] = ak47Image;
        weaponImg[5] = rpgImage;

        for(let i = 1; i < 10 && i != 0; i++) {
            let offset = (60 * i) - 300;
            let color1 = "rgba(255,255,255,0.2)";
            let color2 = "rgba(255,255,255,0.6)";
            let color3 = "rgba(0,0,0,0.8)";

            if(weaponNo[i] == undefined) {
                color1 = "rgba(255,255,255,0.1)";
                color2 = "rgba(255,255,255,0.3)";
                color3 = "rgba(0,0,0,0.5)";
            } else {
                if(weaponNo[i] == window.weapon) {
                    color1 = "rgba(255,255,255,0.4";
                    color2 = "rgba(255,255,255,1)";
                    color3 = "rgba(0,0,0,1)";
                }
            }

            ctx.fillStyle = color1;
            ctx.strokeStyle = color2;
            ctx.lineWidth = 1;
            ctx.beginPath();
            
            ctx.moveTo(offset + 20, 10);
            ctx.lineTo(offset + 50, 10);
            ctx.quadraticCurveTo(offset + 60, 10, offset + 60, 20);
            
            ctx.lineTo(offset + 60, 50);
            ctx.quadraticCurveTo(offset + 60, 60, offset + 50, 60);
            
            ctx.lineTo(offset + 20, 60);
            ctx.quadraticCurveTo(offset + 10, 60, offset + 10, 50);
            
            ctx.lineTo(offset + 10, 20);
            ctx.quadraticCurveTo(offset + 10, 10, offset + 20, 10);
            
            ctx.fill();
            ctx.stroke();

            if(weaponImg[i] != undefined){
                ctx.globalAlpha = weaponNo[i] == undefined ? 0.2 : 1;
                ctx.drawImage(
                    weaponImg[i],
                    0,0,
                    120,120,
                    
                    offset+10,10,
                    50,50
                );

                ctx.globalAlpha = 1;
            }

            ctx.font = "10px Arial";
            ctx.strokeStyle = color3;
            ctx.fillStyle = color2;
            ctx.textAlign = "center";
            ctx.lineWidth = 1;
            ctx.strokeText(i,offset+18, 23);
            ctx.fillText(i,offset+18, 23);


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

