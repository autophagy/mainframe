Mainframe.VictoryScreen = function (game) {

	this.elementLayer = null;
	this.monitorLayer = null;

	this.music = null;

	this.dataValueText = null;
	this.totalEarnedText = null;

	this.dataValue = null;

	this.nextCorpOption = null;
	this.exitOption = null;
	this.selectionIcon = null;
	this.nextCorpSelected = null;

};

Mainframe.VictoryScreen.prototype = {

	create: function () {
		this.elementLayer = this.game.add.group();
		this.monitorLayer = this.game.add.group();

		this.elementLayer.add(Mainframe.centreSprite(this.game.add.sprite(0, 70, 'atlas', 'Victory_Screen/run_successful.png'), this.game.width));
		this.elementLayer.add(Mainframe.centreText(this.game.add.bitmapText(0,175, 'green_font', Mainframe.corpName[0] +' Data Obtained: ', 36), this.game.width));
		this.elementLayer.add(Mainframe.centreSprite(this.game.add.sprite(0, 200, 'atlas', 'Victory_Screen/data_obtained_bar.png'), this.game.width));

		this.elementLayer.add(this.game.add.bitmapText(276,260, 'green_font', 'Corp Difficulty: ', 28));
		this.elementLayer.add(this.game.add.bitmapText(333,285, 'green_font', 'Data Value: ', 28));
		this.elementLayer.add(this.game.add.bitmapText(304,310, 'green_font', 'Total Earned: ', 28));

		this.elementLayer.add(this.game.add.bitmapText(480, 260, 'green_font', Mainframe.corpDifficulty.toFixed(1) + 'x', 28));

		var percentage = 100 - ((3 - Mainframe.hackerProxies.length ) * 20)
		var value = percentage * 48;
		value = value * Mainframe.corpDifficulty;
		Mainframe.totalEarned += value;

		this.dataValueText = this.game.add.bitmapText(480, 285, 'green_font', value + 'C', 28);
		this.elementLayer.add(this.dataValueText);
		this.totalEarnedText = this.game.add.bitmapText(480, 310, 'green_font', Mainframe.totalEarned + 'C', 28);
		this.elementLayer.add(this.totalEarnedText);

		var b = this.game.add.sprite(121, 217,'atlas', 'Subroutines/General/trace_bar_full.png');
		this.elementLayer.add(b)
		b.width = 0;
		b.height = 30;
		b.alpha = 0.8;

		this.game.add.tween(b).to( { width: (percentage/100)*718 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);

		this.nextCorpOption = this.game.add.bitmapText(0,400, 'green_font', 'Next Corp', 30);
		Mainframe.centreText(this.nextCorpOption, this.game.width);
		this.elementLayer.add(this.nextCorpOption);

		this.exitOption = this.game.add.bitmapText(0,430, 'green_font', 'Exit', 30);
		Mainframe.centreText(this.exitOption, this.game.width);
		this.elementLayer.add(this.exitOption);

		this.selectionIcon = this.game.add.bitmapText(200,430, 'green_font', '>', 30);
		this.elementLayer.add(this.selectionIcon);

		var cursors = this.game.input.keyboard.createCursorKeys();

		cursors.down.onDown.add(this.toggleSelection, this);
		cursors.up.onDown.add(this.toggleSelection, this);

		var space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		space.onDown.add(this.select, this);

		this.nextCorpSelected = true;

		this.repositionSelector();
		var bg_flicker = this.game.add.sprite(0, 0, 'bg_flicker');
		this.elementLayer.add(bg_flicker);
		bg_flicker.animations.add('anim');
		bg_flicker.animations.play('anim', 16, false);

		this.monitorLayer.add(this.game.add.sprite(0,0,'atlas','General/monitor.png'))
	},

	toggleSelection: function () {
		this.nextCorpSelected = !this.nextCorpSelected;
		this.repositionSelector();
	},

	repositionSelector: function () {
		if(this.nextCorpSelected) {
			this.selectionIcon.y = this.nextCorpOption.y;
			this.selectionIcon.x = this.nextCorpOption.x - 15;
		} else {
			this.selectionIcon.y = this.exitOption.y;
			this.selectionIcon.x = this.exitOption.x - 15;
		}
	},

	select: function () {
		var bg_flicker = this.game.add.sprite(0, 0, 'bg_flicker_on');
		this.elementLayer.add(bg_flicker);
		bg_flicker.animations.add('anim');
		bg_flicker.animations.play('anim', 16, false);
		bg_flicker.events.onAnimationComplete.add(function () {
			if(this.nextCorpSelected) {
				Mainframe.corpDifficulty += 0.2;
				this.state.start('MainScreen', true, false, true, null);
			} else {
				this.state.start('MainMenu');
			}
		}, this);
	}
};
