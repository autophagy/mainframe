
MainframeGame.MainMenu = function (game) {

	this.music = null;
	this.gameSelected = true;
	
	this.gameOption = null;
	this.creditsOption = null;
	this.selectionIcon = null;

};

MainframeGame.MainMenu.prototype = {

	create: function () {

		var title = this.game.add.sprite(0, 100, 'mainframe_logo');
		centreSprite(title, this.game.width);
		title.animations.add('anim');
		title.animations.play('anim', 16, false);		
		
		var text = this.game.add.bitmapText(0,250, 'green_font', 'Subroutine Development Initative\nCurrent Subroutine: Password Cracker', 30);
		centreText(text, this.game.width);
		
		this.gameOption = this.game.add.bitmapText(0,400, 'green_font', 'Hack The Planet', 30);
		centreText(this.gameOption, this.game.width);
		
		this.creditsOption = this.game.add.bitmapText(0,430, 'green_font', 'Credits', 30);
		centreText(this.creditsOption, this.game.width);
		
		this.selectionIcon = this.game.add.bitmapText(200,430, 'green_font', '>', 30);
		
		
		//this.music = this.add.audio('intro_music');
		//this.music.play();	
		
		this.game.add.sprite(0,0,'atlas','General/monitor.png');
		
		var cursors = this.game.input.keyboard.createCursorKeys();
		
		cursors.down.onDown.add(this.toggleSelection, this);
		cursors.up.onDown.add(this.toggleSelection, this);
		
		var space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		space.onDown.addOnce(this.select, this);
		
		this.repositionSelector();

	},

	update: function () {

		//	Do some nice funky main menu effect here

	},
	
	toggleSelection: function () {
		this.gameSelected = !this.gameSelected;		
		this.repositionSelector();
		
	},
	
	repositionSelector: function () {
		if(this.gameSelected) {
			this.selectionIcon.y = this.gameOption.y;
			this.selectionIcon.x = this.gameOption.x - 15;
		} else {
			this.selectionIcon.y = this.creditsOption.y;
			this.selectionIcon.x = this.creditsOption.x - 15;
		}
	},

	select: function () {

		if(this.gameSelected) {
			//Start gam
		} else {
			this.state.start('Credits');
		}
		//	And start the actual game
		//this.state.start('Game');

	}
};
