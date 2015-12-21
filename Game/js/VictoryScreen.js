Mainframe.VictoryScreen = function (game) {

	this.music = null;

	this.dataValueText = null;
	this.totalEarnedText = null;

	this.dataValue = null;

};

Mainframe.VictoryScreen.prototype = {

	create: function () {

		Mainframe.centreSprite(this.game.add.sprite(0, 70, 'atlas', 'Victory_Screen/run_successful.png'), this.game.width);
		Mainframe.centreText(this.game.add.bitmapText(0,175, 'green_font', Mainframe.corpName[0] +' Data Obtained: ', 36), this.game.width);
		Mainframe.centreSprite(this.game.add.sprite(0, 200, 'atlas', 'Victory_Screen/data_obtained_bar.png'), this.game.width);

		this.game.add.bitmapText(276,260, 'green_font', 'Corp Difficulty: ', 28);
		this.game.add.bitmapText(333,285, 'green_font', 'Data Value: ', 28);
		this.game.add.bitmapText(304,310, 'green_font', 'Total Earned: ', 28);

		this.game.add.bitmapText(480, 260, 'green_font', '1.0x', 28);

		var percentage = 100 - ((3 - Mainframe.hackerProxies.length ) * 20)
		var value = percentage * 48;
		value = value * Mainframe.corpDifficulty;
		Mainframe.totalEarned += value;

		this.dataValueText = this.game.add.bitmapText(480, 285, 'green_font', value + 'C', 28);
		this.totalEarnedText = this.game.add.bitmapText(480, 310, 'green_font', Mainframe.totalEarned + 'C', 28);

		var b = this.game.add.sprite(121, 217,'atlas', 'Subroutines/General/trace_bar_full.png');
		b.width = 0;
		b.height = 30;
		b.alpha = 0.8;

		this.game.add.tween(b).to( { width: (percentage/100)*718 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);

		var bg_flicker = this.game.add.sprite(0, 0, 'bg_flicker');
		bg_flicker.animations.add('anim');
		bg_flicker.animations.play('anim', 16, false);

		this.game.add.sprite(0,0,'atlas','General/monitor.png');
	}

};
