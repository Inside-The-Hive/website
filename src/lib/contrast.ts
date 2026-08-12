/**
 * WCAG 2.1 relative luminance and contrast ratio.
 *
 * Used by /style-guide to render measured contrast for every colour pair, so
 * failing combinations are visible to the team rather than rediscovered in
 * review. Contrast is computed, never asserted by hand.
 */

function channel(value: number) {
  const v = value / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function luminance(hex: string) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string) {
  const la = luminance(a);
  const lb = luminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/** AA needs 4.5:1 for body text, 3:1 for large text (>=24px or bold >=18.66px). */
export function grade(ratio: number, large = false) {
  const threshold = large ? 3 : 4.5;
  if (ratio >= 7) return "AAA";
  if (ratio >= threshold) return "AA";
  return "FAIL";
}
