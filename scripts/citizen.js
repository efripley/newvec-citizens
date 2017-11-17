//Citizen
var citizenImage = new Image();
citizenImage.src = 'images/citizens.png';

function Citizen(_x, _y, _homeX, _homeY, _workX, _workY){
	this.id = citizens.length + 1;
	this.x = _x;
	this.y = _y;
	this.direction = 0;
	this.frame = 0;
	this.happiness = 0;
	this.homeHappiness = 0;
	this.workHappiness = 0;
	this.homeX = _homeX;
	this.homeY = _homeY;
	this.homeTime = Math.floor(Math.random() * 11) * 3;
	this.workX = _workX;
	this.workY = _workY;
	this.workTime = Math.floor(Math.random() * 11) * 3;
	this.state = HOME;
	this.pathHomeToWork = new Array();
	this.pathWorkToHome = new Array();
	this.pathIndex = 0;

	this.findPath = function(){
		this.pathHomeToWork = findPath(this.homeX, this.homeY, this.workX, this.workY);
		this.pathWorkToHome = findPath(this.workX, this.workY, this.homeX, this.homeY);
	}

	this.atWork = function(){
		return this.x == this.workX && this.y == this.workY;
	}

	this.atHome = function(){
		return this.x == this.homeX && this.y == this.homeY;
	}

	this.sendHome = function(){
		players[this.x][this.y] = null;
		this.x = this.homeX;
		this.y = this.homeY;
		this.pathIndex = 0;
		players[this.x][this.y] = this;
	}

	this.updateHappiness = function(){
		var buildingStatus = 0;
		var perimeter = 0;
		// for(var a = 1; a <= 5; a++){
		// 	if(this.x - a > 0 && (map[this.x - a][this.y] == 5 || map[this.x - a][this.y] == 6 || map[this.x - a][this.y] == 21 || map[this.x - a][this.y] == 22)){
		// 		var startX = this.x - a;
		// 		var startY = this.y;
		// 		var posX = startX;
		// 		var posY = startY;
		// 		var direction = 2;

		// 		while(buildingStatus == 0){
		// 			if(Math.abs(posX - this.homeX) <= 5 && Math.abs(posY - this.homeY) <= 5){
		// 				if(direction == 1){
		// 					if(posY - 1 >= 0 && (getBlock(map[posX][posY - 1]).colidable || map[posX][posY - 1] == 21 || map[posX][posY - 1] == 22)){
		// 						posY--;
		// 						direction = 2;
		// 					}
		// 					else if(posX - 1 >= 0 && (getBlock(map[posX - 1][posY]).colidable || map[posX - 1][posY] == 21 || map[posX - 1][posY] == 22)){
		// 						posX--;
		// 					}
		// 					else if(posY + 1 < worldSize && (getBlock(map[posX][posY + 1]).colidable || map[posX][posY + 1] == 21 || map[posX][posY + 1] == 22)){
		// 						posY++;
		// 						direction = 4;
		// 					}
		// 					else{
		// 						buildingStatus = 2;//does not exist
		// 					}
		// 				}
		// 				else if(direction == 2){
		// 					if(posX + 1 < worldSize && (getBlock(map[posX + 1][posY]).colidable || map[posX + 1][posY] == 21 || map[posX + 1][posY] == 22)){
		// 						posX++;
		// 						direction = 3;
		// 					}
		// 					else if(posY - 1 >= 0 && (getBlock(map[posX][posY - 1]).colidable || map[posX][posY - 1] == 21 || map[posX][posY - 1] == 22)){
		// 						posY--;
		// 					}
		// 					else if(posX - 1 >= 0 && (getBlock(map[posX - 1][posY]).colidable || map[posX - 1][posY] == 21 || map[posX - 1][posY] == 22)){
		// 						posX--;
		// 						direction = 1;
		// 					}
		// 					else{
		// 						buildingStatus = 2;//does not exist
		// 					}
		// 				}
		// 				else if(direction == 3){
		// 					if(posY + 1 < worldSize && (getBlock(map[posX][posY + 1]).colidable || map[posX][posY + 1] == 21 || map[posX][posY + 1] == 22)){
		// 						posY++;
		// 						direction = 4;
		// 					}
		// 					else if(posX + 1 < worldSize && (getBlock(map[posX + 1][posY]).colidable || map[posX + 1][posY] == 21 || map[posX + 1][posY] == 22)){
		// 						posX++;
		// 					}
		// 					else if(posY - 1 >= 0 && (getBlock(map[posX][posY - 1]).colidable || map[posX][posY - 1] == 21 || map[posX][posY - 1] == 22)){
		// 						posY--;
		// 						direction = 2;
		// 					}
		// 					else{
		// 						buildingStatus = 2;//does not exist
		// 					}
		// 				}
		// 				else if(direction == 4){
		// 					if(posX - 1 >= 0 && (getBlock(map[posX - 1][posY]).colidable || map[posX - 1][posY] == 21 || map[posX - 1][posY] == 22)){
		// 						posX--;
		// 						direction = 1;
		// 					}
		// 					else if(posY + 1 < worldSize && (getBlock(map[posX][posY + 1]).colidable || map[posX][posY + 1] == 21 || map[posX][posY + 1] == 22)){
		// 						posY++;
		// 					} 
		// 					else if(posX + 1 < worldSize && (getBlock(map[posX + 1][posY]).colidable || map[posX + 1][posY] == 21 || map[posX + 1][posY] == 22)){
		// 						posX++;
		// 						direction = 3;
		// 					}
		// 					else{
		// 						buildingStatus = 2;//does not exist
		// 					}
		// 				}

		// 				perimeter++;

		// 				if(posX == startX && posY == startY)
		// 					buildingStatus = 1;//completed building
		// 			}
		// 			else
		// 				buildingStatus = 3;//to large
		// 		}
		// 	}
		// }

		// if(buildingStatus == 1){
		// 	if(perimeter >= 26){
		// 		this.homeHappiness = 100;
		// 	}
		// 	else if(perimeter >= 22){
		// 		this.homeHappiness = 90;
		// 	}
		// 	else if(perimeter >= 16){
		// 		this.homeHappiness = 75;
		// 	}
		// 	else if(perimeter >= 12){
		// 		this.homeHappiness = 55;
		// 	}
		// 	else{
		// 		this.homeHappiness = 25;
		// 	}
		// }
		// else if(buildingStatus == 2){
		// 	this.homeHappiness = 0;
		// }
		// else if(buildingStatus == 3 || buildingStatus == 0){
		// 	this.homeHappiness = 0;
		// }

		this.homeHappiness = 100;
		
		// var numCoworkers = 0;
		// var numWalls = 0;
		// var numFloors = 0;

		// for(var a = this.workY - 1; a <= this.workY + 1; a++)
		// 	for(var b = this.workX - 1; b <= this.workX + 1; b++){
		// 		if(map[b][a] == 4 && (b != this.workX || a != this.workY))
		// 			numCoworkers++;
		// 		else if(map[b][a] == 2)
		// 			numFloors++;
		// 		else if(map[b][a] == 6 || map[b][a] == 5)
		// 			numWalls++;
		// 	}

		// if(numCoworkers >= 2){
		// 	this.workHappiness = 0;
		// }
		// else if(numCoworkers == 1){
		// 	this.workHappiness = 25;
		// }
		// else if(numCoworkers == 0){
		// 	this.workHappiness = 100;
		// }
		// if(this.workHappiness == 100){
		// 	if(numWalls >= 5){
		// 		this.workHappiness = 100;
		// 	}
		// 	else if(numWalls >= 3){
		// 		this.workHappiness = 75;
		// 	}
		// 	else if(numWalls >= 1){
		// 		this.workHappiness = .5;
		// 	}
		// 	else{
		// 		this.workHappiness = .25;
		// 	}
		// }

		this.workHappiness = 100;

		this.happiness = (this.homeHappiness * .65) + (this.workHappiness * .35);
		console.log("Happiness for john " + this.id + " is " + this.happiness);
	}

	this.newWork = function(){
		console.log("Job change for " + this.id);
		var workIndex = -1;
		for(var a = 0; a < work.length; a++)
			if(work[a][0] == this.workX && work[a][1] == this.workY){
				workIndex = a;
				break;
			}
		for(var a = 0; a < work.length; a++)
			if(work[a][0] != this.workX && work[a][1] != this.workY && work[a][2] == -1){
				if(Math.random() * 100 > this.happiness){
					console.log("Job accepted");
					work[workIndex][2] = -1;
					work[a][2] = 1;
					this.workX = work[a][0];
					this.workY = work[a][1];
					break;
				}
				else
					console.log("Job not accepted");
			}
	}

	this.drawInfo = function(){
		document.getElementById('tooltip').setAttribute('style', 'display: inherit;');

		document.getElementById('tooltip-name').innerHTML = 'John ' + this.id;

		var toolTipStatus = document.getElementById('tooltip-my-status');
		if(this.state == HOME && this.atHome())
			toolTipStatus.innerHTML = "Sleeping";
		else if(this.state == HOME && !this.atHome())
			toolTipStatus.innerHTML = "Going Home";
		else if(this.state == WORK && this.atWork())
			toolTipStatus.innerHTML = "Working";
		else if(this.state == WORK && !this.atWork())
			toolTipStatus.innerHTML = "Going to Work";

		var toolTipLife = document.getElementById('tooltip-my-home');
		toolTipLife.getElementsByClassName('stat')[0].setAttribute('style', 'width: ' + this.homeHappiness + '%;');

		var toolTipLife = document.getElementById('tooltip-my-work');
		toolTipLife.getElementsByClassName('stat')[0].setAttribute('style', 'width: ' + this.workHappiness + '%;');
	}

	this.draw = function(drawx, drawy){
		context.fillStyle = "#fff";
		var frameOffsetX = 0;
		var frameOffsetY = 0;
		if(this.direction == 0 || this.frame == 1){
			frameOffsetX = 0;
			frameOffsetY = 0;
			this.direction = 0;
			this.frame = 0;
		}
		else if(this.frame == 0){
			if(this.direction == 1){
				frameOffsetX = tileSize / 2;
			}
			else if(this.direction == 2){
				frameOffsetY = tileSize / 2;
			}
			else if(this.direction == 3){
				frameOffsetX = -tileSize / 2;
			}
			else if(this.direction == 4){
				frameOffsetY = -tileSize / 2;
			}
			this.frame++;
		}

		//Draw citizen
		if(this.happiness > 90)
			context.drawImage(citizenImage, 128, 0, 32, 32, drawx + frameOffsetX + tileSize / 8, drawy + frameOffsetY + tileSize / 8, 3 * tileSize / 4, 3 * tileSize / 4);
		else if(this.happiness > 80)
			context.drawImage(citizenImage, 96, 0, 32, 32, drawx + frameOffsetX + tileSize / 8, drawy + frameOffsetY + tileSize / 8, 3 * tileSize / 4, 3 * tileSize / 4);
		else if(this.happiness > 70)
			context.drawImage(citizenImage, 64, 0, 32, 32, drawx + frameOffsetX + tileSize / 8, drawy + frameOffsetY + tileSize / 8, 3 * tileSize / 4, 3 * tileSize / 4);
		else if(this.happiness > 60)
			context.drawImage(citizenImage, 32, 0, 32, 32, drawx + frameOffsetX + tileSize / 8, drawy + frameOffsetY + tileSize / 8, 3 * tileSize / 4, 3 * tileSize / 4);
		else
			context.drawImage(citizenImage, 0, 0, 32, 32, drawx + frameOffsetX + tileSize / 8, drawy + frameOffsetY + tileSize / 8, 3 * tileSize / 4, 3 * tileSize / 4);
	}

	this.findPath();
	this.sendHome();
	this.updateHappiness();
	population++;
}