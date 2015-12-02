MainframeGame.Firewall = function (game) {

	// Standard Layering

	this.elementLayer = null;
	this.timerLayer = null;
	this.monitorLayer = null;
	
	// Timer
	
	this.timerBlock = null;
	this.timerTime = null;
	this.timerStartTime = null;
	this.timeGoal = Phaser.Timer.SECOND * 20;
	
	this.music = null;
	
	this.ready = false;

};

MainframeGame.Firewall.prototype = {

	create: function () {
		this.elementLayer = this.game.add.group();
		this.timerLayer = this.game.add.group();
		this.monitorLayer = this.game.add.group();
		this.monitorLayer.add(this.game.add.sprite(0,0,'atlas','General/monitor.png'));

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
				this.incTimer();
			}
		}

    },

    victory: function () {				
		
	},
	
	failure: function () {
		
	},
	
	initTimer: function (context) {
		var timerBar = this.game.add.sprite(0, 22, 'trace_detected');
		this.timerLayer.add(timerBar);
		centreSprite(timerBar, this.game.width);
		timerBar.animations.add('anim');		
		timerBar.animations.play('anim', 16, false);
		timerBar.events.onAnimationComplete.add(function() {
				this.ready = true;
				//this.music = this.add.audio('subroutine_rush');
				//this.music.play();
			}, this);
		this.timerBlock = this.game.add.sprite(10,55,'atlas', 'Subroutines/General/trace_bar_full.png');
		centreSprite(this.timerBlock, this.game.width);
		this.timerLayer.add(this.timerBlock);
		
		this.timerBlock.width = 0;	
	},
	
	incTimer: function () {
		var barWidth = 859;
		var percentage = (this.game.time.now - this.timerStartTime) / this.timeLimit;
		this.timerBlock.width = percentage*barWidth;	

		if (percentage >= 1)
		{
			this.ready = false;
			this.failure();
		}
	}

};
