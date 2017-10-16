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
    static insertScript(filesArr,callback = function(){}) {
        let scriptCount = 0;
        filesArr.forEach(function(fl){
            var script = document.createElement("script");
            script.type = "text/javascript";

            if (script.readyState){  //IE
                script.onreadystatechange = function(){
                    if (script.readyState == "loaded" ||
                            script.readyState == "complete"){
                        script.onreadystatechange = null;
                        scriptCount += 1;
                        if(scriptCount == filesArr.length)
                            callback();
                    }
                };
            } else {  //Others
                script.onload = function(){
                    scriptCount += 1;
                    if(scriptCount == filesArr.length)
                        callback();
                };
            }

            script.src = fl;
            document.head.appendChild(script);
        });
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
        window.hud = new HUD();
        window.bullets = [];

        weaponNo["1"] = new Weapon("Pistol");
        weaponNo["2"] = new Weapon("Uzi");
        weaponNo["3"] = new Weapon("Shotgun");
        weaponNo["4"] = new Weapon("MP16");
        weaponNo["5"] = new Weapon("RPG");
        weaponNo["0"] = new Weapon("Test");

        window.weapon = weaponNo["1"];

        let stageCount = 1;

        stage.resize();

        // Draw once;
        stage.draw();
        Game.addTheListeners(stage);

        // Game Loop
        spawnInterval = setInterval(() => Enemy.spawn(stage), 300);
        gameInterval = setInterval(Game.gameLoop, 33);
    }
}

// Initializing the game
Game.init();
