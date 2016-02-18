Mainframe.SQLInject = function(game) {

  // Standard Layering

  this.elementLayer = null;
  this.tutorialLayer = null;
  this.timerLayer = null;
  this.monitorLayer = null;

  // Timer

  this.timerBlock = null;
  this.timerTime = null;
  this.timerStartTime = null;
  this.timeLimit = Phaser.Timer.SECOND * 30;

  this.player = null;
  this.playerSpeed = 10;
  this.playerBounds = null;
  this.cursors = null;

  this.blocks = [];
  this.blockBounds = [];
  this.wallBounds = [];
  this.failureBounds = null;

  this.injection = null;
  this.injectionBounds = null;
  this.injectionVelocity = null;

  this.databaseBounds = null;

  this.music = null;
  this.paddleHitSound = null;
  this.blockHitSound = null;

  this.ready = false;

};

Mainframe.SQLInject.prototype = {

  create: function() {
    this.elementLayer = this.game.add.group();
    this.tutorialLayer = this.game.add.group();
    this.timerLayer = this.game.add.group();
    this.monitorLayer = this.game.add.group();
    this.monitorLayer.add(this.game.add.sprite(0, 0, 'atlas', 'General/monitor.png'));

    var t = '> man DB_BREAKER';
    t += '\n\nNAME'
    t += '\n  DB_BREAKER - SQL injection script';
    t += '\n\nDESCRIPTION'
    t += '\n  Control the bar with left and right keys. Keep'
    t += '\n  knocking away rows with the SQL injection until you'
    t += '\n  can hit the central database.';

    Mainframe.setupTutorial(this, t);
  },

  update: function() {

    if (this.ready) {
      if (this.game.time.now - this.timerTime >= Phaser.Timer.SECOND) {
        this.timerTime = this.game.time.now;
        Mainframe.incTimer(this, true);
      }

      // Player movement
      if (this.cursors.left.isDown) {
        if (this.player.x >= 35) {
          this.player.x -= this.playerSpeed;
          this.playerBounds.x -= this.playerSpeed;
        }
      } else if (this.cursors.right.isDown) {
        if (this.player.right <= 925.5) {
          this.player.x += this.playerSpeed;
          this.playerBounds.x += this.playerSpeed;
        }
      }

      this.checkCollisions();

      this.injection.x = this.injection.x + this.injectionVelocity.x;
      this.injection.y = this.injection.y + this.injectionVelocity.y;
      this.injectionBounds.x = this.injectionBounds.x + this.injectionVelocity.x;
      this.injectionBounds.y = this.injectionBounds.y + this.injectionVelocity.y;
    }

  },

  setupGame: function() {
    this.generateBlocks();
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.paddleHitSound = this.add.audio('paddle_hit');
    this.blockHitSound = this.add.audio('block_hit');
  },

  initGame: function() {
    Mainframe.initTimer(this, true);
  },

  generateBlocks: function() {
    var xOffset = 37;
    var xGap = 172;
    var yOffset = 110;
    var yGap = 30;

    var databaseSprite = Mainframe.centreSprite(this.game.add.sprite(0, 80, 'atlas', 'Subroutines/SQL_Injector/central_database.png'), this.game.width);
    this.elementLayer.add(databaseSprite);
    this.databaseBounds = new Phaser.Rectangle(databaseSprite.x + 13, databaseSprite.y + 13, databaseSprite.width - 26, databaseSprite.height - 26);

    this.blockBounds = [];
    this.blocks = [];

    for (var i = 1; i <= 3; i++) {
      for (var x = 0; x < 5; x++) {
        var block = this.game.add.sprite(37 + (172 * x), 110 + (30 * i), 'atlas', 'Subroutines/SQL_Injector/tier_' + i + '_block.png');
        this.elementLayer.add(block);
        this.blocks.push(block);
        this.blockBounds.push(new Phaser.Rectangle(50 + (172 * x), 123 + (30 * i), 170, 28));
      }
    }

    this.wallBounds[0] = new Phaser.Rectangle(38, 0, 10, this.game.height);
    this.wallBounds[1] = new Phaser.Rectangle(this.game.width - 50, 0, 10, this.game.height);
    this.failureBounds = new Phaser.Rectangle(0, this.game.height - 60, this.game.width, 10);

    this.player = Mainframe.centreSprite(this.game.add.sprite(0, 435, 'atlas', 'Subroutines/SQL_Injector/player_paddle.png'), this.game.width);
    this.elementLayer.add(this.player);
    this.playerBounds = new Phaser.Rectangle(this.player.x + 13, this.player.y + 13, this.player.width - 26, this.player.height - 26);

    this.injection = Mainframe.centreSprite(this.game.add.sprite(0, 390, 'atlas', 'Subroutines/SQL_Injector/sql_injector_ball.png'), this.game.width);
    this.elementLayer.add(this.injection);
    this.injectionBounds = new Phaser.Rectangle(this.injection.x + 13, this.injection.y + 13, this.injection.width - 26, this.injection.height - 26);
    this.injectionVelocity = new Phaser.Point(Math.floor(Math.random() * 3) + 1, -3);

  },

  checkCollisions: function() {
    // Check block collisions
    for (var i = 0; i < this.blockBounds.length; i++) {
      if (Phaser.Rectangle.intersects(this.injectionBounds, this.blockBounds[i])) {
        this.injectionVelocity.y = this.injectionVelocity.y * -1;
        this.blocks[i].destroy();
        this.blocks.splice(i, 1);
        this.blockBounds.splice(i, 1);
        this.blockHitSound.play();
        this.blockHitSound._sound.playbackRate.value = 1 + (Math.random() * 0.2);
        break;
      }
    }

    // Check wall collisions
    if (Phaser.Rectangle.intersects(this.injectionBounds, this.wallBounds[0]) || Phaser.Rectangle.intersects(this.injectionBounds, this.wallBounds[1])) {
      this.injectionVelocity.x = this.injectionVelocity.x * -1;
    }

    // Check paddle bounds
    if (Phaser.Rectangle.intersects(this.injectionBounds, this.playerBounds)) {
      this.injectionVelocity.y = this.injectionVelocity.y * -1;
      this.injectionVelocity.x = this.injectionVelocity.x + ((this.injectionBounds.x + (this.injectionBounds.width / 2)) - (this.playerBounds.x + (this.playerBounds.width / 2))) / 10;
      this.paddleHitSound.play();
      this.paddleHitSound._sound.playbackRate.value = 1 + (Math.random() * 0.2);
    }

    // Check fail collisions
    if (Phaser.Rectangle.intersects(this.injectionBounds, this.failureBounds)) {
      this.ready = false;
      Mainframe.subroutineFailure(this);
    }

    // Check victory collision
    if (Phaser.Rectangle.intersects(this.injectionBounds, this.databaseBounds)) {
      this.ready = false;
      Mainframe.subroutineVictory(this);
    }
  }
};
