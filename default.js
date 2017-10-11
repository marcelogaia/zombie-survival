/* jslint browser:true, esversion: 6 */
/*global window*/
var sCanvas = document.getElementById("stage");
var iCanvas = document.getElementById("interaction");
var sCtx = sCanvas.getContext("2d");
var iCtx = iCanvas.getContext("2d");

// Keyboard control
var keyPress = {
    Left    : false,
    Right   : false,
    Up      : false,
    Down    : false,
    Space   : false,
    Click   : false,
};

var mouse = {
    x : 0,
    y : 0,
    Click : false
};

var weaponNo = [];

// Game properties
var score = 0;
var level = 1;
var gameInterval;
var spawnInterval;
var speedInterval;
var weaponsData;

// SFX
var gunshotSnd;
var reloadSnd;
var outOfAmmoSnd;
var playerDiedSnd;
var gotHitSnd = [];

// Sprite Maps
var bloodImage = new Image();
bloodImage.src = './blood_sprite.png';

// Canvas/Stage properties
function Stage (bounds, tilemap) {
    var self = this;

    self.defaultSize = 0;
    self.width = 0;
    self.height = 0;
    self.xMid = self.width / 2;
    self.yMid = self.height / 2;
    self.bondaries = bounds;
    
    self.resize = function () {
        if (document.body.clientHeight > document.body.clientWidth) {
            self.defaultSize = document.body.clientWidth;
        } else {
            self.defaultSize = document.body.clientHeight;
        }

        self.height = self.defaultSize - 10;
        self.width = self.defaultSize - 10;
        self.xMid = self.width / 2; 
        self.yMid = self.height / 2; 
        
        sCanvas.width = self.width;
        sCanvas.height = self.height;
        iCanvas.width = self.width;
        iCanvas.height = self.height;
    };

    self.draw = function() {
        // Draw background
        var testGrad = sCtx.createLinearGradient(0,0,0,self.height);
        testGrad.addColorStop("0","yellow");
        testGrad.addColorStop("0.3","green");
        testGrad.addColorStop("0.7","gray");
        testGrad.addColorStop("1","black");
        sCtx.fillStyle = testGrad;
        sCtx.fillRect(0, 0, stage.width, stage.height);

        // @TODO: Draw tilemap
    };

    self.resize();
}

// Player properties
function Player () {
    var self = this;

    self.hp = 100;
    self.x = 0;
    self.y = 0;
    self.speed = 2;
    self.direction = Math.PI/2;

    gotHitSnd.push(new Audio());
    gotHitSnd.push(new Audio());
    gotHitSnd.push(new Audio());

    gotHitSnd[0].src = "gothit1.wav";
    gotHitSnd[1].src = "gothit2.wav";
    gotHitSnd[2].src = "gothit3.wav";

    playerDiedSnd = new Audio();
    playerDiedSnd.src = "dead.wav";
    
    self.draw = function() {
        self.move();

        // Drawing the player
        iCtx.beginPath();
        iCtx.fillStyle = "#EFE";
        iCtx.fillRect(stage.xMid + self.x - 10, stage.yMid + self.y - 10, 20, 20);  

        // Drawing the HP bar
        iCtx.fillStyle = "red";
        iCtx.fillRect(stage.xMid + self.x - 15, stage.yMid + self.y - 20, 30, 3);
        iCtx.fillStyle = "green";
        iCtx.fillRect(stage.xMid + self.x - 15, stage.yMid + self.y - 20, self.hp/100*30, 3);
    };

    self.move = function() {
        if(self.hp <= 0) {
            self.die();
        }
        let actualSpeed = self.speed;

        // Fair diagonal speed =)
        if(keyPress.Up+keyPress.Down+keyPress.Right+keyPress.Left >= 2) {
            actualSpeed = self.speed * Math.cos(Math.PI/4);
        }

        if(keyPress.Up) {
            self.y -= actualSpeed;
        }
        if(keyPress.Down) {
            self.y += actualSpeed;
        }
        if(keyPress.Right) {
            self.x += actualSpeed;
        }
        if(keyPress.Left) {
            self.x -= actualSpeed;
        }

        if(stage.bondaries) {
            self.x = self.x > (stage.xMid-10) ? (stage.xMid-10) : self.x;
            self.x = self.x < -(stage.xMid-10) ? -(stage.xMid-10) : self.x;
            self.y = self.y > (stage.yMid-10) ? (stage.yMid-10) : self.y;
            self.y = self.y < -(stage.yMid-10) ? -(stage.yMid-10) : self.y;
        } else {
            self.x = self.x > (stage.xMid) ? -stage.xMid : self.x;
            self.x = self.x < -(stage.xMid) ? stage.xMid : self.x;
            self.y = self.y > (stage.yMid) ? -stage.yMid : self.y;
            self.y = self.y < -(stage.yMid) ? stage.yMid : self.y;
                
        }
    };

    self.die = function () {

        self.speed = 0;

        // @TODO: Solve this better;
        clearInterval(gameInterval);
        clearInterval(spawnInterval);

        playerDiedSnd.currentTime = 0;
        playerDiedSnd.play();

    };
}

