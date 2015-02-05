var Bullet = function() {

    // local references to global variables
    var stage = window.stage;
    var assetmanager = window.asserManager;

    // custom events
    var eventBulletKilled = new createjs.Event("onBulletKilled", true);

    // private property variables
    var speed = 6;

    // get sprite and setup
    var sprite = assetManager.getSprite("GameSprites");
    sprite.gotoAndStop("bullet");
    sprite.regX = sprite.getBounds().width / 2;
    sprite.regY = sprite.getBounds().height / 2;
    // ?????????????????????????????? this will need to be changed

    // ???????????????????????????????????????????????????????????

    // determine top stage bounds
    var stageUpBound = -sprite.getBounds().height;

    // --------------------------------------------------- get/set methods
    this.getSprite = function() {
        return sprite;
    };

    // --------------------------------------------------- public methods
    this.startMe = function(x, y) {
        sprite.x = x;
        sprite.y = y;
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
            this.killMe();
            sprite.dispatchEvent(eventBulletKilled);
        }
    };

};
