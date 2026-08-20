/**
 * The three social marks the site uses.
 *
 * Inline SVG rather than an icon package: three glyphs do not justify a
 * dependency, and inlining means they inherit `currentColor` so a mark sits in
 * whatever colour its context already sets.
 *
 * All three share a 24-unit viewBox and are drawn to the same optical weight,
 * so a row of them reads as one set rather than three borrowed logos.
 */

type IconProps = { className?: string };

/** X, formerly Twitter. */
export function XIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
      className={className}
    >
      <path d="M17.53 3h3.02l-6.6 7.54L21.75 21h-5.9l-4.62-6.04L5.94 21H2.92l7.06-8.07L2.5 3h6.05l4.18 5.52L17.53 3Zm-1.06 16.2h1.67L7.6 4.71H5.81l10.66 14.49Z" />
    </svg>
  );
}

export function TelegramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
      className={className}
    >
      <path d="M21.7 4.2 18.9 19c-.2 1-.8 1.2-1.6.75l-4.5-3.3-2.17 2.1c-.24.24-.44.44-.9.44l.32-4.6L18.4 6.5c.36-.32-.08-.5-.56-.18L7.5 12.9l-4.44-1.4c-.97-.3-.99-.96.2-1.43l17.36-6.7c.8-.3 1.5.18 1.24 1.03Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function EmailIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className={className}
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6.5 8.13 5.7a1.5 1.5 0 0 0 1.74 0L21 6.5" />
    </svg>
  );
}
