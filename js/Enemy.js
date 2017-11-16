/* jslint browser:true, esversion: 6 */
class Enemy extends GameObject{
    constructor (name, x, y, context,stage) {
        super(x,y,context,enemiesData[name].size);

        for(let i in enemiesData[name]) {
            let w = enemiesData[name][i];
            this[i] = w;
        }

        this.currHP = this.HP;

        this.pDirection = 0;
        this.currSpeed = 0;
        stage.toSpawn[name] -= stage.toSpawn[name] > 0 ? 1 : 0;



        this.skillList = {
            "dash" : {
                "castTime" : 2000,
                "action" : () => {
                    let prevAcc = this.acceleration;
                    let prevMax = this.maxSpeed;
                    this.acceleration = 5;
                    this.maxSpeed = 40;

                    setTimeout(function(){
                        this.maxSpeed = prevMax;
                        this.acceleration = prevAcc;
                    },300);
                },
            }
        };

        let self = this;

        // Based on: https://stackoverflow.com/a/6962808/4184867
        (function loop() {
            let skillNames = Object.keys(self.skills);

            if(skillNames.length > 0) {
                let skill = skillNames[Math.floor(Math.random() * skillNames.length)];
                let rand = Math.round(Math.random() * 5000) + self.skillList[skill].castTime;

                setTimeout(function() {
                    self.useSkill(skill);
                    loop();  
                }, rand);
            }
        }());
    }

    move() {
        // m = (y2 - y1) / (x2 - x1)
        // angle = arctan(m)
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
            stage.xMid + this.x - this.size, 
            stage.yMid + this.y - (this.size + 5), 
            this.size*2, 
            3);
        this.context.fillStyle = "green";
        this.context.fillRect(
            stage.xMid + this.x - this.size, 
            stage.yMid + this.y - (this.size + 5), 
            this.currHP/this.HP*this.size*2, 
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
        let theSkill = this.skills[skillName];
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