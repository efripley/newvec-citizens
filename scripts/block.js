var tileImage = new Image();
tileImage.src = 'images/tiles.png';

var air = new Block(
	0,
	'Air',
	0,
	0,
	false,
	function(direction){
		if(direction == 1)
			return false;
		else if(direction == 2)
			return false;
		else if(direction == 3)
			return false;
		else if(direction == 4)
			return false;
	},
	function(drawx, drawy, left, up, right, down){
	}
);
var grass = new Block(
	1,
	'Grass',
	1,
	0,
	false,
	function(direction){
		if(direction == 1)
			return false;
		else if(direction == 2)
			return false;
		else if(direction == 3)
			return false;
		else if(direction == 4)
			return false;
	},
	function(drawx, drawy, left, up, right, down){
		context.fillStyle = "#4B9130";
		context.fillRect(drawx, drawy, tileSize, tileSize);
	}
);
var floor = new Block(
	2,
	'Floor',
	1,
	0,
	false,
	function(direction){
		if(direction == 1)
			return true;
		else if(direction == 2)
			return true;
		else if(direction == 3)
			return true;
		else if(direction == 4)
			return true;
	},
	function(drawx, drawy, left, up, right, down){
		context.drawImage(tileImage, 128, 0, 32, 32, drawx, drawy, tileSize, tileSize);
	}
);
var home = new Block(
	3,
	'Bed',
	2,
	0,
	false,
	function(direction){
		if(direction == 1)
			return true;
		else if(direction == 2)
			return true;
		else if(direction == 3)
			return true;
		else if(direction == 4)
			return true;
	},
	function(drawx, drawy, left, up, right, down){
		context.drawImage(tileImage, 0, 0, 32, 32, drawx, drawy, tileSize, tileSize);
	}
);
var machine = new Block(
	4,
	'Desk',
	2,
	0,
	false,
	function(direction){
		if(direction == 1)
			return true;
		else if(direction == 2)
			return true;
		else if(direction == 3)
			return true;
		else if(direction == 4)
			return true;
	},
	function(drawx, drawy, left, up, right, down){
		context.drawImage(tileImage, 32, 0, 32, 32, drawx, drawy, tileSize, tileSize);
	}
);
var stone = new Block(
	5,
	'Stone',
	2,
	0,
	true,
	function(direction){
		if(direction == 1)
			return false;
		else if(direction == 2)
			return false;
		else if(direction == 3)
			return false;
		else if(direction == 4)
			return false;
	},
	function(drawx, drawy, left, up, right, down){
		context.drawImage(tileImage, 64, 0, 32, 32, drawx, drawy, tileSize, tileSize);
	}
);
var lumber = new Block(
	6,
	'Lumber',
	2,
	0,
	true,
	function(direction){
		if(direction == 1)
			return false;
		else if(direction == 2)
			return false;
		else if(direction == 3)
			return false;
		else if(direction == 4)
			return false;
	},
	function(drawx, drawy, left, up, right, down){
		context.drawImage(tileImage, 96, 0, 32, 32, drawx, drawy, tileSize, tileSize);
	}
);
var door = new Block(
	7,
	'Door',
	2,
	0,
	false,
	function(direction){
		if(direction == 1)
			return true;
		else if(direction == 2)
			return true;
		else if(direction == 3)
			return true;
		else if(direction == 4)
			return true;
	},
	function(drawx, drawy, left, up, right, down){
		context.fillStyle = "#ce9b70";
		context.fillRect(drawx, drawy, tileSize, tileSize);
		context.fillStyle = "#966c49";
		context.fillRect(drawx, drawy + tileSize / 2 - 2, tileSize, 4);
	}
);
var plan = new Block(
	8,
	'Planning',
	2,
	0,
	false,
	function(direction){
		if(direction == 1)
			return true;
		else if(direction == 2)
			return true;
		else if(direction == 3)
			return true;
		else if(direction == 4)
			return true;
	},
	function(drawx, drawy, left, up, right, down){
		context.fillStyle = "rgba(255, 255, 255, 0.5)";
		context.fillRect(drawx, drawy, tileSize, tileSize);
	}
);
var hztlDoor = new Block(
	21,
	'Horizontal Door',
	2,
	0,
	false,
	function(direction){
		if(direction == 1)
			return true;
		else if(direction == 2)
			return false;
		else if(direction == 3)
			return true;
		else if(direction == 4)
			return false;
	},
	function(drawx, drawy, left, up, right, down){
		context.drawImage(tileImage, 160, 0, 32, 32, drawx, drawy, tileSize, tileSize);
	}
);
var vertDoor = new Block(
	22,
	'Vertical Door',
	2,
	0,
	false,
	function(direction){
		if(direction == 1)
			return false;
		else if(direction == 2)
			return true;
		else if(direction == 3)
			return false;
		else if(direction == 4)
			return true;
	},
	function(drawx, drawy, left, up, right, down){
		context.drawImage(tileImage, 192, 0, 32, 32, drawx, drawy, tileSize, tileSize);
	}
);
var roadLeft = new Block(
	101,
	'Road Left',
	1,
	1,
	false,
	function(direction){
		if(direction == 1)
			return true;
		else if(direction == 2)
			return true;
		else if(direction == 3)
			return false;
		else if(direction == 4)
			return true;
	},
	function(drawx, drawy, left, up, right, down){
		if(up == 104)
			context.drawImage(tileImage, 32, 32, 32, 32, drawx, drawy, tileSize, tileSize);
		else if(down == 102)
			context.drawImage(tileImage, 64, 32, 32, 32, drawx, drawy, tileSize, tileSize);
		else
			context.drawImage(tileImage, 0, 32, 32, 32, drawx, drawy, tileSize, tileSize);
		
		var tileLeft = drawx;
		var tileTop = drawy;
		var tileRight = drawx + tileSize;
		var tileBottom = drawy + tileSize;
		var tileHalf = tileSize / 2;

		if(inventoryIndex == 1 && tileSize >= 24){
			//Draw left direction arrow
			context.strokeStyle = "#fff";
			context.beginPath();
			context.moveTo(tileLeft, tileTop + tileHalf);
			context.lineTo(tileLeft + tileHalf - 4, drawy + tileHalf);
			context.moveTo(tileLeft, tileTop + tileHalf);
			context.lineTo(tileLeft + 4, tileTop + tileHalf - 4);
			context.moveTo(tileLeft, tileTop + tileHalf);
			context.lineTo(tileLeft + 4, tileTop + tileHalf + 4);
			context.stroke();
		}
	}
);
var roadUp = new Block(
	102,
	'Road Up',
	1,
	2,
	false,
	function(direction){
		if(direction == 1 && tileSize >= 24)
			return true;
		else if(direction == 2)
			return true;
		else if(direction == 3)
			return true;
		else if(direction == 4)
			return false;
	},
	function(drawx, drawy, left, up, right, down){
		if(left == 103)
			context.drawImage(tileImage, 128, 32, 32, 32, drawx, drawy, tileSize, tileSize);
		else if(right == 101)
			context.drawImage(tileImage, 160, 32, 32, 32, drawx, drawy, tileSize, tileSize);
		else
			context.drawImage(tileImage, 96, 32, 32, 32, drawx, drawy, tileSize, tileSize);
		
		var tileLeft = drawx;
		var tileTop = drawy;
		var tileRight = drawx + tileSize;
		var tileBottom = drawy + tileSize;
		var tileHalf = tileSize / 2;
		
		if(inventoryIndex == 1 && tileSize >= 24){
			//Draw up direction arrow
			context.strokeStyle = "#fff";
			context.beginPath();
			context.moveTo(tileLeft + tileHalf, tileTop);
			context.lineTo(tileLeft + tileHalf, tileTop + tileHalf - 4);
			context.moveTo(tileLeft + tileHalf, tileTop);
			context.lineTo(tileLeft + tileHalf - 4, tileTop + 4);
			context.moveTo(tileLeft + tileHalf, tileTop);
			context.lineTo(tileLeft + tileHalf + 4, tileTop + 4);
			context.stroke();
		}
	}
);
var roadRight = new Block(
	103,
	'Road Right',
	1,
	3,
	false,
	function(direction){
		if(direction == 1)
			return false;
		else if(direction == 2)
			return true;
		else if(direction == 3)
			return true;
		else if(direction == 4)
			return true;
	},
	function(drawx, drawy, left, up, right, down){
		if(down == 102)
			context.drawImage(tileImage, 32, 64, 32, 32, drawx, drawy, tileSize, tileSize);
		else if(up == 104)
			context.drawImage(tileImage, 64, 64, 32, 32, drawx, drawy, tileSize, tileSize);
		else
			context.drawImage(tileImage, 0, 64, 32, 32, drawx, drawy, tileSize, tileSize);

		var tileLeft = drawx;
		var tileTop = drawy;
		var tileRight = drawx + tileSize;
		var tileBottom = drawy + tileSize;
		var tileHalf = tileSize / 2;
		
		if(inventoryIndex == 1 && tileSize >= 24){
			//Draw right direction arrow
			context.strokeStyle = "#fff";
			context.beginPath();
			context.moveTo(tileRight, tileTop + tileHalf);
			context.lineTo(tileRight - tileHalf + 4, tileTop + tileHalf);
			context.moveTo(tileRight, tileTop + tileHalf);
			context.lineTo(tileRight - 4, tileTop + tileHalf - 4);
			context.moveTo(tileRight, tileTop + tileHalf);
			context.lineTo(tileRight - 4, tileTop + tileHalf + 4);
			context.stroke();
		}
	}
);
var roadDown = new Block(
	104,
	'Road Down',
	1,
	4,
	false,
	function(direction){
		if(direction == 1)
			return true;
		else if(direction == 2)
			return false;
		else if(direction == 3)
			return true;
		else if(direction == 4)
			return true;
	},
	function(drawx, drawy, left, up, right, down){
		if(left == 103)
			context.drawImage(tileImage, 128, 64, 32, 32, drawx, drawy, tileSize, tileSize);
		else if(right == 101)
			context.drawImage(tileImage, 160, 64, 32, 32, drawx, drawy, tileSize, tileSize);
		else
			context.drawImage(tileImage, 96, 64, 32, 32, drawx, drawy, tileSize, tileSize);
		
		var tileLeft = drawx;
		var tileTop = drawy;
		var tileRight = drawx + tileSize;
		var tileBottom = drawy + tileSize;
		var tileHalf = tileSize / 2;

		if(inventoryIndex == 1 && tileSize >= 24){
			//Draw down direction arrow
			context.strokeStyle = "#fff";
			context.beginPath();
			context.moveTo(tileLeft + tileHalf, tileBottom);
			context.lineTo(tileLeft + tileHalf, tileBottom - tileHalf + 4);
			context.moveTo(tileLeft + tileHalf, tileBottom);
			context.lineTo(tileLeft + tileHalf - 4, tileBottom - 4);
			context.moveTo(tileLeft + tileHalf, tileBottom);
			context.lineTo(tileLeft + tileHalf + 4, tileBottom - 4);
			context.stroke();
		}
	}
);
var intersectionLeft = new Block(
	111,
	'Intersection Left',
	1,
	1,
	false,
	function(direction){
		if(direction == 1)
			return true;
		else if(direction == 2)
			return true;
		else if(direction == 3)
			return false;
		else if(direction == 4)
			return true;
	},
	function(drawx, drawy, left, up, right, down){
		context.drawImage(tileImage, 192, 32, 32, 32, drawx, drawy, tileSize, tileSize);

		var tileLeft = drawx;
		var tileTop = drawy;
		var tileRight = drawx + tileSize;
		var tileBottom = drawy + tileSize;
		var tileHalf = tileSize / 2;

		if(inventoryIndex == 1 && tileSize >= 24){
			//Draw left direction arrow
			context.strokeStyle = "#fff";
			context.beginPath();
			context.moveTo(tileLeft, tileTop + tileHalf);
			context.lineTo(tileLeft + tileHalf - 4, drawy + tileHalf);
			context.moveTo(tileLeft, tileTop + tileHalf);
			context.lineTo(tileLeft + 4, tileTop + tileHalf - 4);
			context.moveTo(tileLeft, tileTop + tileHalf);
			context.lineTo(tileLeft + 4, tileTop + tileHalf + 4);
			context.stroke();
		}
	}
);
var intersectionUp = new Block(
	112,
	'Intersection Up',
	1,
	2,
	false,
	function(direction){
		if(direction == 1)
			return true;
		else if(direction == 2)
			return true;
		else if(direction == 3)
			return true;
		else if(direction == 4)
			return false;
	},
	function(drawx, drawy, left, up, right, down){
		context.drawImage(tileImage, 192, 32, 32, 32, drawx, drawy, tileSize, tileSize);

		var tileLeft = drawx;
		var tileTop = drawy;
		var tileRight = drawx + tileSize;
		var tileBottom = drawy + tileSize;
		var tileHalf = tileSize / 2;
		
		if(inventoryIndex == 1 && tileSize >= 24){
			//Draw up direction arrow
			context.strokeStyle = "#fff";
			context.beginPath();
			context.moveTo(tileLeft + tileHalf, tileTop);
			context.lineTo(tileLeft + tileHalf, tileTop + tileHalf - 4);
			context.moveTo(tileLeft + tileHalf, tileTop);
			context.lineTo(tileLeft + tileHalf - 4, tileTop + 4);
			context.moveTo(tileLeft + tileHalf, tileTop);
			context.lineTo(tileLeft + tileHalf + 4, tileTop + 4);
			context.stroke();
		}
	}
);
var intersectionRight = new Block(
	113,
	'Intersection Right',
	1,
	3,
	false,
	function(direction){
		if(direction == 1)
			return false;
		else if(direction == 2)
			return true;
		else if(direction == 3)
			return true;
		else if(direction == 4)
			return true;
	},
	function(drawx, drawy, left, up, right, down){
		context.drawImage(tileImage, 192, 32, 32, 32, drawx, drawy, tileSize, tileSize);

		var tileLeft = drawx;
		var tileTop = drawy;
		var tileRight = drawx + tileSize;
		var tileBottom = drawy + tileSize;
		var tileHalf = tileSize / 2;
		
		if(inventoryIndex == 1 && tileSize >= 24){
			//Draw right direction arrow
			context.strokeStyle = "#fff";
			context.beginPath();
			context.moveTo(tileRight, tileTop + tileHalf);
			context.lineTo(tileRight - tileHalf + 4, tileTop + tileHalf);
			context.moveTo(tileRight, tileTop + tileHalf);
			context.lineTo(tileRight - 4, tileTop + tileHalf - 4);
			context.moveTo(tileRight, tileTop + tileHalf);
			context.lineTo(tileRight - 4, tileTop + tileHalf + 4);
			context.stroke();
		}
	}
);
var intersectionDown = new Block(
	114,
	'Intersection Down',
	1,
	4,
	false,
	function(direction){
		if(direction == 1)
			return true;
		else if(direction == 2)
			return false;
		else if(direction == 3)
			return true;
		else if(direction == 4)
			return true;
	},
	function(drawx, drawy, left, up, right, down){
		context.drawImage(tileImage, 192, 32, 32, 32, drawx, drawy, tileSize, tileSize);

		var tileLeft = drawx;
		var tileTop = drawy;
		var tileRight = drawx + tileSize;
		var tileBottom = drawy + tileSize;
		var tileHalf = tileSize / 2;

		if(inventoryIndex == 1 && tileSize >= 24){
			//Draw down direction arrow
			context.strokeStyle = "#fff";
			context.beginPath();
			context.moveTo(tileLeft + tileHalf, tileBottom);
			context.lineTo(tileLeft + tileHalf, tileBottom - tileHalf + 4);
			context.moveTo(tileLeft + tileHalf, tileBottom);
			context.lineTo(tileLeft + tileHalf - 4, tileBottom - 4);
			context.moveTo(tileLeft + tileHalf, tileBottom);
			context.lineTo(tileLeft + tileHalf + 4, tileBottom - 4);
			context.stroke();
		}
	}
);

function getBlock(_id){
	if(_id == 0)
		return air;
	else if(_id == 1)
		return grass;
	else if(_id == 2)
		return floor;
	else if(_id == 3)
		return home;
	else if(_id == 4)
		return machine;
	else if(_id == 5)
		return stone;
	else if(_id == 6)
		return lumber;
	else if(_id == 7)
		return door;
	else if(_id == 8)
		return plan;
	else if(_id == 21)
		return hztlDoor;
	else if(_id == 22)
		return vertDoor;
	else if(_id == 101)
		return roadLeft;
	else if(_id == 102)
		return roadUp;
	else if(_id == 103)
		return roadRight;
	else if(_id == 104)
		return roadDown;
	else if(_id == 105)
		return floor;
	else if(_id == 111)
		return intersectionLeft;
	else if(_id == 112)
		return intersectionUp;
	else if(_id == 113)
		return intersectionRight;
	else if(_id == 114)
		return intersectionDown;
}

function Block(_id, _name, _type, _direction, _colidable, _allowDirection, _draw){
	this.id = _id;
	this.name = _name;
	this.type = _type;
	this.direction = _direction;
	this.colidable = _colidable;
	this.allowDirection = _allowDirection;
	this.draw = _draw;
}