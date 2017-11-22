/* jslint browser:true, esversion: 6 */

class StatusMessage {
	constructor(context, message, color, size) {
		this.context = context;
		this.message = message;
		this.color = color;
		this.size = size;

		this.draw(2,50);
	}

	draw(alpha,y) {
		this.context.save();

		let realAlpha = alpha > 1 ? 1 : alpha;
		realAlpha = realAlpha < 0 ? 0 : realAlpha;

		// Thanks! https://stackoverflow.com/a/29862266
		let rgba = Array.from(this.colorToRGBA(this.color));
		rgba.splice(3);
		
		let actualRGBA = "rgba(" + rgba.join() + "," + realAlpha + ")";

		this.context.font = this.size+"px Arial";
		this.context.fillStyle = actualRGBA;
		this.context.strokeStyle = "rgba(0, 0, 0, " + realAlpha +")";
		this.context.textAlign = "center";
		this.context.lineWidth = 3;

		this.context.strokeText(this.message, stage.xMid, hCanvas.height - 100 + y);
		this.context.fillText(this.message,stage.xMid, hCanvas.height - 100  + y);

		this.context.restore();

		if(y > 0) {
			setTimeout(() => this.draw(alpha-0.04,y - 1), 33);
		}

	}

	// Code from: https://stackoverflow.com/a/24390910
	colorToRGBA(color) {
	    var cvs, ctx;
	    cvs = document.createElement('canvas');
	    cvs.height = 1;
	    cvs.width = 1;
	    ctx = cvs.getContext('2d');
	    ctx.fillStyle = color;
	    ctx.fillRect(0, 0, 1, 1);
	    return ctx.getImageData(0, 0, 1, 1).data;
	}
}