Mainframe.StackOverflow = function(game) {

  // Standard Layering

  this.elementLayer = null;
  this.payloadLayer = null;
  this.tutorialLayer = null;
  this.timerLayer = null;
  this.monitorLayer = null;

  // Timer

  this.timerBlock = null;
  this.timerTime = null;
  this.timerStartTime = null;
  this.timeLimit = Phaser.Timer.SECOND * 10;

  this.stackFrames = null;
  this.selectedStack = null;
  this.payloadInjecting = null;

  this.music = null;

  this.ready = false;

};

Mainframe.StackOverflow.prototype = {

  create: function() {
    this.elementLayer = this.game.add.group();
    this.payloadLayer = this.game.add.group();
    this.tutorialLayer = this.game.add.group();
    this.timerLayer = this.game.add.group();
    this.monitorLayer = this.game.add.group();
    this.monitorLayer.add(this.game.add.sprite(0, 0, 'atlas', 'General/monitor.png'));

    var t = '> man STACK_SMASHER';
    t += '\n\nNAME'
    t += '\nSTACK_SMASHER - Stack buffer overflow exploiter';
    t += '\n\nDESCRIPTION'
    t += '\nHold down space to start generating values in the stack buffer.';
    t += '\nWhen the data reaches the return address area, release space to';
    t += '\njump to the next stack. Jump from 3 buffers to inject your';
    t += '\nICE-BREAK payload.';

    Mainframe.setupTutorial(this, t);
  },

  update: function() {

    if (this.ready) {
      if (this.game.time.now - this.timerTime >= Phaser.Timer.SECOND) {
        this.timerTime = this.game.time.now;
        Mainframe.incTimer(this, true);
      }

      if (this.payloadInjecting) {
        this.stackFrames[this.selectedStack].movePayload();
      }

    }

  },

  setupGame: function() {
    this.stackFrames = [];
    for (var i = 0; i < 3; i++) {
      this.stackFrames.push(new StackFrame(this, 80 + (270 * i), 85, i + 1));
    }
    this.selectedStack = -1;
    this.selectNextStack();

    this.payloadInjecting = false;

    var payloadKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    payloadKey.onDown.add(function() {
      this.payloadInjecting = true;
    }, this);
    payloadKey.onUp.add(function() {
      this.payloadInjecting = false;
      if (this.stackFrames[this.selectedStack].payloadInjected()) {
        this.selectNextStack();
      } else {
        this.stackFrames[this.selectedStack].resetPayload();
      }
    }, this);
  },

  initGame: function() {
    Mainframe.initTimer(this, true);
  },

  selectNextStack: function() {
    this.selectedStack++;
    if (this.selectedStack > 2) {
      this.ready = false;
      Mainframe.subroutineVictory(this);
    } else {
      this.stackFrames[this.selectedStack].selectFrame();
    }
  }

};

var StackFrame = (function() {
  function StackFrame(context, x, y, difficulty) {
    this.context = context;
    this.sprite = context.game.add.sprite(x, y, 'atlas', 'Subroutines/Stack_Overflow/stack_frame.png');

    this.speed = 6 * difficulty;

    var returnAddr = Math.floor(Math.random() * 230);
    returnAddr = y + returnAddr + 50;

    this.returnBounds = new Phaser.Rectangle(x + 18, returnAddr, 228, 38);
    this.returnSprite = context.game.add.sprite(x + 17, returnAddr - 13, 'atlas', 'Subroutines/Stack_Overflow/return_addr.png');

    this.upperStackText = context.game.add.bitmapText(x + 50, y + ((returnAddr - y) / 2) - 5, 'white_font', 'STACK SPACE', 26);
    this.lowerStackText = context.game.add.bitmapText(x + 50, (returnAddr + 38) + ((this.sprite.bottom - (returnAddr + 38)) / 2) - 20, 'white_font', 'STACK SPACE', 26);;

    this.context.elementLayer.add(this.sprite);
    this.context.elementLayer.add(this.upperStackText);
    this.context.elementLayer.add(this.lowerStackText);
    this.context.elementLayer.add(this.returnSprite);
  };

  StackFrame.prototype.selectFrame = function() {
    this.payload = this.context.game.add.sprite(this.sprite.x + 6, this.sprite.bottom - 49, 'atlas', 'Subroutines/Stack_Overflow/payload_bar.png');
    this.payloadBounds = new Phaser.Rectangle(this.payload.x + 12, this.payload.bottom - 17, this.payload.width - 24, 5);
    this.context.elementLayer.add(this.payload);

  };

  StackFrame.prototype.movePayload = function() {
    if (this.payload.y + this.speed < 80) {
      this.payload.y = 80;
      this.speed = this.speed * -1;
    } else if (this.payload.y + this.speed > this.sprite.bottom - 49) {
      this.payload.y = this.sprite.bottom - 49;
      this.speed = this.speed * -1;
    } else {
      this.payload.y += this.speed;
    }
    this.payloadBounds.y = this.payload.bottom - 17;
  };

  StackFrame.prototype.resetPayload = function() {
    this.payload.y = this.sprite.bottom - 49;
  };

  StackFrame.prototype.payloadInjected = function() {
    if (Phaser.Rectangle.intersects(this.payloadBounds, this.returnBounds)) {
      this.payload.destroy();
      this.sprite = this.context.game.add.sprite(this.sprite.x, this.sprite.y, 'stack_smashed');
      this.context.elementLayer.add(this.sprite);
      this.sprite.animations.add('anim');
      this.sprite.animations.play('anim', 16, false);
      return true;
    }
    return false;
  };

  return StackFrame;
})();
