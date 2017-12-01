/* jslint browser:true, esversion: 6 */

// @TODO: Figure out where all of these variables should be (Scope)
var sCanvas = document.createElement("canvas");
var iCanvas = document.createElement("canvas");
var eCanvas = document.createElement("canvas");
var hCanvas = document.createElement("canvas");

var sCtx = sCanvas.getContext("2d");
var iCtx = iCanvas.getContext("2d");
var eCtx = eCanvas.getContext("2d");
var hCtx = hCanvas.getContext("2d");

// Settings
var fillTheScreen = true;
var fps = 30;

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
var hud;

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


// FPS Counter
// Code from: https://stackoverflow.com/a/5111475
let filterStrength = 20;
let frameTime = 0;
let lastLoop = new Date(); 
let thisLoop;

// Report the fps only every second, to only lightly affect measurements
setInterval(function(){
    
},1000);

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

class Game {

    static gameLoop() {
        iCtx.clearRect(0,0,stage.width,stage.height);
        player.draw();
        env.draw();
        hud.draw();
        weapon.draw();

        for(let i in stage.enemies) {
            stage.enemies[i].draw();
        }

        for(let i in bullets) {
            bullets[i].draw();
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

        if(1000/frameTime < 29 && hud.maxDrops > 200 ) {
            hud.maxDrops-=2;
        }
        else if(hud.maxDrops < 400){
            hud.maxDrops+=2;
        }

        HUD.drawStatusMessage(
            stage.width - 40,
            stage.height - 30,
            Math.round(1000/frameTime) + " fps",
            hCtx
        );
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
            'js/Environment.js',
            'js/HUD.js',
            'js/Player.js',
            'js/Sprite.js',
            'js/Stage.js',
            'js/Weapon.js',
            'js/StatusMessage.js'
        ];

        let spriteFiles = {
            defaultImage : {
                src : 'sprites/default.png',
                loaded : false
            },
            bloodImage : {
                src : 'sprites/blood.png',
                loaded : false
            },
            playerImage : {
                src : 'sprites/player_handgun.png',
                loaded : false
            },
            pistolImage : {
                src : 'sprites/weapon_pistol.png',
                loaded: false
            },
            uziImage : {
                src : 'sprites/weapon_uzi.png',
                loaded: false
            },
            shotgunImage : {
                src : 'sprites/weapon_shotgun.png',
                loaded: false
            },
            ak47Image : {
                src : 'sprites/weapon_ak47.png',
                loaded: false
            },
            rpgImage : {
                src : 'sprites/weapon_rpg.png',
                loaded: false
            },
            portraitImage : {
                src : 'sprites/portrait.png',
                loaded: false
            },
        };

        let soundFiles = {
            rainSound : {
                src : "sounds/rain.ogg",
                loaded : false,
                isBg : true,
            },
            caveTheme : {
                src : "sounds/cave-theme.ogg",
                loaded : false,
                isBg : true
            },
            thunderSnd : {
                src : "sounds/thunder.flac",
                loaded : false,
                isBg : false
            },
        };

        window.sounds = [];
        for(let snd in soundFiles) {
            window.sounds[snd] = new Audio();
            window.sounds[snd].src = soundFiles[snd].src;
            window.sounds[snd].isBg = soundFiles[snd].isBg;
            window.sounds[snd].mozPreservesPitch = false;


            window.sounds[snd].onload = () => {
                soundFiles[snd].loaded = true;
            };

            window.sounds[snd].onended = () => {
                if(window.sounds[snd].isBg)
                    window.sounds[snd].play();
            };
        }

        for(let img in spriteFiles){
            window[img] = new Image();
            window[img].src = spriteFiles[img].src;

            window[img].onload = () =>{
                spriteFiles[img].loaded = true;
            };
        }

        Game.insertScript(dataFiles);
        Game.insertScript(classFiles, callback);

    }

    static playPauseMusic(pause = false) {
        for(let i in window.sounds) {
            let snd = window.sounds[i];
        
            if(pause) snd.pause();
            else if(snd.isBg) snd.play();
        }
    }
    
    // Code from: https://stackoverflow.com/a/4634669
    static insertScript(filesArr,callback = function(){},index = 0) {
        // Wait until the last script was complete before trying to load next
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

            if (evt.key === "Escape") {
                if(Game.isPaused)
                    Game.play();
                else
                    Game.pause();
            }
        });

        let mouseDown = function(evt) {
            evt.preventDefault();
            mouse.Click = true;
        };
        let mouseUp = function(evt) {
            evt.preventDefault();
            mouse.Click = false;
        };
        let mouseMove = function(evt){
            evt.preventDefault();
            mouse.x = evt.clientX;
            mouse.y = evt.clientY;
        };

        document.addEventListener("mousedown", mouseDown);
        // document.addEventListener("touchstart", mouseDown);

        document.addEventListener("mouseup", mouseUp);
        // document.addEventListener("touchend", mouseUp);

        document.addEventListener("mousemove", mouseMove);
        // document.addEventListener("touchmove", mouseMove);

    }

    static init() {
        
        // Create the Canvas elements
        document.body.append(sCanvas);
        document.body.append(iCanvas);
        document.body.append(eCanvas);
        document.body.append(hCanvas);

        // Only run once all the json files are loaded
        Game.loadFiles(Game.main);
    }

    static play() {
        clearInterval(gameInterval); // Static from Game
        clearInterval(spawnInterval); // Static from Stage

        window.tto = setTimeout(()=>{
            env.thunder();
        },Math.random() * 5000 + 1000);

        // Game Loop
        spawnInterval = setInterval(stage.spawnEnemy.bind(stage), 150);
        gameInterval = setInterval(Game.gameLoop, 1000/fps);

        Game.playPauseMusic();
        Game.isPaused = false;
    }

    static pause() {
        clearInterval(gameInterval); // Static from Game
        clearInterval(spawnInterval); // Static from Stage
        clearInterval(env.thunderInterval); // Static from Stage
        clearTimeout(env.nextThunderTO);
        clearTimeout(window.tto);

        Game.playPauseMusic(true);
        Game.isPaused = true;
    }

    static main() {
        
        window.weaponsData = weaponsJSON.weapons[0];
        window.stagesData = stagesJSON.stages[0];
        window.enemiesData = enemiesJSON.enemies[0];
        
        window.stage = new Stage("1-1");

        window.player  = new Player(iCtx);
        window.env = new Environment(eCtx);
        window.hud = new HUD(hCtx);
        window.bullets = [];

        // Mapping the weapons
        weaponNo["1"] = new Weapon("Pistol");
        weaponNo["0"] = new Weapon("Test");

        window.weapon = weaponNo["1"];

        Game.addTheListeners();

        Game.play();
    }
}

// Initializing the game
Game.init();
