var canvas;
var context;
var canvasWidth;
var canvasHeight;
var xTiles;
var yTiles;
var tileOffsetX;
var tileOffsetY;
var tileSize = 32;
var players = new Array();
var worldSize = 100;
var playerDrawX;
var playerDrawY;
var attack = false;
var attackLock = false;
var inventoryIndex = 1;
var homes = new Array();
var work = new Array();
var citizens = new Array();
var hour = 8;
var minute = 0;
var day = 0;
var minutesPerTurn = 1;
var simulate = false;
var tokens = 0;
var todayTokens = 0.0;
var HOME = 0;
var WORK = 1;
var myInterval;
var client;
var performSave = false;
var performLoad = false;
var menuPopup = false;
var population = 0;
var playerSize = 24;
var playerOffset = 4;
var numRoadTiles = 0;
var numBuildingTiles = 0;
var frame = 0;
var playing = false;

window.onbeforeunload = function(){
	if(playing){
		save();
	}
};

function save(){
	console.log("saving");
	//Save the map
	world.save();

	//Save the citizens
	localStorage.numCitizens = citizens.length;
	for(var a = 0; a < citizens.length; a++){
		localStorage.setItem('cit' + a, citizens[a].homeX + "#" + citizens[a].homeY + "#" + citizens[a].workX + "#" + citizens[a].workY);
	}

	//Save the player
	localStorage.playerX = player.x;
	localStorage.playerY = player.y;

	localStorage.income = document.getElementById('total-income').innerHTML;
	localStorage.food = document.getElementById('food-expense').innerHTML;
	localStorage.roads = document.getElementById('road-expense').innerHTML;
	localStorage.buildings = document.getElementById('building-expense').innerHTML;
	localStorage.totalDebt = document.getElementById('total-expense').innerHTML;
	localStorage.total = document.getElementById('grand-total').innerHTML;

	//Save other variables
	localStorage.systemTime = Math.floor(new Date().getTime() / 1000);
	localStorage.hour = hour;
	localStorage.minute = minute;
	localStorage.day = day;
	localStorage.tokens = tokens;
	localStorage.todayTokens = todayTokens;
}

function load(){

	//Stop the game loop
	clearInterval(myInterval);

	world.init();

	world.load();

	for(var a = 0; a < worldSize; a++){
		for(var b = 0; b < worldSize; b++){
			players[b][a] = null;
		}
	}

	// load the citizens
	if(localStorage.numCitizens != null){
		for(var a = 0; a < localStorage.numCitizens; a++){
			citizenArray = localStorage.getItem('cit' + a).split('#');
			citizens.push(new Citizen(parseInt(citizenArray[0]), parseInt(citizenArray[1]), parseInt(citizenArray[0]), parseInt(citizenArray[1]), parseInt(citizenArray[2]), parseInt(citizenArray[3])));
			for(var b = 0; b < homes.length; b++)
				if(homes[b][0] == citizenArray[0] && homes[b][1] == citizenArray[1]){
					homes[b][2] = 1;
					break;
				}
			for(var b = 0; b < work.length; b++)
				if(work[b][0] == citizenArray[2] && work[b][1] == citizenArray[3]){
					work[b][2] = 1;
					break;
				}
		}
	}

	player.x = parseInt(localStorage.playerX);
	player.y = parseInt(localStorage.playerY);

	document.getElementById('total-income').innerHTML = localStorage.income;
	document.getElementById('food-expense').innerHTML = localStorage.food;
	document.getElementById('road-expense').innerHTML = localStorage.roads;
	document.getElementById('building-expense').innerHTML = localStorage.buildings;
	document.getElementById('total-expense').innerHTML = localStorage.totalDebt;
	document.getElementById('grand-total').innerHTML = localStorage.total;

	logoffTime = parseInt(localStorage.systemTime);
	systemTime = Math.floor(new Date().getTime() / 1000);
	tokens = parseInt(localStorage.tokens);
	todayTokens = parseFloat(localStorage.todayTokens);
	hour = parseInt(localStorage.hour);
	minute = parseInt(localStorage.minute);
	day = localStorage.day;
	
	var timeDiff = systemTime - logoffTime;
	if(timeDiff > 1080)
		timeDiff = 1080;
	console.log("Simulating " + timeDiff + " seconds from saved game time " + hour + ":" + minute);
	simulate = true;
	for(var a = 0; a < timeDiff * 8; a++){
		update();
	}
	window.alert('Simutated ' + Math.floor(timeDiff / 15) + ' hours while you were away.');
	simulate = false;
	console.log("New time is " + hour + ":" + minute);
	drawMap();

	myInterval = setInterval(update, 125);

	playing = true;
}

