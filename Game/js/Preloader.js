Mainframe.Preloader = function(game) {

  this.ready = false;
  this.loadingText = null;

};

Mainframe.Preloader.prototype = {

  preload: function() {

    this.game.stage.backgroundColor = '#1b1b1b';

    this.loadingText = this.game.add.bitmapText(200, 30, 'green_font', 'Loading...', 30);
    Mainframe.centreText(this.loadingText, this.game.width);

    this.game.add.sprite(35, 50, 'loading_bar_empty');
    this.game.load.setPreloadSprite(this.game.add.sprite(52, 67, 'loading_bar_full'));

    this.game.add.sprite(0, 0, 'monitor');

    this.game.load.atlasJSONHash('atlas', 'assets/sprites/mainframe_sprites.png', 'assets/sprites/mainframe_sprites.json');

    // Sounds
    this.game.load.audio('intro_music', 'assets/sounds/mainframe_beep.mp3');
    this.game.load.audio('flatline', 'assets/sounds/flatline.mp3');
    this.game.load.audio('subroutine_victory', 'assets/sounds/subroutine_victory.mp3');
    this.game.load.audio('subroutine_failure', 'assets/sounds/subroutine_failure.mp3');
    this.game.load.audio('selection', 'assets/sounds/selection.mp3');
    this.game.load.audio('black_ice_warning', 'assets/sounds/black_ice_warning.mp3');
    this.game.load.audio('key_press_0', 'assets/sounds/key_press_0.mp3');
    this.game.load.audio('key_press_1', 'assets/sounds/key_press_1.mp3');
    this.game.load.audio('key_press_2', 'assets/sounds/key_press_2.mp3');
    this.game.load.audio('key_press_3', 'assets/sounds/key_press_3.mp3');
    this.game.load.audio('key_press_4', 'assets/sounds/key_press_4.mp3');
    this.game.load.audio('key_press_5', 'assets/sounds/key_press_5.mp3');
    this.game.load.audio('character_cracked', 'assets/sounds/character_cracked.mp3');
    this.game.load.audio('ICE_enabled', 'assets/sounds/iceenabled.mp3');
    this.game.load.audio('entity_enabled', 'assets/sounds/entity_enabled.mp3');
    this.game.load.audio('entity_removed', 'assets/sounds/entity_removed.mp3');
    this.game.load.audio('movement', 'assets/sounds/movement.mp3');
    this.game.load.audio('paddle_hit', 'assets/sounds/paddle_hit.mp3');
    this.game.load.audio('block_hit', 'assets/sounds/block_hit.mp3');
    this.game.load.audio('start_up', 'assets/sounds/start_up.mp3');
    this.game.load.audio('fan_loop', 'assets/sounds/fan_loop.mp3');

    // Music
    this.game.load.audio('main_music_1', 'assets/music/The Way Out.mp3');

    // Animations
    this.game.load.spritesheet('bg_flicker', 'assets/animations/bg_flicker.png', 960, 540, 7);
    this.game.load.spritesheet('bg_flicker_on', 'assets/animations/bg_flicker_on.png', 960, 540, 6);
    this.game.load.spritesheet('trace_detected', 'assets/animations/trace_detected.png', 893, 62, 7);
    this.game.load.spritesheet('icebreak_in_progress', 'assets/animations/icebreak_in_progress.png', 893, 61, 7);
    this.game.load.spritesheet('black_ice_detected', 'assets/animations/black_ice_detected.png', 851, 69, 6);
    this.game.load.spritesheet('bot_offline', 'assets/animations/bot_offline.png', 147, 142, 7);
    this.game.load.spritesheet('bot_online', 'assets/animations/bot_online.png', 147, 142, 7);
    this.game.load.spritesheet('conn_activate', 'assets/animations/conn_activate.png', 40, 27, 7);
    this.game.load.spritesheet('crash', 'assets/animations/crash.png', 960, 540, 4);
    this.game.load.spritesheet('ICE_broken', 'assets/animations/ICE_broken.png', 50, 203, 7);
    this.game.load.spritesheet('ICE_activate', 'assets/animations/ICE_activate.png', 50, 203, 6);
    this.game.load.spritesheet('mainframe_accessed', 'assets/animations/mainframe_accessed.png', 128, 203, 7);
    this.game.load.spritesheet('mainframe_logo', 'assets/animations/mainframe_logo.png', 857, 136, 12);
    this.game.load.spritesheet('MF_conn_activate', 'assets/animations/MF_conn_activate.png', 107, 27, 7);
    this.game.load.spritesheet('proxy_activate', 'assets/animations/proxy_activate.png', 57, 203, 6);
    this.game.load.spritesheet('proxy_deactivate', 'assets/animations/proxy_deactivate.png', 57, 203, 12);
    this.game.load.spritesheet('selected_ICE', 'assets/animations/selected_ICE.png', 50, 203, 2);
    this.game.load.spritesheet('skull_error', 'assets/animations/skull_error.png', 101, 89, 5);
    this.game.load.spritesheet('stack_smashed', 'assets/animations/stack_smashed.png', 264, 374, 6);
    this.game.load.spritesheet('subroutine_complete', 'assets/animations/subroutine_complete.png', 851, 69, 6);
    this.game.load.spritesheet('subroutine_failed', 'assets/animations/subroutine_failed.png', 851, 69, 6);
    this.game.load.spritesheet('victory_banner', 'assets/animations/victory_banner.png', 851, 114, 6);
    this.game.load.spritesheet('victory_blink', 'assets/animations/victory_blink.png', 851, 114, 6);

  },

  create: function() {


  },

  update: function() {

    //You don't actually need to do this, but I find it gives a much smoother game experience.
    //Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
    //You can jump right into the menu if you want and still play the music, but you'll have a few
    //seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
    //it's best to wait for it to decode here first, then carry on.

    //If you don't have any music in your game then put the game.state.start line into the create function and delete
    //the update function completely.

    if (this.cache.isSoundDecoded('intro_music') && this.ready == false) {
      Mainframe.fanLoop = this.add.audio('fan_loop', 1, true);
      Mainframe.mainMusic = this.add.audio('main_music_1', 1, true);
      this.ready = true;
      this.state.start('MainMenu');
    }

  }

};
