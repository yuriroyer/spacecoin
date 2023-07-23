class EndGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndGameScene' });
    }

    init(data) {
        this.score = data.score;
    }

    create() {
        let gameOverText = this.add.text(
            this.cameras.main.centerX, 
            this.cameras.main.centerY - 50, 
            `Game Over\nScore: ${this.score}`, 
            { font: '50px Arial', fill: '#ffffff', align: 'center' }
        )
        .setOrigin(0.5);

        let replayButton = this.add.text(
            this.cameras.main.centerX, 
            this.cameras.main.centerY + 50, 
            'Play Again', 
            { font: '50px Arial', fill: '#ffffff' }
        )
        .setOrigin(0.5)
        .setInteractive();

        replayButton.on('pointerdown', () => {
            // Aqui começamos a tocar a música novamente
            this.sound.get('backgroundMusic').play();
            this.scene.start('GameScene');
        });
    }
}
