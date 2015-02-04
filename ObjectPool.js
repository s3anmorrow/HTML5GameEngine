// ObjectPool class
// Sean Morrow
// Mar 22 / 2013

var ObjectPool = function() {
	// private property variables
	// list of all game objects to be rendered onto the canvas
	var usedList = [];

	// starting constant maximums of the game elements (virusMax can be extended by Object pool if needed)
	var PLANE_MAX = 20;
	var PILOT_MAX = 20;
	var TANK_MAX = 100;
	var JEEP_MAX = 100;
	var BULLET_MAX = 150;
	var CLOUD_MAX = 5;
	var TOWER_MAX = 1;
	var BUNKER_MAX = 2;
	var FACTORY_MAX = 2;
	var PRISON_MAX = 3;
	var SURVIVOR_MAX = 15;
	var BALLOON_MAX = 1;
	var LANDSCAPE_MAX = 1;

	// object pool arrays
	var planePool = [];
	var pilotPool = [];
	var tankPool = [];
	var jeepPool = [];
	var bulletPool = [];
	var cloudPool = [];
	var towerPool = [];
	var bunkerPool = [];
	var factoryPool = [];
	var prisonPool = [];
	var survivorPool = [];
	var balloonPool = [];
	var landscapePool = [];

	// direct public access to pools
	this.survivorPool = survivorPool;
	this.planePool = planePool;
	this.tankPool = tankPool;
	this.bulletPool = bulletPool;
	this.prisonPool = prisonPool;
	this.jeepPool = jeepPool;
	this.factoryPool = factoryPool;

	// other
	var index = 0;

	// ------------------------------------------------------ private methods
	function getObject(pool,max){
		// go through existing pool and grab target object that is not in use and return it
		var i;
		for (i = 0; i < max; i++) {
			if (!pool[i].used) {
				var object = pool[i];
				object.used = true;
				usedList[object.usedIndex] = object;
				return object;
			}
		}
		return null;
	}

	function constructObjects(pool,max,Class) {
		// adding new object to a pool
		for (var i = 0; i < max; i++) {
			pool[i] = new Class;
			pool[i].poolIndex = i;
			pool[i].usedIndex = index;
			usedList[index] = null;
			index++;
		}
	}

	// ------------------------------------------------------ public methods
	this.getUsedList = function() {return usedList}

	this.init = function() {
		// pool object construction
		// populate arrays to create pool of game objects
		constructObjects(landscapePool, LANDSCAPE_MAX, Landscape);
		constructObjects(balloonPool, BALLOON_MAX, Balloon);
		constructObjects(pilotPool, PILOT_MAX, Pilot);
		constructObjects(planePool, PLANE_MAX, Plane);
		constructObjects(tankPool, TANK_MAX, Tank);
		constructObjects(jeepPool, JEEP_MAX, Jeep);
		constructObjects(bunkerPool, BUNKER_MAX, Bunker);
		constructObjects(factoryPool, FACTORY_MAX, Factory);
		constructObjects(prisonPool, PRISON_MAX, Prison);
		constructObjects(bulletPool, BULLET_MAX, Bullet);
		constructObjects(cloudPool, CLOUD_MAX, Cloud);
		constructObjects(towerPool, TOWER_MAX, Tower);
		constructObjects(survivorPool, SURVIVOR_MAX, Survivor);
	}

	this.getPilot = function() {
		return getObject(pilotPool, PILOT_MAX);
    }

	this.getPlane = function() {
		return getObject(planePool, PLANE_MAX);
    }

    this.getTank = function() {
		return getObject(tankPool, TANK_MAX);
    }

    this.getJeep = function() {
		return getObject(jeepPool, JEEP_MAX);
    }

    this.getBullet = function() {
    	return getObject(bulletPool, BULLET_MAX);
    }

    this.getCloud = function() {
    	return getObject(cloudPool, CLOUD_MAX);
    }

    this.getTower = function() {
    	return getObject(towerPool, TOWER_MAX);
    }

    this.getBunker = function() {
    	return getObject(bunkerPool, BUNKER_MAX);
    }

    this.getFactory = function() {
    	return getObject(factoryPool, FACTORY_MAX);
    }

    this.getPrison = function() {
    	return getObject(prisonPool, PRISON_MAX);
    }

    this.getSurvivor = function() {
    	return getObject(survivorPool, SURVIVOR_MAX);
    }

    this.getLandscape = function() {
		return getObject(landscapePool, LANDSCAPE_MAX);
    }

    this.getBalloon = function() {
    	return getObject(balloonPool, BALLOON_MAX);
    }

    this.dispose = function(o) {
		// which type of game object are we disposing?
		if ((o.type == "BluePlane") || (o.type == "RedPlane")) {
			planePool[o.poolIndex].used = false;
			usedList[o.usedIndex] = null;
		} else if ((o.type == "BlueFactory") || (o.type == "RedFactory")) {
			factoryPool[o.poolIndex].used = false;
			usedList[o.usedIndex] = null;
		} else if ((o.type == "BlueBunker") || (o.type == "RedBunker")) {
			bunkerPool[o.poolIndex].used = false;
			usedList[o.usedIndex] = null;
		} else if ((o.type == "BlueTank") || (o.type == "RedTank")) {
			tankPool[o.poolIndex].used = false;
			usedList[o.usedIndex] = null;
		} else if ((o.type == "BlueJeep") || (o.type == "RedJeep")) {
			jeepPool[o.poolIndex].used = false;
			usedList[o.usedIndex] = null;
		} else if ((o.type == "GamePilot") || (o.type == "WinPilot")) {
			pilotPool[o.poolIndex].used = false;
			usedList[o.usedIndex] = null;
		} else if ((o.type == "Bullet") || (o.type == "Bomb")) {
			bulletPool[o.poolIndex].used = false;
			usedList[o.usedIndex] = null;
		} else if (o.type == "Balloon") {
			balloonPool[o.poolIndex].used = false;
			usedList[o.usedIndex] = null;
		} else if (o.type == "Tower") {
			towerPool[o.poolIndex].used = false;
			usedList[o.usedIndex] = null;
		} else if (o.type == "Prison") {
			prisonPool[o.poolIndex].used = false;
			usedList[o.usedIndex] = null;
		} else if (o.type == "Survivor") {
			survivorPool[o.poolIndex].used = false;
			usedList[o.usedIndex] = null;
		}

		console.log("dispose " + o.type + " @ pool index " + o.poolIndex);
	}

};
