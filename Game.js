// Game Engine
// Implemented in HTML5 with CreateJS
// Nova Scotia Community College : Truro Campus
// Sean Morrow
// Feb 2 2015

// game variables
var stage = null;
var canvas = null;

// key booleans
var leftKey = false;
var rightKey = false;
// timer for dropping enemies
var enemyTimer = null;
var dropInterval = 1000;
// containers to add game objects to for proper layering
var enemyContainer = null;
var bulletContainer = null;
// list of all used game objects for updating
var updateList = null;
// the number of bullets active at any moment
var bulletCount = 0;
// are we playing yet?
var playing = false;

// game objects
var assetManager = null;
var background = null;
var player = null;
var introScreen = null;
var gameScreen = null;
var overScreen = null;

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
    // only if I haven't exceeded max bullets allowed
    if (bulletCount >= GameSettings.bulletMax) return;

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

    bulletCount = 0;
    // check collisions between all bullets with each enemy
    for (var n=0; n<bulletPoolLength; n++) {
        if (bulletPool[n].getAlive()) {
            var bullet = bulletPool[n];
            bulletCount++;
            for (var i=0; i<enemyPoolLength; i++) {
                if (enemyPool[i].getAlive()) {
                    var enemy = enemyPool[i];
                    if (ndgmr.checkPixelCollision(enemy.getSprite(), bullet.getSprite(), 1) !== false) {
                        bullet.killMe();
                        enemy.killMe();
                        break;
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
                player.hitMe();
                enemy.killMe();
            }
        }
    }
}

function updateGameObjects() {
    // loop through all used objects of ObjectPool and update them all in turn
	var length = updateList.length;
	var target = null;
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

function onReady(e) {
    console.log(">> setup");
    // kill event listener
	stage.removeEventListener("onAssetLoaded", onProgress);
    stage.removeEventListener("onAllAssetsLoaded", onReady);

    // construct object pool
	objectPool = new ObjectPool();
	objectPool.init();
    updateList = objectPool.getUpdateList();

    // construct screen objects
    gameScreen = assetManager.getSprite("GameSprites");
    gameScreen.gotoAndStop("gameScreen");
    overScreen = assetManager.getSprite("GameSprites");
    overScreen.gotoAndStop("overScreen");
    overScreen.addEventListener("click", onResetGame);
    introScreen = assetManager.getSprite("GameSprites");
    introScreen.gotoAndStop("introScreen");
    introScreen.addEventListener("click", onStartGame);
    stage.addChild(introScreen);

    // construct containers for game objects
    enemyContainer = new createjs.Container();
    stage.addChild(enemyContainer);
    bulletContainer = new createjs.Container();
    stage.addChild(bulletContainer);

    // setup event listener for when browser loses focus
    window.addEventListener("blur", onPause);
    window.addEventListener("focus", onResume);

    // startup the ticker
    createjs.Ticker.setFPS(GameSettings.frameRate);
    createjs.Ticker.addEventListener("tick", onTick);
}

function onStartGame(e) {
    // initialization
    playing = true;
    leftKey = false;
    rightKey = false;
    spaceKey = false;

    // construct player object
    player = objectPool.getPlayer();
    player.startMe();

    // start timer to drop enemies into game
    enemyTimer = window.setInterval(onDropEnemy, dropInterval);

    // setup event listeners for keyboard keys
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    // game listeners
    stage.addEventListener("onEnemySurvived", onGameEvent, true);
    stage.addEventListener("onEnemyKilled", onGameEvent, true);
    stage.addEventListener("onPlayerKilled", onGameEvent, true);
    stage.addEventListener("onPlayerHit", onGameEvent, true);

    // remove introScreen and add gameScreen
    stage.removeChild(introScreen);
    stage.addChildAt(gameScreen,0);
}

function onStopGame(e) {
    // game cleanup
    objectPool.dispose(player);
    window.clearInterval(enemyTimer);
    stage.removeChild(gameScreen);
    stage.addChildAt(overScreen,0);

    // kill everything
    var length = updateList.length;
	var target = null;
	for (var n=0; n<length; n++) {
		target = updateList[n];
		if (target !== null) target.killMe();
	}

    // remove all event listeners
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
    stage.removeAllEventListeners();

    stage.removeChild(gameScreen);
    stage.addChildAt(overScreen,0);
}

function onResetGame(e) {
    playing = false;
    stage.removeChild(overScreen);
    stage.addChildAt(introScreen,0);
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

function onPause(e) {
    window.clearInterval(enemyTimer);
    createjs.Ticker.removeEventListener("tick", onTick);
}

function onResume(e) {
    enemyTimer = window.setInterval(onDropEnemy, dropInterval);
    createjs.Ticker.addEventListener("tick", onTick);
}

function onDropEnemy(e) {
    var enemy = objectPool.getEnemy();
    enemy.startMe();
}

function onGameEvent(e) {

    switch (e.type) {
        case "onEnemySurvived":
            player.hitMe();
            break;
        case "onEnemyKilled":
            console.log("EVENT : enemy killed!");
            break;
        case "onPlayerKilled":
            console.log("EVENT : player killed!");
            onStopGame();
            break;
        case "onPlayerHit":
            console.log("EVENT : PLAYER HIT!");
            break;
    }
}

function onTick(e) {
    // TESTING FPS
    document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

    // game loop stuff
    if (playing) {
        monitorKeys();
        if ((createjs.Ticker.getTicks() % 2) === 0) monitorCollisions();
        updateGameObjects();
    }

    // update the stage!
	stage.update();
}

