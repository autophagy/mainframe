MainframeGame.BotnetDDoS = function (game) {

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

	this.music = null;

	this.ready = false;

};

MainframeGame.BotnetDDoS.prototype = {

	create: function () {
		this.elementLayer = this.game.add.group();
        this.tutorialLayer = this.game.add.group();
		this.timerLayer = this.game.add.group();
		this.monitorLayer = this.game.add.group();
		this.monitorLayer.add(this.game.add.sprite(0,0,'atlas','General/monitor.png'));

        var t = '> man SWARMNET';
		t += '\n\nNAME'
		t += '\n	SWARMNET - Remote botnet with DDoS capabilities';
		t += '\n\nDESCRIPTION'
		t += '\n	Use numeric keys 1-5 to send a packet from a host in your botnet.';
        t += '\n	Send enough packets at the target server to knock it offline.';
        t += '\n	Sending packets too quickly will result in your bandwidth being';
        t += '\n	reached, and it will be temporarily disabled';

		MainframeGame.setupTutorial(this, t);
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

    setupGame: function () {
        for (var i = 0; i < 5; i++) {
            this.game.add.sprite(60+(174*i),320,'atlas', 'Subroutines/DDOS/online_bot.png');
            this.game.add.bitmapText(98+(174*i),430,'green_font', 'BOT'+(i+1), 30);
        }

        MainframeGame.centreSprite(this.game.add.sprite(0,100,'atlas', 'Subroutines/DDOS/server.png'), this.game.width);
        MainframeGame.centreSprite(this.game.add.bitmapText(0,80,'white_font', 'SERVER', 30), this.game.width);

    },

    initGame: function () {
        MainframeGame.initTimer(this, true);
    },

    victory: function () {

	},

	failure: function () {

	}
};
