// game.js
let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
        }
    },
    scene: [MenuScene, GameScene, EndGameScene],
};

let game = new Phaser.Game(config);
