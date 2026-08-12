import { Bricolage_Grotesque, Instrument_Sans, Space_Mono } from "next/font/google";

/**
 * Three families, self-hosted at build time by next/font. No external font
 * requests at runtime.
 *
 * `display: "swap"` plus the adjusted fallback next/font generates from the
 * font metrics keeps cumulative layout shift at zero on load.
 */

export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  // Variable font: the optical-size and width axes ship with the weight range.
  axes: ["opsz", "wdth"],
});

export const instrument = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});

export const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

export const fontVariables = `${bricolage.variable} ${instrument.variable} ${spaceMono.variable}`;
