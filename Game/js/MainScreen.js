
Mainframe.MainScreen = function (game) {
	this.connectionLayer = null;
	this.elementLayer = null;
	this.monitorLayer = null;

	this.music = null;
	
	this.subroutineReturn = null;
	this.firstBoot = null;

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
	
	
};
