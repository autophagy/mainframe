Mainframe.DeathScreen = function(game) {

  this.music = null;

};

Mainframe.DeathScreen.prototype = {

  create: function() {

    Mainframe.centreSprite(this.game.add.sprite(0, 80, 'atlas', 'Death_Screen/flatlined.png'), this.game.width);

    Mainframe.centreText(this.game.add.bitmapText(0, 420, 'green_font', '> Main Menu', 30), this.game.width);

    var bg_flicker = this.game.add.sprite(0, 0, 'bg_flicker');
    bg_flicker.animations.add('anim');
    bg_flicker.animations.play('anim', 16, false);

    this.game.add.sprite(0, 0, 'atlas', 'General/monitor.png');

    var space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space.onDown.addOnce(function() {
      this.state.start('MainMenu')
    }, this);
  }

};
