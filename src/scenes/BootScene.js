import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    // Clean colored diamond tiles - Pokémon GBA style
    this.makeTile('tile_grass', 0x5cb85c, 0x4a9e4a);       // bright green
    this.makeTile('tile_dirt', 0xc49a6c, 0xa87d52);         // warm brown
    this.makeTile('tile_stone', 0xb0b0b0, 0x909090);        // light gray
    this.makeTile('tile_water', 0x5bc0de, 0x3aafcf);        // light blue
    this.makeTile('tile_tall_grass', 0x3d8b3d, 0x2d6e2d);   // dark green
    this.makeTile('tile_flowers', 0x5cb85c, 0x4a9e4a);      // same as grass base

    this.generatePlaceholderCharacter();
    this.generatePlaceholderObjects();

    this.scene.start('GameScene');
  }

  makeTile(key, fill, stroke) {
    const w = 64, h = 32;
    const g = this.add.graphics();

    // Fill diamond
    g.fillStyle(fill, 1);
    g.beginPath();
    g.moveTo(w / 2, 0);
    g.lineTo(w, h / 2);
    g.lineTo(w / 2, h);
    g.lineTo(0, h / 2);
    g.closePath();
    g.fillPath();

    // Border
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
    // Tree
    const g = this.add.graphics();
    g.fillStyle(0x6d4c41, 1); g.fillRect(12, 30, 8, 18);
    g.fillStyle(0x4caf50, 1); g.fillCircle(16, 22, 14);
    g.fillStyle(0x66bb6a, 1); g.fillCircle(16, 16, 10);
    g.generateTexture('tree', 32, 48); g.destroy();

    // Rock
    const g2 = this.add.graphics();
    g2.fillStyle(0x9e9e9e, 1); g2.fillCircle(12, 12, 10);
    g2.fillStyle(0xbdbdbd, 1); g2.fillCircle(10, 10, 5);
    g2.generateTexture('rock', 24, 24); g2.destroy();

    // Flowers
    const g3 = this.add.graphics();
    g3.fillStyle(0xf44336, 1); g3.fillCircle(6, 6, 3);
    g3.fillStyle(0xffeb3b, 1); g3.fillCircle(14, 8, 3);
    g3.fillStyle(0xe91e63, 1); g3.fillCircle(10, 4, 2);
    g3.generateTexture('flowers', 20, 14); g3.destroy();

    // Building - Pokémon Center style
    const g4 = this.add.graphics();
    g4.fillStyle(0xffffff, 1); g4.fillRect(0, 16, 48, 32); // white walls
    g4.fillStyle(0xd32f2f, 1); // red roof
    g4.beginPath(); g4.moveTo(-4, 16); g4.lineTo(24, -2); g4.lineTo(52, 16); g4.closePath(); g4.fillPath();
    g4.fillStyle(0xf44336, 1); g4.fillRect(18, 30, 12, 18); // red door
    g4.fillStyle(0xd32f2f, 1); g4.fillRect(8, 22, 8, 8); // red accent left
    g4.fillRect(32, 22, 8, 8); // red accent right
    g4.generateTexture('building', 48, 50); g4.destroy();
  }
}
