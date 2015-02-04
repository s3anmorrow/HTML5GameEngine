var Bullet = function() {

    // local references to global variables
    var stage = window.stage;
    var assetmanager = window.asserManager;
    //var player = window.player;

    // custom events
    var eventBulletKilled = new createjs.Event("onBulletKilled", true);

    // public properties for objectPool use
    this.type = "Bullet";
	this.used = false;
	this.poolIndex = -1;

    // private property variables
    var speed = 6;

    // get sprite and setup
    var sprite = assetManager.getSprite("GameSprites");
    sprite.regX = sprite.getBounds().width / 2;
    sprite.regY = sprite.getBounds().height / 2;
    // ?????????????????????????????? this will need to be changed
    sprite.gotoAndStop("bullet");
    // ???????????????????????????????????????????????????????????

    // determine top stage bounds
    var stageUpBound = -sprite.getBounds().height;

    // --------------------------------------------------- get/set methods
    this.getSprite = function() {
        return sprite;
    };

    // --------------------------------------------------- public methods
    this.startMe = function() {
        // ????????????????????????????????
        //sprite.x = player.x;
        //sprite.y = player.y;
        stage.addChild(sprite);
    };

    this.killMe = function() {
        sprite.stop();
        stage.removeChild(sprite);
        objectPool.dispose(this);
        sprite.dispatchEvent(eventBulletKilled);
    };

    this.updateMe = function() {

        sprite.y -= speed;
        // has the bullet gone off the stage?
        if (sprite.y < stageUpBound) {

            console.log("bullet off stage");
            sprite.dispatchEvent(eventBulletKilled);
        }



    };

};
