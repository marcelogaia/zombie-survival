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
};

var gameInterval;

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
        sCtx.fillStyle = "black";
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
    self.speed = 3;
    
    self.draw = function() {
        self.move();

        // Drawing the player
        iCtx.beginPath();
        iCtx.fillStyle = "white";
        iCtx.fillRect(stage.xMid + self.x - 10, stage.yMid + self.y - 10, 20, 20);  

        // Drawing the HP bar
        iCtx.fillStyle = "red";
        iCtx.fillRect(stage.xMid + self.x - 15, stage.yMid + self.y - 25, 30, 3);
        iCtx.fillStyle = "green";
        iCtx.fillRect(stage.xMid + self.x - 15, stage.yMid + self.y - 25, self.hp/100*30, 3);
    };

    self.move = function() {
        if(self.hp <= 0) self.speed = 0;
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
}

// Enemies
function Enemy (x,y) {
    var self = this;
    self.x = x;
    self.y = y;
    self.speed = 1.5;
    self.pDirection = 0;
    self.dmg = 10;

    let currSpeed = 0;

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
                        currSpeed = 0;

                        console.log("Bump it! (Awesome collision system!");
                        eDirection = Math.atan2((en.y - self.y),(en.x - self.x));

                        en.x += Math.cos(eDirection) * 2;
                        en.y += Math.sin(eDirection) * 2;
                    }
                }
            }
            if(currSpeed === 0) {
                setTimeout(function(){
                    currSpeed = self.speed;
                },500);
            }
            
            self.x += Math.cos(pDirection) * currSpeed;
            self.y += Math.sin(pDirection) * currSpeed;   
        } else {
            currSpeed = 0;
            setTimeout(function(){currSpeed = self.speed;},600);
            self.hit();
        }
    };
    self.draw = function() {
        self.move();
        iCtx.beginPath();
        iCtx.fillStyle = "white";
        iCtx.arc(stage.xMid + self.x, stage.yMid + self.y, 10, 0, Math.PI*2);  
        iCtx.fill();
    };

    self.hitTest = function(obj) {
        return !(Math.abs(obj.y - self.y)>20 || Math.abs(obj.x - self.x)>20);
    };

    self.hit = function() {
        if(player.hp > 0) {
            player.x += Math.cos(pDirection) * 15;
            player.y += Math.sin(pDirection) * 15;
            
            player.hp = self.dmg > player.hp ? 0 : player.hp - self.dmg;
        }
    };
}

// Game properties
var score = 0;
var level = 1;

function addTheListeners() {
    window.addEventListener("resize", stage.resize);

    document.addEventListener("keydown", function (evt) {
        if (evt.key === "ArrowRight") {
            keyPress.Right = true;
        }
        if (evt.key === "ArrowLeft") {
            keyPress.Left = true;
        }
        if (evt.key === "ArrowUp") {
            keyPress.Up = true;
        }
        if (evt.key === "ArrowDown") {
            keyPress.Down = true;
        }
        if (evt.key === " ") {
            keyPress.Space = true;
        }
    });

    document.addEventListener("keyup", function (evt) {
        if (evt.key === "ArrowRight") {
            keyPress.Right = false;
        }
        if (evt.key === "ArrowLeft") {
            keyPress.Left = false;
        }
        if (evt.key === "ArrowUp") {
            keyPress.Up = false;
        }
        if (evt.key === "ArrowDown") {
            keyPress.Down = false;
        }
        if (evt.key === " ") {
            keyPress.Space = false;
        }
    });
}

function gameLoop() {
    "use strict";
    
    iCtx.clearRect(0,0,stage.width,stage.height);
    stage.draw();
    player.draw();

    for(let i in enemies) {
        enemies[i].draw();
    }
}

function init() {
    "use strict";

    clearInterval(gameInterval);
    
    window.stage = new Stage(true,"");
    window.player  = new Player();
    window.enemies = new Array();

    let spawn = setInterval(function(){
        enemies.push(new Enemy(
            (Math.random()*stage.width/2) - stage.xMid,
            (Math.random()*stage.height) - stage.yMid
            )
        );
    },3000);

    stage.resize();
    addTheListeners();

    // Game Loop
    console.log(gameInterval);
    gameInterval = setInterval(gameLoop, 33);
}

init();

