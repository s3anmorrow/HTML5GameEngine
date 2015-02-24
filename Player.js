var Player = function(){

    // local references to global variables
    var stage = window.stage;
    var assetmanager = window.assetManager;

    // custom events
    var eventPlayerHit = new createjs.Event("onPlayerHit", true);
    var eventPlayerEnergize = new createjs.Event("onPlayerEnergize", true);
    var eventPlayerKilled = new createjs.Event("onPlayerKilled", true);

    // private property variables
    var speed = GameSettings.playerSpeed;
    var moving = MovingDirection.STOPPED;
    var alive = false;
    var hitPoints = 0;

    // get sprite and setup
    var sprite = assetManager.getSprite("GameAssets");
    sprite.scaleX = 1;
    sprite.gotoAndStop("playerMoving");
    sprite.regX = sprite.getBounds().width / 2;
    sprite.regY = sprite.getBounds().height / 2;

    // determine left and right stage bounds
    var stageLeftBound = sprite.getBounds().width / 2;
    var stageRightBound = stage.canvas.width - (sprite.getBounds().width / 2);

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

    this.getHitPoints = function() {
        return hitPoints;
    };

    // --------------------------------------------------- public methods
    this.startMe = function() {
        alive = true;
        sprite.scaleX = 1;
        sprite.gotoAndStop("playerMoving");
        if (GameSettings.idleAnimation) sprite.gotoAndPlay("playerIdle");
        hitPoints = GameSettings.hitPoints;
        sprite.x = 300;
        sprite.y = 500;
        stage.addChild(sprite);
    };

    this.stopMe = function() {
        if (moving === MovingDirection.STOPPED) return;
        sprite.stop();
        if (GameSettings.idleAnimation) sprite.gotoAndPlay("playerIdle");
        moving = MovingDirection.STOPPED;
        //stage.removeChild(sprite);
    };

    this.moveLeft = function() {
        if (moving === MovingDirection.LEFT) return;
        sprite.play();
        if (GameSettings.idleAnimation) sprite.gotoAndPlay("playerMoving");
        moving = MovingDirection.LEFT;
    };

    this.moveRight = function() {
        if (moving === MovingDirection.RIGHT) return;
        sprite.play();
        if (GameSettings.idleAnimation) sprite.gotoAndPlay("playerMoving");
        moving = MovingDirection.RIGHT;
    };

    this.hitMe = function() {
        if (alive) {
            hitPoints--;
            sprite.dispatchEvent(eventPlayerHit);
            if (hitPoints <= 0) {
                this.killMe();
            } else {
                // player not killed - nudge player up a bit in shock
                sprite.y = sprite.y - 10;
            }
        }
    };

    this.energizeMe = function() {
        if (alive) {
            hitPoints++;
            if (hitPoints > GameSettings.hitPoints) hitPoints = GameSettings.hitPoints;
            sprite.dispatchEvent(eventPlayerHit);
        }
    }

    this.killMe = function() {
        alive = false;
        this.stopMe();
        sprite.gotoAndPlay("playerDead");
        sprite.addEventListener("animationend", onKilled);
    };

    this.updateMe = function() {
        if (alive) {
            if (moving === MovingDirection.LEFT) {
                // moving left
                sprite.scaleX = 1;
                sprite.x = sprite.x - speed;
                if (sprite.x < stageLeftBound) {
                    sprite.x = stageLeftBound;
                }
            } else if (moving === MovingDirection.RIGHT) {
                // moving right
                sprite.scaleX = -1;
                sprite.x = sprite.x + speed;
                if (sprite.x > stageRightBound) {
                    sprite.x = stageRightBound;
                }
            }

            // bump player back down again (if nudged up)
            if (sprite.y < 500) {
                sprite.y = sprite.y + 5;
            }
        }
    };

    // -------------------------------------------------- event handlers
    function onKilled(e) {
        sprite.stop();
        sprite.removeEventListener("animationend", onKilled);
        sprite.dispatchEvent(eventPlayerKilled);
        stage.removeChild(sprite);
    }

};

var MovingDirection = {
    "STOPPED":0,
    "LEFT":1,
    "RIGHT":2
};
