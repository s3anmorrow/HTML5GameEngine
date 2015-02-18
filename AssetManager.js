/*
* AssetManager class
* Sean Morrow
* May 6 / 2014
*
* USAGE:
* > Construct AssetManager object once and give it a global scope (or pass it around to different game objects)
* > Call loadAssets(manifest) method and provide loading manifest as argument
* > AssetManager will handle preloading all assets (images or sound)
*
* var manifest = [
*   {src:"lib/Snake.png",
    id:"Snake",
    data:{
*       images:["lib/Snake.png"],
        frames:[
*            [0, 0, 128, 128, 0, -2, 1],
*            [128, 0, 128, 128, 0, -2, 1],
*            [256, 0, 128, 128, 0, -2, 1],
*            [384, 0, 128, 128, 0, -2, 1],
*            [512, 0, 128, 128, 0, -2, 1],
*            [640, 0, 128, 128, 0, -2, 1],
*            [768, 0, 128, 128, 0, -2, 1],
*            [0, 128, 128, 128, 0, -2, 1],
*            [128, 128, 128, 128, 0, -2, 1],
*            [256, 128, 128, 128, 0, -2, 1],
*            [384, 128, 128, 128, 0, -2, 1],
*            [512, 128, 128, 128, 0, -2, 1],
*            [640, 128, 128, 128, 0, -2, 1],
*            [768, 128, 128, 128, 0, -2, 1],
*            [0, 256, 128, 128, 0, -2, 1],
*            [128, 256, 128, 128, 0, -2, 1],
*            [256, 256, 128, 128, 0, -2, 1],
*            [384, 256, 128, 128, 0, -2, 1],
*            [512, 256, 128, 128, 0, -2, 1]
*        ],
*        animations:{
*            alive: {frames: [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2], speed: 1},
*            dead: {frames: [3,4,5,6,7,8,9,10,11,12,12,12,12,12,12,12,12,12,12,12,12,12,13,14,15,16,17,18],speed: 1}
*        }
*    }}
*];
* > this data was generated from a SWF with CreateJS ZOE but allows different sized frames to be included in one spritesheet
* > ultimately this approach allows you to use one Spritesheet for a large number of different sprites
* > note that when using zoe all your sprite animations need to be on the main timeline with frame labels
* > you also want to include an empty movieclip with instance name "registrationPoint" to mark where reg point is located
*
* > to get a sprite at anytime call getSprite(id) and provide id of sprite you want to retrieve and it returns the sprite for usage
*/

var AssetManager = function() {
    // keep track of assets
    var manifest = null;
    var progress = 0;
    // array of spritesheet objects
    var spriteSheets = [];
    // array of JSON for each spritesheet
    var spriteSheetsJSON = [];
    // LoadQueue object
    preloader = new createjs.LoadQueue();

    // construct custom event object and initialize it
    var eventAssetLoaded = new createjs.Event("onAssetLoaded");
    var eventAllLoaded = new createjs.Event("onAllAssetsLoaded");

	// ------------------------------------------------------ event handlers
    function onLoaded(e) {

        console.log("asset loaded: " + e.item.src + " type: " + e.item.type);

        // what type of asset was loaded?
        switch(e.item.type) {
            case createjs.LoadQueue.IMAGE:
                // spritesheet loaded
                // get id and source from manifest of currently loaded spritesheet
                var id = e.item.id;
                // store a reference to the actual image that was preloaded
                var image = e.result;
                // get data object from JSON array (previously loaded)
                var data = spriteSheetsJSON[id];
                if (data === undefined) console.log("ASSETMANAGER ERROR > JSON not defined for spritesheet - Check manifest [JSON must be listed before spritesheet image]");
                // add images property to data object and tack on loaded spritesheet image from LoadQueue
                // this is so that the SpriteSheet constructor doesn't preload the image again
                // it will do this if you feed it the string path of the spritesheet
                data.images = [image];
                // construct Spritesheet object from source
                var spriteSheet = new createjs.SpriteSheet(data);
                // store spritesheet object for later retrieval
                spriteSheets[id] = spriteSheet;
                break;

            case createjs.LoadQueue.JSON:
                // get spritesheet this JSON object belongs to and store for spritesheet construction later
                var spriteSheetID = e.item.spritesheet;
                spriteSheetsJSON[spriteSheetID] = e.result;
                break;

            case createjs.LoadQueue.SOUND:
                // sound loaded
                break;
        }

        // an asset has been loaded
        stage.dispatchEvent(eventAssetLoaded);
    }

    function onProgress(e) {
        progress = e.progress;
    }

    // called if there is an error loading the spriteSheet (usually due to a 404)
    function onError(e) {
        console.log("ASSETMANAGER ERROR > Error Loading asset");
    }

    function onComplete(e) {
        console.log("All assets loaded");
        spriteSheetsJSON = null;
        // kill event listeners
        preloader.removeEventListener("fileload", onLoaded);
        preloader.removeEventListener("progress", onProgress);
        preloader.removeEventListener("error", onError);
        preloader.removeEventListener("complete", onComplete);
        // dispatch event that all assets are loaded
        stage.dispatchEvent(eventAllLoaded);
    }

	// ------------------------------------------------------ public methods
    this.getSprite = function(spriteSheetID, frameLabel) {
        // construct sprite object to animate the frames (I call this a clip)
        var sprite = new createjs.Sprite(spriteSheets[spriteSheetID]);
        sprite.name = spriteSheetID;
        sprite.x = 0;
        sprite.y = 0;
        sprite.currentFrame = 0;
        if (frameLabel != undefined) sprite.gotoAndStop(frameLabel);
        return sprite;
    };

    this.getProgress = function() {
        return progress;
    };

	this.getSpriteSheet = function(id) {
		return spriteSheets[id];
	};

    this.loadAssets = function(myManifest) {
        // setup manifest
        manifest = myManifest;
        // if browser doesn't suppot the ogg it will attempt to look for an mp3
        createjs.Sound.alternateExtensions = ["mp3","wav"];
        // registers the PreloadJS object with SoundJS - will automatically have access to all sound assets
        preloader.installPlugin(createjs.Sound);
        preloader.addEventListener("fileload", onLoaded);
        preloader.addEventListener("progress", onProgress);
        preloader.addEventListener("error", onError);
        preloader.addEventListener("complete", onComplete);
        preloader.setMaxConnections(5);
        // load first spritesheet to start preloading process
        preloader.loadManifest(manifest);
    };
};
