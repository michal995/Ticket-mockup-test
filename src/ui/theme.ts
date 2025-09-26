export type UISizePreset = 'S' | 'M' | 'L';

export const theme = {
  colors: {
    background: 0x0b1018,
    backgroundHex: '#0b1018',
    surface: 0x111827,
    surfaceHex: '#111827',
    surfaceAltHex: '#1f2937',
    accent: 0x38bdf8,
    accentHex: '#38bdf8',
    textPrimary: '#ffffff',
    textMuted: '#94a3b8'
  },
  fontSizes: {
    heading: 48,
    label: 28,
    body: 22
  },
  presets: {
    S: {
      scale: 1,
      minFont: 22,
      minButtonHeight: 48
    },
    M: {
      scale: 1.15,
      minFont: 26,
      minButtonHeight: 56
    },
    L: {
      scale: 1.3,
      minFont: 30,
      minButtonHeight: 64
    }
  } as Record<UISizePreset, { scale: number; minFont: number; minButtonHeight: number }>
};
