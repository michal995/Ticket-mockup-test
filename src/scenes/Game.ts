import Phaser from 'phaser';
import { theme } from '../ui/theme';
import type { GameMode, GameResults, GameSettings } from '../types';

interface GameSceneData {
  settings?: GameSettings;
}

export class Game extends Phaser.Scene {
  private settings!: GameSettings;
  private countdown = 20;
  private timerText!: Phaser.GameObjects.Text;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private overlayText!: Phaser.GameObjects.Text;
  private passengerCountdownEvent?: Phaser.Time.TimerEvent;

  constructor() {
    super('Game');
  }

  init(data: GameSceneData): void {
    const lastSettings = this.registry.get('lastGameSettings') as GameSettings | undefined;
    this.settings = data.settings ?? lastSettings ?? {
      name: '',
      mode: 'TB1',
      uiSize: 'M'
    };
  }

  create(): void {
    this.cameras.main.setBackgroundColor(theme.colors.backgroundHex);
    this.countdown = 20;
    this.score = 0;

    const preset = theme.presets[this.settings.uiSize];
    const headingSize = theme.fontSizes.heading * preset.scale;
    const bodySize = Math.max(theme.fontSizes.body, preset.minFont) * preset.scale * 0.75;
    const labelSize = theme.fontSizes.label * preset.scale;

    const hudBackground = this.add.rectangle(960, 80, 1400, 120, theme.colors.surface, 0.65);
    hudBackground.setStrokeStyle(4, theme.colors.accent);

    this.scoreText = this.add
      .text(360, 72, `Score: ${this.score}`, {
        fontSize: `${labelSize}px`,
        fontFamily: 'Inter, Roboto, sans-serif',
        color: theme.colors.textPrimary
      })
      .setOrigin(0.5);

    this.timerText = this.add
      .text(960, 72, `Timer: ${this.countdown}`, {
        fontSize: `${labelSize}px`,
        fontFamily: 'Inter, Roboto, sans-serif',
        color: theme.colors.textPrimary
      })
      .setOrigin(0.5);

    this.add
      .text(1560, 72, `Mode: ${this.settings.mode}`, {
        fontSize: `${labelSize}px`,
        fontFamily: 'Inter, Roboto, sans-serif',
        color: theme.colors.textPrimary
      })
      .setOrigin(0.5);

    const layoutDescription = this.describeLayout(this.settings.mode);
    this.add
      .text(960, 200, layoutDescription, {
        fontSize: `${bodySize * 1.1}px`,
        fontFamily: 'Inter, Roboto, sans-serif',
        color: theme.colors.textMuted,
        align: 'center'
      })
      .setOrigin(0.5);

    const buttonWidth = 480 * preset.scale;
    const buttonHeight = Math.max(220, preset.minButtonHeight * 3);

    const ticketsButton = this.createLargeButton(650, 650, buttonWidth, buttonHeight, 'Tickets', headingSize);
    const coinsButton = this.createLargeButton(1270, 650, buttonWidth, buttonHeight, 'Coins', headingSize);

    ticketsButton.on('pointerdown', () => this.flashButton(ticketsButton));
    coinsButton.on('pointerdown', () => this.flashButton(coinsButton));

    this.overlayText = this.add.text(960, 450, '', {
      fontSize: `${headingSize}px`,
      fontFamily: 'Inter, Roboto, sans-serif',
      color: theme.colors.textPrimary,
      align: 'center'
    });
    this.overlayText.setOrigin(0.5);
    this.overlayText.setAlpha(0);

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.countdown -= 1;
        this.timerText.setText(`Timer: ${Math.max(0, this.countdown)}`);
        if (this.countdown <= 0) {
          this.endRound();
        }
      }
    });

    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        this.score += Phaser.Math.Between(5, 15);
        this.scoreText.setText(`Score: ${this.score}`);
      }
    });

    this.startPassengerCountdown();
    this.scale.refresh();
    this.input.addPointer(1);
  }

  private describeLayout(mode: GameMode): string {
    switch (mode) {
      case 'TB1':
        return 'Layout: Top & Bottom focus with queue at the sides.';
      case 'TB2':
        return 'Layout: Top/Bottom with split ticket validation.';
      case 'HR1':
        return 'Layout: Horizontal counters with dual panels.';
      case 'HR2':
        return 'Layout: Horizontal counters with mirrored controls.';
      default:
        return 'Layout: Placeholder configuration.';
    }
  }

  private createLargeButton(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    fontSize: number
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const background = this.add.rectangle(0, 0, width, height, theme.colors.surface);
    background.setStrokeStyle(6, theme.colors.accent);
    background.setInteractive({ useHandCursor: true });

    const text = this.add.text(0, 0, label, {
      fontSize: `${fontSize}px`,
      fontFamily: 'Inter, Roboto, sans-serif',
      color: theme.colors.textPrimary,
      align: 'center'
    });
    text.setOrigin(0.5);

    container.add([background, text]);
    container.setSize(width, height);
    container.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
    container.on('pointerover', () => background.setFillStyle(theme.colors.surface, 0.9));
    container.on('pointerout', () => background.setFillStyle(theme.colors.surface, 1));
    container.on('pointerdown', () => background.setFillStyle(theme.colors.surface, 1));

    return container;
  }

  private flashButton(button: Phaser.GameObjects.Container): void {
    this.tweens.add({
      targets: button,
      scale: 0.98,
      duration: 80,
      yoyo: true,
      repeat: 1,
      ease: 'Sine.easeInOut'
    });
  }

  private startPassengerCountdown(): void {
    if (this.passengerCountdownEvent) {
      this.passengerCountdownEvent.remove(false);
    }

    let countdown = 5;
    this.overlayText.setText(`Next passenger in ${countdown}`);
    this.overlayText.setAlpha(0.92);

    this.passengerCountdownEvent = this.time.addEvent({
      delay: 1000,
      repeat: 4,
      callback: () => {
        countdown -= 1;
        if (countdown > 0) {
          this.overlayText.setText(`Next passenger in ${countdown}`);
        } else {
          this.overlayText.setText('Passenger ready!');
          this.time.delayedCall(600, () => {
            this.overlayText.setAlpha(0);
          });
        }
      }
    });

    this.time.addEvent({
      delay: 6000,
      callback: () => {
        if (this.scene.isActive() && this.countdown > 0) {
          this.startPassengerCountdown();
        }
      }
    });
  }

  private endRound(): void {
    const results: GameResults = {
      score: this.score,
      settings: this.settings
    };
    this.scene.start('Results', results);
  }
}
