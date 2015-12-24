
Mainframe.MainMenu = function (game) {
	this.elementLayer = null;
	this.monitorLayer = null;

	this.music = null;
	this.firstBoot = true;
	this.gameSelected = true;

	this.cyberpunkText = null;
	this.gameOption = null;
	this.creditsOption = null;
	this.selectionIcon = null;

	this.selectionSound = null;
};

Mainframe.MainMenu.prototype = {

	create: function () {
		this.elementLayer = this.game.add.group();
		this.monitorLayer = this.game.add.group();

		this.monitorLayer.add(this.game.add.sprite(0,0,'atlas','General/monitor.png'));

		if(this.firstBoot) {
			// I'm sorry, but this is a requirement.
			this.cyberpunkText = this.game.add.bitmapText(0,100,'green_font', 'This is dedicated to all those\ncyberpunks who fight against injustice\nevery day of their lives.', 30);
			Mainframe.centreText(this.cyberpunkText, this.game.width);
			this.elementLayer.add(this.cyberpunkText);
			this.game.time.events.add(Phaser.Timer.SECOND * 3, this.renderMainMenu, this);
		} else
		{
		   this.renderMainMenu();
		}
	},

	renderMainMenu : function () {
		if(this.firstBoot) {
			this.cyberpunkText.destroy();
			this.music = this.add.audio('intro_music');
			this.music.play();
			this.firstBoot = false;
		}

		this.selectionSound = this.add.audio('selection');

		var title = this.game.add.sprite(0, 100, 'mainframe_logo');
		this.elementLayer.add(title);
		Mainframe.centreSprite(title, this.game.width);
		title.animations.add('anim');
		title.animations.play('anim', 16, false);

		this.gameOption = this.game.add.bitmapText(0,400, 'green_font', 'Hack The Planet', 30);
		Mainframe.centreText(this.gameOption, this.game.width);
		this.elementLayer.add(this.gameOption);

		this.creditsOption = this.game.add.bitmapText(0,430, 'green_font', 'Credits', 30);
		Mainframe.centreText(this.creditsOption, this.game.width);
		this.elementLayer.add(this.creditsOption);

		this.selectionIcon = this.game.add.bitmapText(200,430, 'green_font', '>', 30);
		this.elementLayer.add(this.selectionIcon);

		var cursors = this.game.input.keyboard.createCursorKeys();

		cursors.down.onDown.add(this.toggleSelection, this);
		cursors.up.onDown.add(this.toggleSelection, this);

		var space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		space.onDown.add(this.select, this);

		this.repositionSelector();

		// Reset game variables
		Mainframe.corpDifficulty = 1.0;
		Mainframe.totalEarned = 0;
	},

	toggleSelection: function () {
		this.selectionSound.play();
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
		this.music.stop();
		if(this.gameSelected) {
			var bg_flicker = this.game.add.sprite(0, 0, 'bg_flicker_on');
			this.elementLayer.add(bg_flicker);
			bg_flicker.animations.add('anim');
			bg_flicker.animations.play('anim', 16, false);
			bg_flicker.events.onAnimationComplete.add(function () {
				this.state.start('MainScreen', true, false, true, null);
			}, this);
		} else {
			this.state.start('Credits');
		}
	}
};
