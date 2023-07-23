class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        // Define as variáveis de velocidade para o jogo
        this.velocidadeJogador = 200;
        this.velocidadeTiro = 400;
        this.velocidadeInimigo = 100;
        this.velocidadeTiroInimigo = 200;
        this.intervaloAparicaoInimigo = 2000; // em ms
        this.intervaloDisparo = 200; // em ms
        this.intervaloDisparoInimigo = 1000; // em ms
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

        // Cria um inimigo a cada 'intervaloAparicaoInimigo' milissegundos
        this.time.addEvent({
            delay: this.intervaloAparicaoInimigo,
            callback: this.createEnemy,
            callbackScope: this,
            loop: true
        });

        // Dispara um projétil inimigo a cada 'intervaloDisparoInimigo' milissegundos
        this.time.addEvent({
            delay: this.intervaloDisparoInimigo,
            callback: this.shootEnemyBullet,
            callbackScope: this,
            loop: true
        });

        // grupo de projéteis
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 30
        });

        // Dispara um projétil a cada 'intervaloDisparo' milissegundos
        this.time.addEvent({
            delay: this.intervaloDisparo,
            callback: this.shootBullet,
            callbackScope: this,
            loop: true
        });

        // botões de controle
        this.leftButton = this.physics.add.sprite(0, this.game.config.height, 'leftButton').setInteractive().setOrigin(0, 1);
        this.rightButton = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height, 'rightButton').setInteractive().setOrigin(0, 1);

        // Escalar os botões para caber 50% da largura da tela
        let scaleX = (0.5 * this.game.config.width) / this.leftButton.width;
        let scaleY = 100 / this.leftButton.height;
        this.leftButton.setScale(scaleX, scaleY);
        this.rightButton.setScale(scaleX, scaleY);

        // eventos de toque
        this.leftButton.on('pointerdown', () => this.ship.setVelocityX(-this.velocidadeJogador));
        this.rightButton.on('pointerdown', () => this.ship.setVelocityX(this.velocidadeJogador));

        // Colisão entre os projéteis do jogador e os inimigos
        this.physics.add.collider(this.bullets, this.enemies, this.hitEnemy, null, this);

        // Colisão entre os projéteis do jogador e os projéteis do inimigo
        this.physics.add.collider(this.bullets, this.enemyBullets, this.hitBullet, null, this);
        // Colisão entre os projéteis do inimigo e o jogador
        this.physics.add.collider(this.enemyBullets, this.ship, this.hitPlayer, null, this);
    }

    //adiciona score
    addScore() {
        this.score += 50;
        this.scoreText.setText('Score: ' + this.score);

        // Verifica se a pontuação é um múltiplo de 100
        if (this.score % 100 === 0) {
            // Se for, aumenta todas as velocidades em 20%
            this.velocidadeJogador *= 1.1;
            this.velocidadeTiro *= 1.2;
            this.velocidadeInimigo *= 1.1;
            this.velocidadeTiroInimigo *= 1.2;
            this.intervaloAparicaoInimigo *= 1.3; // em ms
            this.intervaloDisparo *= 1.5; // em ms
            this.intervaloDisparoInimigo *= 1.3; // em ms
        }
    }

    hitPlayer(ship, enemyBullet) {
        ship.setActive(false);
        ship.setVisible(false);
        enemyBullet.setActive(false);
        enemyBullet.setVisible(false);

        // Pare a música quando o jogador é atingido
        this.sound.get('backgroundMusic').stop();
        this.velocidadeJogador = 200;
        this.velocidadeTiro = 400;
        this.velocidadeInimigo = 100;
        this.velocidadeTiroInimigo = 200;
        this.intervaloAparicaoInimigo = 2000; // em ms
        this.intervaloDisparo = 200; // em ms
        this.intervaloDisparoInimigo = 1000; // em ms
        // Aqui você pode adicionar código para terminar o jogo ou perder uma vida, por exemplo
        this.scene.start('EndGameScene', { score: this.score });
    }

    hitEnemy(bullet, enemy) {
        bullet.destroy();
        enemy.destroy();
        //adiciona score ao abater nave inimiga.
        this.addScore();
    }

    hitBullet(playerBullet, enemyBullet) {
        playerBullet.destroy();
        enemyBullet.destroy();
    }

    createEnemy() {
        let x = Phaser.Math.Between(50, this.game.config.width - 50);
        let enemy = this.enemies.create(x, 0, 'enemy').setScale(0.1);
        enemy.setVelocityY(this.velocidadeInimigo);
    }

    shootEnemyBullet() {
        this.enemies.children.each((enemy) => {
            if (enemy.active) {
                let bullet = this.enemyBullets.get(enemy.x, enemy.y);
                if (bullet) {
                    bullet.setActive(true);
                    bullet.setVisible(true);
                    bullet.body.velocity.y = this.velocidadeTiroInimigo;
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
            bullet.body.velocity.y = -this.velocidadeTiro;
        }
    }
}
