// MenuScene.js
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.audio('backgroundMusic', 'assets/backgroundMusic.mp3');
    }

    create() {
        this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true });

        let playButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Play', { font: '50px Arial', fill: '#ffffff' }
        )
        .setOrigin(0.5)
        .setInteractive();

        playButton.on('pointerdown', () => {
            if (this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
            this.backgroundMusic.play();
            this.scene.start('GameScene');
        });
    }
}
