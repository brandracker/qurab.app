const THEME_STORAGE_KEY = 'qurb_theme';

export type AppTheme = 'light' | 'dark';

type ThemeListener = (theme: AppTheme) => void;
const listeners = new Set<ThemeListener>();

export const themeService = {
  getTheme(): AppTheme {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'dark' || stored === 'light') {
          return stored;
        }
      }
    } catch {
      // In restricted sandbox or SSR environments
    }
    // Default to clean Light Theme
    return 'light';
  },

  isDark(): boolean {
    return this.getTheme() === 'dark';
  },

  setTheme(theme: AppTheme): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      }
    } catch {}
    this.applyTheme(theme);
    listeners.forEach((listener) => {
      try {
        listener(theme);
      } catch (err) {
        console.error('Theme listener error:', err);
      }
    });
  },

  toggleTheme(): AppTheme {
    const nextTheme: AppTheme = this.isDark() ? 'light' : 'dark';
    this.setTheme(nextTheme);
    return nextTheme;
  },

  applyTheme(theme?: AppTheme): void {
    if (typeof document === 'undefined') return;
    const currentTheme = theme || this.getTheme();
    const root = document.documentElement;
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  },

  subscribe(listener: ThemeListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }
};

// Initialize theme immediately on script evaluation
if (typeof window !== 'undefined') {
  themeService.applyTheme();
}

