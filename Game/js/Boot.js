var MainframeGame = {

	//Globals go here!

};

MainframeGame.Boot = function (game) {

};

MainframeGame.Boot.prototype = {

    init: function () {

        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = false;

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
        this.state.start('Preloader');

    }
	

};

// Misc Global Functions

function centreSprite(sprite, width) {
		sprite.x = (width/2) - Math.floor(sprite.width/2);
		return sprite;
}


function centreText(text, width) {
	text.align = 'center';
	text.x = width/2 - text.textWidth/2;
	return text;
}


