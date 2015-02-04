var Bullet = function() {

    // local references to global variables
    var stage = window.stage;
    var assetmanager = window.asserManager;

    // custom events
    //var eventPlayerKilled = new createjs.Event("onPlayerKilled", true);

    // public properties for objectPool use
    this.type = "Bullet";
	this.used = false;
	this.poolIndex = -1;


};
