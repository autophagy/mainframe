
Mainframe.MainScreen = function (game) {
	this.connectionLayer = null;
	this.elementLayer = null;
	this.bootLayer = null;
	this.monitorLayer = null;

	this.music = null;
	
	this.subroutineReturn = null;
	this.firstBoot = null;
	
	this.generatedIPs = null;
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
		this.bootLayer.add(this.game.add.bitmapText(30,50, 'green_font', '> mainframe -target ' + Mainframe.corpName[1], 25));
		this.bootLayer.add(this.game.add.bitmapText(50,75, 'green_font', 'Initialising . . .', 25));
		this.bootLayer.add(this.game.add.bitmapText(50,100, 'green_font', 'Establishing proxies . . .', 25));
		this.bootLayer.add(this.game.add.bitmapText(50,125, 'green_font', 'Connecting to ' + Mainframe.hackerProxies[0], 25));
		this.bootLayer.add(this.game.add.bitmapText(50,150, 'green_font', 'Proxy 0 CONNECTED', 25));
		this.bootLayer.add(this.game.add.bitmapText(50,175, 'green_font', 'Connecting to: ' + Mainframe.hackerProxies[1], 25));
		this.bootLayer.add(this.game.add.bitmapText(50,200, 'green_font', 'Proxy 1 CONNECTED', 25));
		this.bootLayer.add(this.game.add.bitmapText(50,225, 'green_font', 'Connecting to: ' + Mainframe.hackerProxies[2], 25));
		this.bootLayer.add(this.game.add.bitmapText(50,250, 'green_font', 'Proxy 2 CONNECTED', 25));
		this.bootLayer.add(this.game.add.bitmapText(50,275, 'green_font', 'All proxies CONNECTED', 25));
		this.bootLayer.add(this.game.add.bitmapText(50,300, 'green_font', 'Loading ICE-Breaks . . .', 25));
		this.bootLayer.add(this.game.add.bitmapText(50,325, 'green_font', 'ICE-Breaks LOADED', 25));
		this.bootLayer.add(this.game.add.bitmapText(50,350, 'green_font', 'Trace detector INITIALISED', 25));
		this.bootLayer.add(this.game.add.bitmapText(50,375, 'green_font', 'Booting MAINFRAME', 25));
	},
	
	victorySubroutineInit: function() {
	
	},
	
	failedSubroutineInit: function() {
	
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

            name = n + ' ' + n2;
        }

        if (probability > 0.5 && probability <= 0.9) {
            name = doubleVerbs[Math.floor(Math.random()*doubleVerbs.length)] + ' ' + doubleNouns[Math.floor(Math.random()*doubleNouns.length)];
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
		var subroutines = ['PasswordCracker', 'Firewall', 'Worm', 'SQLInject', 'BotnetDDoS', 'StackOverflow', 'PacketSniffer', 'VoiceCracker'];
		subroutines = Mainframe.shuffleArray(subroutines);
		
		Mainframe.subroutineSequence = subroutines;
		Mainframe.subroutinePosition = 0;
	}
	
};
