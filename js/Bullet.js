/* jslint browser:true, esversion: 6 */
class Bullet extends GameObject {
    constructor(x, y, context, range, direction, speed, impact, width) {
        super(x,y,context);

        this.range = range;
        this.direction = direction;
        this.speed = speed;
        this.dmg = weapon.dmg;
        this.impact = impact;
        this.width = width;
    }
    

    move(){
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;

        // Destroy once it leaves the screen
        if(Math.abs(this.x) > stage.xMid || Math.abs(this.y) > stage.yMid) {
            this.destroy();
        }
    }

    draw(){
        this.context.beginPath();
        this.context.save();
        this.context.translate(stage.xMid,stage.yMid);
        this.context.strokeStyle = "#DDA";
        this.context.lineWidth = this.width;
        this.context.moveTo(this.x, this.y);

        let hit = this.hit();

        if(hit) {
            this.context.lineTo(hit.x,hit.y);
        }
        else {
            this.context.lineTo(
                this.x + (Math.cos(this.direction) * weapon.bulletSpeed),
                this.y + (Math.sin(this.direction) * weapon.bulletSpeed)
            );
        }

        this.context.stroke();
        this.context.restore();

        if(hit) this.destroy();

        this.move();
    }

    hit(){
        let hit = false;

        sCtx.save();
        sCtx.translate(stage.xMid,stage.yMid);

        eachPixel:
        for(let i = 0; i < this.speed; i++) {

            let point = {
                x: this.x + (Math.cos(this.direction) * i),
                y: this.y + (Math.sin(this.direction) * i)
            };

            eachEnemies:
            for(let j in stage.enemies){
                if(stage.enemies[j].wasHit(point)) {
                    // Sprite source: <a href='http://www.freepik.com/free-vector/red-ink-splashes_1050260.htm'>Designed by Freepik</a>

                    let bloodSprite = new Sprite({
                        context: sCtx,
                        width: 150,
                        height: 150,
                        image: bloodImage,
                        // Size Graph: https://www.wolframalpha.com/input/?i=sqrt(x%2F2)+x+from+0+to+1000
                        scale: Math.sqrt(weapon.impact/2)/10,
                        frames: 4
                    });

                    bloodSprite.drawRand(point.x,point.y);

                    hit = point;
                    this.destroy();

                    if(this.dmg < stage.enemies[j].currHP)
                        stage.enemies[j].currHP -= this.dmg;
                    else 
                        stage.enemies[j].currHP = 0;

                    stage.enemies[j].x += (Math.cos(this.direction) * (this.impact*5 / stage.enemies[j].size));
                    stage.enemies[j].y += (Math.sin(this.direction) * (this.impact*5 / stage.enemies[j].size));
                    break eachPixel;
                }
            }
        }

        sCtx.restore();

        return hit;
    }

    destroy(){
        for(let i in bullets){
            if(this === bullets[i])
                bullets.splice(i,1);
        }
    }
}

