/* jslint browser:true, esversion: 6 */

class Player extends GameObject {
    constructor(context) {
        super(0,0,context,20);

        this.hp = 100;
        this.maxHp = 100;
        this.speed = 3;
        this.direction = Math.PI/2;
        this.level = 1;
        this.exp = 0;
        this.baseDmg = 1;
        this.invulnerable = false;

        window.playerImg = new Image();
        playerImg.src = "sprites/player_handgun.png";

        playerImg.onload = () => {
            this.sprite = new Sprite({
                context : this.context,
                width   : playerImg.width/20,
                height  : playerImg.height/4,
                image   : playerImage,
                scale   : this.size,
                frames  : 20,
                animationSpeed : 20
            });
        };

        // @TODO: Change location of this part
        gotHitSnd.push(new Audio());
        gotHitSnd.push(new Audio());
        gotHitSnd.push(new Audio());

        gotHitSnd[0].src = "sounds/gothit1.wav";
        gotHitSnd[1].src = "sounds/gothit2.wav";
        gotHitSnd[2].src = "sounds/gothit3.wav";

        for(let i in gotHitSnd) gotHitSnd[i].volume = 0.2;

        playerDiedSnd = new Audio();
        playerDiedSnd.src = "sounds/dead.wav";
        playerDiedSnd.volume = 0.4;
    }


    draw() {
        this.move();
        if(this.invulnerable)
            super.draw(this.direction,0.4);
        else
            super.draw(this.direction);
        this.drawHPBar();
    }

    earnXp(exp) {
        if(this.exp + exp >= this.nextLevel()) {
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
            function(){ // 2
                window.weaponNo["2"] = new Weapon("Uzi");
                hud.message("New weapon: Uzi");
            },
            function(){ // 3
                window.weaponNo["1"].dmg *= 2;
                hud.message("Pistol - Double Damage");  

            },
            function() { // 4
                window.weaponNo["3"] = new Weapon("Shotgun");
                hud.message("New weapon: Shotgun");
            },
            function(){ // 5
                window.weaponNo["2"].ammo = 300;
                window.weaponNo["2"].inMag = 50;
                hud.message("Uzi - Increased Capacity");
            },
            function(){ // 6
                window.weaponNo["3"].dmg *= 3;
                hud.message("Shotgun - Triple Damage");
            },
            function() { // 7
                window.weaponNo["4"] = new Weapon("MP16");
                hud.message("New weapon: MP16");
            },
            function(){ // 8
                window.weaponNo["3"].ammo = 45;
                window.weaponNo["3"].inMag = 6;
                hud.message("Shotgun - Increased Capacity");
            },
            function(){ // 9
                window.weaponNo["2"].dmg *= 2;
                hud.message("Uzi - Double Damage");

            },
            function() { // 10
                window.weaponNo["5"] = new Weapon("RPG");
                hud.message("New weapon: RPG");
            }
        ];

        setTimeout(upgrades[level-2],700);
        this.maxHp *= 1.12;
        this.maxHp = parseInt(this.maxHp);
        this.speed = 2.5 + Math.log(level);
        console.log(this.speed);
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

        Game.pause();

        playerDiedSnd.currentTime = 0;
        playerDiedSnd.volume = 0.3;
        playerDiedSnd.play();

        // @TODO: Respawn
    }
}