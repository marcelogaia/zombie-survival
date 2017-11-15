/* jslint browser:true, esversion: 6 */

class Stage {
    constructor(name, canvas) {
        let self = this;
        this.levelName = name;
        this.defaultSize = 0;
        this.width = 0;
        this.height = 0;
        this.enemies = [];
        this.xMid = this.width / 2;
        this.yMid = this.height / 2;
        this.canvas = canvas;
        this.currEnemies = {};
        
        this.shouldSpawn = true;
        this.spawnCounting = false;
        this.nextStageCountdown = 10;

        // @TODO: Remember what's this doing and comment explaining
        for(let i in stagesData[this.levelName]) {
            let w = stagesData[this.levelName][i];
            this[i] = w;
        }

        this.toSpawn = this.enemyType;
        
        this.context = {
            stage : this.canvas.stage.getContext("2d"),
            interaction : this.canvas.interaction.getContext("2d"),
            hud : this.canvas.hud.getContext("2d")
        };

        this.resize();
        this.draw();

        setTimeout(function(){
            hud.message(self.name,"yellow",25);
        },500);
    }

    resize() {
        if(fillTheScreen) {
            this.width = document.body.clientWidth - 10;
            this.height = document.body.clientHeight - 10;
            this.xMid = this.width / 2;
            this.yMid = this.height / 2;
        } else {
            if (document.body.clientHeight > document.body.clientWidth) {
                this.defaultSize = document.body.clientWidth;
            } else {
                this.defaultSize = document.body.clientHeight;
            }

            this.width = this.defaultSize - 10;
            this.height = this.defaultSize - 10;
        }

        this.xMid = this.width / 2;
        this.yMid = this.height / 2;
        this.canvas.stage.width = this.width;
        this.canvas.stage.height = this.height;
        this.canvas.interaction.width = this.width;
        this.canvas.interaction.height = this.height;
        this.canvas.hud.width = this.width;
        this.canvas.hud.height = this.height;

        this.draw();
    }

    spawnEnemy() {
        if(this.shouldSpawn){
            let nextEnemy = "";
            let enemies = [];

            // Next enemy to spawn is a random based on how many of 
            // that type that still needs to be spawned
            for(let i in this.toSpawn) {
                enemies[i] = {
                    name: i,
                    chanceToSpawn: Math.random() * this.toSpawn[i]
                };
            }

            let chance = 0;
            for(let i in enemies){
                if(enemies[i].chanceToSpawn > chance) {
                    chance = enemies[i].chanceToSpawn;
                    nextEnemy = enemies[i].name;
                }
            }
            
            this.enemies.push(
                new Enemy(
                    nextEnemy,
                    // @TODO: Change that so I can set an spawn area
                    (Math.random()*this.width) - this.xMid,
                    (Math.random()*this.height) - this.yMid,
                    iCtx,
                    this
                )
            );

            let spawnedAll = true;

            for (var enemy in this.toSpawn) {
                if(this.toSpawn[enemy] > 0) spawnedAll = false;
            }

            if(spawnedAll) {
                this.shouldSpawn = false;
            }

        } else {
            if(this.enemies.length == 0 && !this.spawnCounting) {
                
                this.nextStageCountdown -= 1;
                this.spawnCounting = true;
                
                if(this.nextStageCountdown > 0) hud.message(this.nextStageCountdown);

                if(this.nextStageCountdown <= 0) {
                    Stage.nextStage(this.canvas);
                    return;
                }

                setTimeout(function(){
                    this.spawnCounting = false;
                }.bind(this),700);
            }
        }
    }

    draw() {
        // Draw background
        let tileSize = 50;
        let black = true;
        let prevLine = black;

        // @TODO: Draw using a tilemap
        for(let x = 0; x < this.width; x += tileSize) {
            black = !prevLine;
            for(let y = 0; y < this.height; y += tileSize) {
                if(y === 0) prevLine = black;
                this.context.stage.fillStyle = black ? "#222" : "#555";
                this.context.stage.fillRect(x, y, x+tileSize, y+tileSize);
                black = !black;
            }
        }
    }

    static nextStage(canvas) {
        let stages = Object.getOwnPropertyNames(stagesData);
        let currStage = stages.indexOf(stage.levelName);

        if(currStage+1 < stages.length)
            window.stage = new Stage(stages[currStage+1],canvas);
        
        Game.play();
    }
}