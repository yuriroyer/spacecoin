class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('ship', 'assets/ship.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('leftButton', 'assets/leftButton.png');
        this.load.image('rightButton', 'assets/rightButton.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('enemyBullet', 'assets/enemyBullet.png');


    }

    create() {
        //add background para pegar na tela toda
        this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
        this.background.setOrigin(0, 0);

        this.ship = this.physics.add.sprite(195, 500, 'ship').setScale(0.5);
        this.ship.setScale(0.1);
        this.ship.setCollideWorldBounds(true);

        //pontuação
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });


        this.enemies = this.physics.add.group();
        this.enemyBullets = this.physics.add.group({
            defaultKey: 'enemyBullet',
            maxSize: 30
        });

        // Cria um inimigo a cada 2 segundos
        this.time.addEvent({
            delay: 2000, // milissegundos
            callback: this.createEnemy,
            callbackScope: this,
            loop: true
        });

        // Dispara um projétil a cada 2 segundo
        this.time.addEvent({
            delay: 200, // milissegundos
            callback: this.shootEnemyBullet,
            callbackScope: this,
            loop: true
        });



        // grupo de projéteis
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 30
        });

        // disparo automático de projéteis
        this.time.addEvent({
            delay: 200, // milissegundos
            callback: this.shootBullet,
            callbackScope: this,
            loop: true
        });

        // botões de controle
        this.leftButton = this.physics.add.sprite(50, this.game.config.height - 100, 'leftButton').setInteractive();
        this.rightButton = this.physics.add.sprite(this.game.config.width - 50, this.game.config.height - 100, 'rightButton').setInteractive();
        this.leftButton.setScale(0.3);
        this.rightButton.setScale(0.3);

        // eventos de toque
        this.leftButton.on('pointerdown', () => this.ship.setVelocityX(-200));
        this.rightButton.on('pointerdown', () => this.ship.setVelocityX(200));


        // Colisão entre os projéteis do jogador e os inimigos
        this.physics.add.collider(this.bullets, this.enemies, this.hitEnemy, null, this);

        // Colisão entre os projéteis do jogador e os projéteis do inimigo
        this.physics.add.collider(this.bullets, this.enemyBullets, this.hitBullet, null, this);
        // Colisão entre os projéteis do inimigo e o jogador
        this.physics.add.collider(this.enemyBullets, this.ship, this.hitPlayer, null, this);
    }

    //adiciona score
    addScore() {
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }

    hitPlayer(ship, enemyBullet) {
        ship.setActive(false);
        ship.setVisible(false);
        enemyBullet.setActive(false);
        enemyBullet.setVisible(false);

        // Pare a música quando o jogador é atingido
        this.sound.get('backgroundMusic').stop();

        // Aqui você pode adicionar código para terminar o jogo ou perder uma vida, por exemplo
        this.scene.start('EndGameScene', { score: this.score });
    }

    hitEnemy(bullet, enemy) {
        bullet.setActive(false);
        bullet.setVisible(false);
        enemy.setActive(false);
        enemy.setVisible(false);
        //adiciona score ao abater nave inimiga.
        this.addScore();
    }

    hitBullet(playerBullet, enemyBullet) {
        playerBullet.setActive(false);
        playerBullet.setVisible(false);
        enemyBullet.setActive(false);
        enemyBullet.setVisible(false);
    }

    createEnemy() {
        let x = Phaser.Math.Between(50, this.game.config.width - 50);
        let enemy = this.enemies.create(x, 0, 'enemy').setScale(0.1);
        enemy.setVelocityY(100);
    }

    shootEnemyBullet() {
        this.enemies.children.each((enemy) => {
            if (enemy.active) {
                let bullet = this.enemyBullets.get(enemy.x, enemy.y);
                if (bullet) {
                    bullet.setActive(true);
                    bullet.setVisible(true);
                    bullet.body.velocity.y = 400;
                }
            }
        }, this);
    }

    update() {
        // limpa os projéteis ao sair da tela
        this.bullets.children.each((bullet) => {
            if (bullet.active && bullet.y < 0) {
                bullet.setActive(false);
                bullet.setVisible(false);
            }
        }, this);


        this.enemyBullets.children.each((bullet) => {
            if (bullet.active && bullet.y > this.game.config.height) {
                bullet.setActive(false);
                bullet.setVisible(false);
            }
        }, this);
    }

    shootBullet() {
        let bullet = this.bullets.get(this.ship.x, this.ship.y);
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.velocity.y = -400;
        }
    }
}
