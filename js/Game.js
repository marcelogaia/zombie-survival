/* jslint browser:true, esversion: 6 */

// @TODO: Figure out where all of these variables should be (Scope)

// var sCanvas = document.getElementById("stage");
// var iCanvas = document.getElementById("interaction");
// var hCanvas = document.getElementById("hud");
var sCanvas = document.createElement("canvas");
var iCanvas = document.createElement("canvas");
var hCanvas = document.createElement("canvas");

var sCtx = sCanvas.getContext("2d");
var iCtx = iCanvas.getContext("2d");
var hCtx = hCanvas.getContext("2d");

var hud;

// Settings
var fillTheScreen = true;

// Keyboard control
var keyPress = {
    Left    : false,
    Right   : false,
    Up      : false,
    Down    : false,
    Space   : false,
    Click   : false
};

var mouse = {
    x : 0,
    y : 0,
    Click : false
};

var weaponNo = [];

// Game properties

var level = 1;
var gameInterval;
var spawnInterval;
var speedInterval;
var weaponsData;
var stagesData;

// SFX
var gunshotSnd;
var reloadSnd;
var outOfAmmoSnd;
var playerDiedSnd;
var gotHitSnd = [];

// Sprite Maps
var bloodImage = new Image();
bloodImage.src = 'sprites/blood_sprite.png';




// FPS Counter
// Code from: https://stackoverflow.com/a/5111475
let filterStrength = 20;
let frameTime = 0;
let lastLoop = new Date(); 
let thisLoop;

// Report the fps only every second, to only lightly affect measurements
setInterval(function(){
    hud.drawStatusMessage(
        stage.width - 40,
        stage.height - 30,
        Math.round(1000/frameTime) + " fps"
    );
},1000);



class Game {

    static gameLoop() {
        iCtx.clearRect(0,0,stage.width,stage.height);
        player.draw();
        hud.draw();
        weapon.draw();

        for(let i in stage.enemies) {
            stage.enemies[i].draw();
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



        // FPS Counter
        // Code from: https://stackoverflow.com/a/5111475
        thisLoop = new Date();
        let thisFrameTime = thisLoop - lastLoop;
        frameTime += (thisFrameTime - frameTime) / filterStrength;
        lastLoop = thisLoop;
    }

    static loadFiles(callback) {

        let dataFiles = [
            'data/weapons.json',
            'data/stages.json',
            'data/enemies.json'
        ];

        let classFiles = [
            'js/GameObject.js',
            'js/Bullet.js',
            'js/Enemy.js',
            'js/HUD.js',
            'js/Player.js',
            'js/Sprite.js',
            'js/Stage.js',
            'js/Weapon.js'
        ];

        Game.insertScript(dataFiles);
        Game.insertScript(classFiles, callback);
    }
    
    // Code from: https://stackoverflow.com/a/4634669
    static insertScript(filesArr,callback = function(){},index = 0) {
        // @TODO: IMPORTANT: Wait until the last script was complete before trying to load next
        let fl = filesArr[index];
        let script = document.createElement("script");
        script.type = "text/javascript";

        sleep(50);

        if (script.readyState){  // IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" ||
                        script.readyState == "complete"){
                    
                    script.onreadystatechange = null;

                    index += 1;
                    if(index == filesArr.length)
                        callback();
                    else
                        Game.insertScript(filesArr,callback,index);
                
                }
            };
        } else {  //Others
            script.onload = function(){
                index += 1;
                if(index == filesArr.length)
                    callback();
                else
                    Game.insertScript(filesArr,callback,index);
            };
        }
        
        script.src = fl;
        document.head.appendChild(script);
    }

    // Creating the listeners for inputs
    static addTheListeners() {
        window.addEventListener("resize", stage.resize.bind(stage));

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

    static init() {
        
        // Create the Canvas elements
        document.body.append(sCanvas);
        document.body.append(iCanvas);
        document.body.append(hCanvas);

        Game.loadFiles(Game.main);
    }

    static main() {
        // @TODO: Improve location of the code
        clearInterval(gameInterval); // Static from Game
        clearInterval(spawnInterval); // Static from Stage

        // @TODO: Definitely improve how I'm getting this
        window.weaponsData = weaponsJSON.weapons[0];
        window.stagesData = stagesJSON.stages[0];
        window.enemiesData = enemiesJSON.enemies[0];

        window.stage = new Stage("1-1",{
            stage : sCanvas,
            interaction : iCanvas,
            hud : hCanvas
        });

        window.player  = new Player(iCtx);
        window.hud = new HUD(hCtx);
        window.bullets = [];

        weaponNo["1"] = new Weapon("Pistol", player.x, player.y, iCtx);
        weaponNo["2"] = new Weapon("Uzi", player.x, player.y, iCtx);
        weaponNo["3"] = new Weapon("Shotgun", player.x, player.y, iCtx);
        weaponNo["4"] = new Weapon("MP16", player.x, player.y, iCtx);
        weaponNo["5"] = new Weapon("RPG", player.x, player.y, iCtx);
        weaponNo["0"] = new Weapon("Test", player.x, player.y, iCtx);

        window.weapon = weaponNo["1"];

        let stageCount = 1;

        stage.resize();

        // Draw once;
        stage.draw();
        Game.addTheListeners(stage);

        // Game Loop
        spawnInterval = setInterval(() => Enemy.spawn(stage), 100);
        gameInterval = setInterval(Game.gameLoop,33);
    }
}


// Initializing the game
Game.init();


// @TODO: REMOVE THIS!
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}
