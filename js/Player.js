/* jslint browser:true, esversion: 6 */

class Player extends GameObject {
    constructor(context) {
        super(0,0,context,20);

        this.hp = 100;
        this.maxHp = 100;
        this.speed = 15;
        this.direction = Math.PI/2;
        this.level = 1;
        this.exp = 0;
        this.baseDmg = 1;

        window.playerImg = new Image();
        playerImg.src = "sprites/player_handgun.png";

        playerImg.onload = function(){
            this.sprite = new Sprite({
                context : this.context,
                width   : 258,
                height  : 220,
                image   : playerImage,
                scale   : this.size,
                frames  : 20,
                animationSpeed : 20
            });
        }.bind(this);

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
        super.draw(this.direction);
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
        // @TODO: Level Up Animation
        this.level += 1;
        console.log("Level up! " + (this.level-1) + ">" + this.level);
        hud.message("Level up!");
        this.exp = 0;
        this.applyUpgrades(this.level);
        this.earnXp(remainingExp);
    }

    // Based on: G1 Pokemon
    // http://howtomakeanrpg.com/a/how-to-make-an-rpg-levels.html
    nextLevel() {
        return Math.round((4 * (Math.pow(this.level,3))) / 5);
    }

    applyUpgrades(level) {
        let upgrades = [
            null, // 0
            null, // 1
            function(){ // 2
                window.weaponNo["2"] = new Weapon("Uzi", this.x, this.y, iCtx);
                hud.message("New weapon: Uzi");
            },
            null, // 3
            function() { // 4
                window.weaponNo["3"] = new Weapon("Shotgun", this.x, this.y, iCtx);
                hud.message("New weapon: Shotgun");
            },
            null, // 5
            null, // 6
            function() { // 7
                window.weaponNo["4"] = new Weapon("MP16", this.x, this.y, iCtx);
                hud.message("New weapon: MP16");
            },
            null, // 8
            null, // 9
            function() { // 10
                window.weaponNo["5"] = new Weapon("RPG", this.x, this.y, iCtx);
                hud.message("New weapon: RPG");
            }
        ];

        // @TODO: Apply upgrades to HP, Speed, weapon damage, based on level.
        if(upgrades[level] !== null) setTimeout(upgrades[level],700);
        this.maxHp *= 1.1 * (1 + level/4);
        this.hp = this.maxHp;
    }

    drawHPBar() {
        // Drawing the HP bar
        this.context.fillStyle = "red";
        this.context.fillRect(stage.xMid + this.x - 15, stage.yMid + this.y - 20, 30, 3);
        this.context.fillStyle = "green";
        this.context.fillRect(stage.xMid + this.x - 15, stage.yMid + this.y - 20, this.hp/this.maxHp*30, 3);

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

        weapon.x = this.x;
        weapon.y = this.y;

        this.direction = Math.atan2((mouse.y - (this.y + stage.yMid)),(mouse.x - (this.x + stage.xMid)));
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