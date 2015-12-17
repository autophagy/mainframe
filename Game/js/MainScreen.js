
Mainframe.MainScreen = function (game) {
	this.connectionLayer = null;
	this.elementLayer = null;
	this.monitorLayer = null;

	this.music = null;
	
	this.subroutineReturn = null;
	this.firstBoot = null;
	
	this.generatedIPs = null;

Mainframe.MainScreen.prototype = {

	init: function (firstBoot, subroutineReturn) {
		this.firstBoot = firstBoot;
		this.subroutineReturn = subroutineReturn;		
	}

	create: function () {
		if (firstBoot) {
			this.firstBootInit();
		} else if (subroutineReturn) {
			this.victorySubroutineInit();
		} else {
			this.failedSubroutineInit();
		}
		
	},

	firstBootInit: function() {
	
	}
	
	victorySubroutineInit: function() {
	
	},
	
	failedSubroutineInit: function() {
	
	},
	
    generateHackerName: function () {

        var doubleNouns = ['Zero', 'Cool', 'Acid', 'Burn', 'Crash', 'Override', 'Flatline', 'Puppet', 'Master', 'Flux', 'Neon', 'Null', 'Void', 'Lord', 'King', 'Queen', 'Cyber', 'Net', 'Mantis', 'Soul', 'Shadow'];

        var doubleVerbs = ['Laughing', 'Crying', 'Deadly', 'Crouching', 'Hidden', 'Pale', 'White', 'Black', 'Red', 'Dead', 'Toxic'];

        var singleNouns = ['Morpheus', 'Trinity', 'Maelcum', 'Hideo', 'Pandora', 'Ozymandias', 'Xerxes', 'Turing', 'Tracer', 'Phoenix'];

        var probability = Math.random();
		
		var IP = generateIP();
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
            name = Mainframe.hackerName.replace(/a/g,'4').replace(/e/g,'3').replace(/s/g,'5').replace(/o/g,'0');
        }
		
		Mainframe.hackerName = [name. IP];
    },
	
	generateCorpName: function () {
		var names = ['Hanka Precision Instruments', 'Kenbishi Heavy Industries', 'Locus-Solus', 'Megatech', 'Sagawa Electronics Inc', 'Tyrell Corporation', 'Ellingson Mineral Company', 'Yoyodyne', 'Cyberdyne Systems', 'Rekall', 'Sense/Net', 'Tessier-Ashpool', 'Maas Biolabs', 'Hosaka', 'Ares Macrotechnology', 'Aztechnology', 'Evo Corporation', 'Mitsuhama', 'NeoNET', 'Renraku', 'Saeder-Krupp', 'Shiawase Corporation', 'Wuxing Inc', 'Weyland-Yutani', 'Jinteki', 'NBN', 'Haas-Bioroid', 'Arboria Institue', 'Versatran', 'Sarif Industries', 'Tai Yong Medical', 'Antenna Research', 'Cortical Systematics', 'Spectacular Optical', 'Omni Consumer Products', 'Virtual Space Industries', 'Bartok Science Industries', 'Alphabet', 'Turing Machines Inc.', 'Lepidoptera Conglomerate', 'Socialist Workers Party'];
		
		var name = names[Math.floor(Math.random()*names.length)];
		var IP = generateIP();
		
		Mainframe.corpName = [name, IP];		
	},
	
	generateIP: function () {	
		var numbers = [];
		for (var i = 0; i < 4; i++) {
			numbers.push(Math.floor(Math.random()*256));
		}
		var IP = numbers.join('.');	
		
		if (this.generatedIPs.indexOf(IP) == -1) {
			return IP
		} else {
			return generateIP();
		}
	},
	
	generateSubroutineSequence: function () {
		var subroutines = ['PasswordCracker', 'Firewall', 'Worm', 'SQLInject', 'BotnetDDoS', 'StackOverflow', 'PacketSniffer', 'VoiceCracker'];
		subroutines = Mainframe.shuffleArray(subroutines);
		
		Mainframe.subroutineSequence = subroutines;
		Mainframe.subroutinePosition = 0;
	}
	
};
