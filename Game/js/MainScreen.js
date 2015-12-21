
Mainframe.MainScreen = function (game) {
	this.connectionLayer = null;
	this.elementLayer = null;
	this.bootLayer = null;
	this.monitorLayer = null;

	this.music = null;

	this.subroutineReturn = null;
	this.firstBoot = null;

	this.generatedIPs = null;

	this.inputField = null;

	this.proxies = [];
	this.ICEs = [];
	this.ICEConns = [];
	this.mainframe = null;

	this.currentProxyA = null;
	this.currentProxyB = null;
	this.currentProxyIP = null;
};

Mainframe.MainScreen.prototype = {

	init: function (firstBoot, subroutineReturn) {
		this.firstBoot = firstBoot;
		this.subroutineReturn = subroutineReturn;
	},

	create: function () {
		this.connectionLayer = this.game.add.group();
		this.elementLayer = this.game.add.group();
		this.bootLayer = this.game.add.group();
		this.monitorLayer = this.game.add.group();
		this.monitorLayer.add(this.game.add.sprite(0,0,'atlas','General/monitor.png'));

		if (this.firstBoot) {
			this.firstBootInit();
		} else if (this.subroutineReturn) {
			this.victorySubroutineInit();
		} else {
			this.failedSubroutineInit();
		}
	},

	firstBootInit: function() {
		this.generateHackerName();
		this.generateCorpName();
		this.generateSubroutineSequence();

		Mainframe.hackerProxies = [this.generateIP(), this.generateIP(), this.generateIP()];

		this.bootSequence();
	},

	bootSequence: function() {
		var sequence = function () {
			var timer = 0;
			this.game.time.events.add(timer = timer + Phaser.Timer.QUARTER, function () { this.bootLayer.add(this.game.add.bitmapText(50,75, 'green_font', 'Initialising . . .', 25)); }, this);
			this.game.time.events.add(timer = timer + Phaser.Timer.QUARTER, function () { this.bootLayer.add(this.game.add.bitmapText(50,100, 'green_font', 'Establishing proxies . . .', 25)); }, this);
			this.game.time.events.add(timer = timer + Phaser.Timer.QUARTER, function () { this.bootLayer.add(this.game.add.bitmapText(50,125, 'green_font', 'Connecting to ' + Mainframe.hackerProxies[0], 25)); }, this);
			this.game.time.events.add(timer = timer + Phaser.Timer.HALF, function () { this.bootLayer.add(this.game.add.bitmapText(50,150, 'green_font', 'Proxy 0 CONNECTED', 25)); }, this);
			this.game.time.events.add(timer = timer + Phaser.Timer.QUARTER, function () { this.bootLayer.add(this.game.add.bitmapText(50,175, 'green_font', 'Connecting to: ' + Mainframe.hackerProxies[1], 25)); }, this);
			this.game.time.events.add(timer = timer + Phaser.Timer.HALF, function () { this.bootLayer.add(this.game.add.bitmapText(50,200, 'green_font', 'Proxy 1 CONNECTED', 25)); }, this);
			this.game.time.events.add(timer = timer + Phaser.Timer.QUARTER, function () { this.bootLayer.add(this.game.add.bitmapText(50,225, 'green_font', 'Connecting to: ' + Mainframe.hackerProxies[2], 25)); }, this);
			this.game.time.events.add(timer = timer + Phaser.Timer.HALF, function () { this.bootLayer.add(this.game.add.bitmapText(50,250, 'green_font', 'Proxy 2 CONNECTED', 25)); }, this);
			this.game.time.events.add(timer = timer + Phaser.Timer.QUARTER, function () { this.bootLayer.add(this.game.add.bitmapText(50,275, 'green_font', 'All proxies CONNECTED', 25)); }, this);
			this.game.time.events.add(timer = timer + Phaser.Timer.QUARTER, function () { this.bootLayer.add(this.game.add.bitmapText(50,300, 'green_font', 'Loading ICE-Breaks . . .', 25)); }, this);
			this.game.time.events.add(timer = timer + Phaser.Timer.QUARTER/2, function () { this.bootLayer.add(this.game.add.bitmapText(50,325, 'green_font', 'ICE-Breaks LOADED', 25)); }, this);
			this.game.time.events.add(timer = timer + Phaser.Timer.QUARTER/2, function () { this.bootLayer.add(this.game.add.bitmapText(50,350, 'green_font', 'Trace detector INITIALISED', 25)); }, this);
			this.game.time.events.add(timer = timer + Phaser.Timer.QUARTER/2, function () { this.bootLayer.add(this.game.add.bitmapText(50,375, 'green_font', 'Booting MAINFRAME', 25)); }, this);
			this.game.time.events.add(timer = timer + Phaser.Timer.QUARTER/2, this.bootInitialiseSequence, this);
		}.bind(this);

		var initText = this.game.add.bitmapText(30,50, 'green_font', '>', 25);
		this.bootLayer.add(initText);

		Mainframe.textScroll(this, initText, ' mainframe -target ' + Mainframe.corpName[1], 100, sequence);
	},

	bootInitialiseSequence: function() {
		this.bootLayer.removeAll(true, false);
		bg_flicker = this.game.add.sprite(0, 0, 'bg_flicker');
		this.bootLayer.add(bg_flicker);
		bg_flicker.animations.add('anim');

		this.hackerInitialise();
		this.proxiesInitialise();
		this.corpInitialise();

		bg_flicker.animations.play('anim', 16, false);
	},

	hackerInitialise: function () {
		this.elementLayer.add(this.game.add.sprite(39, 120, 'atlas', 'Main_Screen/Hacker/hacker_frame.png'));

		var hackerName = this.game.add.bitmapText(98,90, 'green_font', Mainframe.hackerName[0], 35);
		hackerName.anchor.setTo(0.5, 0.5);
		hackerName.align = 'center';

		var hackerIP = this.game.add.bitmapText(100,360, 'green_font', Mainframe.hackerName[1], 20);
		hackerIP.anchor.setTo(0.5, 0.5);
		hackerIP.align = 'center';

		this.elementLayer.add(hackerName);
		this.elementLayer.add(hackerIP);

		this.connectionLayer.add(this.game.add.sprite(93, 224, 'atlas', 'Main_Screen/Corp/hacker-corp_connection.png'));

		this.inputField = this.game.add.bitmapText(30, 430, 'green_font', '> ', 45);
		this.elementLayer.add(this.inputField);
	},

	proxiesInitialise: function () {
		this.elementLayer.add(this.game.add.sprite(160, 120, 'atlas', 'Main_Screen/Proxy/proxies_outline.png'));

		if (this.firstBoot) {
			var func = function(offset) {
				this.game.time.events.add(Phaser.Timer.HALF + (150*offset), function () {
					var proxy = this.game.add.sprite(176 + (38*offset), 136, 'proxy_activate');
					this.elementLayer.add(proxy);
					proxy.animations.add('anim');
					proxy.animations.play('anim', 32, false);

					if(offset == 2) {
						proxy.events.onAnimationComplete.add(function() {
						this.setupProxyDisplay();
						}, this);
					}

				}, this);
			}.bind(this);

			for (i = 0; i < 3; i++) {
				func(i);
			}
		} else {
			this.proxies = [];
			for (i = 0; i < Mainframe.hackerProxies.length; i++) {
				var proxy = this.game.add.sprite(176 + (38*i), 136, 'atlas', 'Main_Screen/Proxy/proxy.png');
				this.elementLayer.add(proxy);
				this.proxies.push(proxy);
			}
			this.setupProxyDisplay();
		}
	},

	corpInitialise: function () {
		this.elementLayer.add(this.game.add.sprite(445, 120, 'atlas', 'Main_Screen/Corp/corp_outline.png'));

		var corpName = this.game.add.bitmapText(673,110, 'white_font', Mainframe.corpName[0], 35);
		corpName.anchor.setTo(0.5, 0.5);
		corpName.align = 'center';

		var corpIP = this.game.add.bitmapText(673,365, 'white_font', Mainframe.corpName[1], 35);
		corpIP.anchor.setTo(0.5, 0.5);
		corpIP.align = 'center';

		this.mainframe = this.game.add.sprite(777, 136, 'atlas', 'Main_Screen/Corp/mainframe.png');
		this.elementLayer.add(this.mainframe);

		this.elementLayer.add(corpName);
		this.elementLayer.add(corpIP);

		this.ICEs = [];
		this.ICEConns = [];

		if (this.firstBoot) {
			var func = function(offset) {
				this.game.time.events.add(Phaser.Timer.HALF + (150*offset), function () {
					var ICE = this.game.add.sprite(461 + (46*offset), 136, 'ICE_activate');
					this.elementLayer.add(ICE);
					ICE.animations.add('anim');
					ICE.animations.play('anim', 32, false);

					this.ICEs.push(ICE);

					ICE.events.onAnimationComplete.add(function() {
						if (offset < 4) {
							var ICEConn = this.game.add.sprite(499 + (46*offset), 224, 'atlas', 'Main_Screen/Corp/ICE-ICE_inactive.png');
							this.ICEConns.push(ICEConn);
						} else {
							var ICEConn = this.game.add.sprite(499 + (46*offset), 224, 'atlas', 'Main_Screen/Corp/ICE-MF_inactive.png');
							this.game.time.events.add(Phaser.Timer.HALF, function () {
								this.selectICE();
							}, this);
						}

						this.connectionLayer.add(ICEConn);
					}, this);



				}, this);
			}.bind(this);

			for (var i = 0; i < 5; i++) {
				func(i);
			}

			Mainframe.remainingICE = 5;

		} else {
			for (var i = 0; i < 5; i++) {
				if (i < (5-Mainframe.remainingICE)) {
					var ICE = this.game.add.sprite(461 + (46*i), 136, 'atlas', 'Main_Screen/Corp/broken_ICE.png');
					var conn = this.game.add.sprite(473 + (46*i), 224, 'atlas', 'Main_Screen/Corp/ICE-ICE_active.png');
					conn.width += 6;
					this.connectionLayer.add(conn);
					var ICEConn = this.game.add.sprite(499 + (46*i), 224, 'atlas', 'Main_Screen/Corp/ICE-ICE_active.png');
				} else {
					var ICE = this.game.add.sprite(461 + (46*i), 136, 'atlas', 'Main_Screen/Corp/ICE.png');
					if (i == 4) {
						var ICEConn = this.game.add.sprite(499 + (46*i), 224, 'atlas', 'Main_Screen/Corp/ICE-MF_inactive.png');
					} else {
						var ICEConn = this.game.add.sprite(499 + (46*i), 224, 'atlas', 'Main_Screen/Corp/ICE-ICE_inactive.png');
					}

				}
				this.elementLayer.add(ICE);
				this.connectionLayer.add(ICEConn);
				this.ICEs.push(ICE);
				this.ICEConns.push(ICEConn);
			}
		}
	},

	removeICE: function() {
		var index = 5 - Mainframe.remainingICE;
		this.ICEs[index].destroy();
		this.ICEs[index] = this.game.add.sprite(461 + (46*index), 136, 'ICE_broken');
		this.elementLayer.add(this.ICEs[index]);
		this.ICEs[index].animations.add('anim');
		this.ICEs[index].animations.play('anim', 32, false);
		this.ICEs[index].events.onAnimationComplete.add(function () {
			this.ICEConns[index].destroy();
			this.ICEConns[index] = this.game.add.sprite(499 + (46*index), 224, 'atlas', 'Main_Screen/Corp/ICE-ICE_active.png');
			var conn = this.game.add.sprite(473 + (46*index), 224, 'atlas', 'Main_Screen/Corp/ICE-ICE_active.png');
			conn.width += 6;
			this.connectionLayer.add(this.ICEConns[index]);
			this.connectionLayer.add(conn);
			Mainframe.remainingICE--;
			if (Mainframe.remainingICE == 0) {
				// YOU WIN!
				this.ICEConns[index].destroy();
				this.ICEConns[index] = this.game.add.sprite(499 + (46*index), 224, 'atlas', 'Main_Screen/Corp/ICE-MF_active.png');
				this.connectionLayer.add(this.ICEConns[index]);
				this.victoryAnimation();
			} else {
				Mainframe.subroutineSequence.splice(0, 1);
				this.selectICE();
			}
		}, this);
	},

	victoryAnimation: function() {
		this.mainframe.destroy();
		this.mainframe = this.game.add.sprite(777, 136, 'mainframe_accessed');
		this.elementLayer.add(this.mainframe);
		this.mainframe.animations.add('anim');
		this.mainframe.animations.play('anim', 16, false);
		this.mainframe.events.onAnimationComplete.add(function () {
			var banner = this.game.add.sprite(this.game.width/2, this.game.height/2, 'victory_banner');
			banner.anchor.setTo(0.5, 0.5);
			this.elementLayer.add(banner);
			banner.animations.add('anim');
			banner.animations.play('anim', 16, false);
			banner.events.onAnimationComplete.add(function () {
				banner.destroy();
				banner = this.game.add.sprite(this.game.width/2, this.game.height/2 - 2, 'victory_blink');
				banner.anchor.setTo(0.5, 0.5);
				this.elementLayer.add(banner);
				banner.animations.add('anim');
				banner.animations.play('anim', 2, false);
				banner.events.onAnimationComplete.add(function () {
					this.state.start('VictoryScreen');
				}, this);
			}, this);
		}, this);
	},

	removeProxy: function() {
		var index = Mainframe.hackerProxies.length - 1;
		this.proxies[index].destroy();
		this.proxies[index] = this.game.add.sprite(176 + (38*index), 136, 'proxy_deactivate');
		this.elementLayer.add(this.proxies[index]);
		this.proxies[index].animations.add('anim');
		this.proxies[index].animations.play('anim', 32, false);
		this.proxies[index].events.onAnimationComplete.add(function () {
			Mainframe.hackerProxies.splice(Mainframe.hackerProxies.length - 1, 1);
			this.refreshProxyDisplay();
			if (Mainframe.hackerProxies.length == 0) {
				this.flatline();
			} else {
				Mainframe.subroutineSequence.splice(0, 1);
				this.selectICE();
			}
		}, this);
	},

	setupProxyDisplay: function () {
		this.currentProxyA = this.game.add.bitmapText(375,195, 'green_font', 'current', 35);
		this.currentProxyB = this.game.add.bitmapText(375,215, 'green_font', 'proxy', 35);
		this.currentProxyA.anchor.setTo(0.5, 0.5);
		this.currentProxyB.anchor.setTo(0.5, 0.5);
		this.currentProxyA.align = 'center';
		this.currentProxyB.align = 'center';

		this.currentProxyIP = this.game.add.bitmapText(380,255, 'green_font', Mainframe.hackerProxies[Mainframe.hackerProxies.length -1], 20);
		this.currentProxyIP.anchor.setTo(0.5, 0.5);

		this.elementLayer.add(this.currentProxyA);
		this.elementLayer.add(this.currentProxyB);
		this.elementLayer.add(this.currentProxyIP);
	},

	refreshProxyDisplay: function () {
		if (Mainframe.hackerProxies.length > 0) {
			this.currentProxyIP.text = Mainframe.hackerProxies[Mainframe.hackerProxies.length -1];
		} else {
			this.currentProxyIP.text = '';
		}
	},

	flatline: function () {
		var blackICE = this.game.add.sprite(this.game.width/2, this.game.height/2, 'black_ice_detected');
		blackICE.anchor.setTo(0.5, 0.5);
		this.elementLayer.add(blackICE);
		blackICE.animations.add('anim');
		blackICE.animations.play('anim', 32, false);
		blackICE.events.onAnimationComplete.add(function () {
			this.game.time.events.add(Phaser.Timer.HALF, function () {
				var death = this.game.add.sprite(0, 0, 'crash');
				this.elementLayer.add(death);
				death.animations.add('anim');
				death.animations.play('anim', 2, false);
				death.events.onAnimationComplete.add(function () {
					this.elementLayer.alpha = 0;
					this.connectionLayer.alpha = 0;
					this.game.time.events.add(Phaser.Timer.SECOND * 1.5, function () {
						this.state.start('DeathScreen');
					}, this);
				}, this);
			}, this);
		}, this);
	},

	victorySubroutineInit: function() {
		bg_flicker = this.game.add.sprite(0, 0, 'bg_flicker');
		this.bootLayer.add(bg_flicker);
		bg_flicker.animations.add('anim');

		this.hackerInitialise();
		this.proxiesInitialise();
		this.corpInitialise();

		bg_flicker.animations.play('anim', 16, false);
		bg_flicker.events.onAnimationComplete.add(function() { this.removeICE(); }, this);
	},

	failedSubroutineInit: function() {
		bg_flicker = this.game.add.sprite(0, 0, 'bg_flicker');
		this.bootLayer.add(bg_flicker);
		bg_flicker.animations.add('anim');

		this.hackerInitialise();
		this.proxiesInitialise();
		this.corpInitialise();

		bg_flicker.animations.play('anim', 16, false);
		bg_flicker.events.onAnimationComplete.add(function() { this.removeProxy(); }, this);
	},

	selectICE: function() {
		var func = function () {
			this.game.time.events.add(Phaser.Timer.HALF * 1.5, function () {
				var bg_flicker = this.game.add.sprite(0, 0, 'bg_flicker_on');
				this.bootLayer.add(bg_flicker);
				bg_flicker.animations.add('anim');
				bg_flicker.animations.play('anim', 16, false);
				bg_flicker.events.onAnimationComplete.add(function () {
					this.state.start(Mainframe.subroutineSequence[Mainframe.subroutinePosition][0]);
				}, this);
			}, this);
		}.bind(this);

		var index = 5 - Mainframe.remainingICE;
		this.ICEs[index].destroy();
		this.ICEs[index] = this.game.add.sprite(461 + (46*index), 136, 'selected_ICE');
		this.elementLayer.add(this.ICEs[index]);
		this.ICEs[index].animations.add('anim');
		this.ICEs[index].animations.play('anim', 3, true);

		this.game.time.events.add(Phaser.Timer.HALF * 4, function () {
			Mainframe.textScroll(this, this.inputField, Mainframe.subroutineSequence[Mainframe.subroutinePosition][1], 200, func);
		}, this);
	},

    generateHackerName: function () {

        var doubleNouns = ['Zero', 'Cool', 'Acid', 'Burn', 'Crash', 'Override', 'Flatline', 'Puppet', 'Master', 'Flux', 'Neon', 'Null', 'Void', 'Lord', 'King', 'Queen', 'Cyber', 'Net', 'Mantis', 'Soul', 'Shadow'];

        var doubleVerbs = ['Laughing', 'Crying', 'Deadly', 'Crouching', 'Hidden', 'Pale', 'White', 'Black', 'Red', 'Dead', 'Toxic'];

        var singleNouns = ['Morpheus', 'Trinity', 'Maelcum', 'Hideo', 'Pandora', 'Ozymandias', 'Xerxes', 'Turing', 'Tracer', 'Phoenix'];

        var probability = Math.random();

		var IP = this.generateIP();
		var name = '';

        if (probability <= 0.5) {
            var n = doubleNouns[Math.floor(Math.random()*doubleNouns.length)];
            var n2 = doubleNouns[Math.floor(Math.random()*doubleNouns.length)];

            while (n == n2) {
                n2 = doubleNouns[Math.floor(Math.random()*doubleNouns.length)];
            }

            name = n + '\n' + n2;
        }

        if (probability > 0.5 && probability <= 0.9) {
            name = doubleVerbs[Math.floor(Math.random()*doubleVerbs.length)] + '\n' + doubleNouns[Math.floor(Math.random()*doubleNouns.length)];
        }

        if (probability > 0.9) {
            name = singleNouns[Math.floor(Math.random()*singleNouns.length)];
        }

		// 1337ification 1/3 of the time
        if (Math.random() <= 0.33) {
            name = name.replace(/a/g,'4').replace(/e/g,'3').replace(/s/g,'5').replace(/o/g,'0');
        }

		Mainframe.hackerName = [name, IP];
    },

	generateCorpName: function () {
		var names = ['Hanka Precision Instruments', 'Kenbishi Heavy Industries', 'Locus-Solus', 'Megatech', 'Sagawa Electronics Inc', 'Tyrell Corporation', 'Ellingson Mineral Company', 'Yoyodyne', 'Cyberdyne Systems', 'Rekall', 'Sense/Net', 'Tessier-Ashpool', 'Maas Biolabs', 'Hosaka', 'Ares Macrotechnology', 'Aztechnology', 'Evo Corporation', 'Mitsuhama', 'NeoNET', 'Renraku', 'Saeder-Krupp', 'Shiawase Corporation', 'Wuxing Inc', 'Weyland-Yutani', 'Jinteki', 'NBN', 'Haas-Bioroid', 'Arboria Institue', 'Versatran', 'Sarif Industries', 'Tai Yong Medical', 'Antenna Research', 'Cortical Systematics', 'Spectacular Optical', 'Omni Consumer Products', 'Virtual Space Industries', 'Bartok Science Industries', 'Alphabet', 'Turing Machines Inc.', 'Lepidoptera Conglomerate', 'Socialist Workers Party'];

		var name = names[Math.floor(Math.random()*names.length)];
		var IP = this.generateIP();

		Mainframe.corpName = [name, IP];
	},

	generateIP: function () {
		var numbers = [];

		if (this.generatedIPs == null) {
			this.generatedIPs = [];
		}

		for (var i = 0; i < 4; i++) {
			numbers.push(Math.floor(Math.random()*256));
		}
		var IP = numbers.join('.');

		if (this.generatedIPs.indexOf(IP) == -1) {
			return IP
		} else {
			return this.generateIP();
		}
	},

	generateSubroutineSequence: function () {
		var subroutines = [ ['PasswordCracker', 'JOHN_THE_RIPPER'], ['Firewall', 'HOLEPUNCH'], ['Worm', 'YOURDOOM'], ['SQLInject', 'DB_BREAKER'], ['BotnetDDoS', 'SWARMNET'], ['StackOverflow', 'STACK_SMASHER'], ['PacketSniffer', 'CONN_SHARK'], ['VoiceCracker', 'MIMIC'] ];
		subroutines = Mainframe.shuffleArray(subroutines);

		Mainframe.subroutineSequence = subroutines;
		Mainframe.subroutinePosition = 0;
	}

};
