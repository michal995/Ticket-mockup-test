import Phaser from 'phaser';
import { theme } from '../ui/theme';
import type { GameResults } from '../types';

export class Results extends Phaser.Scene {
  private results!: GameResults;

  constructor() {
    super('Results');
  }

  init(data: GameResults): void {
    this.results = data;
  }

  create(): void {
    this.cameras.main.setBackgroundColor(theme.colors.backgroundHex);

    const preset = theme.presets[this.results.settings.uiSize];
    const headingSize = theme.fontSizes.heading * preset.scale * 1.4;
    const buttonHeight = Math.max(preset.minButtonHeight, 80);
    const buttonWidth = 380 * preset.scale;

    this.add
      .text(960, 220, 'Shift complete!', {
        fontSize: `${headingSize}px`,
        fontFamily: 'Inter, Roboto, sans-serif',
        color: theme.colors.textPrimary,
        align: 'center'
      })
      .setOrigin(0.5);

    this.add
      .text(960, 380, `Score: ${this.results.score}`, {
        fontSize: `${headingSize * 0.8}px`,
        fontFamily: 'Inter, Roboto, sans-serif',
        color: theme.colors.accentHex,
        align: 'center'
      })
      .setOrigin(0.5);

    const buttonContainer = this.add.container(960, 620);
    buttonContainer.add([
      this.createButton(-buttonWidth / 2 - 20, 0, buttonWidth, buttonHeight, 'Play again'),
      this.createButton(buttonWidth / 2 + 20, 0, buttonWidth, buttonHeight, 'Back to Menu')
    ]);

    const buttons = buttonContainer.list as Phaser.GameObjects.Container[];
    const playAgain = buttons[0];
    const backToMenu = buttons[1];

    playAgain.on('pointerdown', () => {
      this.scene.start('Game', { settings: this.results.settings });
    });

    backToMenu.on('pointerdown', () => {
      this.scene.start('Menu');
    });
  }

  private createButton(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const background = this.add.rectangle(0, 0, width, height, theme.colors.surface, 0.95);
    background.setStrokeStyle(4, theme.colors.accent);
    background.setInteractive({ useHandCursor: true });

    const text = this.add.text(0, 0, label, {
      fontSize: `${Math.max(28, theme.fontSizes.label)}px`,
      fontFamily: 'Inter, Roboto, sans-serif',
      color: theme.colors.textPrimary,
      align: 'center'
    });
    text.setOrigin(0.5);

    container.add([background, text]);
    container.setSize(width, height);
    container.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
    container.on('pointerover', () => background.setFillStyle(theme.colors.surface, 1));
    container.on('pointerout', () => background.setFillStyle(theme.colors.surface, 0.95));
    container.on('pointerdown', () => {
      background.setFillStyle(theme.colors.surface, 1);
      this.tweens.add({
        targets: container,
        scale: 0.97,
        duration: 90,
        yoyo: true,
        ease: 'Sine.easeInOut'
      });
    });

    return container;
  }
}
