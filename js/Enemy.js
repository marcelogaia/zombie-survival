/* jslint browser:true, esversion: 6 */
class Enemy extends GameObject{
    constructor (name, x, y, context,stage) {
        let spriteStr, sprite;
        if(Array.isArray(enemiesData[name].spritesheet)){
            spriteStr = enemiesData[name].spritesheet[0].trim();
            sprite = spriteStr !== "";
        }

        super(x,y,context,enemiesData[name].size,sprite);

        for(let i in enemiesData[name]) {
            let w = enemiesData[name][i];
            this[i] = w;
        }
        
        if(sprite) {

            // @TODO: Check if image was found.
            let img = new Image();
            img.src = "sprites/" + this.spritesheet[0];


            img.onload = () => {
                this.sprite = new Sprite({
                    context : this.context,
                    width   : img.width,
                    height  : img.height,
                    image   : img,
                    scale   : this.size,
                    frames  : this.spritesheet[1],
                    animationSpeed : this.maxSpeed*25
                });
            };
        }


        this.currHP = this.HP;

        this.pDirection = 0;
        this.currSpeed = 0;
        this.directionLock = false;
        stage.toSpawn[name] -= stage.toSpawn[name] > 0 ? 1 : 0;

        // @TODO: Create a skill class
        this.skillList = {
            "dash" : {
                "castTime" : 2000,
                "action" : () => {
                    let prevAcc = this.acceleration;
                    let prevMax = this.maxSpeed;
                    this.acceleration = 0.45;
                    this.maxSpeed = 11;
                    this.directionLock = true;

                    setTimeout(() => {
                        this.maxSpeed = prevMax;
                        this.acceleration = prevAcc;
                        this.directionLock = false;
                    },1500);
                },
            }
        };

        let self = this;

        // Based on: https://stackoverflow.com/a/6962808/4184867
        (function loop() {
            if(self.skills.length > 0) {
                let skill = self.skills[Math.floor(Math.random() * self.skills.length)];
                
                let rand = Math.round(Math.random() * 5000) + self.skillList[skill].castTime*2;

                setTimeout(() => {
                    self.useSkill(skill);
                    loop();  
                }, rand);
            }
        }());
    }

    move() {
        // m = (y2 - y1) / (x2 - x1)
        // angle = arctan(m)
        if(!this.directionLock)
            this.pDirection = Math.atan2((player.y - this.y),(player.x - this.x));

        // If not touching the player, walk towards it.
        if(!this.hitTest(player) && player.hp > 0) {
            if(this.maxSpeed > this.currSpeed) {
                this.currSpeed += this.acceleration;
            } else {
                for(let i = 0; this.maxSpeed < this.currSpeed && i < 100; i++) {
                    this.currSpeed -= this.acceleration;
                }
            }

            // Easy fix
            if(this.currSpeed < 0) this.currSpeed = 0;

            for(let i in stage.enemies){
                let en = stage.enemies[i];
                if(this !== en) {
                    if(this.hitTest(en)) {
                        en.currSpeed = 0;
                        let eDirection = Math.atan2((en.y - this.y),(en.x - this.x));

                        en.x += Math.cos(eDirection) * 2;
                        en.y += Math.sin(eDirection) * 2;
                    }
                }
            }

            this.x += Math.cos(this.pDirection) * this.currSpeed;
            this.y += Math.sin(this.pDirection) * this.currSpeed;
        } else {
            this.currSpeed = 0;
            this.hit();
        }
    }

    draw() {
        if(this.currHP <= 0) {
            this.die();
            return;
        }
        
        // @TODO: Not sure this should be here
        this.move();
        super.draw(this.pDirection);
        this.drawHPBar();
    }

    drawHPBar() {
        // Drawing the HP bar
        this.context.fillStyle = "red";
        this.context.fillRect(
            stage.xMid + this.x - this.size/2, 
            stage.yMid + this.y - (this.size + 5), 
            this.size, 
            3);
        this.context.fillStyle = "green";
        this.context.fillRect(
            stage.xMid + this.x - this.size/2, 
            stage.yMid + this.y - (this.size + 5), 
            this.currHP/this.HP*this.size, 
            3);
    }

    hitTest(obj) {
        // TODO: Fix the hardest function on the code.
        if(obj && obj.size === undefined) obj.size = 0;

        let yDist = Math.abs(obj.y - this.y);
        let xDist = Math.abs(obj.x - this.x);
        let actualDist = Math.sqrt(yDist*yDist + xDist*xDist);

        if(actualDist > this.size + obj.size)
            return false;
        
        return obj;
    }

    useSkill(skillName) {
        let theSkill = this.skillList[skillName];

        // @TODO: Show the casting and casting bar.
        setTimeout(theSkill.action, theSkill.castTime);
    }

    hit() {
        if(player.hp > 0 && !player.invulnerable) {

            player.x += Math.cos(this.pDirection) * 15;
            player.y += Math.sin(this.pDirection) * 15;

            player.hp = this.damage > player.hp ? 0 : player.hp - this.damage;


            let randSnd = Math.floor(Math.random() * 3);
            gotHitSnd[randSnd].currentTime = 0;
            gotHitSnd[randSnd].play();
            player.invulnerable = true;
            setTimeout(() => {
                player.invulnerable = false;
            },400);
        }

        // @TODO: Draw damage received
    }

    die() {
        let index = stage.enemies.indexOf(this);
        stage.enemies.splice(index,1);
        player.earnXp(this.experience);
    }
}