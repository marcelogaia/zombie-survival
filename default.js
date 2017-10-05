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

    self.x = 0;
    self.y = 0;
    self.speed = 3;
    
    self.draw = function() {
        self.move();
        iCtx.clearRect(0,0,stage.width,stage.height);
        iCtx.beginPath();
        iCtx.fillStyle = "white";
        iCtx.fillRect(stage.xMid + self.x - 10, stage.yMid + self.y - 10, 20, 20);  
    };

    self.move = function() {
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
    self.x = 0;
    self.y = 0;
    self.speed = 1.5;
    self.move = function() {
        
    };
    self.draw = function() {
        self.move();
        iCtx.clearRect(0,0,stage.width,stage.height);
        iCtx.beginPath();
        iCtx.fillStyle = "white";
        iCtx.fillRect(stage.xMid + self.x - 10, stage.yMid + self.y - 10, 20, 20);  
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

    stage.draw();
    player.draw();
}

function init() {
    "use strict";
    
    window.stage = new Stage(true,"");
    window.player  = new Player();

    stage.resize();
    addTheListeners();

    // Game Loop
    setInterval(gameLoop, 33);
}

init();

