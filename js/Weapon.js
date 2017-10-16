/* jslint browser:true, esversion: 6 */
class Weapon {
    constructor(name){

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
                    (y - stage.yMid - player.y),
                    (x - stage.xMid - player.x));

                // Implementing accuracy
                let widthRange = 100/(this.accuracy*Math.PI*6);
                direction += -widthRange/2 + Math.random()*widthRange;
                
                bullets.push( new Bullet(
                    player.x,
                    player.y,
                    iCtx,
                    this.range,
                    direction,
                    this.bulletSpeed,
                    this.impact,
                    this.bulletWidth
                ));
            }

            this.inMag -= 1;

            setTimeout(function(){
                this.isShooting = false;
            }.bind(this),this.shotDelay*1000);

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
            setTimeout(function(){weapon = new Weapon("Pistol");},500);
            return;
        }

        if(!this.isReloading) {
            // @TODO: Start reloading animation
            // @TODO: Cancel all reloads if changes weapons
            this.isReloading = true;
            setTimeout(
                function(){
                    if(this.ammo < (this.capacity - this.inMag)) {
                        this.inMag += this.ammo;
                        this.ammo = 0;
                    } else {
                        this.ammo -= this.capacity - this.inMag;
                        this.inMag = this.capacity;
                    }
                    this.isReloading = false;
                }.bind(this),
                this.reloadTime * 1000
            );
        }
    }

    draw() {

        // @TODO: Change this whole thing to the HUD, not here.
        iCtx.font="14px Georgia";
        iCtx.fillStyle = "white";
        iCtx.textAlign = "center";
        iCtx.lineWidth = 3;
        iCtx.strokeText(weapon.name ,stage.xMid + player.x, stage.yMid + player.y + 25);
        iCtx.fillText(weapon.name ,stage.xMid + player.x, stage.yMid + player.y + 25);

        iCtx.textAlign = 'right';
        iCtx.strokeText(this.inMag + "/" ,stage.xMid + player.x, stage.yMid + player.y + 45);
        iCtx.fillText(this.inMag + "/" ,stage.xMid + player.x, stage.yMid + player.y + 45);

        if(this.ammo == Infinity) {
            iCtx.textAlign = 'left';
            iCtx.font="22px Georgia";
            iCtx.strokeText("∞" ,stage.xMid + player.x, stage.yMid + player.y + 50);
            iCtx.fillText("∞" ,stage.xMid + player.x, stage.yMid + player.y + 50);
        } else {
            iCtx.textAlign = 'left';
            iCtx.strokeText(this.ammo ,stage.xMid + player.x, stage.yMid + player.y + 45);
            iCtx.fillText(this.ammo ,stage.xMid + player.x, stage.yMid + player.y + 45);
        }

    }
}