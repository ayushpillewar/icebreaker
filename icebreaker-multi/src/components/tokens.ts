/** Centralised design tokens — dark "Nebula" theme. */
export const AppColors = {
  // Brand
  primary:           '#7B61FF',
  primaryLight:      '#9D87FF',
  primaryGlow:       'rgba(123,97,255,0.18)',
  primaryGlowStrong: 'rgba(123,97,255,0.40)',

  // Semantic
  success:   '#00E4A1',
  successBg: 'rgba(0,228,161,0.12)',
  danger:    '#FF4D6D',
  dangerBg:  'rgba(255,77,109,0.12)',
  warning:   '#FFB84D',
  warningBg: 'rgba(255,184,77,0.12)',

  // Text
  text:          '#EEF0FF',
  textSecondary: '#8B8FA8',
  textMuted:     '#4A4D68',

  // Surfaces
  background:      '#0C0C1A',
  surface:         '#13132A',
  surfaceElevated: '#1B1B38',

  // Borders
  border:       'rgba(255,255,255,0.07)',
  borderAccent: 'rgba(123,97,255,0.35)',
} as const;
