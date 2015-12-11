Mainframe.VoiceCracker = function (game) {

	// Standard Layering

	this.templateLayer = null;
	this.activeLayer = null;
    this.tutorialLayer = null;
	this.timerLayer = null;
	this.monitorLayer = null;

	// Timer

	this.timerBlock = null;
	this.timerTime = null;
	this.timerStartTime = null;
	this.timeLimit = Phaser.Timer.SECOND * 60;

	this.dial = null;
	this.dialSet = null;
	
	this.music = null;

	this.ready = false;

};

Mainframe.VoiceCracker.prototype = {

	create: function () {
		this.templateLayer = this.game.add.group();
		this.activeLayer = this.game.add.group();
        this.tutorialLayer = this.game.add.group();
		this.timerLayer = this.game.add.group();
		this.monitorLayer = this.game.add.group();
		this.monitorLayer.add(this.game.add.sprite(0,0,'atlas','General/monitor.png'));

        var t = '> man MIMIC';
		t += '\n\nNAME'
		t += '\n	MIMIC - Synthesiser for voice activated password cracking';
		t += '\n\nDESCRIPTION'
		t += '\n	Use the modulation dials to mimic the waveform of a known login.';

		Mainframe.setupTutorial(this, t);
	},

	update: function () {

		if (this.ready)
		{
			if(this.game.time.now - this.timerTime >= Phaser.Timer.SECOND)
			{
				this.timerTime = this.game.time.now;
				Mainframe.incTimer(this, true);
				this.dialSet++;
				this.dial.rotateDial(this.dialSet);
				this.dial.toggleActive();
			}

		}

    },

    setupGame: function () {

    },

    initGame: function () {
        Mainframe.initTimer(this, true);
    }

};

var VoiceDial = (function () {
    function VoiceDial(context, x, y, name, r) {
        this.context = context;
		this.sprite = context.game.add.sprite(x,y,'atlas', 'Subroutines/Voice_Cracker/cracker_button.png');
		this.activeSprite = context.game.add.sprite(x-2,y-2,'atlas', 'Subroutines/Voice_Cracker/active_button.png');
		this.activeSprite.alpha = 0;
		this.dial = context.game.add.sprite(x+(this.sprite.width/2),y+(this.sprite.height/2),'atlas', 'Subroutines/Voice_Cracker/cracker_dial.png');
		this.dial.anchor.setTo(0.5, 0.57);
		this.dial.smoothed = false;
		this.rotateDial(r);
		this.text = context.game.add.bitmapText(x+(this.sprite.width/2)-5,y+110,'green_font', name, 23);
		this.text.anchor.setTo(0.5, 0.5);
0    }

    VoiceDial.prototype.rotateDial = function (dialPosition) {
		this.dial.angle = dialPosition*90;
    };
	
	VoiceDial.prototype.toggleActive = function () {
		this.activeSprite.alpha = 1 - this.activeSprite.alpha;
	};
 
    return VoiceDial;
})();
