
MainframeGame.Preloader = function (game) {

	this.ready = false;
	this.loadingText = null;

};

MainframeGame.Preloader.prototype = {

	preload: function () {

		this.game.stage.backgroundColor = '#1b1b1b';
	 
		this.loadingText = this.game.add.bitmapText(200,270, 'green_font', 'Loading...', 30);
		centreText(this.loadingText, this.game.width);

		this.game.add.sprite(0,0,'monitor');		
		

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		//IMPORTANT
		//this.load.setPreloadSprite(this.preloadBar);

		this.game.load.atlasJSONHash('atlas', 'assets/sprites/mainframe_sprites.png', 'assets/sprites/mainframe_sprites.json');
		
		//Special Phaser Credits
		this.load.image('phaser_credits', 'assets/sprites/phaser_pixel_large_shaded.png');
		
		// Sounds
		this.game.load.audio('intro_music', 'assets/sounds/mainframe_beep.mp3');
		this.game.load.audio('subroutine_rush', 'assets/sounds/subroutine_rush.mp3');

		// Animations
		this.game.load.spritesheet('bg_flicker', 'assets/animations/bg_flicker.png', 960, 540, 7);
		this.game.load.spritesheet('trace_detected', 'assets/animations/trace_detected.png', 893, 62, 7);
		this.game.load.spritesheet('icebreak_in_progress', 'assets/animations/icebreak_in_progress.png', 893, 61, 7);
		this.game.load.spritesheet('black_ice_detected', 'assets/animations/black_ice_detected.png', 851, 69, 6);
		this.game.load.spritesheet('bot_offline', 'assets/animations/bot_offline.png', 147, 142, 7);
		this.game.load.spritesheet('bot_online', 'assets/animations/bot_online.png', 147, 142, 7);
		this.game.load.spritesheet('conn_activate', 'assets/animations/conn_activate.png', 40, 27, 7);
		this.game.load.spritesheet('crash', 'assets/animations/crash.png', 960, 540, 4);
		this.game.load.spritesheet('ICE_broken', 'assets/animations/ICE_broken.png', 50, 203, 7);
		this.game.load.spritesheet('mainframe_accessed', 'assets/animations/mainframe_accessed.png', 128, 203, 7);
		this.game.load.spritesheet('mainframe_logo', 'assets/animations/mainframe_logo.png', 857, 136, 12);
		this.game.load.spritesheet('MF_conn_activate', 'assets/animations/MF_conn_activate.png', 107, 27, 7);
		this.game.load.spritesheet('proxy_activate', 'assets/animations/proxy_activate.png', 57, 203, 6);
		this.game.load.spritesheet('proxy_deactivate', 'assets/animations/proxy_deactivate.png', 57, 203, 12);
		this.game.load.spritesheet('selected_ICE', 'assets/animations/selected_ICE.png', 50, 203, 2);
		this.game.load.spritesheet('skull_error', 'assets/animations/skull_error.png', 101, 89, 5);
		this.game.load.spritesheet('stack_smashed', 'assets/animations/stack_smashed.png', 264, 374, 6);
		this.game.load.spritesheet('subroutine_complete','assets/animations/subroutine_complete.png', 851, 69, 6);
		this.game.load.spritesheet('subroutine_failed', 'assets/animations/subroutine_failed.png', 851, 69, 6);
		this.game.load.spritesheet('victory_banner', 'assets/animations/victory_banner.png', 851, 114, 6);
		this.game.load.spritesheet('victory_blink', 'assets/animations/victory_blink.png', 851, 114, 6);

	},

	create: function () {


	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		if (this.cache.isSoundDecoded('intro_music') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}

	}

};