function newGame(){
	console.log("Creating New Game");

	//Stop the game loop
	clearInterval(myInterval);

	//Initializing game map to default
	world.init();

	for(var a = 0; a < worldSize; a++)
		for(var b = 0; b < worldSize; b++){
			players[b][a] = null;
		}

	//Initialize home work and citizens to default
	homes.length = 0;
	work.length = 0;
	citizens.length = 0;

	//Initialize player to default
	player.init();

	document.getElementById('total-income').innerHTML = 'Unknown';
	document.getElementById('food-expense').innerHTML = 'Unknown';
	document.getElementById('road-expense').innerHTML = 'Unknown';
	document.getElementById('building-expense').innerHTML = 'Unknown';
	document.getElementById('total-expense').innerHTML = 'Unknown';
	document.getElementById('grand-total').innerHTML = 'Unknown';

	//Initialize game variables to default
	tokens = 5000;
	hour = 8;
	minute = 0;
	day = 0;
	numRoadTiles = 0;
	numBuildingTiles = 0;
	population = 0;

	//Save new game state
	save();

	//Draw the new game
	drawMap();
	
	//Restart the game loop
	myInterval = setInterval(update, 125);

	playing = true;

	console.log("Done Creating New Game");
}

function init(){
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');

	resizeCanvas();

	for(var a = 0; a < worldSize; a++){
		players.push(new Array());
	}

	initPath();

	//Set event listeners for the home-screen
	document.getElementById('home-screen').addEventListener('click', function(event){homeScreenEvents(event);})
	var homeScreenEvents = function(event){
		if(event.target.getAttribute('id') == 'home-continue'){
			load();
			document.getElementById('home-screen').setAttribute('style', 'display: none');
		}
		else if(event.target.getAttribute('id') == 'home-new'){
			if(window.confirm("Are you sure you want to start a new game?\n This will delete any previous game.")){
			window.alert("HOW TO PLAY:\nConstruct buildings with a floor and walls and build roads to connect them together. Then place beds and desks in the buildings to spawn new workers.\n\nCONTROLS:\n- Arrow Keys: Move the cursor around the map\n- F Key: Put the cursor in build mode\n- D Key: Cycle the inventory\n\nTIPS:\n- Press F key twice to lock cursor into build mode\n- Press F key a third time to cancle build mode\n- Planning blocks are free and useless\n- Make sure you have a floor tile beneath you beds and desks");
				newGame();
				document.getElementById('home-screen').setAttribute('style', 'display: none');
			}
		}
	}

	document.body.addEventListener('keydown', function (event){processKey(event);});
	window.addEventListener('resize', function (){resizeGame();});
	document.getElementsByClassName('moveLeft')[0].addEventListener('click', function (){processClick('moveLeft');});
	document.getElementsByClassName('moveUp')[0].addEventListener('click', function (){processClick('moveUp');});
	document.getElementsByClassName('moveRight')[0].addEventListener('click', function (){processClick('moveRight');});
	document.getElementsByClassName('moveDown')[0].addEventListener('click', function (){processClick('moveDown');});
	document.getElementsByClassName('attack')[0].addEventListener('click', function (){processClick('attack');});
	document.getElementsByClassName('cycleInventory')[0].addEventListener('click', function (){processClick('cycleInventory');});
	document.getElementById('menu-button').addEventListener('click', function(){
		menuPopup = !menuPopup;
		if(menuPopup){
			document.getElementById('menu-popup').setAttribute('style', 'display: inherit;');
			document.getElementById('menu-button').innerHTML = "BACK";
		}
		else{
			document.getElementById('menu-popup').setAttribute('style', 'display: none;');
			document.getElementById('menu-button').innerHTML = "MENU";
		}
	});
	document.getElementById('zoom-in').addEventListener('click', function(){
		tileSize += 8;
		if(tileSize > 48)
			tileSize = 48;
		resizeGame();
	});
	document.getElementById('zoom-out').addEventListener('click', function(){
		tileSize -= 8;
		if(tileSize < 8)
			tileSize = 8;
		resizeGame();
	})
	document.getElementById('stats').addEventListener('click', function(){
		document.getElementById('expense-popup').setAttribute('style', 'display: inherit');
		document.getElementById('menu-popup').setAttribute('style', 'display: none');
		document.getElementById('menu-button').innerHTML = "MENU";
		menuPopup = !menuPopup;
	});
	document.getElementById('expense-back').addEventListener('click', function(){
		document.getElementById('expense-popup').setAttribute('style', 'display: none');
	});
	document.getElementById('how-to-button').addEventListener('click', function(){
		document.getElementById('how-to-play').setAttribute('style', 'display: inherit');
	});

	player.init();
}

