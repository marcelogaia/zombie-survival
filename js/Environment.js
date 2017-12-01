/* jslint browser:true, esversion: 6 */
class Environment {

	constructor(context) {
	    this.context = context;
	    this.drops = [];
	    this.maxDrops = 150;
	    this.shadowAlpha = 1;
        this.thudnerInterval = 0;
        this.nextThunderTO = 0;

        sounds.thunderSnd.volume = 0.3; 

        this.thunderCount = 0;
	}

    thunder() {
        console.log(this.thunderCount++);
        this.shadowAlpha = 1;

    	let dim = false;
        sounds.thunderSnd.currentTime = 0;
        sounds.thunderSnd.playbackRate = 0.6 + Math.random() * 0.8;

        sounds.thunderSnd.play();

        this.thunderInterval = setInterval(() => {
            this.context.fillStyle = "rgba(200,150,255,0.2)";
            this.context.fillRect(0,0,stage.width,stage.height);
            
            if(!dim && this.shadowAlpha > 0) {
                this.shadowAlpha = 0;
            } else {
                dim = true;

                if(this.shadowAlpha < 1) {
                    // x = 2 * (x + 0.015)
                    this.shadowAlpha += 0.015;
                    this.shadowAlpha *= 2;
                    clearTimeout(this.nextThunderTO);
                } else {
                    clearInterval(this.thunderInterval);
                    dim = false;
                    this.shadowAlpha = 1;

                    let time = Math.random() * 10000 + 3000;
                    
                    this.nextThunderTO = setTimeout(()=>{
                        this.thunder();
                    },time);
                }
            }

            if(this.shadowAlpha < 0) this.shadowAlpha = 0;
        }, 33);
    }

    draw() {
        this.context.clearRect(0,0,stage.width,stage.height);
        this.context.globalAlpha = 1;
	    this.makeItRain();
	    this.drawShadow();
    }

    drawShadow(alpha = 1) {

        let gradient = this.context.createRadialGradient(
            player.x+stage.xMid,
            player.y+stage.yMid,
            300,
            player.x+stage.xMid,
            player.y+stage.yMid,
            0
        );

        gradient.addColorStop(0, 'rgba(0,0,0,'+this.shadowAlpha*0.95+')');
        gradient.addColorStop(0.8, 'rgba(0,0,0,'+this.shadowAlpha*0.5+')');
        gradient.addColorStop(1, 'rgba(0,0,0,'+this.shadowAlpha*0.3+')');

        this.context.fillStyle = gradient;
        this.context.fillRect(0,0,stage.width,stage.height);
    }

    makeItRain() {
        let ctx = this.context;
        ctx.save();
        ctx.translate(stage.xMid,stage.yMid);
        ctx.strokeStyle = "rgba(215,215,255,0.5)";
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

            d.x += Math.cos(pDirection) * actualDist/30;
            d.y += Math.sin(pDirection) * actualDist/30;
            
            let minDistance  = Math.random()*400 - 200;
            let maxDistance = 600;

            if(actualDist < minDistance || actualDist > maxDistance) {
                this.drops.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.moveTo(d.x,d.y);
            ctx.lineTo(
                d.x + (Math.cos(pDirection) * actualDist/15),
                d.y + (Math.sin(pDirection) * actualDist/15)
            );

            ctx.stroke();
        }

        ctx.restore();
    }
}