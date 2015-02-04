// HTML5 Game Engine
// Sean Morrow
// Feb 2 2015

// game variables
var stage = null;
var canvas = null;

// key booleans
var leftKey = false;
var rightKey = false;
var spaceKey = false;
// frame rate of game
var frameRate = 24;

// game objects
var assetManager = null;
var background = null;
var player = null;
// ????????????????????????????? remove this
var enemy = null;
// ?????????????????????????????????????????

// ------------------------------------------------------------ private methods
function monitorKeys() {
    if (leftKey) {
        player.moveLeft();
    } else if (rightKey) {
        player.moveRight();
    } else {
        player.stopMe();
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
    else if (e.keyCode == 32) spaceKey = true;
}

function onKeyUp(e) {
    // which keystroke is up?
    if (e.keyCode == 37) leftKey = false;
    else if (e.keyCode == 39) rightKey = false;
    else if (e.keyCode == 32) rightKey = false;
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

    // construct game objects
    //player = new Player();

    // ????????????????????????? testing
    player = objectPool.getPlayer();

    enemy = objectPool.getEnemy();
    enemy.setAngleOfTravel(45,135);
    enemy.setRangeOfTravel(100);
    enemy.startMe();





    // setup event listeners for keyboard keys
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    // game listeners
    stage.addEventListener("onEnemySurvived", onEnemySurvived);

    // startup the ticker
    createjs.Ticker.setFPS(frameRate);
    createjs.Ticker.addEventListener("tick", onTick);
}

function onEnemySurvived(e) {

    console.log("oh no - enemy survived!");

}

function onTick(e) {
    // TESTING FPS
    document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();



    monitorKeys();
    player.updateMe();
    enemy.updateMe();



    // update the stage!
	stage.update();
}

