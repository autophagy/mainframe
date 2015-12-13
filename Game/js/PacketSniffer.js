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
	this.timeLimit = Phaser.Timer.SECOND * 300;
	
	this.playerSkull = null;
	this.packetBar = null;
	this.sniffer = null;
	
	this.packets = null;

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
			
			for (var i = 0; i < this.packets.length; i++) {
				this.packets[i].moveStream();
			}

		}

    },

    setupGame: function () {
	
	 this.playerSkull = Mainframe.centreSprite(this.game.add.sprite(0,90,'atlas', 'Subroutines/General/player_skull.png'), this.game.width);
	 this.elementLayer.add(this.playerSkull);
	 this.elementLayer.add(Mainframe.centreSprite(this.game.add.sprite(0,170,'atlas', 'Subroutines/Packet_Sniffer/progress_bar.png'), this.game.width));
	 this.sniffer = Mainframe.centreSprite(this.game.add.sprite(0,210,'atlas', 'Subroutines/Packet_Sniffer/pipe.png'), this.game.width);
	 this.elementLayer.add(this.sniffer);
	 
	 this.packets = [];
	 this.packets.push(new PacketStream(this, 390, 1));
	 this.packets.push(new PacketStream(this, 410, -1));
	 this.packets.push(new PacketStream(this, 430, 1));

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

var PacketStream = (function () {
    function PacketStream(context, y, direction) {
        this.context = context;
		this.y = y;
		this.direction = direction;
		this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		this.packets = [];
		this.speed = Math.floor( (Math.random()*3) + 2);
		this.xLimit = direction == 1 ? context.game.width : 0;
		this.buffer = 0;
		
		for (var i = 0; i < 64; i++) {
			this.addPacket((15*i));
		}
    }

    PacketStream.prototype.moveStream = function () {
		for (var i = 0; i < this.packets.length; i++) {
			this.packets[i].x += (this.speed * this.direction);
			if ((this.direction == 1 && this.packets[i].x >= this.xLimit) || (this.direction == -1 && this.packets[i].x <= this.xLimit)) {
				this.packets[i].destroy();
				this.packets.splice(i, 1);
				i--;
				
				if (this.buffer > 0) {
					buffer--;
				} else {
					x = this.direction == 1 ? 0 : this.context.game.width;
					this.addPacket(x);
				}
			}
		}
    };	
	
	PacketStream.prototype.addPacket = function (x) {
		var c = this.alphabet[Math.floor(Math.random()*this.alphabet.length)];
		var packet = this.context.game.add.bitmapText(x,this.y, 'white_font', c, 30);
		this.context.streamLayer.add(packet);
		this.packets.push(packet);
	};
 
    return PacketStream;
})();
