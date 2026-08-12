/**
 * Site-wide configuration: nav, socials, podcast platforms, external links.
 *
 * Values marked TODO are not yet confirmed by the client. They are placeholders
 * and must never be treated as real. Nothing here may be invented — if a value
 * is unknown it stays TODO until supplied.
 *
 * Socials and the podcast categories below were recovered from the live site
 * and are real.
 */

export const site = {
  name: "Inside The Hive",
  shortName: "ITH",

  /**
   * `.org` is primary. The current site serves on `.org` while declaring
   * canonicals on `.com` — that mismatch is corrected here. The `.com` domain
   * should 301 to `.org` at the DNS/host layer (see README).
   */
  url: "https://www.insidethehive.org",

  description:
    "Inside The Hive is an African Web3 media brand. We host events, cover them on the ground, and run Africa's #1 Web3 podcast.",

  /** Merch lives in a separate repo. Placeholder — not yet live. */
  storeUrl: "https://store.insidethehive.org",

  twitterHandle: "@InsideDHive",
} as const;

/** Primary navigation. Four links, no dropdowns. */
export const navLinks = [
  { label: "Events", href: "/events" },
  { label: "Podcast", href: "/podcast" },
  { label: "About", href: "/about" },
  { label: "Partner", href: "/partner" },
] as const;

/** Real, recovered from the live site. */
export const socials = [
  { label: "X", href: "https://x.com/InsideDHive" },
  { label: "Instagram", href: "https://instagram.com/insidedhive" },
  { label: "Telegram", href: "https://t.me/insidethehive" },
  { label: "Email", href: "mailto:contact@insidedhive.com" },
] as const;

/**
 * The six platforms the podcast publishes to.
 * TODO(client): show URLs for Apple, Pocket Casts, Audiomack and CastBox.
 */
export const podcastPlatforms = [
  { label: "YouTube", href: "https://youtube.com/@insidethehive", confirmed: false },
  { label: "Spotify", href: "TODO", confirmed: false },
  { label: "Apple Podcasts", href: "TODO", confirmed: false },
  { label: "Pocket Casts", href: "TODO", confirmed: false },
  { label: "Audiomack", href: "TODO", confirmed: false },
  { label: "CastBox", href: "TODO", confirmed: false },
] as const;

/**
 * The five real episode categories, recovered from /categories/* on the live
 * site. The current site renders these as vertically-stacked single letters,
 * which is unreadable; here they are horizontal Space Mono filter chips.
 */
export const episodeCategories = [
  { slug: "blockchain", label: "Blockchain" },
  { slug: "crypto", label: "Crypto" },
  { slug: "web3", label: "Web3" },
  { slug: "nft", label: "NFT" },
  { slug: "creator-and-socialfi", label: "Creator & SocialFi" },
] as const;

export type EpisodeCategory = (typeof episodeCategories)[number]["slug"];

/**
 * Footer: four groups, under 12 links total. The current site has ~20 links in
 * three undifferentiated columns.
 */
export const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Events", href: "/events" },
      { label: "About", href: "/about" },
      { label: "Team", href: "/team" },
    ],
  },
  {
    title: "Listen",
    links: [
      { label: "All episodes", href: "/podcast" },
      { label: "YouTube", href: "https://youtube.com/@insidethehive", external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Partner with us", href: "/partner" },
      { label: "Join the Hive", href: "/join" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "X", href: "https://x.com/InsideDHive", external: true },
      { label: "Instagram", href: "https://instagram.com/insidedhive", external: true },
      { label: "Telegram", href: "https://t.me/insidethehive", external: true },
    ],
  },
] as const;

/**
 * Homepage "By the numbers".
 * TODO(client): real figures. The section renders the labels and the odometer
 * with `value: null` until supplied — no invented statistics.
 */
export const stats = [
  { label: "Events covered", value: null as number | null },
  { label: "Episodes published", value: null as number | null },
  { label: "Guests hosted", value: null as number | null },
  { label: "Cities", value: null as number | null },
] as const;
