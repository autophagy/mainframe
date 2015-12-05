MainframeGame.Worm = function (game) {

	// Standard Layering

	this.elementLayer = null;
	this.timerLayer = null;
	this.monitorLayer = null;

	// Timer

	this.timerBlock = null;
	this.timerTime = null;
	this.timerStartTime = null;
	this.timeLimit = Phaser.Timer.SECOND * 20;

	this.music = null;

	this.ready = false;

};

MainframeGame.Worm.prototype = {

	create: function () {
		this.elementLayer = this.game.add.group();
		this.timerLayer = this.game.add.group();
		this.monitorLayer = this.game.add.group();
		this.monitorLayer.add(this.game.add.sprite(0,0,'atlas','General/monitor.png'));

		var outline = MainframeGame.centreSprite(this.game.add.sprite(0,95,'atlas','Subroutines/Worm/worm_outline.png'), this.game.width);
		outline.height -= 34;
		this.elementLayer.add(outline);

		this.generateMaze();
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
		}

    },

    victory: function () {

	},

	failure: function () {

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
			dirs = MainframeGame.shuffleArray(dirs);

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
				}
			}
		}

		for (var i = 0; i < 10; i++) {
			this.elementLayer.add(this.game.add.sprite((27*30) + offsetX, (i*30) + offsetY, 'atlas', 'Subroutines/Worm/worm_wall.png'));
		}

		this.elementLayer.add(this.game.add.sprite((27*30) + offsetX, (10*30) + offsetY, 'atlas', 'Subroutines/Worm/worm_goal.png'))
	}
};
