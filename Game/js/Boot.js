var Mainframe = {

	//Globals go here!

	// Global Variables that need to be tracked across states

	// Of the form [name, IP]
    hackerName: [],
	corpName: [],

	remainingICE: 0,

	// Of the form [IP, IP, IP] (when empty, you're flatlined!)
	hackerProxies: [],

	subroutineSequence: [],
	subroutinePosition: 0,

	corpDifficulty: 1.0,
	totalEarned: 0,

	// Global sounds & Music
	fanLoop: null,
  mainMusic: null,

    centreSprite: function(sprite, width) {
    		sprite.x = (width/2) - Math.floor(sprite.width/2);
    		return sprite;
    },

    centreText: function(text, width) {
    	text.align = 'center';
    	text.x = width/2 - text.textWidth/2;
    	return text;
    },

    initTimer: function(context, isTrace) {
        var timerAnim = '';
        var fillY = 0;

        if (isTrace) {
            timerAnim = 'trace_detected'
            fillY = 55;
        } else {
            timerAnim = 'icebreak_in_progress';
            fillY = 54;
        }

    	var timerBar = context.game.add.sprite(0, 22, timerAnim);
    	context.timerLayer.add(timerBar);
    	Mainframe.centreSprite(timerBar, context.game.width);
    	timerBar.animations.add('anim');
    	timerBar.animations.play('anim', 16, false);
    	timerBar.events.onAnimationComplete.add(function() {
            this.timerTime = this.game.time.now;
            this.timerStartTime = this.timerTime;
    	    context.ready = true;
    		}, context);

    	context.timerBlock = context.game.add.sprite(10,fillY,'atlas', 'Subroutines/General/trace_bar_full.png');
    	Mainframe.centreSprite(context.timerBlock, context.game.width);
    	context.timerLayer.add(context.timerBlock);

    	context.timerBlock.width = 0;
    },

    incTimer: function(context, isTrace) {
        var finishedFunc = isTrace ? function() { this.subroutineFailure(context); }.bind(this) : function() { this.subroutineVictory(context); }.bind(this);

        var barWidth = 859;
        var percentage = (context.game.time.now - context.timerStartTime) / context.timeLimit;
        context.timerBlock.width = percentage*barWidth;

        if (percentage >= 1)
        {
            context.ready = false;
            finishedFunc();
        }
    },

    setupTutorial: function(context, tutorial, setup) {
      Mainframe.mainMusic.volume = 0.25;
      context.tutorialLayer.add(context.game.add.bitmapText(30,50, 'green_font', tutorial, 25));

		  context.tutorialLayer.add(Mainframe.centreText(context.game.add.bitmapText(0,420, 'green_font', '> Begin ICE-Break', 30), context.game.width));

  		var space = context.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  		space.onDown.addOnce(function () {
  			context.tutorialLayer.removeAll();
  			bg_flicker = context.game.add.sprite(0, 0, 'bg_flicker');
  			context.tutorialLayer.add(bg_flicker);
  			bg_flicker.animations.add('anim');
  			bg_flicker.events.onAnimationComplete.add(function() {
          Mainframe.mainMusic.volume = 1;
  				context.tutorialLayer.removeAll();
  				context.initGame();
  			}, context);

        context.setupGame();

			  bg_flicker.animations.play('anim', 16, false);
      }, context);
    },

    subroutineVictory: function(context) {
        var victorySign = context.game.add.sprite(0, 200, 'subroutine_complete');
        context.timerLayer.add(victorySign);
        Mainframe.centreSprite(victorySign, context.game.width);
        victorySign.animations.add('anim');
        victorySign.animations.play('anim', 16, false);
        var victoryTone = context.add.audio('subroutine_victory');
        victoryTone.play();

		context.game.time.events.add(Phaser.Timer.SECOND * 1.5, function() {
            victoryTone.stop();
            victoryTone.destroy();
			var bg_flicker = context.game.add.sprite(0, 0, 'bg_flicker_on');
			context.timerLayer.add(bg_flicker);
			bg_flicker.animations.add('anim');
			bg_flicker.animations.play('anim', 16, false);
			bg_flicker.events.onAnimationComplete.add(function () {
				context.state.start('MainScreen', true, false, false, true);
			}, this);
		}, this);

    },

    subroutineFailure: function(context) {
        var failureSign = context.game.add.sprite(0, 200, 'subroutine_failed');
        context.timerLayer.add(failureSign);
        Mainframe.centreSprite(failureSign, context.game.width);
        failureSign.animations.add('anim');
        failureSign.animations.play('anim', 16, false);
        var failureTone = context.add.audio('subroutine_failure');
        failureTone.play();

		context.game.time.events.add(Phaser.Timer.SECOND * 1.5, function() {
            failureTone.stop();
            failureTone.destroy();
			var bg_flicker = context.game.add.sprite(0, 0, 'bg_flicker_on');
			context.timerLayer.add(bg_flicker);
			bg_flicker.animations.add('anim');
			bg_flicker.animations.play('anim', 16, false);
			bg_flicker.events.onAnimationComplete.add(function () {
				context.state.start('MainScreen', true, false, false, false);
			}, this);
		}, this);

    },

	textScroll : function (context, bitmapText, text, speed, mute, nextFunc) {
		if (text.length > 0) {
			bitmapText.text = bitmapText.text + text[0];
            var keyPress = context.add.audio('key_press_' + Math.floor(Math.random()*6));
            keyPress.volume = 0.1;
            if (!mute) keyPress.play();
			context.game.time.events.add(speed, function() {
                keyPress.stop();
                keyPress.destroy();
                this.textScroll(context, bitmapText, text.substr(1), speed, mute, nextFunc);
            }, this);

		} else if (nextFunc != null) {
            var enter = context.add.audio('key_press_5');
            enter.volume = 0.5;
            if (!mute) enter.play();
			nextFunc();
		}
	},

    // Knuth shuffe
    shuffleArray: function(array) {
        var i = array.length;
        var t, randomI ;

        while (i != 0) {
            randomI = Math.floor(Math.random()*i);
            i -= 1;
            t = array[i];
            array[i] = array[randomI];
            array[randomI] = t;
        }

        return array;
    },

    // Temp debug function
    showRect: function(context, rect) {
        context.game.debug.geom(rect, '#FF0000', false);
    }


};

Mainframe.Boot = function (game) {

};

Mainframe.Boot.prototype = {

    init: function () {

        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            //  If you have any desktop specific settings, they can go in here
            this.scale.pageAlignHorizontally = true;
        }

    },

    preload: function () {

        this.load.image('monitor', 'assets/sprites/monitor.png');
		this.load.image('loading_bar_full', 'assets/sprites/loading_bar_full.png');
		this.load.image('loading_bar_empty', 'assets/sprites/loading_bar_empty.png');
		this.game.load.bitmapFont('green_font', 'assets/fonts/green_font.png', 'assets/fonts/green_font.xml');
		this.game.load.bitmapFont('white_font', 'assets/fonts/white_font.png', 'assets/fonts/white_font.xml');

    },

    create: function () {

        //  By this point the preloader assets have loaded to the cache, we've set the game settings
        //  So now let's start the real preloader going
        this.state.start('Preloader');

    }
};
