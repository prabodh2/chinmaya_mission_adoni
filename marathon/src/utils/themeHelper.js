// Helper to apply dynamic CSS variables to :root based on admin theme settings

export const applyDynamicTheme = (theme) => {
  if (!theme || typeof window === 'undefined') return;

  const root = document.documentElement;

  if (theme.primaryColor) root.style.setProperty('--navy', theme.primaryColor);
  if (theme.secondaryColor) root.style.setProperty('--cream', (theme.secondaryColor === '#FFF8EC' || theme.secondaryColor === '#8AD6D1') ? '#FFF0C5' : theme.secondaryColor);
  if (theme.accentColor) root.style.setProperty('--orange', theme.accentColor);
  if (theme.backgroundColor) root.style.setProperty('--bg-primary', (theme.backgroundColor === '#FFF8EC' || theme.backgroundColor === '#8AD6D1') ? '#FFF0C5' : theme.backgroundColor);
  if (theme.textColor) root.style.setProperty('--text-primary', theme.textColor);
  if (theme.buttonColor) root.style.setProperty('--btn-primary-bg', theme.buttonColor);
  if (theme.buttonHoverColor) root.style.setProperty('--btn-primary-hover', theme.buttonHoverColor);
  const cardBg = theme.cardBackgroundColor || '#FFFFFF';
  root.style.setProperty('--bg-secondary', cardBg);
  root.style.setProperty('--cream-card', cardBg);
  root.style.setProperty('--glass-bg', cardBg);
  if (theme.headingColor) root.style.setProperty('--heading-color', theme.headingColor);
};

export const defaultPosterTheme = {
  primaryColor: '#0B2340',
  secondaryColor: '#FFF0C5',
  accentColor: '#F4511E',
  backgroundColor: '#FFF0C5',
  textColor: '#0B2340',
  buttonColor: '#F4511E',
  buttonHoverColor: '#D84315',
  cardBackgroundColor: '#FFFFFF',
  headingColor: '#0B2340',
};
