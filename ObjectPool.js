// ObjectPool class
// Sean Morrow
// Mar 22 / 2013

var ObjectPool = function() {
	// private property variables
	// list of all game objects to be rendered onto the canvas
	//var usedList = [];

	// starting constant maximums of the game elements (virusMax can be extended by Object pool if needed)
	var PLAYER_MAX = 1;
    var ENEMY_MAX = 20;
    var BULLET_MAX = 20;

	// object pool arrays
	var playerPool = [];
	var enemyPool = [];
    var bulletPool = [];

	// direct public access to pools
	this.playerPool = playerPool;
	this.enemyPool = enemyPool;
    this.bulletPool = bulletPool;

	// other
	var index = 0;

	// ------------------------------------------------------ private methods
	function getObject(pool,max){
		// go through existing pool and grab target object that is not in use and return it
		for (var i = 0; i < max; i++) {
			if (!pool[i].used) {
				var object = pool[i];
				object.used = true;
				//usedList[object.usedIndex] = object;
				return object;
			}
		}

        // no more objects left - construct a new object (emergency!)
        // ???????????????????????????????


		return null;
	}

	function constructObjects(pool,max,Class) {
		// adding new object to a pool
		for (var i = 0; i < max; i++) {
			pool[i] = new Class;
			pool[i].poolIndex = i;
			//pool[i].usedIndex = index;
			//usedList[index] = null;
			//index++;
		}
	}

	// ------------------------------------------------------ public methods
	this.getUsedList = function() {return usedList}

	this.init = function() {
		// pool object construction
		// populate arrays to create pool of game objects
		constructObjects(playerPool, PLAYER_MAX, Player);
		constructObjects(enemyPool, ENEMY_MAX, Enemy);
        constructObjects(bulletPool, BULLET_MAX, Bullet);
	}

	this.getPlayer = function() {
		return getObject(playerPool, PLAYER_MAX);
    }

	this.getEnemy = function() {
		return getObject(enemyPool, ENEMY_MAX);
    }

	this.getBullet = function() {
		return getObject(bulletPool, BULLET_MAX);
    }

    this.dispose = function(o) {
		// which type of game object are we disposing?
		if (o.type == "Player") {
			playerPool[o.poolIndex].used = false;
			//usedList[o.usedIndex] = null;
		} else if (o.type == "Enemy") {
			enemyPool[o.poolIndex].used = false;
			//usedList[o.usedIndex] = null;
		} else if (o.type == "Bullet") {
			bulletPool[o.poolIndex].used = false;
			//usedList[o.usedIndex] = null;
		}

		console.log("dispose " + o.type + " @ pool index " + o.poolIndex);
	}

};
