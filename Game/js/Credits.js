MainframeGame.Credits = function (game) {

	this.music = null;


};

MainframeGame.Credits.prototype = {

	create: function () {

		MainframeGame.centreText(this.game.add.bitmapText(0,50, 'green_font', 'CREDITS', 40), this.game.width);
		MainframeGame.centreText(this.game.add.bitmapText(0,170, 'green_font', 'Words, pictures and code by Mika / Autophagy', 30), this.game.width);
		MainframeGame.centreText(this.game.add.bitmapText(0,200, 'green_font', 'Music by ????', 30), this.game.width);
		MainframeGame.centreText(this.game.add.bitmapText(0,260, 'green_font', 'Made with:', 30), this.game.width);

		MainframeGame.centreText(this.game.add.bitmapText(0,420, 'green_font', '> Back', 30), this.game.width);

		this.game.add.sprite(390,300,'phaser_credits');

		var bg_flicker = this.game.add.sprite(0, 0, 'bg_flicker');
		bg_flicker.animations.add('anim');
		bg_flicker.animations.play('anim', 16, false);

		this.game.add.sprite(0,0,'atlas','General/monitor.png');

		var space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		space.onDown.addOnce(function () { this.state.start('MainMenu')}, this);
	}

};
