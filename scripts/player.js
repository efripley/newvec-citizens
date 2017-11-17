var player = new Player();

function Player(){
	this.x = 0;
	this.y = 0;
	this.dx = 0;
	this.dy = 0;
	this.direction = 0;
	
	this.init = function (){
		this.x = 50;
		this.y = 50;
		this.dx = 0;
		this.dy = 0;
		this.direction = 0;
	}

	this.moveLeft = function(){
		this.dx = -1;
		this.dy = 0;
		this.direction = 1;
		this.update();
	}

	this.moveUp = function(){
		this.dx = 0;
		this.dy = -1;
		this.direction = 2;
		this.update();
	}

	this.moveRight = function(){
		this.dx = 1;
		this.dy = 0;
		this.direction = 3;
		this.update();
	}
	
	this.moveDown = function(){
		this.dx = 0;
		this.dy = 1;
		this.direction = 4;
		this.update();
	}

	this.update = function(){
		var attackX = this.x + this.dx;
		var attackY = this.y + this.dy;

		if(!attack && !attackLock){
			this.x += this.dx;
			this.y += this.dy;
		}
		else if(attack && players[attackX][attackY] != null)
			players[attackX][attackY].sendHome();
		else if((attackLock || attack) && getBlock(inventoryIndex).type == 1){
			if(world.map[attackX][attackY][0] == 1){
				mapAddBlock(attackX, attackY, this.direction);
				if(world.map[attackX][attackY][1] == 8)
					world.map[attackX][attackY][1] = 0;
			}
			else if(world.map[attackX][attackY][0] > 0){
				mapRemoveBlock(attackX, attackY, 0)
			}
		}
		else if((attackLock || attack) && getBlock(inventoryIndex).type == 2){
			if(world.map[attackX][attackY][1] == 0 || (world.map[attackX][attackY][1] == 8 && inventoryIndex != 8)){
				console.log("adding block");
				mapAddBlock(attackX, attackY, this.direction);
			}
			else if(world.map[attackX][attackY][1] > 0){
				mapRemoveBlock(attackX, attackY, 1)
			}
		}

		if(attackLock){
			this.x += this.dx;
			this.y += this.dy;
		}

		this.dx = 0;
		this.dy = 0;
		this.direction = 0;
		attack = false;
	}
}