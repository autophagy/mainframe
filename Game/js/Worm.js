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

	}
};