function update(){
	if(frame == 0){
		updateCitizens();
		updateTime();
		if(!simulate){
			drawMap();
			document.getElementById('tokens').innerHTML = '$' + tokens;
			document.getElementById('population').innerHTML = 'P:' + population;
		}
		if(hour == 0 && minute == 0){
			if(!simulate){
				document.getElementById('food-expense').innerHTML = "-" + (population * 15);
				document.getElementById('road-expense').innerHTML = "-" + (numRoadTiles * 2);
				document.getElementById('building-expense').innerHTML = "-" + numBuildingTiles;
				document.getElementById('total-expense').innerHTML = "-" + ((numRoadTiles * 2) + numBuildingTiles + (population * 15));
				document.getElementById('total-income').innerHTML = parseInt(todayTokens);
				document.getElementById('grand-total').innerHTML = parseInt(todayTokens - numBuildingTiles - (numRoadTiles * 2) - (population * 15));
			}
			tokens -= numRoadTiles * 2;
			tokens -= numBuildingTiles;
			todayTokens = 0;
			save();
		}
		else if(hour == 18 && minute == 0){
			tokens += Math.floor(todayTokens);
		}
		frame++;
	}
	else{
		if(!simulate)
			drawMap();
		frame = 0;
	}
}

function updateTime(){
	minute += minutesPerTurn;
	if(minute >= 60){
		minute = 0;
		hour++;
		minute = 0;
		if(hour >= 24){
			day++;
			hour = 0;
		}
	}
	
	var timeDiv = document.getElementById('time');

	var displayHour = "";
	var displayMinute = "";
	var displayHalf = "";
	if(hour == 0){
		displayHour = "12:";
		displayHalf = " AM";
	}
	else if(hour < 12){
		displayHour = hour + ":";
		displayHalf = " AM";
	}
	else if(hour == 12){
		displayHour = hour + ":";
		displayHalf = " PM";
	}
	else{
		displayHour = (hour - 12) + ":";
		displayHalf = " PM";
	}
	if(minute < 10)
		displayMinute = "0" + minute;
	else
		displayMinute = minute;

	timeDiv.innerHTML = displayHour + displayMinute + displayHalf;
}

function updateCitizens(){
	for(var a = 0; a < homes.length; a++){
		if(homes[a][2] == -1)
		{
			for(var b = 0; b < work.length; b++){
				if(work[b][2] == -1)
				{
					citizens.push(new Citizen(homes[a][0], homes[a][1], homes[a][0], homes[a][1], work[b][0], work[b][1]));
					homes[a][2] = 1;
					work[b][2] = 1;
					break;
				}
			}
			break;
		}
	}
	for(var a = 0; a < citizens.length; a++)
	{
		updateCitizen(citizens[a]);
	}
}

