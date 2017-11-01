/* jslint browser:true, esversion: 6 */

class StatusMessage {
	constructor(context, message) {
		console.log(context,message);
		this.context = context;
		this.message = message;

		this.draw(2,50);
	}

	draw(alpha,y) {
        this.context.save();

        let realAlpha = alpha > 1 ? 1 : alpha;
        realAlpha = realAlpha < 0 ? 0 : realAlpha;

        this.context.font = "20px Arial";
        this.context.fillStyle = "rgba(255, 255, 255, " + realAlpha +")";
        this.context.strokeStyle = "rgba(0, 0, 0, " + realAlpha +")";
        this.context.textAlign = "center";
        this.context.lineWidth = 3;
        
        this.context.strokeText(this.message, stage.xMid, hCanvas.height - 100 + y);
        this.context.fillText(this.message,stage.xMid, hCanvas.height - 100  + y);
        
        this.context.restore();

        if(y > 0) {
        	setTimeout(function(){
        		this.draw(alpha-0.04,y - 1);
        	}.bind(this), 33);
        }
	}
}


