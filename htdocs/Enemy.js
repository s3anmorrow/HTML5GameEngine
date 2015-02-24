var Enemy = function() {

    // local references to global variables
    var stage = window.stage;
    var assetmanager = window.assetManager;
    var me = this;

    // custom events
    var eventEnemyShot = new createjs.Event("onEnemyShot", true);
    var eventEnemySurvived = new createjs.Event("onEnemySurvived", true);

    // private property variables
    var moving = MovingDirection.STOPPED;
    var speed = 2;
    var alive = false;
    var angleOfRightTravel = 45;
    var angleOfLeftTravel = 135;
    var rangeOfTravel = 100;

    var startX = 0;
    var xDisplace = -1;
    var yDisplace = -1;
    var stageWidth = stage.canvas.width;
    var stageHeight = stage.canvas.height;

    // get sprite and setup
    var sprite = assetManager.getSprite("GameAssets");
    sprite.gotoAndStop("enemyMoving");
    sprite.x = 50;
    sprite.y = 30;

    var stageLeftBound = sprite.getBounds().width;
    var stageRightBound = stageWidth - (sprite.getBounds().width * 2);

    // -------------------------------------------------- private methods
    function radianMe(degrees) {
        return (degrees * (Math.PI / 180));
    }

    function calculateDisplace(angle) {
        // convert current rotation of object to radians
        var radians = radianMe(angle);
        // calculating X and Y displacement
        xDisplace = Math.cos(radians) * speed;
        yDisplace = Math.sin(radians) * speed;
    }

    // --------------------------------------------------- get/set methods
    this.getMoving = function(){
        return moving;
    };

    this.getSprite = function() {
        return sprite;
    };

    this.getAlive = function() {
        return alive;
    };

    // --------------------------------------------------- public methods
    this.startMe = function() {
        alive = true;
        sprite.gotoAndPlay("enemyMoving");

        // randomly set behaviour properties
        sprite.y = -sprite.getBounds().height;
        sprite.x = randomMe(stageLeftBound, stageRightBound);
        angleOfRightTravel = randomMe(20, 80);
        angleOfLeftTravel = randomMe(100, 160);

        rangeOfTravel = sprite.getBounds().width * 2;
        speed = randomMe(2,4);

        // store where we start from
        startX = sprite.x;
        calculateDisplace(angleOfRightTravel);

        moving = MovingDirection.RIGHT;
        enemyContainer.addChild(sprite);

        /*
        // collision detection test setup
        sprite.x = 265;
        sprite.y = 10;
        moving = MovingDirection.STOPPED;
        */
    };

    this.stopMe = function() {
        sprite.stop();
        moving = MovingDirection.STOPPED;
    };

    this.shootMe = function(){
        this.killMe();
        sprite.dispatchEvent(eventEnemyShot);
    }

    this.killMe = function() {
        alive = false;
        this.stopMe();
        sprite.gotoAndPlay("enemyDead");
        sprite.addEventListener("animationend", onKilled);
    };

    this.updateMe = function() {
        if (moving) {

            // where am I going on the xAxis for the next move?
            var nextX = sprite.x + xDisplace;

            // change to other direction - done if used up horizontal range or hitting edge of stage
            if ((Math.abs(startX - nextX) > rangeOfTravel) || (nextX <= stageLeftBound) || (nextX >= stageRightBound)) {
                if (moving === MovingDirection.RIGHT) {
                    calculateDisplace(angleOfLeftTravel);
                    moving = MovingDirection.LEFT;
                } else {
                    calculateDisplace(angleOfRightTravel);
                    moving = MovingDirection.RIGHT;
                }
            }

            // move sprite
            sprite.x = sprite.x + xDisplace;
            sprite.y = sprite.y + yDisplace;

            // is the enemy off the bottom of the stage?
            if (sprite.y > stageHeight) {
                alive = false;
                this.stopMe();
                sprite.dispatchEvent(eventEnemySurvived);
                enemyContainer.removeChild(sprite);
                objectPool.dispose(me);
            }

        }
    };

    // -------------------------------------------------- event handlers
    function onKilled(e) {
        sprite.stop();
        sprite.removeEventListener("animationend", onKilled);
        enemyContainer.removeChild(sprite);
        // return object to pool
        objectPool.dispose(me);
    }

};
