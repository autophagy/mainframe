Mainframe.BotnetDDoS = function (game) {

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

	// Bots
	this.bots = null;
	this.botBandwidthLimit = 100;
	this.botPacketSize = 40;

	// Server
	this.serverLoadBar = 0;
	this.serverLoad = null;
	this.serverLoadGoal = 1300;
	this.serverLastRecieved = null;
	this.serverPacketSize = 60;

	this.music = null;

	this.ready = false;

};

Mainframe.BotnetDDoS.prototype = {

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

			for (var i = 0; i < this.bots.length; i++) {
				this.bots[i].decBandwidth();
			}

			this.serverLoad -= Math.pow(1.1, (this.game.time.now - this.serverLastRecieved)/100) - 1;
			this.serverLoad = this.serverLoad < 0 ? 0 : this.serverLoad;
			this.serverLoadBar.width = (this.serverLoad / this.serverLoadGoal)*437;
			if (this.serverLoad >= this.serverLoadGoal) {
				this.ready = false;
				this.serverLoad = this.serverLoadGoal
				this.serverLoadBar.width = 437;
				Mainframe.subroutineVictory(this);
			}

		}

    },

    setupGame: function () {
		this.bots = [];
        for (var i = 0; i < 5; i++) {
			var bot = new Bot(this, 60+(174*i), 320, i+1);
			this.bots.push(bot);
        }

        this.elementLayer.add(Mainframe.centreSprite(this.game.add.sprite(0,100,'atlas', 'Subroutines/DDOS/server.png'), this.game.width));
        this.elementLayer.add(Mainframe.centreSprite(this.game.add.bitmapText(0,80,'white_font', 'SERVER', 30), this.game.width));

		key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
		key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
		key3 = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
		key4 = this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
		key5 = this.game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
		key1.onDown.add(function () { this.sendPacket(0); }, this);
		key2.onDown.add(function () { this.sendPacket(1); }, this);
		key3.onDown.add(function () { this.sendPacket(2); }, this);
		key4.onDown.add(function () { this.sendPacket(3); }, this);
		key5.onDown.add(function () { this.sendPacket(4); }, this);

		this.serverLoadBar = this.game.add.sprite(262,214,'atlas', 'Subroutines/General/trace_bar_full.png');
		this.serverLoadBar.height = 11;
		this.serverLoadBar.width = 0;
		this.elementLayer.add(this.serverLoadBar);
		this.serverLastRecieved = this.game.time.now;

    },

    initGame: function () {
        Mainframe.initTimer(this, true);
    },

	sendPacket: function (botNum) {
		this.bots[botNum].sendPacket();
	}
};

var Bot = (function () {
    function Bot(context, x, y, num) {
        this.context = context;
        this.sprite = context.game.add.sprite(x,y,'atlas', 'Subroutines/DDOS/online_bot.png');
		context.elementLayer.add(this.sprite);

		this.disabledSprite = null;
        this.bandwidth = 0;
		this.enabled = true;

        this.bandwidthBar = context.game.add.sprite(x+40,y+95,'atlas', 'Subroutines/General/trace_bar_full.png');
		context.elementLayer.add(this.bandwidthBar);
		this.bandwidthBar.width = 0;
		this.bandwidthBar.height = 4;

		this.botText = context.game.add.bitmapText(x+38,y+110,'green_font', 'BOT'+num, 30);

        this.timeSinceSent = context.game.time.now;
    }

    Bot.prototype.sendPacket = function () {
		if (this.enabled && this.context.ready) {
			this.timeSinceSent = this.context.game.time.now;
			this.bandwidth += this.context.botPacketSize;

			var packet = this.context.game.add.sprite(this.sprite.x+52, this.sprite.y, 'atlas', 'Subroutines/DDOS/packet.png');
			this.context.elementLayer.add(packet);
			var sendPacket = this.context.game.add.tween(packet);
			sendPacket.to({ x: this.context.game.width/2, y: 150}, 200, Phaser.Easing.Linear.In);
			sendPacket.start();
			sendPacket.onComplete.add( function() {
				packet.destroy();
				this.context.serverLastRecieved = this.context.game.time.now;
				this.context.serverLoad += this.context.serverPacketSize;
			}, this);

			if (this.bandwidth / this.context.botBandwidthLimit >= 1)
			{
				this.disable();
			}
		}
    };

    Bot.prototype.decBandwidth = function () {
        this.bandwidth -= Math.pow(1.1, (this.context.game.time.now - this.timeSinceSent)/1000) - 1;
		this.bandwidth = this.bandwidth < 0 ? 0 : this.bandwidth;
		this.refreshBandwidth();
    };

	Bot.prototype.refreshBandwidth = function () {
		this.bandwidthBar.width = (this.bandwidth / this.context.botBandwidthLimit)*85;
	};

    Bot.prototype.disable = function () {
		this.enabled = false;
		this.disabledSprite = this.context.game.add.sprite(this.sprite.x, this.sprite.y, 'bot_offline');
    	this.context.elementLayer.add(this.disabledSprite);
		this.sprite.alpha = 0;
		this.botText.alpha = 0;
		this.bandwidthBar.alpha = 0;
    	this.disabledSprite.animations.add('anim');
    	this.disabledSprite.animations.play('anim', 32, false);
    	this.disabledSprite.events.onAnimationComplete.add(function() {
			this.context.game.time.events.add(Phaser.Timer.SECOND * 7, function() {
				this.disabledSprite.destroy();
				this.disabledSprite =this. context.game.add.sprite(this.sprite.x, this.sprite.y, 'bot_online');
		    	this.context.elementLayer.add(this.disabledSprite);
		    	this.disabledSprite.animations.add('anim');
		    	this.disabledSprite.animations.play('anim', 32, false);
				this.disabledSprite.events.onAnimationComplete.add(function() {
					this.disabledSprite.destroy();
					this.sprite.alpha = 1;
					this.botText.alpha = 1;
					this.bandwidthBar.alpha = 1;
					this.bandwidth = 0;
					this.refreshBandwidth();
					this.enabled = true;
				}, this);
			}, this);
		}, this);


    };
    return Bot;
})();
