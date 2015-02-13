var ScoreBoard = function() {

    // local references to global variables
    var stage = window.stage;
    var assetmanager = window.assetManager;

    // private properties
    var kills = 0;
    var bulletMax = 0;
    var hitPoints = 0;

    // setup icons of scoreBoard
    var scoreBoardContainer = new createjs.Container();

    var scoreBoardBack = assetmanager.getSprite("GenericAssets");
    scoreBoardBack.gotoAndStop("scoreBoardBack");
    scoreBoardBack.x = 10;
    scoreBoardBack.y = 10;
    scoreBoardContainer.addChild(scoreBoardBack);

    var txtKills = new createjs.BitmapText("0",assetmanager.getSpriteSheet("GenericAssets"));
    txtKills.x = 38;
    txtKills.y = 43;
    scoreBoardContainer.addChild(txtKills);

    var txtBulletCount = new createjs.BitmapText("0",assetmanager.getSpriteSheet("GenericAssets"));
    txtBulletCount.x = 38;
    txtBulletCount.y = 76;
    scoreBoardContainer.addChild(txtBulletCount);

    var hitPointsBar = new createjs.Shape();
    scoreBoardContainer.addChild(hitPointsBar);


    // ------------------------------------------------ get/set methods
    this.setKills = function(value) {
        kills = value;
        txtKills.text = String(kills);
    };

    this.setBulletMax = function(value) {
        bulletMax = value;
        txtBulletCount.text = String(bulletMax);
    };

    this.setHitPoints = function(value) {
        hitPoints = value;
        // adjust width of speedBar
        var width = (hitPoints / GameSettings.hitPoints) * 80;
        // redraw bar shape object to reflect current hitPoints
        hitPointsBar.graphics.clear();
        hitPointsBar.graphics.beginFill(GameSettings.hitPointsBarColor).drawRect(38, 16, width, 10);
    };

    // ------------------------------------------------ public methods
    this.startMe = function() {
        this.setKills(0);
        this.setBulletMax(GameSettings.bulletMaxAtStart);
        this.setHitPoints(GameSettings.hitPoints);
        stage.addChild(scoreBoardContainer);
    };

    this.stopMe = function() {
        stage.removeChild(scoreBoardContainer);

    };
};
