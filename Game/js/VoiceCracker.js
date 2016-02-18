Mainframe.VoiceCracker = function(game) {

  // Standard Layering

  this.templateLayer = null;
  this.activeLayer = null;
  this.dialLayer = null;
  this.tutorialLayer = null;
  this.timerLayer = null;
  this.monitorLayer = null;

  // Timer

  this.timerBlock = null;
  this.timerTime = null;
  this.timerStartTime = null;
  this.timeLimit = Phaser.Timer.SECOND * 10;

  this.dials = null;
  this.selectedDial = null;
  this.waveHeights = null;
  this.goalConfig = null;
  this.playerConfig = null;

  this.music = null;
  this.selectionSound = null;

  this.ready = false;

};

Mainframe.VoiceCracker.prototype = {

  create: function() {
    this.templateLayer = this.game.add.group();
    this.activeLayer = this.game.add.group();
    this.dialLayer = this.game.add.group();
    this.tutorialLayer = this.game.add.group();
    this.timerLayer = this.game.add.group();
    this.monitorLayer = this.game.add.group();
    this.monitorLayer.add(this.game.add.sprite(0, 0, 'atlas', 'General/monitor.png'));

    var t = '> man MIMIC';
    t += '\n\nNAME'
    t += '\n  MIMIC - Synthesiser for voice activated password cracking';
    t += '\n\nDESCRIPTION'
    t += '\n  Use the modulation dials to mimic the waveform of a known login.';
    t += '\n  Press H to hide the constructed waveform, if needed.'

    Mainframe.setupTutorial(this, t);
  },

  update: function() {

    if (this.ready) {
      if (this.game.time.now - this.timerTime >= Phaser.Timer.SECOND) {
        this.timerTime = this.game.time.now;
        Mainframe.incTimer(this, true);
      }
    }

  },

  setupGame: function() {
    this.waveHeights = [];
    for (var i = 0; i < 20; i++) {
      this.waveHeights.push(Math.random());
    }

    this.goalConfig = [];
    for (var i = 0; i < 3; i++) {
      this.goalConfig[i] = Math.floor(Math.random() * 4);
    }

    this.playerConfig = [];
    for (var i = 0; i < 3; i++) {
      var v = this.goalConfig[i];
      while (v == this.goalConfig[i]) {
        v = Math.floor(Math.random() * 4);
      }
      this.playerConfig[i] = v
    }

    this.renderConfiguration(this.goalConfig[0], this.goalConfig[1], this.goalConfig[2], false);

    var dialNames = ['FREQUENCY', 'WAVELENGTH', 'AMPLITUDE'];
    this.dials = [];
    for (var i = 0; i < 3; i++) {
      this.dials.push(new VoiceDial(this, 250 + (179 * i), 360, dialNames[i], this.playerConfig[i]));
    }

    var cursors = this.game.input.keyboard.createCursorKeys();
    var hideKey = this.game.input.keyboard.addKey(Phaser.Keyboard.H);
    hideKey.onDown.add(function() { this.activeLayer.alpha = 0; }, this);
    hideKey.onUp.add(function() { this.activeLayer.alpha = 1; }, this);


    cursors.left.onDown.add(function() {
      this.moveSelection(-1);
    }, this);
    cursors.right.onDown.add(function() {
      this.moveSelection(1);
    }, this);

    var space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space.onDown.add(this.turnDial, this);

    this.selectionSound = this.add.audio('selection');
  },

  initGame: function() {
    this.game.time.events.add(Phaser.Timer.SECOND, function() {
      Mainframe.initTimer(this, true);
      this.renderConfiguration(this.playerConfig[0], this.playerConfig[1], this.playerConfig[2], true);
      this.selectedDial = 0;
      this.dials[this.selectedDial].toggleActive();
    }, this);
  },

  renderConfiguration: function(frequency, wavelength, amplitude, active) {
    var s = active ? 'active' : 'template';
    var l = active ? this.activeLayer : this.templateLayer;
    var a = 1 + ((amplitude - 1) * 0.2);
    var w = 1 + ((wavelength - 1) * 0.2);

    l.removeAll(true);

    var bits = [];

    var initialX = (this.game.width / 2) - ((((frequency + 1) * 4) * ((77 - Math.pow(10, w)) * 0.75)) / 2);

    for (var i = 0; i < (frequency + 1) * 4; i++) {
      bits.push(this.game.add.sprite(initialX, 220, 'atlas', 'Subroutines/Voice_Cracker/' + s + '_freq.png'));
      bits[i].anchor.setTo(0, 0.5);
      bits[i].height = 9 * ((a * Math.floor(this.waveHeights[i] * 21) + 4));
      bits[i].width = 80 - Math.pow(10, w);
      bits[i].x = bits[i].x + ((bits[i].width * 0.7) * i);
      l.add(bits[i]);
    }

    var base = this.game.add.sprite(200, 220, 'atlas', 'Subroutines/Voice_Cracker/' + s + '_base.png');
    Mainframe.centreSprite(base, this.game.width);
    l.add(base);
    base.anchor.setTo(0, 0.5);
  },

  updateActiveWave: function() {
    this.renderConfiguration(this.playerConfig[0], this.playerConfig[1], this.playerConfig[2], true);
  },

  validConfig: function() {
    for (var i = 0; i < this.playerConfig.length; i++) {
      if (this.playerConfig[i] != this.goalConfig[i]) {
        return false;
      }
    }
    return true;
  },

  moveSelection: function(direction) {
    if (this.ready) {
      this.dials[this.selectedDial].toggleActive();
      this.selectedDial += direction;
      if (this.selectedDial < 0) this.selectedDial = 2;
      if (this.selectedDial > 2) this.selectedDial = 0;
      this.dials[this.selectedDial].toggleActive();
    }
  },

  turnDial: function() {
    if (this.ready) {
      this.selectionSound.play();
      this.playerConfig[this.selectedDial]++;
      if (this.playerConfig[this.selectedDial] > 3) this.playerConfig[this.selectedDial] = 0;
      this.dials[this.selectedDial].rotateDial(this.playerConfig[this.selectedDial]);
      this.updateActiveWave();
      if (this.validConfig()) {
        this.ready = false;
        this.activeLayer.alpha = 1;
        Mainframe.subroutineVictory(this);
      }
    }
  }
};

