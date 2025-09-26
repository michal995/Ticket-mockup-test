import Phaser from 'phaser';
import { theme } from '../ui/theme';

export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    this.load.setPath('');
    const size = 256;
    const graphics = this.add.graphics({ x: 0, y: 0 });
    graphics.setVisible(false);
    graphics.fillStyle(theme.colors.accent, 1);
    graphics.fillRoundedRect(0, 0, size, size, 32);
    graphics.lineStyle(10, theme.colors.surface, 1);
    graphics.strokeRoundedRect(0, 0, size, size, 32);
    graphics.generateTexture('button-surface', size, size);
    graphics.clear();

    graphics.fillStyle(theme.colors.surface, 1);
    graphics.fillRoundedRect(0, 0, size, size, 32);
    graphics.generateTexture('button-background', size, size);
    graphics.destroy();
  }

  create(): void {
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
    });

    this.scene.start('Menu');
  }
}