// Enemies
function Enemy (x,y,hp) {
    var self = this;
    self.x = x;
    self.y = y;
    self.speed = 1.5;
    self.pDirection = 0;
    self.dmg = 10;
    self.hp = hp;
    self.currSpeed = 0;
    self.score = 100;
    self.size = 10;

    self.move = function() {
        // m = (y2 - y1) / (x2 - x1)
        // angle = arctan(m) = 
        pDirection = Math.atan2((player.y - self.y),(player.x - self.x));
        
        // If not touching the player, walk towards it.
        if(!self.hitTest(player)/* && player.hp > 0*/) {
            currSpeed = self.speed;
            for(let i in enemies){
                let en = enemies[i];
                if(self !== en) {
                    if(self.hitTest(en)) {
                        self.currSpeed = 0;

                        //console.log("Bump it! (Awesome collision system!");
                        eDirection = Math.atan2((en.y - self.y),(en.x - self.x));

                        en.x += Math.cos(eDirection) * 2;
                        en.y += Math.sin(eDirection) * 2;
                    }
                }
            }
            if(self.currSpeed === 0) {
                setTimeout(function(){
                    self.currSpeed = self.speed;
                },500);
            }
            
            self.x += Math.cos(pDirection) * self.currSpeed;
            self.y += Math.sin(pDirection) * self.currSpeed; 
        } else {
            currSpeed = 0;
            setTimeout(function(){currSpeed = self.speed;},600);
            self.hit();
        }
    };
    self.draw = function() {
        if(self.hp <= 0) self.die();
        self.move();
        iCtx.beginPath();
        iCtx.fillStyle = "#D77";
        iCtx.arc(stage.xMid + self.x, stage.yMid + self.y, self.size, 0, Math.PI*2);  
        iCtx.fill();
    };

    self.hitTest = function(obj) {
        return !(Math.abs(obj.y - self.y)>20 || Math.abs(obj.x - self.x)>20);
    };

    self.wasHit = function(obj) {
        return !(Math.abs(obj.y - self.y)>10 || Math.abs(obj.x - self.x)>10);
    };

    self.hit = function() {
        if(player.hp > 0) {
            player.x += Math.cos(pDirection) * 15;
            player.y += Math.sin(pDirection) * 15;
            
            player.hp = self.dmg > player.hp ? 0 : player.hp - self.dmg;

            let randSnd = Math.floor(Math.random() * 3);
            gotHitSnd[randSnd].currentTime = 0;
            gotHitSnd[randSnd].play();
        }
    }; 

    self.spawn = function () {

    };

    self.die = function() {
        let index = enemies.indexOf(self);
        enemies.splice(index,1);
        score += self.score;
    };
}

function HUD() {
    var self = this;
    self.draw = function() {

        iCtx.font="20px Georgia";
        iCtx.fillStyle = "white";
        iCtx.fillText(score,10,20);
    };
}