function updateCitizen(citizen){
	if(citizen.state == WORK && citizen.pathHomeToWork[0] > 0 && citizen.pathWorkToHome[0] > 0){
		if(citizen.atWork() && hour >= 8 && hour < 17 || (hour == 17 && minute < citizen.homeTime)){
			if(minute % 4 == 0)
				todayTokens += citizen.happiness / 100;
		}
		else if(citizen.atWork() && ((hour == 17 && minute >= citizen.homeTime) || (hour > 17 || hour < 8))){
			citizen.state = HOME;
			citizen.pathIndex = 0;
		}
		else{
			console.log("going to work");
			players[citizen.x][citizen.y] = null;
			if(citizen.pathHomeToWork[citizen.pathIndex] == 3 && getBlock(world.map[citizen.x][citizen.y][0]).allowDirection(3) && getBlock(world.map[citizen.x + 1][citizen.y][0]).id != 0){
				if(players[citizen.x + 1][citizen.y] == null){
					citizen.x++;
					citizen.direction = 3;
					citizen.pathIndex++;
				}
			}
			else if(citizen.pathHomeToWork[citizen.pathIndex] == 1 && getBlock(world.map[citizen.x][citizen.y][0]).allowDirection(1) && getBlock(world.map[citizen.x - 1][citizen.y][0]).id != 0){
				if(players[citizen.x - 1][citizen.y] == null){
					citizen.x--;
					citizen.direction = 1;
					citizen.pathIndex++;
				}
			}
			else if(citizen.pathHomeToWork[citizen.pathIndex] == 4 && getBlock(world.map[citizen.x][citizen.y][0]).allowDirection(4) && getBlock(world.map[citizen.x][citizen.y + 1][0]).id != 0){
				if(players[citizen.x][citizen.y + 1] == null){
					citizen.y++;
					citizen.direction = 4;
					citizen.pathIndex++;
				}
			}
			else if(citizen.pathHomeToWork[citizen.pathIndex] == 2 && getBlock(world.map[citizen.x][citizen.y][0]).allowDirection(2) && getBlock(world.map[citizen.x][citizen.y - 1][0]).id != 0){
				if(players[citizen.x][citizen.y - 1] == null){
					citizen.y--;
					citizen.direction = 2;
					citizen.pathIndex++;
				}
			}
			else{
				citizen.sendHome();
				citizen.findPath();
			}
			
			players[citizen.x][citizen.y] = citizen;
		}
	}
	else if(citizen.state == HOME && citizen.pathHomeToWork[0] > 0 && citizen.pathWorkToHome[0] > 0){
		if(citizen.atHome() && ((hour >= 17 || hour < 8) || (hour == 8 && minute < citizen.workTime))){
			if(hour == 0 && minute == 0 && day % 7 == citizen.id % 7){
				console.log("Day is " + day + " Id is " + citizen.id);
				citizen.sendHome();
				if(Math.random() * 100 > citizen.happiness){
					citizen.newWork();
				}
				citizen.findPath();
				citizen.updateHappiness();
			}
		}
		else if(citizen.atHome() && ((hour == 8 && minute >= citizen.workTime) || (hour > 8 && hour < 17))){
			citizen.state = WORK;
			citizen.pathIndex = 0;
		}
		else{
			players[citizen.x][citizen.y] = null;

			if(citizen.pathWorkToHome[citizen.pathIndex] == 1 && getBlock(world.map[citizen.x][citizen.y][0]).allowDirection(1) && getBlock(world.map[citizen.x - 1][citizen.y][0]).id != 0){
				if(players[citizen.x - 1][citizen.y] == null){	
					citizen.x--;
					citizen.direction = 1;
					citizen.pathIndex++;
				}
			}
			else if(citizen.pathWorkToHome[citizen.pathIndex] == 3 && getBlock(world.map[citizen.x][citizen.y][0]).allowDirection(3) && getBlock(world.map[citizen.x + 1][citizen.y][0]).id != 0){
				if(players[citizen.x + 1][citizen.y] == null){
					citizen.x++;
					citizen.direction = 3;
					citizen.pathIndex++;
				}
			}																		
			else if(citizen.pathWorkToHome[citizen.pathIndex] == 2 && getBlock(world.map[citizen.x][citizen.y][0]).allowDirection(2) && getBlock(world.map[citizen.x][citizen.y - 1][0]).id != 0){
				if(players[citizen.x][citizen.y - 1] == null){
					citizen.y--;
					citizen.direction = 2;
					citizen.pathIndex++;
				}
			}
			else if(citizen.pathWorkToHome[citizen.pathIndex] == 4 && getBlock(world.map[citizen.x][citizen.y][0]).allowDirection(4) && getBlock(world.map[citizen.x][citizen.y + 1][0]).id != 0){
				if(players[citizen.x][citizen.y + 1] == null){
					citizen.y++;
					citizen.direction = 4;
					citizen.pathIndex++;
				}
			}
			else{
				citizen.sendHome();
				citizen.findPath();
			}

			players[citizen.x][citizen.y] = citizen;
		}
	}
	else{
		if(citizen.pathHomeToWork[0] < 0){
			citizen.pathHomeToWork[0]++;
			if(citizen.pathHomeToWork[0] == 0)
				citizen.findPath();
		}
		else if(citizen.pathWorkToHome[0] < 0){
			citizen.pathWorkToHome[0]++;
			if(citizen.pathWorkToHome[0] == 0)
				citizen.findPath();
		}
	}
	if((hour == 6 || hour == 12 || hour == 19) && minute == 0){
		tokens -= 5;
	}
}

