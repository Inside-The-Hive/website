import { Inter, Inter_Tight, Sacramento } from "next/font/google";

/**
 * Inter carries the site. Hierarchy comes from weight and size, not from
 * switching typefaces.
 *
 * Inter Tight carries display type at weight 800 with negative tracking; plain
 * Inter carries body and labels. Sacramento is the one exception — a script
 * face used solely for crew members' names, where a signature reads as a
 * person signing their own portrait rather than as a caption.
 *
 * All self-hosted at build time — no external font requests at runtime.
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

/** Script face, single weight. Crew names only. */
export const sacramento = Sacramento({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-sacramento",
});

export const fontVariables = `${inter.variable} ${interTight.variable} ${sacramento.variable}`;
