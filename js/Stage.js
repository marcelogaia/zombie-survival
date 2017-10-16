/* jslint browser:true, esversion: 6 */

class Stage {
    constructor(name, canvas) {
        this.defaultSize = 0;
        this.width = 0;
        this.height = 0;
        this.enemies = [];
        this.xMid = this.width / 2;
        this.yMid = this.height / 2;
        this.canvas = canvas;

        // @TODO: Make another foreach loop getting all the data
        for(let i in stagesData[name]) {
            let w = stagesData[name][i];
            this[i] = w;
        }
        
        this.context = {
            stage : this.canvas.stage.getContext("2d"),
            interaction : this.canvas.interaction.getContext("2d"),
            hud : this.canvas.hud.getContext("2d")
        };

        this.resize();
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

    draw() {
        // Draw background
        let tileSize = 50;
        let black = true;
        let prevLine = black;

        // @TODO: Draw using a tilemap
        for(let x = 0; x < this.width; x += tileSize) {
            black = !prevLine;
            for(let y = 0; y < this.height; y += tileSize) {
                //sCtx.fillStyle = black ? "black" : "white";
                // Not so hard in the eyes =P
                this.context.stage.fillStyle = black ? "#222" : "#DDD";
                this.context.stage.fillRect(x, y, x+tileSize, y+tileSize);
                black = !black;
            }
            prevLine = black;
        }
    }
}

Stage.shouldSpawn = true;
Stage.spawnCount = true;
Stage.nextStageCountdown = 10;