function resizeGame(){
	resizeCanvas();
	drawMap();
}

function resizeCanvas(){
	playerOffset = tileSize / 8;
	playerSize = tileSize / 4 * 3;
	canvasWidth = canvas.offsetWidth;
	canvasHeight = canvas.offsetHeight;

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	xTiles = Math.ceil(canvasWidth / tileSize);
	yTiles = Math.ceil(canvasHeight / tileSize);

	if(parseInt(xTiles / 2) == xTiles / 2)
		xTiles++;
	if(parseInt(yTiles / 2) == yTiles / 2)
		yTiles++;

	var xTileWidth = xTiles * tileSize;
	var yTileHeight = yTiles * tileSize;

	tileOffsetX = Math.floor((canvasWidth - xTileWidth) / 2);
	tileOffsetY = Math.floor((canvasHeight - yTileHeight) / 2);

	var halfTile = tileSize / 2;
	playerDrawX = Math.floor(canvasWidth / 2 - halfTile);
	playerDrawY = Math.floor(canvasHeight / 2 - halfTile);

}

function drawMap(){
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	var drawx = tileOffsetX;
	var drawy = tileOffsetY;

	var halfXTiles = parseInt(xTiles / 2);
	var halfYTiles = parseInt(yTiles / 2);

	for(var fz = 0; fz < 2; fz++){
		for(var fy = player.y - halfYTiles; fy <= player.y + halfYTiles; fy++){
			for(var fx = player.x - halfXTiles; fx <= player.x + halfXTiles; fx++){
				if(fy >= 0 && fy < 100 && fx >= 0 && fx < 100)
				{
					var left = 0;
					if(fx - 1 >= 0)
						left = world.map[fx - 1][fy][fz];
					
					var up = 0;
					if(fy - 1 >= 0)
						up = world.map[fx][fy - 1][fz];

					var right = 0;
					if(fx + 1 < 100)
						right = world.map[fx + 1][fy][fz];

					var down = 0;
					if(fy + 1 < 100) 
						down = world.map[fx][fy + 1][fz];

					getBlock(world.map[fx][fy][fz]).draw(drawx, drawy, left, up, right, down);
				}
				else{
					context.fillStyle = '#444444';
				}
				drawx += tileSize;
			}
			drawx = tileOffsetX;
			drawy += tileSize;
		}

		drawx = tileOffsetX;
		drawy = tileOffsetY;
	}

	for(var a = player.y - halfYTiles; a <= player.y + halfYTiles; a++){
		for(var b = player.x - halfXTiles; b <= player.x + halfXTiles; b++){
			if(a >= 0 && a < 100 && b >= 0 && b < 100)
			{
				if(players[b][a] != null){
					var thisCitizen = players[b][a];
					thisCitizen.draw(drawx, drawy);
					if(b == player.x && a == player.y){
						thisCitizen.drawInfo();
					}
					else if(players[player.x][player.y] == null)
						document.getElementById('tooltip').setAttribute('style', 'display: none;');
				}
			}
			drawx += tileSize;
		}
		drawx = tileOffsetX;
		drawy += tileSize;
	}
	context.fillStyle = '#fff';
	if(attackLock)
		context.fillStyle = '#ff0000';
	context.fillRect(playerDrawX + playerOffset, playerDrawY + tileSize / 2 - 2, playerSize, 4);
	context.fillRect(playerDrawX + tileSize / 2 - 2, playerDrawY + playerOffset, 4, playerSize);
}

