/**
 * Typed mirror of the design tokens declared in globals.css `@theme`.
 * Single source of truth for JS/TS consumers (charts, canvas, inline SVG)
 * that can't read CSS variables ergonomically. Keep in sync with globals.css.
 */

export const colors = {
  bg: "#0A0A0D",
  surface: "#101014",
  card: "#16161C",
  elevated: "#1E1E26",
  input: "#131318",

  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.14)",
  highlight: "rgba(255,255,255,0.06)",

  fg: "#F4F4F6",
  muted: "#A1A1AD",
  subtle: "#6B6B78",

  primary: "#7B61FF",
  primaryFg: "#FFFFFF",
  primarySoft: "#A78BFA",
  primaryDim: "rgba(123,97,255,0.16)",

  amber: "#FFB020",
  gold: "#F5C56B",

  success: "#34D399",
  danger: "#FB7185",
  info: "#60A5FA",
} as const;

export const levelColors = {
  A1: "#34D399",
  A2: "#22D3EE",
  B1: "#60A5FA",
  B2: "#7B61FF",
  C1: "#F472B6",
  C2: "#FFB020",
} as const;

export type Cefr = keyof typeof levelColors;

export const gradients = {
  brand: "linear-gradient(135deg, #7B61FF 0%, #9D7BFF 45%, #C084FC 100%)",
  amber: "linear-gradient(135deg, #FFB020 0%, #F5C56B 100%)",
} as const;

export const radius = {
  base: 12,
  xl: 16,
  xl2: 20,
  full: 9999,
} as const;

export const easing = {
  outQuint: "cubic-bezier(0.22, 1, 0.36, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export const fonts = {
  display: "var(--font-display)",
  sans: "var(--font-sans)",
  mono: "var(--font-mono)",
} as const;
