MainframeGame.Firewall = function (game) {

	// Standard Layering

	this.elementLayer = null;
	this.timerLayer = null;
	this.monitorLayer = null;

	// Timer

	this.timerBlock = null;
	this.timerTime = null;
	this.timerStartTime = null;
	this.timeLimit = Phaser.Timer.SECOND * 20;

	// Firewall stuff
	this.gapSize = 150;
	this.rows = [];
	this.lastGapX = null;

	this.player = null;
	this.playerSpeed = 7;
	this.cursors = null;

	this.music = null;

	this.ready = false;

};

MainframeGame.Firewall.prototype = {

	create: function () {
		this.elementLayer = this.game.add.group();
		this.timerLayer = this.game.add.group();
		this.monitorLayer = this.game.add.group();
		this.monitorLayer.add(this.game.add.sprite(0,0,'atlas','General/monitor.png'));

		this.player = this.game.add.sprite(0, 425, 'atlas', 'Subroutines/General/player_skull.png');
		this.player.scale.setTo(0.5, 0.5);
		MainframeGame.centreSprite(this.player, this.game.width);

		this.cursors = this.game.input.keyboard.createCursorKeys();

		this.createRow(300, 370);
		this.lastGapX = 370;
		this.generateRow(120);
		this.generateRow(-60);

		MainframeGame.initTimer(this, false);

	},

	update: function () {

		if (this.ready)
		{
			// Update
			if(this.timerTime == null) {
				this.timerTime = this.game.time.now;
				this.timerStartTime = this.timerTime;
			}

			if(this.game.time.now - this.timerTime >= Phaser.Timer.SECOND)
			{
				this.timerTime = this.game.time.now;
				MainframeGame.incTimer(this, false);
			}

			// Player movement
			if (this.cursors.left.isDown)
			{
				if (this.player.x >= 35) {
					this.player.x -= this.playerSpeed;
				}
			}
			else if (this.cursors.right.isDown)
			{
				if (this.player.right <= 925.5) {
					this.player.x += this.playerSpeed;
				}
			}

			// Moves the bars. Although maybe tweening would be better?
			// Also destroys any bar and adds a new one if off screen
			for (var i = 0; i < this.rows.length; i++) {
				for (var x = 0; x < this.rows[i].length; x++) {
					this.rows[i][x].y += 3;
				}

				if (this.rows[i][0].y > this.game.height - 50) {
					for (var x = 0; x < this.rows[i].length; x++) {
						this.rows[i][x].destroy();
					}

					this.rows.splice(i, 1);

					this.generateRow(-50);

					// Un-increment the i pointer
					i -= 1;
				}


			}

		}
    },

    victory: function () {
		var victorySign = this.game.add.sprite(0, 200, 'subroutine_complete');
		this.timerLayer.add(victorySign);
		MainframeGame.centreSprite(victorySign, this.game.width);
		victorySign.animations.add('anim');
		victorySign.animations.play('anim', 16, false);
	},

	failure: function () {

	},

	generateRow: function(y) {
		var left = Math.floor(Math.random()*300);
		var right = Math.floor(Math.random()*300);

		this.lastGapX += left - right;

		// Bounds checking
		if (this.lastGapX < 45) {
			this.lastGapX = 45;
		}

		if (this.lastGapX + this.gapSize > 915) {
			this.lastGapX = 915 - this.gapSize;
		}

		this.createRow(y, this.lastGapX);
	},

	createRow: function (y, gapX) {
		var newRow = [];

		var gapLeft = this.game.add.sprite(gapX, y, 'atlas', 'Subroutines/Firewall/firewall_end_left.png');
		this.elementLayer.add(gapLeft);
		newRow.push(gapLeft);


		var gapRight = this.game.add.sprite(gapX + this.gapSize, y, 'atlas', 'Subroutines/Firewall/firewall_end_right.png');
		this.elementLayer.add(gapRight);
		newRow.push(gapRight);

		var newX = gapLeft.x;

		while (newX > 0) {
			newX -= 61;
			newRow.push(this.addBlock(newX, y));
		}

		newX = gapRight.x + 12;
		while (newX < this.game.width) {
			newX += 61;
			newRow.push(this.addBlock(newX, y));
		}

		this.rows.push(newRow);

	},

	addBlock: function (x, y) {
		var block = this.game.add.sprite(x, y, 'atlas', 'Subroutines/Firewall/firewall_block.png');
		this.elementLayer.add(block);
		return block;
	},

	incTimer: function () {
		var barWidth = 859;
		var percentage = (this.game.time.now - this.timerStartTime) / this.timeGoal;
		this.timerBlock.width = percentage*barWidth;

		if (percentage >= 1)
		{
			this.ready = false;
			this.victory();
		}
	}

};
