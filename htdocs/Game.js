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
var enemyDropFreq = 0;
// containers to add game objects to for proper layering
var enemyContainer = null;
var bulletContainer = null;
// list of all used game objects for updating
var updateList = null;
// the number of bullets active at any moment
var bulletCount = 0;
var bulletMaxAtStart = 0;
// the number of enemies killed
var killCount = 0;
// the current level
var level = 0;
// are we playing yet?
var playing = false;

// game objects
var txtLoading = null;
var assetManager = null;
var background = null;
var player = null;
var scoreBoard = null;
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
    if (bulletCount >= bulletMax) return;

    var bullet = objectPool.getBullet();
    var x = player.getSprite().x;
    var y = player.getSprite().y;
    bullet.startMe(x, y);

    createjs.Sound.play(GameSettings.SoundFireBullet);
}

function monitorCollisions() {
    // only monitor if player is alive
    if (!player.getAlive()) return;

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
                        enemy.shootMe();
                        break;
                    }
                }
            }
        }
    }

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

function updateLoadingConsole(msg) {
    txtLoading.text += msg + "\n";
    console.log(msg);
    stage.update();
}

// ------------------------------------------------------------ event handlers
function onInit() {
	// get reference to canvas
	canvas = document.getElementById("stage");
	// set canvas to as wide/high as the browser window
	canvas.width = 600;
	canvas.height = 600;
	// create stage object
    stage = new createjs.Stage(canvas);

    // setup loading console
    txtLoading = new createjs.Text("Game Loading...\n\n","10px Arial", "#FFFFFF");
    txtLoading.x = 10;
    txtLoading.y = 10;
    stage.addChild(txtLoading);
    updateLoadingConsole(">> initializing");

    // construct preloader object to load spritesheet and sound assets
    assetManager = new AssetManager();
    stage.addEventListener("onAssetLoaded", onProgress);
    stage.addEventListener("onAllAssetsLoaded", onReady);
    // load the assets
    assetManager.loadAssets(manifest);
}

function onProgress(e) {
    updateLoadingConsole("progress: " + Math.ceil(assetManager.getProgress() * 100) + "%");
}

function onReady(e) {
    updateLoadingConsole(">> setup");

    // kill event listener
	stage.removeEventListener("onAssetLoaded", onProgress);
    stage.removeEventListener("onAllAssetsLoaded", onReady);

    // construct object pool
	objectPool = new ObjectPool();
	objectPool.init();
    updateList = objectPool.getUpdateList();

    // construct screen objects
    gameScreen = assetManager.getSprite("GameAssets");
    gameScreen.gotoAndStop("screenInGame");
    overScreen = assetManager.getSprite("GameAssets");
    overScreen.gotoAndStop("screenGameOver");
    overScreen.addEventListener("click", onResetGame);
    introScreen = assetManager.getSprite("GameAssets");
    introScreen.gotoAndStop("screenStart");
    introScreen.addEventListener("click", onStartGame);
    stage.addChild(introScreen);

    // construct scoreboard
    scoreBoard = new ScoreBoard();

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

    updateLoadingConsole(">> game ready");
    stage.removeChild(txtLoading);
}

function onStartGame(e) {
    // initialization
    playing = true;
    leftKey = false;
    rightKey = false;
    spaceKey = false;
    level = 1;
    enemyDropFreq = GameSettings.enemyFrequency;
    bulletMax = GameSettings.bulletMaxAtStart;

    // construct game objects
    player = objectPool.getPlayer();
    player.startMe();
    scoreBoard.startMe();

    // start timer to drop enemies into game
    enemyTimer = window.setInterval(onDropEnemy, enemyDropFreq * 1000);

    // setup event listeners for keyboard keys
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    // game listeners
    stage.addEventListener("onEnemySurvived", onGameEvent, true);
    stage.addEventListener("onEnemyShot", onGameEvent, true);
    stage.addEventListener("onPlayerKilled", onGameEvent, true);
    stage.addEventListener("onPlayerHit", onGameEvent, true);
    stage.addEventListener("onPlayerEnergize", onGameEvent, true);

    // remove introScreen and add gameScreen
    stage.removeChild(introScreen);
    stage.addChildAt(gameScreen,0);

    createjs.Sound.play(GameSettings.SoundStartGame);
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

    createjs.Sound.play(GameSettings.SoundGameOver);
}

function onResetGame(e) {
    playing = false;
    scoreBoard.stopMe();
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
    if (playing) window.clearInterval(enemyTimer);
    createjs.Ticker.removeEventListener("tick", onTick);
}

function onResume(e) {
    if (playing) enemyTimer = window.setInterval(onDropEnemy, enemyDropFreq * 1000);
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
            createjs.Sound.play(GameSettings.SoundEnemySurvived);
            break;
        case "onEnemyShot":
            console.log("EVENT : enemy shot!");
            killCount++;
            scoreBoard.setKills(killCount);
            createjs.Sound.play(GameSettings.SoundEnemyKilled);
            // did I level up?
            if (killCount % GameSettings.killsPerLevel === 0) {
                // increase enemy drop frequency
                enemyDropFreq -= 0.25;
                if (enemyDropFreq < 0.25) enemyDropFreq = 0.25;
                window.clearInterval(enemyTimer);
                enemyTimer = window.setInterval(onDropEnemy, enemyDropFreq * 1000);
                // increase bullet max with level
                bulletMax++;
                if (bulletMax > GameSettings.bulletMaxForGame) bulletMax = GameSettings.bulletMaxForGame;
                scoreBoard.setBulletMax(bulletMax);
                // increase level counter
                level++;

                console.log("LEVEL UP : " + level + " Freq: " + enemyDropFreq);
            }

            // did I earn hitPoints?
            if (killCount % GameSettings.killsPerHitPoint === 0) {
                player.energizeMe();
            }

            break;
        case "onPlayerKilled":
            console.log("EVENT : player killed!");
            onStopGame();
            createjs.Sound.play(GameSettings.SoundPlayerKilled);
            break;
        case "onPlayerHit":
            console.log("EVENT : PLAYER HIT!");
            scoreBoard.setHitPoints(player.getHitPoints());
            createjs.Sound.play(GameSettings.SoundPlayerHit);
            break;
        case "onPlayerEnergize":
            console.log("EVENT : PLAYER ENERGIZE!");
            scoreBoard.setHitPoints(player.getHitPoints());
            createjs.Sound.play(GameSettings.SoundPlayerEnergize);
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

