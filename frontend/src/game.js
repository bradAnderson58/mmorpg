
import Phaser from 'phaser'

var game = new Phaser.Game(24*32, 17*32, Phaser.AUTO, document.getElementById('game'));


var Game = {};

Game.init = function() {
    game.stage.disbaleVisibilityChange = true;
};