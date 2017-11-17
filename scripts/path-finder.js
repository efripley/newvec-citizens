//Path Finder
var pathMap;
var pathInstructions;

function PathPoint(x, y){
	return {x: x, y: y};
}

function initPath(){
	pathMap = new Array2d(worldSize, worldSize, 999);
}

function findPath(fromX, fromY, toX, toY){
	for(var a = 0; a < worldSize; a++)
		for(var b = 0; b < worldSize; b++)
			pathMap[b][a] = 999;

	pathInstructions = new Array();

	var step = 0;
	var found = false;
	var currentPoints = new Array();
	var newPoints = new Array();

	currentPoints.push(new PathPoint(toX, toY));

	while(!found){
		for(var a = 0; a < currentPoints.length; a++){
			var x = currentPoints[a].x;
			var y = currentPoints[a].y;

			if(getBlock(world.map[x][y][0]).id > 100 || getBlock(world.map[x][y][0]).id == 2 || getBlock(world.map[x][y][1]).id == 21 || getBlock(world.map[x][y][1]).id == 22 || step == 0 || (x == fromX && y == fromY)){
				pathMap[x][y] = step;

				if(x == fromX && y == fromY){
					found = true;
					break;
				}

				if(x + 1 < worldSize && pathMap[x + 1][y] > step && getBlock(world.map[x + 1][y][0]).allowDirection(1) && getBlock(world.map[x][y][0]).allowDirection(1))
					newPoints.push(new PathPoint(x + 1, y));
				if(x - 1 >= 0 && pathMap[x - 1][y] > step && getBlock(world.map[x - 1][y][0]).allowDirection(3) && getBlock(world.map[x][y][0]).allowDirection(3))
					newPoints.push(new PathPoint(x - 1, y));
				if(y + 1 < worldSize && pathMap[x][y + 1] > step && getBlock(world.map[x][y + 1][0]).allowDirection(2) && getBlock(world.map[x][y][0]).allowDirection(2))
					newPoints.push(new PathPoint(x, y + 1));
				if(y - 1 >= 0 && pathMap[x][y - 1] > step && getBlock(world.map[x][y - 1][0]).allowDirection(4) && getBlock(world.map[x][y][0]).allowDirection(4))
					newPoints.push(new PathPoint(x, y - 1));
			}
		}

		if(currentPoints.length == 0){
			return [-30];
		}

		if(!found){
			currentPoints.length = 0;
			
			for(var a = 0; a < newPoints.length; a++)
				currentPoints.push(new PathPoint(newPoints[a].x, newPoints[a].y));

			newPoints.length = 0;

			step++;
		}
	}

	convertPath(fromX, fromY);
	return pathInstructions;
}

function convertPath(x, y){
	var done = false;

	while(!done){
		var step = pathMap[x][y];
		var direction = 0;
		if(pathMap[x + 1][y] < step && getBlock(world.map[x + 1][y][0]).allowDirection(3) && getBlock(world.map[x][y][0]).allowDirection(3)){
			direction = 3;
		}
		if(pathMap[x - 1][y] < step && getBlock(world.map[x - 1][y][0]).allowDirection(1) && getBlock(world.map[x][y][0]).allowDirection(1)){
			direction = 1;
		}
		if(pathMap[x][y + 1] < step && getBlock(world.map[x][y + 1][0]).allowDirection(4) && getBlock(world.map[x][y][0]).allowDirection(4)){
			direction = 4;
		}
		if(pathMap[x][y - 1] < step && getBlock(world.map[x][y - 1][0]).allowDirection(2) && getBlock(world.map[x][y][0]).allowDirection(2)){
			direction = 2;
		}
		
		if(direction == 3){
			pathInstructions.push(3);
			x++;
		}
		else if(direction == 1){
			pathInstructions.push(1);
			x--;
		}
		else if(direction == 4){
			pathInstructions.push(4);
			y++;
		}
		else if(direction == 2){
			pathInstructions.push(2);
			y--;
		}

		if(step == 0)
			done = true;
	}

}