var VoiceDial = (function() {
  function VoiceDial(context, x, y, name, rotation) {
    this.context = context;
    this.sprite = context.game.add.sprite(x, y, 'atlas', 'Subroutines/Voice_Cracker/cracker_button.png');
    this.activeSprite = context.game.add.sprite(x - 2, y - 2, 'atlas', 'Subroutines/Voice_Cracker/active_button.png');
    this.activeSprite.alpha = 0;
    this.dial = context.game.add.sprite(x + (this.sprite.width / 2), y + (this.sprite.height / 2), 'atlas', 'Subroutines/Voice_Cracker/cracker_dial.png');
    this.dial.anchor.setTo(0.5, 0.57);
    this.dial.smoothed = false;
    this.rotateDial(rotation);
    this.text = context.game.add.bitmapText(x + (this.sprite.width / 2) - 5, y + 110, 'green_font', name, 23);
    this.text.anchor.setTo(0.5, 0.5);

    this.context.dialLayer.add(this.sprite);
    this.context.dialLayer.add(this.activeSprite);
    this.context.dialLayer.add(this.dial);
    this.context.dialLayer.add(this.text);

  }

  VoiceDial.prototype.rotateDial = function(dialPosition) {
    this.dial.angle = dialPosition * 90;
  };

  VoiceDial.prototype.toggleActive = function() {
    this.activeSprite.alpha = 1 - this.activeSprite.alpha;
  };


  return VoiceDial;
})();