function processClick(action){
	if(action == 'moveLeft')
		player.moveLeft();
	else if(action == 'moveUp')
		player.moveUp();
	else if(action == 'moveRight')
		player.moveRight();
	else if(action == 'moveDown')
		player.moveDown();
	else if(action == 'attack'){
		if(attack){
			attackLock = true;
			attack = false;
		}
		else if(attackLock){
			attackLock = false;
		}
		else
			attack = true;
	}
	else if(action == 'cycleInventory')
		cycleInventory();
	drawMap();
}

function cycleInventory(){
	inventoryIndex++;
	if(inventoryIndex > 8)
		inventoryIndex = 1;
	if(inventoryIndex == 1)
		inventory = document.getElementById('inventory-selection').innerHTML = "Road";
	else
		inventory = document.getElementById('inventory-selection').innerHTML = getBlock(inventoryIndex).name;
}

function mapAddBlock(x, y, direction){
	if(inventoryIndex == 3){
		if(tokens >= 100){
			tokens -= 100;
			homes.push([x, y, -1]);
			world.map[x][y][1] = inventoryIndex;
		}
	}
	else if(inventoryIndex == 4){
		if(tokens >= 250){
			tokens -= 250;
			work.push([x, y, -1]);
			world.map[x][y][1] = inventoryIndex;
		}
	}
	else if(inventoryIndex == 1 && tokens >= 35){
		tokens -= 35;
		numRoadTiles++;
		
		var left = getBlock(world.map[x - 1][y][0]);
		var top = getBlock(world.map[x][y - 1][0]);
		var right = getBlock(world.map[x + 1][y][0]);
		var bottom = getBlock(world.map[x][y + 1][0]);
		
		if(direction == 1){
			if((bottom.direction == 2 || top.direction == 4) && right.direction == 1)
				world.map[x][y][0] = 111;
			else if((bottom.direction == 4 || top.direction == 2) && right.direction == 1)
				world.map[x][y][0] = 111;
			else
				world.map[x][y][0] = 101;
		}
		else if(direction == 2){
			if((right.direction == 3 || left.direction == 1) && bottom.direction == 2)
				world.map[x][y][0] = 112;
			else if((right.direction == 1 || left.direction == 3) && bottom.direction == 2)
				world.map[x][y][0] = 112;
			else
				world.map[x][y][0] = 102;
		}
		else if(direction == 3){
			if((top.direction == 4 || bottom.direction == 2) && left.direction == 3)
				world.map[x][y][0] = 113;
			else if((top.direction == 2 || bottom.direction == 4) && left.direction == 3)
				world.map[x][y][0] = 113;
			else
				world.map[x][y][0] = 103;
		}
		else if(direction == 4){
			if((left.direction == 1 || right.direction == 3) && top.direction == 4)
				world.map[x][y][0] = 114;
			else if((left.direction == 3 || right.direction == 1) && top.direction == 4)
				world.map[x][y][0] = 114;
			else
				world.map[x][y][0] = 104;
		}
	}
	else if(inventoryIndex == 2 && tokens >= 20){
		tokens -= 20;
		world.map[x][y][0] = inventoryIndex;
		numBuildingTiles++;
	}
	else if(inventoryIndex == 5 && tokens >= 25){
		tokens -= 25;
		world.map[x][y][1] = inventoryIndex;
		numBuildingTiles++;
	}
	else if(inventoryIndex == 6 && tokens >= 20){
		tokens -= 20;
		world.map[x][y][1] = inventoryIndex;
		numBuildingTiles++;
	}
	else if(inventoryIndex == 7 && tokens >= 35){
		tokens -= 35;
		if(direction == 1 || direction == 3)
			world.map[x][y][1] = 21;
		else if(direction == 2 || direction == 4)
			world.map[x][y][1] = 22;
		numBuildingTiles++;
	}
	else if(inventoryIndex == 8)
		world.map[x][y][1] = inventoryIndex;
}

