/* jslint browser:true, esversion: 6 */
class Bullet extends GameObject {
    constructor(x, y, context, damage, direction, speed, impact, width) {
        super(x,y,context,1,false);

        this.dmg = damage;
        this.direction = direction;
        this.speed = speed;
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
        this.context.strokeStyle = "#EB7";
        this.context.lineWidth = this.width;
        this.context.moveTo(this.x, this.y);

        let hit = this.hit();

        if(hit) {
            this.context.lineTo(hit.x,hit.y);
        }
        else {
            this.context.lineTo(
                this.x + (Math.cos(this.direction) * this.speed),
                this.y + (Math.sin(this.direction) * this.speed)
            );
        }

        this.context.stroke();
        this.context.restore();

        if(hit) this.destroy();

        this.move();
    }

    hit(){
        let hit = false;

        eachPixel:
        for(let i = 0; i < this.speed; i++) {
            

            eachEnemies:
            for(let j in stage.enemies){
                
                let point = {
                    x: this.x+Math.cos(this.direction)*i,
                    y: this.y+Math.sin(this.direction)*i
                };
                
                let currEnemy = stage.enemies[j];

                point = currEnemy.hitTest(point);

                if(point) {
                    // Sprite source: <a href='http://www.freepik.com/free-vector/red-ink-splashes_1050260.htm'>Designed by Freepik</a>

                    let bloodSprite = new Sprite({
                        context: sCtx,
                        width: 150,
                        height: 150,
                        image: bloodImage,
                        // Size Graph: https://www.wolframalpha.com/input/?i=sqrt(x%2F200)+x+from+0+to+1000
                        scale: Math.sqrt(this.dmg)*3,
                        frames: 4,
                        animationSpeed: 0
                    });

                    bloodSprite.drawRand(point.x,point.y);
                    bloodSprite.destroy();

                    hit = point;

                    if(this.dmg < currEnemy.currHP)
                        currEnemy.currHP -= this.dmg;
                    else 
                        currEnemy.currHP = 0;

                    currEnemy.x += (Math.cos(this.direction) * (this.impact * 5 / currEnemy.size));
                    currEnemy.y += (Math.sin(this.direction) * (this.impact * 5 / currEnemy.size));
                    
                    this.destroy();
                    
                    break eachPixel;
                }
            }
        }

        return hit;
    }

    destroy(){
        for(let i in bullets){
            if(this === bullets[i])
                bullets.splice(i,1);
        }
    }
}

