// HTML5 Game Engine
// Sean Morrow
// Feb 2 2015

// game variables
var stage = null;
var canvas = null;

// key booleans
var leftKey = false;
var rightKey = false;
// frame rate of game
var frameRate = 24;

// game objects
var assetManager = null;
var background = null;
var player = null;
var updateList = null;

var enemyTimer = null;
var dropInterval = 1000;

// ????????????????????????????? remove this
//var enemyTemp = null;
// ?????????????????????????????????????????

// ------------------------------------------------------------ private methods
function monitorKeys() {

    if (!player.getAlive()) return;

    if (leftKey) {
        player.moveLeft();
    } else if (rightKey) {
        player.moveRight();
    } else {
        player.stopMe();
    }
}

function fireKey() {

    console.log("fire!");

    var bullet = objectPool.getBullet();
    var x = player.getSprite().x;
    var y = player.getSprite().y;
    bullet.startMe(x, y);


}

function monitorCollisions() {
    // get local references to pools and lengths
    var bulletPool = objectPool.bulletPool;
    var enemyPool = objectPool.enemyPool;
    var bulletPoolLength = bulletPool.length;
    var enemyPoolLength = enemyPool.length;

    // check collisions between all bullets with each enemy
    for (var n=0; n<bulletPoolLength; n++) {
        if (bulletPool[n].getAlive()) {
            var bullet = bulletPool[n];
            for (var i=0; i<enemyPoolLength; i++) {
                if (enemyPool[n].getAlive()) {
                    var enemy = enemyPool[i];
                    if (ndgmr.checkPixelCollision(enemy.getSprite(), bullet.getSprite(), 1) !== false) {

                        console.log("BULLET HIT!");

                        bullet.killMe();
                        enemy.killMe();
                    }
                }
            }
        }
    }

    // only monitor if player is alive
    if (!player.getAlive()) return;

    // check collisions between enemies and player
    for (n=0; n<enemyPoolLength; n++) {
        var enemy = enemyPool[n];
        if (enemy.getAlive()) {
            if (ndgmr.checkPixelCollision(enemy.getSprite(), player.getSprite(), 1) !== false) {
                player.killMe();
                enemy.killMe();
            }
        }
    }
}

function updateGameObjects() {
    // loop through all used objects of ObjectPool and update them all in turn
	var length = updateList.length;
	var target = null;

    //console.log("updating: " + length);

	for (var n=0; n<length; n++) {
		target = updateList[n];
		if (target !== null) target.updateMe();
	}
}

function randomMe(low, high) {
    // returns a random number
	return Math.floor(Math.random() * (1 + high - low)) + low;
}

// ------------------------------------------------------------ event handlers
function onInit() {
	console.log(">> initializing");

	// get reference to canvas
	canvas = document.getElementById("stage");
	// set canvas to as wide/high as the browser window
	canvas.width = 600;
	canvas.height = 600;
	// create stage object
    stage = new createjs.Stage(canvas);

    // setup solid color background
    background = new createjs.Shape();
	background.graphics.beginFill("#6699CC").drawRect(0,0,600,600);
	background.cache(0,0,600,600);
	stage.addChild(background);
	stage.update();

    // construct preloader object to load spritesheet and sound assets
    assetManager = new AssetManager();
    stage.addEventListener("onAssetLoaded", onProgress);
    stage.addEventListener("onAllAssetsLoaded", onReady);
    // load the assets
    assetManager.loadAssets(manifest);
}

function onProgress(e) {
    console.log("progress: " + assetManager.getProgress());
}

function onKeyDown(e) {
    // which keystroke is down?
    if (e.keyCode == 37) leftKey = true;
    else if (e.keyCode == 39) rightKey = true;
}

function onKeyUp(e) {
    // which keystroke is up?
    if (e.keyCode == 37) leftKey = false;
    else if (e.keyCode == 39) rightKey = false;
    else if (e.keyCode == 32) fireKey();
}

function onReady(e) {
    console.log(">> setup");
    // kill event listener
	stage.removeEventListener("onAssetLoaded", onProgress);
    stage.removeEventListener("onAllAssetsLoaded", onReady);

    // current state of keys
    leftKey = false;
    rightKey = false;
    spaceKey = false;


    // construct object pool
	objectPool = new ObjectPool();
	objectPool.init();
    updateList = objectPool.getUpdateList();

    // timer to drop enemies into game
    enemyTimer = window.setInterval(onDropEnemy, dropInterval);

    // construct game objects



    // ????????????????????????? testing
    player = objectPool.getPlayer();
    player.startMe();








    // setup event listeners for keyboard keys
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    // game listeners
    stage.addEventListener("onEnemySurvived", onGameEvent, true);

    // startup the ticker
    createjs.Ticker.setFPS(frameRate);
    createjs.Ticker.addEventListener("tick", onTick);
}

function onDropEnemy(e) {
    var enemy = objectPool.getEnemy();
    enemy.startMe();

}

function onGameEvent(e) {

    switch (e.type) {
        case "onEnemySurvived":
            console.log("oh no - enemy survived!");
            break;



    }

}

function onTick(e) {
    // TESTING FPS
    document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

    monitorKeys();
    monitorCollisions();
    updateGameObjects();

    // update the stage!
	stage.update();
}

