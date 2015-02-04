var Enemy = function() {

    // local references to global variables
    var stage = window.stage;
    var assetmanager = window.asserManager;

    // custom events
    var eventEnemyKilled = new createjs.Event("onEnemyKilled", true);
    var eventEnemySurvived = new createjs.Event("onEnemySurvived", true);

    // public properties for objectPool use
    this.type = "Enemy";
	this.used = false;
	this.poolIndex = -1;

    // private property variables
    var moving = MovingDirection.STOPPED;
    var speed = 4;
    var angleOfRightTravel = 45;
    var angleOfLeftTravel = 135;
    var rangeOfTravel = 100;

    var startX = 0;
    var xDisplace = -1;
    var yDisplace = -1;

    // get sprite and setup
    var sprite = assetManager.getSprite("GameSprites");
    sprite.x = 300;
    sprite.y = 30;
    // ?????????????????????????????? this will need to be changed
    sprite.gotoAndStop("bugAlive");
    // ???????????????????????????????????????????????????????????


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
    this.setSpeed = function(value) {
        speed = value;
    };

    this.setAngleOfTravel = function(value1, value2) {
        angleOfRightTravel = value1;
        angleOfLeftTravel = value2;
    };

    this.setRangeOfTravel = function(value) {
        rangeOfTravel = value;
    };

    this.getMoving = function(){
        return moving;
    };

    // --------------------------------------------------- public methods
    this.startMe = function() {
        // store where we start from
        startX = sprite.x;
        calculateDisplace(angleOfRightTravel);
        sprite.play();
        moving = MovingDirection.RIGHT;
        stage.addChild(sprite);
    };

    this.stopMe = function() {
        sprite.stop();
        moving = MovingDirection.STOPPED;
    };

    this.updateMe = function() {
        if (moving) {
            // move sprite
            sprite.x = sprite.x + xDisplace;
            sprite.y = sprite.y + yDisplace;

            // do I need to cris-cross the other direction?
            if (Math.abs(startX - sprite.x) > rangeOfTravel) {
                if (moving === MovingDirection.RIGHT) {
                    calculateDisplace(angleOfLeftTravel);
                    moving = MovingDirection.LEFT;
                } else {
                    calculateDisplace(angleOfRightTravel);
                    moving = MovingDirection.RIGHT;
                }
            }

            // is the enemy off the bottom of the stage?
            if (sprite.y > stage.canvas.height) {
                this.stopMe();
                sprite.dispatchEvent(eventEnemySurvived);
            }

        }
    };






};
