export const defaultPosterTheme = {
  primaryColor: '#0B2340',
  secondaryColor: '#FF7A00',
  accentColor: '#00B4D8',
  backgroundColor: '#FFFFFF',
  textColor: '#0B2340',
  bannerStyle: 'gradient',
  fontFamily: 'Outfit, sans-serif',
};

export const applyDynamicTheme = (themeConfig) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const t = themeConfig || defaultPosterTheme;
  
  if (t.primaryColor) root.style.setProperty('--theme-primary', t.primaryColor);
  if (t.secondaryColor) root.style.setProperty('--theme-secondary', t.secondaryColor);
  if (t.accentColor) root.style.setProperty('--theme-accent', t.accentColor);
  if (t.backgroundColor) root.style.setProperty('--theme-bg', t.backgroundColor);
  if (t.textColor) root.style.setProperty('--theme-text', t.textColor);
};
