/* jslint browser:true, esversion: 6 */
class Weapon extends GameObject {
    constructor(name){
        super(player.x,player.y,player.context);
        // @TODO: Definitely a better way to implement this (load maybe?)
        for(let i in weaponsData[name]) {
            let w = weaponsData[name][i];
            this[i] = w;
        }

        // @TODO: Implement AoE for explosives

        if(this.ammo == -1) this.ammo = Infinity;

        this.isReloading = false;
        this.isShooting = false;

        gunshotSnd = new Audio();
        reloadSnd = new Audio();
        outOfAmmoSnd = new Audio();

        gunshotSnd.src = this.shotSound;
        reloadSnd.src = this.reloadSound;
        outOfAmmoSnd.src = this.outOfAmmoSound;

        gunshotSnd.volume = 0.1;
        reloadSnd.volume = 0.2;
        outOfAmmoSnd.volume = 0.5;
    }

    shoot(x,y) {
        if(this.inMag <= 0) {
            this.reload();
            return;
        }

        if(!this.isShooting && !this.isReloading) {
            this.isShooting = true;

            // If more then 1 bullet per shot (aka: Shotgun)
            for(let i =0;i<this.bulletPerShot;i++){

                let direction = Math.atan2(
                    (y - stage.yMid - this.y),
                    (x - stage.xMid - this.x));

                // Implementing accuracy
                let widthRange = 100/(this.accuracy*Math.PI*6);
                direction += -widthRange/2 + Math.random()*widthRange;
                
                bullets.push( new Bullet(
                    this.x + (Math.cos(direction+(Math.PI*0.13))*18),
                    this.y + (Math.sin(direction+(Math.PI*0.13))*18),
                    this.context,
                    this.dmg,
                    direction,
                    this.bulletSpeed,
                    this.impact,
                    this.bulletWidth
                ));
            }

            this.inMag -= 1;

            setTimeout(() => this.isShooting = false,this.shotDelay*1000);

            if(!gunshotSnd.paused) gunshotSnd.currentTime = 0;

            gunshotSnd.play();
        }
    }

    reload() {
        // Full mag
        if(this.inMag == this.capacity) return;

        if(this.ammo > 0) {
            reloadSnd.play();
        } else {
            outOfAmmoSnd.play();
            setTimeout(function(){weapon = weaponNo["1"];},500);
            return;
        }

        if(!this.isReloading) {
            // @TODO: Start reloading animation
            // @TODO: Cancel all reloads if changes weapons
            this.isReloading = true;
            setTimeout(() => {
                    if(this.ammo < (this.capacity - this.inMag)) {
                        this.inMag += this.ammo;
                        this.ammo = 0;
                    } else {
                        this.ammo -= this.capacity - this.inMag;
                        this.inMag = this.capacity;
                    }
                    this.isReloading = false;
                },
                this.reloadTime * 1000
            );
        }
    }

    draw() {

        // @TODO: Change this whole thing to the HUD, not here.
        this.context.font="14px Georgia";
        this.context.fillStyle = "white";
        this.context.textAlign = "center";
        this.context.lineWidth = 3;
        this.context.strokeText(weapon.name ,stage.xMid + this.x, stage.yMid + this.y + 25);
        this.context.fillText(weapon.name ,stage.xMid + this.x, stage.yMid + this.y + 25);

        this.context.textAlign = 'right';
        this.context.strokeText(this.inMag + "/" ,stage.xMid + this.x, stage.yMid + this.y + 45);
        this.context.fillText(this.inMag + "/" ,stage.xMid + this.x, stage.yMid + this.y + 45);

        if(this.ammo == Infinity) {
            this.context.textAlign = 'left';
            this.context.font="22px Georgia";
            this.context.strokeText("∞" ,stage.xMid + this.x, stage.yMid + this.y + 50);
            this.context.fillText("∞" ,stage.xMid + this.x, stage.yMid + this.y + 50);
        } else {
            this.context.textAlign = 'left';
            this.context.strokeText(this.ammo ,stage.xMid + this.x, stage.yMid + this.y + 45);
            this.context.fillText(this.ammo ,stage.xMid + this.x, stage.yMid + this.y + 45);
        }

    }
}