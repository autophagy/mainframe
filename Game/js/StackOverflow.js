Mainframe.StackOverflow = function (game) {

	// Standard Layering

	this.elementLayer = null;
	this.payloadLayer = null;
    this.tutorialLayer = null;
	this.timerLayer = null;
	this.monitorLayer = null;

	// Timer

	this.timerBlock = null;
	this.timerTime = null;
	this.timerStartTime = null;
	this.timeLimit = Phaser.Timer.SECOND * 60;
	
	this.stackFrames = null;

	this.music = null;

	this.ready = false;

};

Mainframe.StackOverflow.prototype = {

	create: function () {
		this.elementLayer = this.game.add.group();
		this.payloadLayer = this.game.add.group();
        this.tutorialLayer = this.game.add.group();
		this.timerLayer = this.game.add.group();
		this.monitorLayer = this.game.add.group();
		this.monitorLayer.add(this.game.add.sprite(0,0,'atlas','General/monitor.png'));

        var t = '> man STACK_SMASHER';
		t += '\n\nNAME'
		t += '\n	STACK_SMASHER - Stack buffer overflow exploiter';
		t += '\n\nDESCRIPTION'
		t += '\n	Hold down space to start generating values in the stack buffer.';
        t += '\n	When the data reaches the return address area, release space to';
        t += '\n	jump to the next stack. Jump from 3 buffers to inject your';
        t += '\n	ICE-BREAK payload.';

		//Mainframe.setupTutorial(this, t);
		this.setupGame();
		//this.initGame();
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
		this.stackFrames = [];
		for (var i = 0; i < 3; i++) {
			this.stackFrames.push(new StackFrame(this, 80+(270*i), 85));
		}
    },

    initGame: function () {
        Mainframe.initTimer(this, true);
    }
	
};

var StackFrame = (function () {
    function StackFrame(context, x, y) {
        this.context = context;
		this.sprite = context.game.add.sprite(x,y,'atlas', 'Subroutines/Stack_Overflow/stack_frame.png');		
		
		var returnAddr = Math.floor(Math.random()*230);
		returnAddr = y + returnAddr + 50;
		
		this.returnBounds = new Phaser.Rectangle(x+18, returnAddr, 228, 38);
		this.returnSprite = context.game.add.sprite(x+17, returnAddr - 13,'atlas', 'Subroutines/Stack_Overflow/return_addr.png');	
		
		this.upperStackText = context.game.add.bitmapText(x+50, y + ((returnAddr-y)/2) -5 ,'white_font', 'STACK SPACE', 26);
		this.lowerStackText = context.game.add.bitmapText(x+50, (returnAddr+38) + ((this.sprite.bottom-(returnAddr+38))/2) - 20,'white_font', 'STACK SPACE', 26);;
		
		this.context.elementLayer.add(this.sprite);	
		this.context.elementLayer.add(this.returnSprite);
	};

    return StackFrame;
})();
