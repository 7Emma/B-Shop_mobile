/** @type {const} */
const themeColors = {
  // Brand palette derived from the logo: orange, white, and blue
  primary: { light: "#e8680c", dark: "#ff9f5c" },
  secondary: { light: "#1d63d8", dark: "#6ba3ff" },
  background: { light: "#f4f6fa", dark: "#070b12" },
  surface: { light: "#ffffff", dark: "#121826" },
  /** Thumbnails, chips, steppers — slightly inset from `surface` */
  cardInner: { light: "#eef2f7", dark: "#1e2838" },
  foreground: { light: "#0c1222", dark: "#f1f5f9" },
  muted: { light: "#64748b", dark: "#8b9cb3" },
  border: { light: "#e2e8f0", dark: "#2a3444" },
  success: { light: "#15803d", dark: "#34d399" },
  warning: { light: "#d97706", dark: "#fbbf24" },
  error: { light: "#dc2626", dark: "#fb7185" },
};

module.exports = { themeColors };
