Mainframe.StackOverflow = function (game) {

	// Standard Layering

	this.elementLayer = null;
    this.tutorialLayer = null;
	this.timerLayer = null;
	this.monitorLayer = null;

	// Timer

	this.timerBlock = null;
	this.timerTime = null;
	this.timerStartTime = null;
	this.timeLimit = Phaser.Timer.SECOND * 60;

	this.music = null;

	this.ready = false;

};

Mainframe.StackOverflow.prototype = {

	create: function () {
		this.elementLayer = this.game.add.group();
        this.tutorialLayer = this.game.add.group();
		this.timerLayer = this.game.add.group();
		this.monitorLayer = this.game.add.group();
		this.monitorLayer.add(this.game.add.sprite(0,0,'atlas','General/monitor.png'));

        var t = '> man STACK_SMASHER';
		t += '\n\nNAME'
		t += '\n	STACK_SMASHER - Stack buffer overflow exploiter';
		t += '\n\nDESCRIPTION'
		t += '\n	Hold down space to start generating values in the stack buffer.';
        t += '\n	When the data reaches the return address area, release space to';
        t += '\n	jump to the next stack. Jump from 3 buffers to inject your';
        t += '\n	ICE-BREAK payload.';

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

		}

    },

    setupGame: function () {

    },

    initGame: function () {
        Mainframe.initTimer(this, true);
    }
	
};
