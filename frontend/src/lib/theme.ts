/**
 * localStorage key the theme preference persists under. Passed to the
 * registry ThemeProvider (see main.tsx and src/test/render.tsx) and baked
 * into the pre-paint bootstrap script in index.html — keep the three in sync.
 * The key predates the @nebari/use-theme-preference adoption, so existing
 * users keep their saved preference.
 */
export const THEME_STORAGE_KEY = "provenance:themeMode";
