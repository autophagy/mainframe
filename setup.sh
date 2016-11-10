echo "Getting latest phaser.min.js release..."
LATEST=$(curl -s https://api.github.com/repos/photonstorm/phaser/releases/latest | grep '/phaser.min.js' | cut -d\" -f4)
echo "Downloading $LATEST..."
wget -P Game/ -q --show-progress $LATEST
echo "Done!"
