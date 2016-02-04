Mainframe.PasswordCracker = function(game) {

  this.elementLayer = null;
  this.tutorialLayer = null;
  this.timerLayer = null;
  this.monitorLayer = null;

  this.timerBlock = null;
  this.timerTime = null;
  this.timerStartTime = null;
  this.timeLimit = Phaser.Timer.SECOND * 15;
  this.cropRect = null;

  this.music = null;

  this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  this.str = null;
  this.maxKey = null;
  this.keyCount = 0;
  this.currentChar = -1;
  this.usernameText = null;
  this.username = null;
  this.passwordText = null;
  this.passwordCompleteText = null;
  this.password = null;

  this.characterCrackedSound = null;

  this.ready = false;

};

Mainframe.PasswordCracker.prototype = {

  create: function() {
    this.elementLayer = this.game.add.group();
    this.tutorialLayer = this.game.add.group();
    this.timerLayer = this.game.add.group();
    this.monitorLayer = this.game.add.group();
    this.monitorLayer.add(this.game.add.sprite(0, 0, 'atlas', 'General/monitor.png'));

    var t = '> man JOHN_THE_RIPPER';
    t += '\n\nNAME'
    t += '\n  JOHN_THE_RIPPER - Bruteforce password cracker';
    t += '\n\nDESCRIPTION'
    t += '\n  The finest bruteforce cracker money can buy.'
    t += '\n  Mash those keys!';

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
    this.keyCount = 0;
    this.currentChar = -1;

    this.str = this.loginScreenPicker();

    this.maxKey = Math.round((300 * Mainframe.corpDifficulty) / this.password.length);
  },

  initGame: function() {
    var func = function() {
      Mainframe.initTimer(this, true);
      this.nextChar();
    }.bind(this);

    if (this.str.length > this.username.length) {
      Mainframe.textScroll(this, this.passwordText, this.str, 200, true, func);
      Mainframe.textScroll(this, this.usernameText, this.username, 200, true, null);
    } else {
      Mainframe.textScroll(this, this.passwordText, this.str, 200, true, null);
      Mainframe.textScroll(this, this.usernameText, this.username, 200, true, func);
    }

    this.game.input.keyboard.onUpCallback = (function() {
      this.incChar();
    }.bind(this));

    this.characterCrackedSound = this.add.audio('character_cracked');
  },

  loginScreenPicker: function() {
    this.elementLayer.removeAll(true);
    var loginLoc = [0, 0];
    var passLoc = [0, 0];
    var size = 0;
    var screen = '';

    var screens = [1, 2, 3, 4];

    switch (screens[Math.floor(Math.random() * screens.length)]) {
      case 1:
        loginLoc = [475, 307];
        passLoc = [475, 336];
        size = 25;
        screen = 'Subroutines/Password_Cracker/crack_login_1.png';
        break;
      case 2:
        loginLoc = [486, 131];
        passLoc = [486, 160];
        size = 25;
        screen = 'Subroutines/Password_Cracker/crack_login_2.png';
        break;
      case 3:
        loginLoc = [500, 293];
        passLoc = [500, 331];
        size = 30;
        screen = 'Subroutines/Password_Cracker/crack_login_3.png';
        break;
      case 4:
        loginLoc = [486, 363];
        passLoc = [486, 386];
        size = 28;
        screen = 'Subroutines/Password_Cracker/crack_login_4.png';
    }

    this.elementLayer.add(this.game.add.sprite(0, 0, 'atlas', screen));

    this.username = this.usernamePicker();
    this.usernameText = this.game.add.bitmapText(loginLoc[0], loginLoc[1], 'white_font', '', size);

    this.elementLayer.add(this.usernameText);

    this.password = this.passwordPicker();

    var str = "";
    for (var i = 0; i < this.password.length; ++i) {
      var rand = Math.floor(Math.random() * this.alphabet.length);
      str += this.alphabet[rand]
    }

    this.passwordText = this.game.add.bitmapText(passLoc[0], passLoc[1], 'white_font', '', size);
    this.elementLayer.add(this.passwordText);

    this.passwordCompleteText = this.game.add.bitmapText(passLoc[0], passLoc[1], 'green_font', '', size);
    this.elementLayer.add(this.passwordCompleteText);

    return str;
  },

  usernamePicker: function() {
    var usernames = ['root', 'admin', 'LogMeIn', 'administrator', 'dbAdmin'];
    return usernames[Math.floor(Math.random() * usernames.length)];
  },

  passwordPicker: function() {
    //100 top passwords from the adobe leak, with adobe specific passwords + those less than 5 characters stripped.
    var passwords = ['123456', '123456789', 'password', '12345678', 'qwerty', '1234567', '111111',
      '123123', '1234567890', '000000', 'abc123', 'azerty', 'iloveyou', 'aaaaaa', '654321', '12345', '666666',
      'sunshine', '123321', 'letmein', 'monkey', 'asdfgh', 'password1', 'shadow', 'princess', 'dragon', 'daniel',
      'computer', 'michael', '121212', 'charlie', 'master', 'superman', 'qwertyuiop', '112233', 'asdfasdf', 'jessica',
      '1q2w3e4r', 'welcome', '1qaz2wsx', '987654321', '753951', 'chocolate', 'fuckyou', 'soccer', 'tigger', 'asdasd',
      'thomas', 'asdfghjkl', 'internet', 'michelle', 'football', '123qwe', 'zxcvbnm', '7777777', 'maggie', 'qazwsx',
      'baseball', 'jennifer', 'jordan', 'abcd1234', 'trustno1', 'buster', '555555', 'whatever', '11111111', '102030',
      '123123123', 'andrea', 'pepper', 'nicole', 'killer', 'abcdef', 'hannah', 'alexander', 'andrew', '222222', 'joshua',
      'freedom', 'asdfghj', 'purple', 'ginger', '123654', 'matrix', 'secret', 'summer', '1q2w3e'
    ];
    return passwords[Math.floor(Math.random() * passwords.length)];
  },

  incChar: function() {
    if (this.ready) {
      this.keyCount += 1;
      if (this.keyCount == this.maxKey) {
        if (this.currentChar < this.password.length - 1) {
          this.characterCrackedSound.play();
          this.characterCrackedSound._sound.playbackRate.value = 1 + (this.currentChar / this.password.length);
        }
        this.keyCount = 0;
        this.passwordCompleteText.text = this.passwordCompleteText.text.substr(0, this.currentChar) + this.password[this.currentChar];
        this.nextChar();
      } else {
        this.passwordCompleteText.text = this.passwordCompleteText.text.substr(0, this.currentChar) + this.alphabet[Math.floor(Math.random() * this.alphabet.length)];
      }
    }
  },

  nextChar: function() {
    this.currentChar += 1;
    if (this.currentChar == this.password.length) {
      this.ready = false;
      Mainframe.subroutineVictory(this);
    } else {
      this.passwordCompleteText.text = this.passwordCompleteText.text + this.passwordText.text[0];
      this.passwordText.text = this.passwordText.text.substr(1)
      this.passwordText.x = this.passwordCompleteText.right - 10;
    }
  }

};