// Bullet Instance
function Bullet(x,y,range,direction, speed, impact) {
    var self = this;
    self.x = x;
    self.y = y;
    self.range = range;
    self.direction = direction;
    self.speed = speed;
    self.dmg = weapon.dmg;
    self.impact = impact;

    self.move = function() {
        self.x += Math.cos(self.direction) * self.speed;
        self.y += Math.sin(self.direction) * self.speed;

        if(self.x < -stage.xMid || self.x > stage.xMid || self.y < -stage.yMid || self.y > stage.yMid) {
            self.destroy();
        }
    };

    self.draw = function() {

        iCtx.beginPath();
        iCtx.save();
        iCtx.translate(stage.xMid,stage.yMid);
        iCtx.strokeStyle = "#DDA";
        iCtx.moveTo(self.x, self.y);

        let hit = self.hit();

        if(hit) {
            iCtx.lineTo(hit.x,hit.y);
        }
        else {
            iCtx.lineTo(
                self.x + (Math.cos(self.direction) * weapon.bulletSpeed),
                self.y + (Math.sin(self.direction) * weapon.bulletSpeed)
            );
        }

        iCtx.stroke();
        iCtx.restore();

        if(hit) self.destroy();

        self.move();
    };

    self.hit = function () {
        let hit = false;

        sCtx.save();
        sCtx.translate(stage.xMid,stage.yMid);

        eachPixel:
        for(let i = 0; i < self.speed; i++) {

            let point = {
                x: self.x + (Math.cos(self.direction) * i), 
                y: self.y + (Math.sin(self.direction) * i)
            };

            eachEnemies:
            for(let j in enemies){
                if(enemies[j].wasHit(point)) {
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

                    bloodSprite.draw(point.x,point.y);

                    hit = point;
                    self.destroy();
                    enemies[j].hp -= self.dmg;

                    enemies[j].x += (Math.cos(self.direction) * self.impact);
                    enemies[j].y += (Math.sin(self.direction) * self.impact);
                    break eachPixel;
                }
            }
        }

        sCtx.restore();

        return hit;
    };

    self.destroy = function() {
        for(let i in bullets){
            if(self === bullets[i])
                bullets.splice(i,1);

        }
    };
}

// Weapon Instance
function Weapon(name) {
    var self = this;

    for(let i in weaponsData[name]) {
        let w = weaponsData[name][i];
        self[i] = w;
    }

    // @TODO: Implement AoE for explosives

    if(self.ammo == -1) self.ammo = Infinity;

    self.isReloading = false;
    self.isShooting = false;
    
    gunshotSnd = new Audio();
    reloadSnd = new Audio();
    outOfAmmoSnd = new Audio();
    
    gunshotSnd.src = self.shotSound;
    reloadSnd.src = self.reloadSound;
    outOfAmmoSnd.src = self.outOfAmmoSound;

    self.shoot = function(x,y) {
        if(self.inMag <= 0) {
            self.reload();
            return;
        }

        if(!self.isShooting && !self.isReloading) {
            self.isShooting = true;

            for(let i =0;i<self.bulletPerShot;i++){

                let direction = Math.atan2((y - stage.yMid - player.y),(x - stage.xMid - player.x));
                let widthRange = 100/(self.accuracy*Math.PI*6);
                direction += -widthRange/2 + Math.random()*widthRange;

                bullets.push(new Bullet(player.x,player.y,self.range,direction,self.bulletSpeed,self.impact));
            }
            self.inMag -= 1;

            setTimeout(function(){
                self.isShooting = false;
            },self.shotDelay*1000);

            if(!gunshotSnd.paused) gunshotSnd.currentTime = 0;
            
            gunshotSnd.play();
        }

    };

    self.reload = function() {
        // Full mag
        if(self.inMag == self.capacity) return;

        if(self.ammo > 0) {
            reloadSnd.play();
        } else {
            outOfAmmoSnd.play();
            setTimeout(function(){weapon = new Weapon("Pistol");},500);
            return;
        }
        
        if(!self.isReloading) {
            // @TODO: Start reloading animation
            self.isReloading = true;
            setTimeout(
                function(){
                    if(self.ammo < (self.capacity - self.inMag)) {
                        self.inMag += self.ammo;
                        self.ammo = 0;
                    } else {
                        self.ammo -= self.capacity - self.inMag;
                        self.inMag = self.capacity;
                    }
                    self.isReloading = false;
                },
                self.reloadTime * 1000
            );
        }
    };

    self.draw = function() {
        iCtx.font="14px Georgia";
        iCtx.fillStyle = "white";
        iCtx.textAlign = "center";
        iCtx.fillText(weapon.name ,stage.xMid + player.x, stage.yMid + player.y + 25);

        iCtx.textAlign = 'right';
        iCtx.fillText(self.inMag + "/" ,stage.xMid + player.x, stage.yMid + player.y + 45);
        
        if(self.ammo == Infinity) {   
            iCtx.textAlign = 'left';
            iCtx.font="22px Georgia";
            iCtx.fillText("∞" ,stage.xMid + player.x, stage.yMid + player.y + 50);
        } else {
            iCtx.textAlign = 'left';
            iCtx.fillText(self.ammo ,stage.xMid + player.x, stage.yMid + player.y + 45);
        }

    };
}

