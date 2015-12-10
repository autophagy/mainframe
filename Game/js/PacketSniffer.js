Mainframe.PacketSniffer = function (game) {

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

Mainframe.PacketSniffer.prototype = {

	create: function () {
		this.elementLayer = this.game.add.group();
        this.tutorialLayer = this.game.add.group();
		this.timerLayer = this.game.add.group();
		this.monitorLayer = this.game.add.group();
		this.monitorLayer.add(this.game.add.sprite(0,0,'atlas','General/monitor.png'));

        var t = '> man CONNSHARK';
		t += '\n\nNAME';
		t += '\n	CONNSHARK - Packet and traffic analyzer';
		t += '\n\nDESCRIPTION';
		t += '\n	Press spacebar to to capture key packets while they are in your';
        t += '\n	sniffers buffer. Assemble enough key packets to break the ICE.';
        t += '\n	Capturing non-key packets will lock up the sniffer and require';
        t += '\n	it to be rebooted.';

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
