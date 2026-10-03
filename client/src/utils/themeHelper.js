// Helper to apply dynamic CSS variables to :root based on admin theme settings

export const applyDynamicTheme = (theme) => {
  if (!theme || typeof window === 'undefined') return;

  const root = document.documentElement;

  if (theme.primaryColor) root.style.setProperty('--navy', theme.primaryColor);
  if (theme.secondaryColor) root.style.setProperty('--cream', theme.secondaryColor);
  if (theme.accentColor) root.style.setProperty('--orange', theme.accentColor);
  if (theme.backgroundColor) root.style.setProperty('--bg-primary', theme.backgroundColor);
  if (theme.textColor) root.style.setProperty('--text-primary', theme.textColor);
  if (theme.buttonColor) root.style.setProperty('--btn-primary-bg', theme.buttonColor);
  if (theme.buttonHoverColor) root.style.setProperty('--btn-primary-hover', theme.buttonHoverColor);
  if (theme.cardBackgroundColor) root.style.setProperty('--bg-secondary', theme.cardBackgroundColor);
  if (theme.headingColor) root.style.setProperty('--heading-color', theme.headingColor);
};

export const defaultPosterTheme = {
  primaryColor: '#0B2340',
  secondaryColor: '#FFF8EC',
  accentColor: '#F4511E',
  backgroundColor: '#FFF8EC',
  textColor: '#0B2340',
  buttonColor: '#F4511E',
  buttonHoverColor: '#D84315',
  cardBackgroundColor: '#FFFFFF',
  headingColor: '#0B2340',
};
