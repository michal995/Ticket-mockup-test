import Phaser from 'phaser';
import { theme, UISizePreset } from '../ui/theme';
import type { GameMode, GameSettings } from '../types';

const MODES: GameMode[] = ['TB1', 'TB2', 'HR1', 'HR2'];

const LOCAL_STORAGE_KEYS = {
  name: 'ticket-mockup:name',
  mode: 'ticket-mockup:mode',
  uiSize: 'ticket-mockup:ui-size'
} as const;

export class Menu extends Phaser.Scene {
  private domForm?: Phaser.GameObjects.DOMElement;
  private uiSize: UISizePreset = 'M';

  constructor() {
    super('Menu');
  }

  create(): void {
    this.cameras.main.setBackgroundColor(theme.colors.backgroundHex);
    const savedName = localStorage.getItem(LOCAL_STORAGE_KEYS.name) ?? '';
    const savedMode = (localStorage.getItem(LOCAL_STORAGE_KEYS.mode) as GameMode | null) ?? 'TB1';
    const savedSize = (localStorage.getItem(LOCAL_STORAGE_KEYS.uiSize) as UISizePreset | null) ?? 'M';
    this.uiSize = savedSize;

    const html = this.renderForm(savedName, savedMode, savedSize);
    this.domForm = this.add.dom(960, 540).createFromHTML(html);
    this.domForm.setOrigin(0.5);

    const node = this.domForm.node as HTMLFormElement;
    this.applySelectionStyles(node);
    this.refreshStyles();

    node.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(node);
      const name = String(formData.get('name') ?? '').trim();
      const mode = (formData.get('mode') as GameMode | null) ?? 'TB1';
      const uiSize = (formData.get('uiSize') as UISizePreset | null) ?? 'M';

      const settings: GameSettings = {
        name,
        mode,
        uiSize
      };

      localStorage.setItem(LOCAL_STORAGE_KEYS.name, name);
      localStorage.setItem(LOCAL_STORAGE_KEYS.mode, mode);
      localStorage.setItem(LOCAL_STORAGE_KEYS.uiSize, uiSize);

      this.registry.set('lastGameSettings', settings);
      this.scene.start('Game', { settings });
    });

    node.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement | HTMLSelectElement;
      if (!target?.name) return;
      if (target.name === 'uiSize') {
        const value = target.value as UISizePreset;
        this.uiSize = value;
        localStorage.setItem(LOCAL_STORAGE_KEYS.uiSize, value);
        this.refreshStyles();
      }
      if (target.name === 'mode') {
        localStorage.setItem(LOCAL_STORAGE_KEYS.mode, target.value);
      }
      if (target.name === 'name') {
        localStorage.setItem(LOCAL_STORAGE_KEYS.name, target.value);
      }
      this.applySelectionStyles(node);
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.domForm?.destroy();
    });
  }

  private renderForm(name: string, mode: GameMode, uiSize: UISizePreset): string {
    const sizeOptions = ['S', 'M', 'L'] as const;
    const modeOptions = MODES.map(
      (value) => `
        <label class="option">
          <input type="radio" name="mode" value="${value}" ${value === mode ? 'checked' : ''} />
          <span>${value}</span>
        </label>
      `
    ).join('');

    const sizeOptionElements = sizeOptions
      .map(
        (value) => `
          <label class="option compact">
            <input type="radio" name="uiSize" value="${value}" ${value === uiSize ? 'checked' : ''} />
            <span>${value}</span>
          </label>
        `
      )
      .join('');

    const endlessDisabled = 'disabled';

    return `
      <form class="menu" autocomplete="off">
        <style>
          :root {
            color-scheme: dark;
          }
          .menu {
            width: min(560px, 90vw);
            display: flex;
            flex-direction: column;
            gap: 18px;
            padding: 32px;
            border-radius: 24px;
            background: rgba(17, 24, 39, 0.92);
            box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
            color: ${theme.colors.textPrimary};
            font-family: 'Inter', 'Roboto', sans-serif;
            backdrop-filter: blur(8px);
          }
          h1 {
            margin: 0 0 4px 0;
            font-size: 2.25rem;
            letter-spacing: 0.02em;
            text-align: center;
          }
          p.subtitle {
            margin: 0 0 16px 0;
            text-align: center;
            color: ${theme.colors.textMuted};
          }
          label.field {
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-weight: 600;
            font-size: 1.15rem;
          }
          input[type="text"] {
            padding: 14px 16px;
            border-radius: 12px;
            border: none;
            background: ${theme.colors.surfaceAltHex};
            color: ${theme.colors.textPrimary};
            font-size: 1.1rem;
          }
          .options {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
          }
          .option {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            background: ${theme.colors.surfaceAltHex};
            border-radius: 12px;
            cursor: pointer;
            border: 2px solid transparent;
            min-height: 48px;
            font-size: 1.1rem;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          }
          .option.compact {
            justify-content: center;
            min-width: 72px;
          }
          .option input {
            width: 20px;
            height: 20px;
          }
          .option.active {
            border-color: ${theme.colors.accentHex};
            box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.3);
          }
          .option input:disabled + span {
            opacity: 0.45;
          }
          button.start {
            margin-top: 10px;
            padding: 18px 24px;
            font-size: 1.2rem;
            font-weight: 700;
            border-radius: 14px;
            border: none;
            color: #0b1018;
            background: ${theme.colors.accentHex};
            cursor: pointer;
            min-height: 56px;
          }
          button.start:active {
            transform: translateY(1px);
          }
          .checkbox-row {
            display: flex;
            align-items: center;
            gap: 10px;
            color: ${theme.colors.textMuted};
            font-size: 1.05rem;
          }
          .preset-label {
            font-size: 1.05rem;
            font-weight: 600;
          }
        </style>
        <h1>Boarding Ready?</h1>
        <p class="subtitle">Set your preferences and start the next shift.</p>
        <label class="field">
          Name
          <input type="text" name="name" placeholder="Your name" value="${name}" required minlength="1" />
        </label>
        <div>
          <div class="preset-label">Mode</div>
          <div class="options">
            ${modeOptions}
          </div>
        </div>
        <label class="checkbox-row">
          <input type="checkbox" name="endless" ${endlessDisabled} />
          Endless (coming soon)
        </label>
        <div>
          <div class="preset-label">UI size</div>
          <div class="options">
            ${sizeOptionElements}
          </div>
        </div>
        <button class="start" type="submit">Start</button>
      </form>
    `;
  }

  private refreshStyles(): void {
    if (!this.domForm) return;
    const node = this.domForm.node as HTMLFormElement;
    const baseFont = Math.max(theme.fontSizes.body, theme.presets[this.uiSize].minFont);
    node.querySelectorAll('.menu').forEach((element) => {
      const el = element as HTMLElement;
      el.style.fontSize = `${baseFont}px`;
    });
    node.querySelectorAll('.option, .start').forEach((element) => {
      const el = element as HTMLElement;
      el.style.minHeight = `${theme.presets[this.uiSize].minButtonHeight}px`;
      el.style.fontSize = `${baseFont}px`;
    });
    node.querySelectorAll('input[type="text"]').forEach((element) => {
      const el = element as HTMLElement;
      el.style.fontSize = `${baseFont}px`;
    });
  }

  private applySelectionStyles(container: HTMLElement): void {
    container.querySelectorAll('.option').forEach((element) => {
      const el = element as HTMLElement;
      const input = el.querySelector('input');
      el.classList.toggle('active', !!input && (input as HTMLInputElement).checked);
    });
  }
}
