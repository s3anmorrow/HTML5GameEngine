var Bullet = function() {

    // local references to global variables
    var stage = window.stage;
    var assetmanager = window.asserManager;

    // private property variables
    var speed = 6;
    var alive = false;

    // get sprite and setup
    var sprite = assetManager.getSprite("GameSprites");
    sprite.gotoAndStop("bullet");
    sprite.regX = sprite.getBounds().width / 2;
    sprite.regY = sprite.getBounds().height / 2;

    // determine top stage bounds
    var stageUpBound = -sprite.getBounds().height;

    // --------------------------------------------------- get/set methods
    this.getSprite = function() {
        return sprite;
    };

    this.getAlive = function() {
        return alive;
    };

    // --------------------------------------------------- public methods
    this.startMe = function(x, y) {
        alive = true;
        sprite.x = x;
        sprite.y = y;
        bulletContainer.addChild(sprite);
    };

    this.killMe = function() {
        alive = false;
        sprite.stop();
        bulletContainer.removeChild(sprite);
        objectPool.dispose(this);
    };

    this.updateMe = function() {
        sprite.y -= speed;
        // has the bullet gone off the stage?
        if (sprite.y < stageUpBound) {
            this.killMe();
        }
    };

};
