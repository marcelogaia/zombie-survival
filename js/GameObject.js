/* jslint browser:true, esversion: 6 */

// All intective objects in the Game.
class GameObject {
	constructor(x,y, context, size = 1){
		this.x = x;
		this.y = y;
		this.context = context;
		this.size = size;

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

	draw() {
		this.sprite.draw(this.x,this.y);
	}
}