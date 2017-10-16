/* jslint browser:true, esversion: 6 */

class Player extends GameObject {
    constructor(context) {
        super(0,0,context);

        this.hp = 100;
        this.speed = 2;
        this.direction = Math.PI/2;
        this.level = 1;
        this.exp = 0;   


        // @TODO: Change location of this part
        gotHitSnd.push(new Audio());
        gotHitSnd.push(new Audio());
        gotHitSnd.push(new Audio());

        gotHitSnd[0].src = "sounds/gothit1.wav";
        gotHitSnd[1].src = "sounds/gothit2.wav";
        gotHitSnd[2].src = "sounds/gothit3.wav";

        playerDiedSnd = new Audio();
        playerDiedSnd.src = "sounds/dead.wav";
    }


    draw() {
        this.move();

        // Drawing the player
        this.context.beginPath();
        this.context.fillStyle = "#EFE";
        this.context.strokeStyle = "black";
        this.context.lineWidth = 2;
        this.context.rect(stage.xMid + this.x - 10, stage.yMid + this.y - 10, 20, 20);
        this.context.fill();
        this.context.stroke();
        this.context.lineWidth = 1;

        this.drawHPBar();
    }

    earnXp(exp) {
        if(this.exp + exp > this.nextLevel()) {
            this.levelUp((this.exp + exp) - this.nextLevel());
        } else {
            this.exp += exp;
        }
    }

    levelUp(remainingExp) {
        this.level += 1;
        this.earnXp(remainingExp);
        console.log("Level up! " + (this.level-1) + ">" + this.level);

        // @TODO: Level Up Animation
        // @TODO: Apply upgrades to HP, Speed, weapon damage, based on level.
        // this.applyUpgrades(this.level);
    }

    // Based on: G1 Pokemon
    // http://howtomakeanrpg.com/a/how-to-make-an-rpg-levels.html
    nextLevel() {
        return Math.round((4 * (Math.pow(this.level,3))) / 5);
    }

    drawHPBar() {
        // Drawing the HP bar
        this.context.fillStyle = "red";
        this.context.fillRect(stage.xMid + this.x - 15, stage.yMid + this.y - 20, 30, 3);
        this.context.fillStyle = "green";
        this.context.fillRect(stage.xMid + this.x - 15, stage.yMid + this.y - 20, this.hp/100*30, 3);

    }

    move() {
        if(this.hp <= 0) {
            this.die();
        }
        let actualSpeed = this.speed;

        // Fair diagonal speed =)
        if(keyPress.Up+keyPress.Down+keyPress.Right+keyPress.Left >= 2) {
            actualSpeed = this.speed * Math.cos(Math.PI/4);
        }

        if(keyPress.Up) {
            this.y -= actualSpeed;
        }
        if(keyPress.Down) {
            this.y += actualSpeed;
        }
        if(keyPress.Right) {
            this.x += actualSpeed;
        }
        if(keyPress.Left) {
            this.x -= actualSpeed;
        }

        if(stage.bondaries) {
            this.x = this.x > (stage.xMid-10) ? (stage.xMid-10) : this.x;
            this.x = this.x < -(stage.xMid-10) ? -(stage.xMid-10) : this.x;
            this.y = this.y > (stage.yMid-10) ? (stage.yMid-10) : this.y;
            this.y = this.y < -(stage.yMid-10) ? -(stage.yMid-10) : this.y;
        } else {
            this.x = this.x > (stage.xMid) ? -stage.xMid : this.x;
            this.x = this.x < -(stage.xMid) ? stage.xMid : this.x;
            this.y = this.y > (stage.yMid) ? -stage.yMid : this.y;
            this.y = this.y < -(stage.yMid) ? stage.yMid : this.y;

        }
    }

    die() {
        this.speed = 0;

        // @TODO: Solve this better;
        clearInterval(gameInterval);
        clearInterval(spawnInterval);

        playerDiedSnd.currentTime = 0;
        playerDiedSnd.play();

    }
}