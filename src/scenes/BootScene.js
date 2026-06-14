import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Load pre-processed diamond tiles (clipped + transparent bg)
    this.load.image('tile_grass', 'assets/tilesets/grass_diamond.png');
    this.load.image('tile_dirt', 'assets/tilesets/dirt_diamond.png');
  }

  create() {
    // Placeholders for tiles we don't have yet
    this.makePlaceholderTile('tile_stone', 0x9e9e9e, 0x808080);
    this.makePlaceholderTile('tile_water', 0x4fc3f7, 0x29b6f6);
    this.makePlaceholderTile('tile_tall_grass', 0x4a9f3b, 0x3a8a2e);
    this.makePlaceholderTile('tile_flowers', 0x6abf4b, 0x5aa83e);

    this.generatePlaceholderCharacter();
    this.generatePlaceholderObjects();

    this.scene.start('GameScene');
  }

  makePlaceholderTile(key, fill, stroke) {
    const w = 64, h = 48;
    const g = this.add.graphics();
    g.fillStyle(fill, 1);
    g.beginPath();
    g.moveTo(w / 2, 0);
    g.lineTo(w, h / 2);
    g.lineTo(w / 2, h);
    g.lineTo(0, h / 2);
    g.closePath();
    g.fillPath();
    g.lineStyle(1, stroke, 1);
    g.beginPath();
    g.moveTo(w / 2, 0);
    g.lineTo(w, h / 2);
    g.lineTo(w / 2, h);
    g.lineTo(0, h / 2);
    g.closePath();
    g.strokePath();
    g.generateTexture(key, w, h);
    g.destroy();
  }

  generatePlaceholderCharacter() {
    const frameW = 16, frameH = 24, totalW = frameW * 4;
    const g = this.add.graphics();
    for (let i = 0; i < 4; i++) {
      const ox = i * frameW;
      g.fillStyle(0x3498db, 1); g.fillRect(ox + 4, 10, 8, 10);
      g.fillStyle(0xf5cba7, 1); g.fillRect(ox + 5, 3, 6, 7);
      g.fillStyle(0x2c3e50, 1); g.fillRect(ox + 5, 2, 6, 3);
      g.fillStyle(0x2c3e50, 1); g.fillRect(ox + 5, 20, 2, 4); g.fillRect(ox + 9, 20, 2, 4);
      g.fillStyle(0x000000, 1);
      if (i === 0) { g.fillRect(ox + 6, 6, 1, 1); g.fillRect(ox + 9, 6, 1, 1); }
    }
    g.generateTexture('player', totalW, frameH);
    g.destroy();
    const t = this.textures.get('player');
    t.add(0, 0, 0, 0, frameW, frameH);
    t.add(1, 0, frameW, 0, frameW, frameH);
    t.add(2, 0, frameW * 2, 0, frameW, frameH);
    t.add(3, 0, frameW * 3, 0, frameW, frameH);
  }

  generatePlaceholderObjects() {
    const g = this.add.graphics();
    g.fillStyle(0x6d4c41, 1); g.fillRect(12, 30, 8, 18);
    g.fillStyle(0x4caf50, 1); g.fillCircle(16, 20, 14);
    g.generateTexture('tree', 32, 48); g.destroy();

    const g2 = this.add.graphics();
    g2.fillStyle(0x9e9e9e, 1); g2.fillCircle(12, 12, 10);
    g2.fillStyle(0x757575, 1); g2.fillCircle(18, 14, 7);
    g2.generateTexture('rock', 24, 24); g2.destroy();

    const g3 = this.add.graphics();
    g3.fillStyle(0xf44336, 1); g3.fillCircle(6, 6, 4);
    g3.fillStyle(0xffeb3b, 1); g3.fillCircle(16, 8, 3);
    g3.fillStyle(0x4caf50, 1); g3.fillRect(5, 10, 2, 6); g3.fillRect(15, 11, 2, 5);
    g3.generateTexture('flowers', 24, 18); g3.destroy();

    const g4 = this.add.graphics();
    g4.fillStyle(0x8d6e63, 1); g4.fillRect(0, 20, 48, 30);
    g4.fillStyle(0xd32f2f, 1);
    g4.beginPath(); g4.moveTo(0, 20); g4.lineTo(24, 0); g4.lineTo(48, 20); g4.closePath(); g4.fillPath();
    g4.fillStyle(0x4e342e, 1); g4.fillRect(18, 32, 12, 18);
    g4.generateTexture('building', 48, 50); g4.destroy();
  }
}