function mapRemoveBlock(x, y, z){
	if(world.map[x][y][z] == 3){
		for(var a = 0; a < homes.length; a++){
			if(homes[a][0] == x && homes[a][1] == y){
				homes.splice(a, 1);
				for(var b = 0; b < citizens.length; b++){
					if(citizens[b].homeX == x && citizens[b].homeY == y)
					{
						console.log("citizen found");
						for(var c = 0; c < work.length; c++){
							if(citizens[b].workX == work[c][0] && citizens[b].workY == work[c][1]){
								console.log("work found");
								work[c][2] = -1;
							}
						}
						players[citizens[b].x][citizens[b].y] = null;
						citizens.splice(b, 1);
						population--;
					}
				}
			}
		}
	}
	if(world.map[x][y][z] == 4){
		for(var a = 0; a < work.length; a++){
			if(work[a][0] == x && work[a][1] == y){
				work.splice(a, 1);
				for(var b = 0; b < citizens.length; b++){
					if(citizens[b].workX == x && citizens[b].workY == y)
					{
						for(var c = 0; c < homes.length; c++){
							if(citizens[b].homeX == homes[c][0] && citizens[b].homeY == homes[c][1]){
								homes[c][2] = -1;
							}
						}
						players[citizens[b].x][citizens[b].y] = null;
						citizens.splice(b, 1);
						population--;
					}
				}
			}
		}
	}
	else if(world.map[x][y][z] > 100){
		numRoadTiles--;
	}
	else if(world.map[x][y][z] != 0){
		numBuildingTiles--;
	}
	if(z == 0)
		world.map[x][y][z] = 1;
	else
		world.map[x][y][z] = 0;
}

function processKey(event){
	switch(event.keyCode){
		case 37:
			player.moveLeft();
			break;
		case 38:
			player.moveUp();
			break;
		case 39:
			player.moveRight();
			break;
		case 40:
			player.moveDown();
			break;
		case 68:
			cycleInventory();
			break;
		case 70:
			if(attack){
				attackLock = true;
				attack = false;
			}
			else if(attackLock){
				attackLock = false;
			}
			else
				attack = true;
			break;
	}
	drawMap();
}

function Array2d(col, row, initVal){
	var newArray = new Array(col);
	for(var a = 0; a < col; a++){
		newArray[a] = new Array(row);
		for(var b = 0; b < row; b++)
			newArray[a][b] = initVal;
	}

	return newArray;
}

function Array3d(col, row, depth, initVal){
	var newArray = new Array(col);
	for(var a = 0; a < col; a++){
		newArray[a] = new Array(row);
		for(var b = 0; b < row; b++){
			newArray[a][b] = new Array(depth);
			for(var c = 0; c < depth; c++){
				newArray[a][b][c] = initVal;
			}
		}
	}

	return newArray;
}

function Point(x, y){
	return {x: x, y: y};
}

window.addEventListener("load", init);
