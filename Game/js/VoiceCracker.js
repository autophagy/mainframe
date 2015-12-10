Mainframe.VoiceCracker = function (game) {

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

Mainframe.VoiceCracker.prototype = {

	create: function () {
		this.elementLayer = this.game.add.group();
        this.tutorialLayer = this.game.add.group();
		this.timerLayer = this.game.add.group();
		this.monitorLayer = this.game.add.group();
		this.monitorLayer.add(this.game.add.sprite(0,0,'atlas','General/monitor.png'));

        var t = '> man MIMIC';
		t += '\n\nNAME'
		t += '\n	MIMIC - Synthesiser for voice activated password cracking';
		t += '\n\nDESCRIPTION'
		t += '\n	Use the modulation dials to mimic the waveform of a known login.';

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
