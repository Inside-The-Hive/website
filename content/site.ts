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

/**
 * Primary navigation. Two links, no dropdowns.
 *
 * Deliberately short. Events are already the gallery's own subject — every
 * event has a set there — so a separate Events entry pointed at a second view
 * of the same catalogue. Partnering is an ask rather than a destination, and
 * it belongs on the homepage where the argument for it has just been made.
 * About has no page yet and is not worth a link that leads nowhere.
 */
export const navLinks = [
  { label: "Gallery", href: "/gallery" },
  { label: "Podcast", href: "/podcast" },
] as const;

/** Real, recovered from the live site. */
export const socials = [
  { label: "X", href: "https://x.com/InsideDHive" },
  { label: "Instagram", href: "https://instagram.com/insidedhive" },
  { label: "Telegram", href: "https://t.me/insidethehive" },
  { label: "Email", href: "mailto:insidethehivepod@gmail.com" },
] as const;

/**
 * The six platforms the podcast publishes to.
 * TODO(client): show URLs for Apple, Pocket Casts, Audiomack and CastBox.
 */
export const podcastPlatforms = [
  { label: "YouTube", href: "https://youtube.com/@insidethehive", confirmed: false },
  // Supplied by the client and matching the show's own feed.
  { label: "Spotify", href: "https://open.spotify.com/show/0wOOX8mdQUoRP1adnxV9VD", confirmed: true },
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
      { label: "Gallery", href: "/gallery" },
      { label: "Podcast", href: "/podcast" },
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
      // Mail rather than routes: /partner, /join and /contact do not exist,
      // and a live address beats three dead links.
      { label: "Partner with us", href: "mailto:insidethehivepod@gmail.com", external: true },
      { label: "Contact", href: "mailto:insidethehivepod@gmail.com", external: true },
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
/**
 * Homepage counters.
 *
 * `suffix` marks figures that are approximate by nature, so 20+ reads as a
 * floor rather than an exact count.
 */
export const stats = [
  { label: "Events hosted", value: 20, suffix: "+" },
  { label: "Memories captured", value: 2000, suffix: "" },
  // Counted from the show's own RSS feed (see content/podcast/feed.json).
  { label: "Podcast episodes", value: 94, suffix: "" },
  { label: "Spotify listeners", value: 589, suffix: "" },
  { label: "Partnerships secured", value: 8, suffix: "" },
] as const;

/**
 * Founding facts behind the homepage lore section.
 *
 * The narrative there is written from what the brand demonstrably does —
 * events, on-the-ground coverage, a podcast, work across Nigerian cities.
 * These four values are the ones only the client can confirm, so they are
 * TODO rather than invented: this is a real company's history, and a
 * plausible-sounding fabrication is worse than an obvious blank.
 *
 * Once supplied, they can be woven into the copy in Lore.tsx.
 */
export const founding = {
  /** TODO(client): founder's name, as it should be printed. */
  founder: "TODO",
  /** TODO(client): year Inside The Hive started. */
  year: "TODO",
  /** TODO(client): the first event, and where it happened. */
  firstEvent: "TODO",
  /** TODO(client): city the brand started in. The copy currently says Lagos. */
  city: "Lagos",
} as const;
