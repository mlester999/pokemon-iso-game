import Phaser from 'phaser';

// Tile types
const T = {
  GRASS: 0,
  DIRT: 1,
  STONE: 2,
  WATER: 3,
  TALL_GRASS: 4,
  FLOWERS: 5,
};

const TILE_W = 64;
const TILE_H = 48;

const TILE_KEYS = {
  [T.GRASS]: 'tile_grass',
  [T.DIRT]: 'tile_dirt',
  [T.STONE]: 'tile_stone',
  [T.WATER]: 'tile_water',
  [T.TALL_GRASS]: 'tile_tall_grass',
  [T.FLOWERS]: 'tile_flowers',
};

// 16x16 map layout (easy to edit — just change numbers)
// 0=grass, 1=dirt, 2=stone, 3=water, 4=tall_grass, 5=flowers
const MAP = [
  [0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0],
  [0, 4, 4, 4, 0, 0, 3, 3, 0, 0, 0, 0, 4, 4, 0, 0],
  [4, 4, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 4, 0, 0],
  [4, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 5, 5, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 5, 5, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// Object placements: { type, gridX, gridY }
const OBJECTS = [
  { type: 'tree', gx: 1, gy: 0 },
  { type: 'tree', gx: 2, gy: 1 },
  { type: 'tree', gx: 0, gy: 3 },
  { type: 'tree', gx: 12, gy: 0 },
  { type: 'tree', gx: 13, gy: 1 },
  { type: 'tree', gx: 11, gy: 2 },
  { type: 'tree', gx: 0, gy: 10 },
  { type: 'tree', gx: 1, gy: 11 },
  { type: 'tree', gx: 14, gy: 4 },
  { type: 'tree', gx: 15, gy: 3 },
  { type: 'rock', gx: 9, gy: 4 },
  { type: 'rock', gx: 3, gy: 12 },
  { type: 'rock', gx: 13, gy: 12 },
  { type: 'building', gx: 5, gy: 7 },
  { type: 'building', gx: 7, gy: 6 },
];

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.playerGridX = 7;
    this.playerGridY = 9;
    this.isMoving = false;
  }

  create() {
    // Map dimensions
    this.mapRows = MAP.length;
    this.mapCols = MAP[0].length;
    this.tileSprites = [];

    // Calculate map offset to center it
    const mapPixelW = this.mapCols * TILE_W;
    const mapPixelH = this.mapRows * TILE_H;
    this.offsetX = this.sys.game.config.width / 2;
    this.offsetY = 100;

    // Draw tiles
    for (let row = 0; row < this.mapRows; row++) {
      this.tileSprites[row] = [];
      for (let col = 0; col < this.mapCols; col++) {
        const tileType = MAP[row][col];
        const key = TILE_KEYS[tileType];
        const { sx, sy } = this.gridToIso(col, row);
        const sprite = this.add.image(sx, sy, key).setOrigin(0.5, 0.5);
        sprite.setDepth(sy);
        this.tileSprites[row][col] = sprite;
      }
    }

    // Place objects
    this.objects = [];
    for (const obj of OBJECTS) {
      const { sx, sy } = this.gridToIso(obj.gx, obj.gy);
      const sprite = this.add.image(sx, sy - 10, obj.type).setOrigin(0.5, 1);
      sprite.setDepth(sy + 10);
      this.objects.push(sprite);
    }

    // Player
    const { sx: px, sy: py } = this.gridToIso(this.playerGridX, this.playerGridY);
    this.player = this.add.image(px, py - 12, 'player', 0).setOrigin(0.5, 1);
    this.player.setDepth(py + 20);
    this.player.setScale(2);

    // Camera follow
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1.5);
    this.cameras.main.setBackgroundColor('#8bc34a');

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');

    // UI text
    this.coordText = this.add.text(10, 10, '', {
      fontSize: '14px', color: '#fff', backgroundColor: '#0008',
      padding: { x: 6, y: 3 }
    }).setScrollFactor(0).setDepth(9999);

    this.updateCoordText();
  }

  gridToIso(gx, gy) {
    const sx = this.offsetX + (gx - gy) * (TILE_W / 2);
    const sy = this.offsetY + (gx + gy) * (TILE_H / 2);
    return { sx, sy };
  }

  isoToGrid(sx, sy) {
    const rx = sx - this.offsetX;
    const ry = sy - this.offsetY;
    const gx = (rx / (TILE_W / 2) + ry / (TILE_H / 2)) / 2;
    const gy = (ry / (TILE_H / 2) - rx / (TILE_W / 2)) / 2;
    return { gx: Math.round(gx), gy: Math.round(gy) };
  }

  isWalkable(gx, gy) {
    if (gx < 0 || gy < 0 || gx >= this.mapCols || gy >= this.mapRows) return false;
    const tile = MAP[gy][gx];
    return tile !== T.WATER;
  }

  movePlayer(dx, dy) {
    if (this.isMoving) return;

    const newGX = this.playerGridX + dx;
    const newGY = this.playerGridY + dy;

    if (!this.isWalkable(newGX, newGY)) return;

    this.isMoving = true;
    this.playerGridX = newGX;
    this.playerGridY = newGY;

    const { sx, sy } = this.gridToIso(newGX, newGY);

    // Update frame direction
    if (dy > 0) this.player.setFrame(0);      // down
    else if (dy < 0) this.player.setFrame(3);  // up
    else if (dx < 0) this.player.setFrame(1);  // left
    else if (dx > 0) this.player.setFrame(2);  // right

    this.tweens.add({
      targets: this.player,
      x: sx,
      y: sy - 12,
      duration: 150,
      ease: 'Linear',
      onUpdate: () => {
        this.player.setDepth(this.player.y + 20);
      },
      onComplete: () => {
        this.isMoving = false;
        this.updateCoordText();
        this.checkTileEvent();
      }
    });
  }

  checkTileEvent() {
    const tile = MAP[this.playerGridY]?.[this.playerGridX];
    if (tile === T.TALL_GRASS) {
      // Random encounter chance (placeholder)
      if (Math.random() < 0.15) {
        this.showEncounter();
      }
    }
  }

  showEncounter() {
    const msg = this.add.text(
      this.cameras.main.scrollX + this.cameras.main.width / 2 / this.cameras.main.zoom,
      this.cameras.main.scrollY + 60,
      '⚡ Wild Pokémon appeared!',
      { fontSize: '20px', color: '#fff', backgroundColor: '#d32f2f', padding: { x: 12, y: 6 } }
    ).setOrigin(0.5).setDepth(99999).setScrollFactor(0);

    this.time.delayedCall(1500, () => msg.destroy());
  }

  updateCoordText() {
    const tile = MAP[this.playerGridY]?.[this.playerGridX];
    const tileNames = { 0: 'Grass', 1: 'Path', 2: 'Stone', 3: 'Water', 4: 'Tall Grass', 5: 'Flowers' };
    this.coordText.setText(`(${this.playerGridX}, ${this.playerGridY}) ${tileNames[tile] || '?'}`);
  }

  update() {
    if (this.isMoving) return;

    const up = Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.wasd.W);
    const down = Phaser.Input.Keyboard.JustDown(this.cursors.down) || Phaser.Input.Keyboard.JustDown(this.wasd.S);
    const left = Phaser.Input.Keyboard.JustDown(this.cursors.left) || Phaser.Input.Keyboard.JustDown(this.wasd.A);
    const right = Phaser.Input.Keyboard.JustDown(this.cursors.right) || Phaser.Input.Keyboard.JustDown(this.wasd.D);

    // Isometric: up arrow = move up-left in grid, down = down-right, left = down-left, right = up-right
    if (up) this.movePlayer(0, -1);
    else if (down) this.movePlayer(0, 1);
    else if (left) this.movePlayer(-1, 0);
    else if (right) this.movePlayer(1, 0);
  }
}
