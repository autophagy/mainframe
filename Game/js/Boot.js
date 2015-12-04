var MainframeGame = {

	//Globals go here!
    hackerName: '',

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
    	MainframeGame.centreSprite(timerBar, context.game.width);
    	timerBar.animations.add('anim');
    	timerBar.animations.play('anim', 16, false);
    	timerBar.events.onAnimationComplete.add(function() {
            this.timerTime = this.game.time.now;
            this.timerStartTime = this.timerTime;
    	    context.ready = true;
    		}, context);

    	context.timerBlock = context.game.add.sprite(10,fillY,'atlas', 'Subroutines/General/trace_bar_full.png');
    	MainframeGame.centreSprite(context.timerBlock, context.game.width);
    	context.timerLayer.add(context.timerBlock);

    	context.timerBlock.width = 0;
    },

    incTimer: function(context, isTrace) {
        var finishedFunc = isTrace ? function() { context.failure(); }.bind(context) : function() { context.victory(); }.bind(context);

        var barWidth = 859;
        var percentage = (context.game.time.now - context.timerStartTime) / context.timeLimit;
        context.timerBlock.width = percentage*barWidth;

        if (percentage >= 1)
        {
            context.ready = false;
            finishedFunc();
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
    }


};

MainframeGame.Boot = function (game) {

};

MainframeGame.Boot.prototype = {

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
		this.game.load.bitmapFont('green_font', 'assets/fonts/green_font.png', 'assets/fonts/green_font.xml');
		this.game.load.bitmapFont('white_font', 'assets/fonts/white_font.png', 'assets/fonts/white_font.xml');

    },

    create: function () {

        //  By this point the preloader assets have loaded to the cache, we've set the game settings
        //  So now let's start the real preloader going
        this.generateHackerName();
        this.state.start('Preloader');

    },

    generateHackerName: function () {

        var doubleNouns = ['Zero', 'Cool', 'Acid', 'Burn', 'Crash', 'Override', 'Flatline', 'Puppet', 'Master', 'Flux', 'Neon', 'Null', 'Void', 'Lord', 'King', 'Queen', 'Cyber', 'Net', 'Mantis', 'Soul', 'Shadow'];

        var doubleVerbs = ['Laughing', 'Crying', 'Deadly', 'Crouching', 'Hidden', 'Pale', 'White', 'Black', 'Red', 'Dead', 'Toxic'];

        var singleNouns = ['Morpheus', 'Trinity', 'Maelcum', 'Hideo', 'Pandora', 'Ozymandias', 'Xerxes', 'Turing', 'Tracer', 'Phoenix'];

        var probability = Math.random();

        if (probability <= 0.5) {
            var n = doubleNouns[Math.floor(Math.random()*doubleNouns.length)];
            var n2 = doubleNouns[Math.floor(Math.random()*doubleNouns.length)];

            while (n == n2) {
                n2 = doubleNouns[Math.floor(Math.random()*doubleNouns.length)];
            }

            MainframeGame.hackerName = n + ' ' + n2;
        }

        if (probability > 0.5 && probability <= 0.9) {
            MainframeGame.hackerName = doubleVerbs[Math.floor(Math.random()*doubleVerbs.length)] + ' ' + doubleNouns[Math.floor(Math.random()*doubleNouns.length)];
        }

        if (probability > 0.9) {
            MainframeGame.hackerName = singleNouns[Math.floor(Math.random()*singleNouns.length)];
        }

        if (Math.random() <= 0.33) {
            MainframeGame.hackerName = MainframeGame.hackerName.replace(/a/g,'4').replace(/e/g,'3').replace(/s/g,'5').replace(/o/g,'0');
        }
    }


};
