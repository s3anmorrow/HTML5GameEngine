// a collection of game setting variables to mess with :)
var GameSettings = {

    // the framerate of the game - speeds or slows down the whole game
    "frameRate":30,
    // the speed of the player
    "playerSpeed":6,
    // the speed of the bullets
    "bulletSpeed":8,
    // the number of bullets allowed to be shot at one time at the start of the game
    "bulletMaxAtStart":3,
    // the maximum number of bullets allowed to be shot at one time EVER in the game
    "bulletMaxForGame":8,
    // the number of hitPoints the player starts with - hitPoints are taken away when a enemy gets away OR when the player touches an enemy
    "hitPoints":3,
    // the number of kills required to gain back a hitPoint
    "killsPerHitPoint":5,
    // how many seconds between adding enemies to the game at the start?
    "enemyFrequency":3,
    // the number of kills required to level up
    "killsPerLevel":8,
    // hit points bar color
    "hitPointsBarColor":"#FFCC33",

    // sound effects
    "SoundEnemyKilled":"whonk",
    "SoundPlayerHit":"boing",
    "SoundPlayerEnergize":"energize",
    "SoundPlayerKilled":"boing",
    "SoundEnemySurvived":"metalShard",
    "SoundStartGame":"powerUp",
    "SoundGameOver":"comeon",
    "SoundFireBullet":"shoot"

};