// Simple sprite drawing function
// Based on: http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/
function Sprite(options) {

    var self = this;

    for(let i in options) {
        self[i] = options[i];
    }

    self.draw = function (x,y) {
        let ctx = self.context;
        ctx.save();
        
        ctx.globalCompositeOperation = "source-atop";
        ctx.globalAlpha = 0.8;

        if (bloodImage.complete) {

            let imageIndex = Math.floor(Math.random() * self.frames);
            let randRotation = Math.random() * Math.PI * 2;
            ctx.translate(x,y);
            ctx.rotate(randRotation);
            ctx.drawImage(
                self.image,
                imageIndex * self.width,
                0,
                self.width,
                self.height,

                - (self.width * self.scale)/2,
                - (self.height * self.scale)/2,
                (self.width * self.scale),
                (self.height * self.scale)
            );
        }

        ctx.restore();
    };
}

// Creating the listeners for inputs
function addTheListeners() {
    window.addEventListener("resize", stage.resize);

    document.addEventListener("keydown", function (evt) {
        if (evt.key === "ArrowRight" || evt.key.toLowerCase() === "d") {
            keyPress.Right = true;
        }
        if (evt.key === "ArrowLeft" || evt.key.toLowerCase() === "a") {
            keyPress.Left = true;
        }
        if (evt.key === "ArrowUp" || evt.key.toLowerCase() === "w") {
            keyPress.Up = true;
        }
        if (evt.key === "ArrowDown" || evt.key.toLowerCase() === "s") {
            keyPress.Down = true;
        }
        if (evt.key.toLowerCase() === "r") {
            weapon.reload();
        }

        // Weapon Choice 
        if(evt.key.match("[0-9]")) {

            if(weaponNo[evt.key] != undefined)
                weapon = weaponNo[evt.key];
        }
    });

    document.addEventListener("keyup", function (evt) {
        if (evt.key === "ArrowRight" || evt.key.toLowerCase() === "d") {
            keyPress.Right = false;
        }
        if (evt.key === "ArrowLeft" || evt.key.toLowerCase() === "a") {
            keyPress.Left = false;
        }
        if (evt.key === "ArrowUp" || evt.key.toLowerCase() === "w") {
            keyPress.Up = false;
        }
        if (evt.key === "ArrowDown" || evt.key.toLowerCase() === "s") {
            keyPress.Down = false;
        }
    });

    document.addEventListener("mousedown", function(evt) {
        mouse.Click = true;
    });

    document.addEventListener("mouseup", function(evt) {
        mouse.Click = false;
    });

    document.addEventListener("mousemove", function(evt){
        mouse.x = evt.clientX;
        mouse.y = evt.clientY;
    });
}

// The Gameloop
function gameLoop() {
    "use strict";
    
    iCtx.clearRect(0,0,stage.width,stage.height);
    player.draw();
    hud.draw();
    weapon.draw();

    for(let i in enemies) {
        enemies[i].draw();
    }

    for(let i in bullets) {
        bullets[i].draw();
    }

    if(player.speed > 10){
        clearInterval(speedInterval);
    }

    if(mouse.Click) {
        weapon.shoot(mouse.x,mouse.y);
    }
}

// Initializing the game
function init() {
    "use strict";

    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    
    window.stage = new Stage(true,"");
    window.player  = new Player();
    window.enemies = [];
    window.hud = new HUD();
    window.bullets = [];

    window.weaponsData = weaponsJSON.weapons[0];

    weaponNo["1"] = new Weapon("Pistol");
    weaponNo["2"] = new Weapon("Uzi");
    weaponNo["3"] = new Weapon("Shotgun");
    weaponNo["4"] = new Weapon("MP16");
    weaponNo["5"] = new Weapon("RPG");
    weaponNo["0"] = new Weapon("Test");

    window.weapon = weaponNo["1"];

    let shouldSpawn = true;
    let spawnCount = 0;
    let stageCount = 1;
    let countDown = 10;
    let counting = false;

    spawnInterval = setInterval(function(){
        if(shouldSpawn){
            enemies.push(
                new Enemy(
                    (Math.random()*stage.width) - stage.xMid,
                    (Math.random()*stage.height) - stage.yMid,
                    100
                )
            );
            spawnCount += 1;
            
            if(spawnCount % 10 == 0) {
                shouldSpawn = false;
            }
        } else {
            if(enemies.length == 0) {
                if(!counting) {
                    counting = true;
                    console.log(countDown);
                    setTimeout(function(){
                        countDown -= 1;
                        counting = false;

                        if(countDown == 0) {
                            shouldSpawn = true;
                            countDown = 10;
                        }
                    },1000);
                }
            }
        }
    }, 300);

    stage.resize();

    // Draw once;
    stage.draw();
    addTheListeners();

    // Game Loop
    gameInterval = setInterval(gameLoop, 33);
}

init();