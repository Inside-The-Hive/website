import { Inter, Inter_Tight } from "next/font/google";

/**
 * One family: Inter. Hierarchy comes from weight and size, not from switching
 * typefaces.
 *
 * Inter Tight carries display type at weight 800 with negative tracking; plain
 * Inter carries body and labels. Both self-hosted at build time — no external
 * font requests at runtime.
 *
 * `display: "swap"` plus the adjusted fallback next/font derives from the font
 * metrics keeps cumulative layout shift at zero on load.
 */

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
});

export const fontVariables = `${inter.variable} ${interTight.variable}`;
