// ObjectPool class
// Sean Morrow
// Mar 22 / 2013

var ObjectPool = function() {
	// private property variables
	// list of all game objects that are being used and are to be updated on ticker (presumably these are visible)
	var updateList = [];

	// starting constant maximums of the game elements (virusMax can be extended by Object pool if needed)
	var PLAYER_MAX = 1;
    var ENEMY_MAX = 50;
    var BULLET_MAX = 5;

	// object pool arrays
	var playerPool = [];
	var enemyPool = [];
    var bulletPool = [];

	// direct public access to pools
	this.playerPool = playerPool;
	this.enemyPool = enemyPool;
    this.bulletPool = bulletPool;
    this.updateList = updateList;

	// index for updateList
	var index = 0;

	// ------------------------------------------------------ private methods
	function getObject(pool){
		// go through existing pool and grab target object that is not in use and return it
		for (var i = 0; i < pool.length; i++) {
			if (!pool[i].used) {
				var object = pool[i];
				object.used = true;
				updateList[object.usedIndex] = object;
				return object;
			}
		}

        // no more objects left - construct a new object (emergency!)
        var MyClass = pool.myClass;
        // increment array index one past length
        i = pool.length;
        // construct a new object and setup and add to updateList right away
        pool[i] = new MyClass;
        pool[i].poolIndex = i;
        pool[i].used = true;
        pool[i].usedIndex = index;
        updateList[index] = pool[i];
        index++;

		return pool[i];
	}

	function constructObjects(pool,max,Class) {
        // store class name for emergency constructing later
        pool.myClass = Class;
		// adding new object to a pool
		for (var i = 0; i < max; i++) {
			pool[i] = new Class;
			pool[i].poolIndex = i;
            pool[i].used = false;
			pool[i].usedIndex = index;
			updateList[index] = null;
			index++;
		}
	}

	// ------------------------------------------------------ public methods
	this.getUpdateList = function() {return updateList}

	this.init = function() {
		// pool object construction
		// populate arrays to create pool of game objects
		constructObjects(playerPool, PLAYER_MAX, Player);
		constructObjects(enemyPool, ENEMY_MAX, Enemy);
        constructObjects(bulletPool, BULLET_MAX, Bullet);
	}

	this.getPlayer = function() {
		return getObject(playerPool);
    }

	this.getEnemy = function() {
		return getObject(enemyPool);
    }

	this.getBullet = function() {
		return getObject(bulletPool);
    }

    this.dispose = function(o) {
		// which type of game object are we disposing?
		if (o instanceof Player) {
			playerPool[o.poolIndex].used = false;
            console.log("dispose player @ pool index " + o.poolIndex);
		} else if (o instanceof Enemy) {
			enemyPool[o.poolIndex].used = false;
            console.log("dispose enemy @ pool index " + o.poolIndex);
		} else if (o instanceof Bullet) {
			bulletPool[o.poolIndex].used = false;
            console.log("dispose bullet @ pool index " + o.poolIndex);
		}

        // clear out disposed object from updateList
        updateList[o.usedIndex] = null;


	}

};
