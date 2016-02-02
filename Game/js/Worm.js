Mainframe.Worm = function (game) {

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

	this.mazeBounds = [];
	this.goalBounds = null;

	this.player = null;
	this.playerSpeed = Phaser.Timer.QUARTER / 4;
	this.lastPlayerMove = null;
	this.playerBounds = [];
	this.cursors = [];

	this.music = null;
	this.movementSound = null;

	this.ready = false;

};

Mainframe.Worm.prototype = {

	create: function () {
		this.elementLayer = this.game.add.group();
		this.tutorialLayer = this.game.add.group();
		this.timerLayer = this.game.add.group();
		this.monitorLayer = this.game.add.group();
		this.monitorLayer.add(this.game.add.sprite(0,0,'atlas','General/monitor.png'));

		this.movementSound = this.add.audio('movement', 1, true);


		var t = '> man YOURDOOM';
		t += '\n\nNAME'
		t += '\n	YOURDOOM - Worm that targets specific Corp files';
		t += '\n\nDESCRIPTION'
		t += '\n	Guide the YourDoom worm using the arrow keys to the\n	infection vector. ';
		t += 'To prevent traces, you cannot cross\n	your own path!'

		Mainframe.setupTutorial(this, t);
	},

	update: function () {

		if (this.ready)
		{
			if(this.game.time.now - this.timerTime >= Phaser.Timer.SECOND)
			{
				this.timerTime = this.game.time.now;
				Mainframe.incTimer(this, true);
			}

			if ((this.game.time.now - this.lastPlayerMove) >= this.playerSpeed) {
				// Player movement
				if (this.cursors.left.isDown)
				{
					if(this.validMove(this.player.x - 10, this.player.y)) {
						this.movePlayer(this.player.x - 10, this.player.y);
					}
				}
				else if (this.cursors.right.isDown)
				{
					if(this.validMove(this.player.x + 10, this.player.y)) {
						this.movePlayer(this.player.x + 10, this.player.y);
					}
				}
				else if (this.cursors.up.isDown)
				{
					if(this.validMove(this.player.x, this.player.y - 10)) {
						this.movePlayer(this.player.x, this.player.y - 10);
					}
				}
				else if (this.cursors.down.isDown)
				{
					if(this.validMove(this.player.x, this.player.y + 10)) {
						this.movePlayer(this.player.x, this.player.y + 10);
					}
				} else {
					this.movementSound.stop();
				}

				this.lastPlayerMove = this.game.time.now;
			}

			if (Phaser.Rectangle.intersects(this.playerBounds[this.playerBounds.length - 1], this.goalBounds)) {
				this.ready = false;
				Mainframe.subroutineVictory(this);
			}
		} else {
			this.movementSound.stop();
		}

    },

	setupGame: function () {
		this.mazeBounds = [];
		this.goalBounds = null;

		this.player = null;
		this.lastPlayerMove = null;
		this.playerBounds = [];
		this.cursors = [];

		var outline = Mainframe.centreSprite(this.game.add.sprite(0,95,'atlas','Subroutines/Worm/worm_outline.png'), this.game.width);
		outline.height -= 34;
		this.elementLayer.add(outline);

		this.generateMaze();
		this.movePlayer(59,114);

		this.cursors = this.game.input.keyboard.createCursorKeys();

		this.lastPlayerMove = this.game.time.now;
	},

	initGame: function () {
		Mainframe.initTimer(this, true);
	},

	validMove: function (newX, newY) {
		var newBound = new Phaser.Rectangle(newX+12, newY+12, 8, 8);

		// Player trail collision
		for (var i = 0; i < this.playerBounds.length; i++) {
			if (Phaser.Rectangle.intersects(newBound, this.playerBounds[i])) {
				this.movementSound.stop();
				return false;
			}
		}

		// Maze wall collision
		for (var i = 0; i < this.mazeBounds.length; i++) {
			if (Phaser.Rectangle.intersects(newBound, this.mazeBounds[i])) {
				this.movementSound.stop();
				return false;
			}
		}

		if (!this.movementSound.isPlaying) this.movementSound.play();
		var distance = Math.sqrt(Math.pow(newX - this.goalBounds.x, 2) + Math.pow(newY - this.goalBounds.y, 2));
		this.movementSound._sound.playbackRate.value = 1 + (1 - (distance/850));
		return true;
	},

	movePlayer: function(newX, newY) {
		this.player = this.game.add.sprite(newX,newY,'atlas','Subroutines/Worm/worm_player.png');
		this.playerBounds.push(new Phaser.Rectangle(newX+12, newY+12, 8, 8))
		this.elementLayer.add(this.player);
	},

	generateMaze: function () {
		var width = 14;
		var height = 6;
		var cells = [];
		var carvedCells = [];

		// Choose upper left cell
		cells.push([0,0]);
		this.addCell(0,0, carvedCells);

		var index, x, y;

		while (cells.length != 0) {
			index = this.getCellIndex(cells.length);
			x = cells[index][0];
			y = cells[index][1];

			//Randomly choose a direction
			var dirs = ['N', 'E', 'S', 'W'];
			dirs = Mainframe.shuffleArray(dirs);

			var validDir = false;

			for (var i=0; i < dirs.length; i++) {
				var dirX = 0;
				var dirY = 0;
				switch(dirs[i]) {
					case 'N':
						dirY = -1;
						break;
					case 'E':
						dirX = 1;
						break;
					case 'S':
						dirY = 1;
						break;
					case 'W':
						dirX = -1;
				}
				var newX = x + dirX;
				var newY = y + dirY;

				if (newX >= 0 && newY >= 0 && newX < width && newY < height && this.notInMaze([newX*2, newY*2],carvedCells)) {
					cells.push([newX,newY]);
					this.carveRoute(x, y, dirX, dirY, carvedCells);
					validDir = true;
					break;
				}
			}

			if (!validDir) {
				cells.splice(index, 1);

			}

		}
		this.renderMaze(carvedCells);
	},

	getCellIndex: function (cellsLength) {
		if (Math.random() <= 0.5) {
			return cellsLength - 1;
		} else {
			return Math.floor(Math.random()*cellsLength);
		}
	},

	addCell: function (x, y, cells) {
		cells.push([x*2,y*2]);
	},

	carveRoute: function (x, y, dirX, dirY, cells) {
		cells.push([x*2+dirX, y*2+dirY]);
		this.addCell(x+dirX, y+dirY, cells);
	},

	notInMaze: function (item, array) {
		for (var i = 0; i < array.length; i++) {
			if (array[i][0] == item[0] && array[i][1] == item[1]) {
				return false;
			}
		}
		return true;
	},

	renderMaze(maze) {
		var offsetX = 48;
		var offsetY = 103;

		for (var x = 0; x < 27; x++) {
			for (var y = 0; y < 11; y++) {
				if(this.notInMaze([x,y],maze)) {
					this.elementLayer.add(this.game.add.sprite((x * 30) + offsetX, (y * 30) + offsetY,'atlas','Subroutines/Worm/worm_wall.png'));
					this.mazeBounds.push(new Phaser.Rectangle((x*30)+offsetX+13, (y*30)+offsetY+13, 28, 28));
				}
			}
		}

		for (var i = 0; i < 10; i++) {
			this.elementLayer.add(this.game.add.sprite((27*30) + offsetX, (i*30) + offsetY, 'atlas', 'Subroutines/Worm/worm_wall.png'));
			this.mazeBounds.push(new Phaser.Rectangle((27*30)+offsetX+13, (i*30)+offsetY+13, 28, 28));
		}

		//Walls
		this.mazeBounds.push(new Phaser.Rectangle(offsetX+3, offsetY+3, 8, 348));
		this.mazeBounds.push(new Phaser.Rectangle(offsetX+853, offsetY+3, 8, 348));
		this.mazeBounds.push(new Phaser.Rectangle(offsetX+3, offsetY+3, 858, 8));
		this.mazeBounds.push(new Phaser.Rectangle(offsetX+3, offsetY+343, 858, 8));

		this.goalBounds = new Phaser.Rectangle((27*30)+offsetX+13, (i*30)+offsetY+13, 28, 28);
		this.elementLayer.add(this.game.add.sprite((27*30) + offsetX, (10*30) + offsetY, 'atlas', 'Subroutines/Worm/worm_goal.png'))
	}
};
