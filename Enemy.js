var Enemy = function() {

    // local references to global variables
    var stage = window.stage;
    var assetmanager = window.asserManager;

    // private property variables
    var moving = false;

    // get sprite and setup
    sprite = assetManager.getSprite("GameSprites");
    sprite.scaleX = 1;
    /*
    sprite.regX = sprite.getBounds().width / 2;
    sprite.regY = sprite.getBounds().height / 2;
    */
    sprite.x = 300;
    sprite.y = 500;
    // ?????????????????????????????? this will need to be changed
    sprite.gotoAndStop("bugAlive");
    // ???????????????????????????????????????????????????????????
    stage.addChild(sprite);

    // --------------------------------------------------- public methods
    this.startMe = function() {
        sprite.play();
        moving = MovingDirection.RIGHT;
    };

    this.stopMe = function() {
        sprite.stop();
        moving = MovingDirection.STOPPED;
    };

    this.updateMe = function() {



};
