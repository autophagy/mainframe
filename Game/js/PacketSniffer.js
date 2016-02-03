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
	this.timeLimit = Phaser.Timer.SECOND * 20;

	this.playerSkull = null;
	this.packetBar = null;
	this.sniffer = null;
	this.packetsCaptured = null;
	this.packetGoal = 5;

	this.streams = null;
	this.streamsInit = null;

	this.music = null;
	this.packetCapturedSound = null;

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

		this.packetCapturedSound = this.add.audio('character_cracked');

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
				this.streams[0].queueKeyPacket();
				this.streams[1].queueKeyPacket();
				this.streams[2].queueKeyPacket();

			}

			if(!this.streamsInit) {
				for (var i = 0; i < this.streams.length; i++) {
					this.streams[i].addPacketRepeat();
					this.streams[i].timeSinceLastKey = this.game.time.now;
				}
				this.streamsInit = true;
			}

			for (var i = 0; i < this.streams.length; i++) {
				this.streams[i].moveStream();
			}

			if (this.packetsCaptured == this.packetGoal) {
				this.ready = false;
				Mainframe.subroutineVictory(this);
			}

		}

    },

    setupGame: function () {

	this.packetsCaptured = 0;
	this.playerSkull = Mainframe.centreSprite(this.game.add.sprite(0,90,'atlas', 'Subroutines/General/player_skull.png'), this.game.width);
	this.elementLayer.add(this.playerSkull);
	this.elementLayer.add(Mainframe.centreSprite(this.game.add.sprite(0,170,'atlas', 'Subroutines/Packet_Sniffer/progress_bar.png'), this.game.width));

	this.packetBar = this.game.add.sprite(415,187,'atlas', 'Subroutines/General/trace_bar_full.png');
	this.elementLayer.add(this.packetBar);
	this.packetBar.width = 0;
	this.packetBar.height = 12;

	this.sniffer = Mainframe.centreSprite(this.game.add.sprite(0,210,'atlas', 'Subroutines/Packet_Sniffer/pipe.png'), this.game.width);
	this.elementLayer.add(this.sniffer);

	this.streams = [];
	this.streams.push(new PacketStream(this, 390, 1));
	this.streams.push(new PacketStream(this, 412, -1));
	this.streams.push(new PacketStream(this, 433, 1));
	this.streamsInit = false;
	this.enabled = true;

	var space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	space.onDown.add(function () {
		if (this.ready && this.enabled) {
			var validCapture = false;
			for (var i = 0; i < this.streams.length; i++) {
				if(this.streams[i].capturePackets()) {
					validCapture = true;
					this.sniffer.alpha = 0.25
					this.enabled = false;
					// A bit of re-appropriation from the DDOS game
					var captured = Mainframe.centreSprite(this.game.add.sprite(0, 370, 'atlas', 'Subroutines/DDOS/packet.png'), this.game.width);
					this.elementLayer.add(captured);
					var sendPacket = this.game.add.tween(captured);
					sendPacket.to({y: 180}, 500, Phaser.Easing.Linear.In);
					sendPacket.start();
					sendPacket.onComplete.add( function() {
						captured.destroy();
						this.packetsCaptured++;
						if (this.packetsCaptured < this.packetGoal) {
							this.packetCapturedSound.play();
							this.packetCapturedSound._sound.playbackRate.value = 1 + (this.packetsCaptured/this.packetGoal);
						}
						this.refreshPacketBar();
						this.sniffer.alpha = 1;
						this.enabled = true;
					}, this);
					break;
				}
			}
			if (!validCapture) {
				this.disableSniffer();
			}
		}
	}, this);


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
	},

	refreshPacketBar: function () {
		this.packetBar.width = (this.packetsCaptured / this.packetGoal)*130;
	}

};

var PacketStream = (function () {
    function PacketStream(context, y, direction) {
        this.context = context;
		this.y = y;
		this.direction = direction;
		this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		this.keyPackets = ['email', 'password', 'root', 'admin', 'http', 'ssh', 'tcp', 'udp'];
		this.queuedPacket = '';
		this.packets = [];
		this.speed = Math.floor( (Math.random()*5) + 3);
		this.xLimit = direction == 1 ? context.game.width : 0;
		this.buffer = 0;
		this.timeSinceLastKey = null;

		for (var i = direction == 1 ? 1 : 0; i < 60; i++) {
			this.addPacket(16*i);
		}
    }

    PacketStream.prototype.moveStream = function () {
		for (var i = 0; i < this.packets.length; i++) {
			this.packets[i].x += (this.speed * this.direction);
			if ((this.direction == 1 && this.packets[i].x >= this.xLimit) || (this.direction == -1 && this.packets[i].right <= this.xLimit)) {
				this.packets[i].destroy();
				this.packets.splice(i, 1);
				i--;
			}
		}
    };

	PacketStream.prototype.addPacketRepeat = function () {
		if (this.context.ready) {
			if (this.queuedPacket.length <= 0) {
				x = this.direction == 1 ? 0 : this.context.game.width;
				this.addPacket(x);
				this.context.game.time.events.add((Phaser.Timer.SECOND/4)/this.speed, function() { this.addPacketRepeat(); }, this);
			} else {
				x = this.direction == 1 ? 0 - (15*(this.queuedPacket.length-1)-3) : this.context.game.width + 3;
				this.addKeyPacket(x);
				this.context.game.time.events.add( ((Phaser.Timer.SECOND/4)/this.speed)*this.queuedPacket.length, function() { this.addPacketRepeat(); }, this);
				this.queuedPacket = '';
			}
		}
	};

	PacketStream.prototype.queueKeyPacket = function () {
		var time = this.context.game.time.now - this.timeSinceLastKey;
		time = time/Phaser.Timer.SECOND;
		if (Math.random() <= time*0.05) {
			this.queuedPacket = this.keyPackets[Math.floor(Math.random()*this.keyPackets.length)];
			this.timeSinceLastKey = this.context.game.time.now;
		}
	};

	PacketStream.prototype.addPacket = function (x) {
			if (this.buffer > 0) {
				this.buffer--;
			} else {
				var c = this.alphabet[Math.floor(Math.random()*this.alphabet.length)];
				var packet = this.context.game.add.bitmapText(x,this.y, 'white_font', c, 30);
				this.context.streamLayer.add(packet);
				this.packets.push(packet);
			}
	};

	PacketStream.prototype.addKeyPacket = function (x) {
		var packet = this.context.game.add.bitmapText(x, this.y, 'green_font', this.queuedPacket, 28);
		this.context.streamLayer.add(packet);
		this.packets.push(packet);
	};

	PacketStream.prototype.capturePackets = function () {
		for (var i = 0; i < this.packets.length; i++) {
			var c = this.context.game.width/2;
			if (this.packets[i].font == 'green_font') {
				if((this.packets[i].x >= c-33 && this.packets[i].x <= c+33) || (this.packets[i].right >= c-33 && this.packets[i].right <= c+33) || (this.packets[i].right >= c+33 && this.packets[i].x <= c-33)) {
					this.packets[i].destroy();
					this.packets.splice(i, 1);
					i--;
					return true;
				}
			}
		}
		return false;
	};


    return PacketStream;
})();
