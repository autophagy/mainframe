Mainframe.PacketSniffer = function (game) {

	// Standard Layering

	this.streamLayer = null;
	this.elementLayer = null;
    this.tutorialLayer = null;
	this.timerLayer = null;
	this.monitorLayer = null;

	// Timer

	this.timerBlock = null;
	this.timerTime = null;
	this.timerStartTime = null;
	this.timeLimit = Phaser.Timer.SECOND * 60;
	
	this.playerSkull = null;
	this.packetBar = null;
	this.sniffer = null;

	this.music = null;

	this.ready = false;
	this.enabled = false;

};

Mainframe.PacketSniffer.prototype = {

	create: function () {
		this.streamLayer = this.game.add.group();
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

		//Mainframe.setupTutorial(this, t);
		this.setupGame();
		this.initGame();
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
	
	 this.playerSkull = Mainframe.centreSprite(this.game.add.sprite(0,90,'atlas', 'Subroutines/General/player_skull.png'), this.game.width);
	 this.elementLayer.add(this.playerSkull);
	 this.elementLayer.add(Mainframe.centreSprite(this.game.add.sprite(0,170,'atlas', 'Subroutines/Packet_Sniffer/progress_bar.png'), this.game.width));
	 this.sniffer = Mainframe.centreSprite(this.game.add.sprite(0,210,'atlas', 'Subroutines/Packet_Sniffer/pipe.png'), this.game.width);
	 this.elementLayer.add(this.sniffer);

    },

    initGame: function () {
        Mainframe.initTimer(this, true);
    },
	
	disableSniffer: function () {
		this.enabled = false;
		this.sniffer.alpha = 0;
		this.playerSkull.alpha = 0;
		
		var errorSkull = this.game.add.sprite(this.playerSkull.x, this.playerSkull.y, 'skull_error');
		this.elementLayer.add(errorSkull);
    	errorSkull.animations.add('anim');
    	errorSkull.animations.play('anim', 32, false);
    	errorSkull.events.onAnimationComplete.add(function() {
			this.game.time.events.add(Phaser.Timer.SECOND * 4, function() {
				errorSkull.destroy();
				this.sniffer.alpha = 1;
				this.playerSkull.alpha = 1;
				this.enabled = true;
			}, this);
		}, this);
	}

};
