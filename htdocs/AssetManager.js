/*
* AssetManager Class for ZOE workflow
* Sean Morrow
* May 6 / 2014
*
* USAGE:
* > Construct AssetManager object once and give it a global scope (or pass it around to different game objects)
* > Listen for AssetManager custom events to know when progress made and when finished loading:
* stage.addEventListener("onAssetLoaded", onProgress);
* stage.addEventListener("onAllAssetsLoaded", onReady);
*
* > Call loadAssets(manifest) method and provide loading manifest as argument
* > AssetManager will handle preloading all assets (json, spritesheet images, or sound)
* > This version is tailored to work with the JSON (and spritesheet png) produced by CreateJS ZOE
*
* var manifest = [
*     {
*         src:"lib/gameAssets.json",
*         spritesheet:"GameAssets"
*     },
*     {
*         src:"lib/gameAssets.png",
*         id:"GameAssets"
*     },
*
*     {
*         src:"lib/genericAssets.json",
*         spritesheet:"GenericAssets"
*     },
*     {
*         src:"lib/genericAssets.png",
*         id:"GenericAssets"
*     },
*
*     {
*         src:"sounds/boing.ogg",
*         id:"boing",
*         data:4
*     }
* ];
*
* > IMPORTANT NOTE : the ZOE json file must be loaded BEFORE its partnered spritesheet image and linked together via the spritesheet property (see example above)
* > supports multiple spritesheets (as demoed above) but will not handler a single spritesheet spread over several images (not tested)
* > for using ZOE:
* > generate all animations for single spritesheet on main timeline in Flash with frame labels
* > you also want to include an empty movieclip with instance name "registrationPoint" to mark where reg point is located
* > the JSON file produced outlines the frame sizes and animation sequences of the spritesheet
*
* > to get a sprite at anytime call getSprite(id) to receive sprite object based off spritesheet - will need to gotoAndStop() to desired frame
* > or call getSprite(id, framelabel) to jump to correct frame (stopped)
*
* > sounds are listed in manifest as ogg format but you include mp3 (and possibly wav)
* > use soundsJS to access preloaded sounds in code
*
* > getProgress() returns the progress of the loading of all assets in manifest as a decimal number (progress=1 means everything loaded)
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

        updateLoadingConsole("asset loaded: " + e.item.src + " type: " + e.item.type);

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
        preloader.setMaxConnections(1);
        // load first spritesheet to start preloading process
        preloader.loadManifest(manifest);
    };
};
