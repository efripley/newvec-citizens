world = new World();

function World(){
	this.map = new Array();
	
	this.init = function(){
		this.map = new Array3d(100, 100, 2, 0);
		for(var fy = 0; fy < worldSize; fy++)
			for(var fx = 0; fx < worldSize; fx++){
				this.map[fx][fy][0] = grass.id;
				this.map[fx][fy][1] = air.id;
			}
	}

	this.load = function(){
		//Get the map as a string and split it into an array
		var mapStringArray = localStorage.worldMap.split(',');

		//Parse string array locations into block id's and fill map
		for(var fz = 0; fz < 2; fz++){
			for(var fy = 0; fy < worldSize; fy++){
				for(var fx = 0; fx < worldSize; fx++){
					this.map[fx][fy][fz] = parseInt(mapStringArray[(fz * worldSize * worldSize) + (fy * worldSize) + fx]);

					if(this.map[fx][fy][fz] == 3){
						homes.push([fx, fy, -1]);
					}
					else if(this.map[fx][fy][fz] == 4){
						work.push([fx, fy, -1]);
					}
					else if(this.map[fx][fy][fz] > 100){
						numRoadTiles++;
					}
					else if(this.map[fx][fy][fz] > 1){
						numBuildingTiles++;
					}
				}
			}
		}

	}

	this.save = function(){
		var mapString = "";
		for(var fz = 0; fz < 2; fz++){
			for(var fy = 0; fy < worldSize; fy++){
				for(var fx = 0; fx < worldSize; fx++){
					mapString += this.map[fx][fy][fz] + ",";
				}
			}
		}
		localStorage.worldMap = mapString;
	}
}