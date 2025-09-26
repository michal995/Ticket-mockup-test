import type { UISizePreset } from './ui/theme';

export type GameMode = 'TB1' | 'TB2' | 'HR1' | 'HR2';

export interface GameSettings {
  name: string;
  mode: GameMode;
  uiSize: UISizePreset;
}

export interface GameResults {
  score: number;
  settings: GameSettings;
}

declare global {
  // Phaser's legacy XML parser types reference ActiveXObject on older browsers.
  type ActiveXObject = unknown;
}

