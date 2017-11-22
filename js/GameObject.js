/* jslint browser:true, esversion: 6 */

// All intective objects in the Game.
class GameObject {
	constructor(x,y, context, size = 1, sprite = false){
		this.x = x;
		this.y = y;
		this.context = context;
		this.size = size;

		if(!sprite){
			// Sprite tool: https://www.piskelapp.com/
			this.sprite = new Sprite({
				context : this.context,
	            width 	: 50,
	            height 	: 50,
	            image 	: defaultImage,
	            scale 	: this.size,
	            frames 	: 4,
	            animationSpeed : 7
			});
		}
	}

	draw(rotation = 0, alpha = 1) {

		var gradient = this.context.createRadialGradient(
		    this.x+stage.xMid,
		    this.y+stage.yMid,
		    0,
		    this.x+stage.xMid,
		    this.y+stage.yMid,
		    this.size
		);
		gradient.addColorStop(0, 'rgba(0,0,0,0.5)');
		gradient.addColorStop(1, 'transparent');
		this.context.fillStyle = gradient;
		this.context.fillRect(0,0,stage.width,stage.height);

		if(typeof this.sprite === "object")
			this.sprite.draw(this.x-this.size/2,this.y-this.size/2,this.context,rotation,alpha);
	}
}