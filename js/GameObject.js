/* jslint browser:true, esversion: 6 */

// All intective objects in the Game.
class GameObject {
	constructor(x,y, context, sprite = null){
		this.x = x;
		this.y = y;
		this.context = context;

		if(sprite != null) {
			this.sprite = sprite;
		} else {
			this.sprite = new Sprite();
		}
	}

	draw() {

	}
}