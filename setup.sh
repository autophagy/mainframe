echo "Getting latest phaser.min.js release..."
PHASER='v2.10.3'
echo "Downloading Phaser-CE $PHASER..."
wget -P Game/ -q --show-progress https://github.com/photonstorm/phaser-ce/releases/download/$PHASER/phaser.min.js
echo "Done!"
