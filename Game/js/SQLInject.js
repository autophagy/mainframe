MainframeGame.SQLInject = function (game) {

	// Standard Layering

	this.elementLayer = null;
	this.timerLayer = null;
	this.monitorLayer = null;

	// Timer

	this.timerBlock = null;
	this.timerTime = null;
	this.timerStartTime = null;
	this.timeLimit = Phaser.Timer.SECOND * 20;

    this.player = null;
    this.playerSpeed = 10;
    this.playerBounds = null;
    this.cursors = null;

    this.blocks = [];
    this.blockBounds = [];

    this.databaseBounds = null;

    // Ball variables

	this.music = null;

	this.ready = false;

};

MainframeGame.SQLInject.prototype = {

	create: function () {
		this.elementLayer = this.game.add.group();
		this.timerLayer = this.game.add.group();
		this.monitorLayer = this.game.add.group();
		this.monitorLayer.add(this.game.add.sprite(0,0,'atlas','General/monitor.png'));

        this.generateBlocks();

        this.cursors = this.game.input.keyboard.createCursorKeys();

        MainframeGame.initTimer(this, true);

	},

	update: function () {

		if (this.ready)
		{
			if(this.game.time.now - this.timerTime >= Phaser.Timer.SECOND)
			{
				this.timerTime = this.game.time.now;
				MainframeGame.incTimer(this, true);
			}

            // Player movement
			if (this.cursors.left.isDown)
			{
				if (this.player.x >= 35) {
					this.player.x -= this.playerSpeed;
					//this.playerBounds.x -= this.playerSpeed;
				}
			}
			else if (this.cursors.right.isDown)
			{
				if (this.player.right <= 925.5) {
					this.player.x += this.playerSpeed;
					//this.playerBounds.x += this.playerSpeed;
				}
			}
		}

    },

    victory: function () {

	},

	failure: function () {

	},

    generateBlocks: function () {
        var xOffset = 37;
        var xGap = 172;
        var yOffset = 110;
        var yGap = 30;

        this.elementLayer.add(MainframeGame.centreSprite(this.game.add.sprite(0,80,'atlas', 'Subroutines/SQL_Injector/central_database.png'), this.game.width));

        for (var i = 1; i <= 3; i++) {
            for (var x = 0; x < 5; x++) {
                this.elementLayer.add(this.game.add.sprite(xOffset+(xGap*x),yOffset+(yGap*i),'atlas', 'Subroutines/SQL_Injector/tier_'+i+'_block.png'));
            }
        }

        this.player = MainframeGame.centreSprite(this.game.add.sprite(0,435,'atlas', 'Subroutines/SQL_Injector/player_paddle.png'), this.game.width);
        this.elementLayer.add(this.player);

        this.elementLayer.add(MainframeGame.centreSprite(this.game.add.sprite(0,390,'atlas', 'Subroutines/SQL_Injector/sql_injector_ball.png'), this.game.width));
    }
};
