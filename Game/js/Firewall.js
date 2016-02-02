Mainframe.Firewall = function (game) {

	// Standard Layering

	this.elementLayer = null;
	this.tutorialLayer = null;
	this.timerLayer = null;
	this.monitorLayer = null;

	// Timer

	this.timerBlock = null;
	this.timerTime = null;
	this.timerStartTime = null;
	this.timeLimit = Phaser.Timer.SECOND * 20;

	// Firewall stuff
	this.gapSize = 150;
	this.rows = null;
	this.rowBounds = null;
	this.lastGapX = null;

	this.player = null;
	this.playerBounds = null;
	this.playerSpeed = 7;
	this.cursors = null;

	this.music = null;
	this.movementSound = null;

	this.ready = false;
};

Mainframe.Firewall.prototype = {

	create: function () {
		this.elementLayer = this.game.add.group();
		this.tutorialLayer = this.game.add.group();
		this.timerLayer = this.game.add.group();
		this.monitorLayer = this.game.add.group();
		this.monitorLayer.add(this.game.add.sprite(0,0,'atlas','General/monitor.png'));

		this.movementSound = this.add.audio('movement', 1, true);

		var t = '> man HOLEPUNCH';
		t += '\n\nNAME'
		t += '\n	HOLEPUNCH - Allows access through firewalls';
		t += '\n\nDESCRIPTION'
		t += '\n	Use the arrow keys to maneuver the payload through\n	the gaps in the Corp\'s firewall.';

		Mainframe.setupTutorial(this, t);
	},

	update: function () {

		if (this.ready)
		{
			// Update
			if(this.game.time.now - this.timerTime >= Phaser.Timer.SECOND)
			{
				this.timerTime = this.game.time.now;
				Mainframe.incTimer(this, false);
			}

			// Player movement
			if (this.cursors.left.isDown)
			{
				if (this.player.x >= 35) {
					this.player.x -= this.playerSpeed;
					this.playerBounds.x -= this.playerSpeed;
					this.movementSound.play();
				}
			}
			else if (this.cursors.right.isDown)
			{
				if (this.player.right <= 925.5) {
					this.player.x += this.playerSpeed;
					this.playerBounds.x += this.playerSpeed;
					this.movementSound.play();
				}
			}
			else {
				this.movementSound.stop();
			}

			// Moves the bars. Although maybe tweening would be better?
			// Also destroys any bar and adds a new one if off screen
			for (var i = 0; i < this.rows.length; i++) {
				for (var x = 0; x < this.rows[i].length; x++) {
					this.rows[i][x].y += 3;
				}

				this.rowBounds[i][0].y += 3;
				this.rowBounds[i][1].y += 3;

				if (this.rows[i][0].y > this.game.height - 50) {
					for (var x = 0; x < this.rows[i].length; x++) {
						this.rows[i][x].destroy();
					}

					this.rows.splice(i, 1);
					this.rowBounds.splice(i, 1);

					this.generateRow(-50);

					// Un-increment the i pointer
					i -= 1;
				}


			}

			// Check collisions
			for (var i = 0; i < this.rowBounds.length; i++) {
				if (Phaser.Rectangle.intersects(this.playerBounds, this.rowBounds[i][0]) || Phaser.Rectangle.intersects(this.playerBounds, this.rowBounds[i][1])) {
					this.ready = false;
					Mainframe.subroutineFailure(this);
				}
			}

		} else {
			this.movementSound.stop();
		}
    },

	setupGame: function () {
		this.player = this.game.add.sprite(0, 425, 'atlas', 'Subroutines/General/player_skull.png');
		this.player.scale.setTo(0.5, 0.5);
		Mainframe.centreSprite(this.player, this.game.width);
		this.elementLayer.add(this.player);

		// This crops the bounding box so that the edges are never above empty sprite space
		this.playerBounds = new Phaser.Rectangle(this.player.x + 11, this.player.y + 5, this.player.width - 22, this.player.height - 10);

		this.cursors = this.game.input.keyboard.createCursorKeys();

		this.rows = [];
		this.rowBounds = [];

		this.createRow(300, 370);
		this.lastGapX = 370;
		this.generateRow(120);
		this.generateRow(-60);
	},

	initGame: function () {
		Mainframe.initTimer(this, false);
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

		var x = newRow[newRow.length-1].x;
		var y = newRow[newRow.length-1].y;
		var width = gapLeft.right - x;
		var height = gapLeft.height;
		var leftRowRect = new Phaser.Rectangle(x+11, y+11, width-22, height-22);

		newX = gapRight.x + 12;
		while (newX < this.game.width) {
			newX += 61;
			newRow.push(this.addBlock(newX, y));
		}

		x = gapRight.x;
		y = gapRight.y;
		width = newRow[newRow.length-1].x - x;
		height = gapRight.height;
		var rightRowRect = new Phaser.Rectangle(x+11, y+11, width-22, height-22);

		this.rowBounds.push([leftRowRect,rightRowRect]);

		this.rows.push(newRow);

	},

	addBlock: function (x, y) {
		var block = this.game.add.sprite(x, y, 'atlas', 'Subroutines/Firewall/firewall_block.png');
		this.elementLayer.add(block);
		return block;
	},

};
