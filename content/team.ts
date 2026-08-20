/**
 * The crew.
 *
 * `photo: null` renders the initial in a honey cell instead of an image, which
 * is the same approach `partners.ts` takes with missing logos.
 */

export type TeamMember = {
  name: string;
  /** What they actually do on a shoot or at an event, not a job title. */
  role: string;
  /** Square crop. Null renders the designed fallback rather than a broken img. */
  photo: string | null;
  /** Optional. Rendered as a link on the name when present. */
  url?: string;
  /**
   * Personal accounts, shown as icons under the role on hover.
   *
   * All three marks always render so the label's design is settled; each turns
   * into a real link once its URL is filled in here, and stays an inert,
   * screen-reader-hidden glyph until then. These are individual handles, not
   * the brand's — `socials` in site.ts holds Inside The Hive's own.
   */
  x?: string;
  telegram?: string;
  email?: string;
  /**
   * Which corner the hover label occupies.
   *
   * Alternates down the row so the labels do not stack into one horizontal
   * band, and so a label never lands on the face of the neighbour its own
   * figure overlaps.
   */
  labelAt: "top" | "bottom";
};

/**
 * Photos are cut-outs on a transparent ground — the layout stands each person
 * against an angled colour panel, so a photo with its original background
 * would sit as a rectangle on top of that panel and lose the effect entirely.
 *
 * Every file here comes from `scripts/build-crew.mjs`, which cuts the studio
 * background where one is still present, trims to the subject, and then pads
 * each portrait onto one shared aspect ratio anchored to the bottom edge.
 *
 * The shared ratio is what keeps the row even. The layout gives each person an
 * identical box and fits the image with `object-contain`, which scales to
 * whichever axis runs out first — so a portrait trimmed to a narrower box than
 * its neighbours renders smaller, and one cropped at a different height stands
 * at a different level. Normalising at the source removes both problems
 * instead of correcting them per person in the component.
 *
 * Originals stay in /public untouched; the processed files live in
 * /public/crew. To add or replace someone: drop the photograph in /public,
 * add it to the SET in the script, run it, and point `photo` at the result.
 */
export const team: TeamMember[] = [
  {
    name: "Feezy",
    role: "Founder",
    labelAt: "top",
    photo: "/crew/feezy.png",
  },
  {
    name: "Anya",
    role: "Brand & Design",
    labelAt: "bottom",
    // Used as supplied — already cut out and framed like the others, so it
    // needs no trimming pass.
    photo: "/crew/anya.png",
  },
  {
    name: "Cynthia",
    role: "Content Lead",
    labelAt: "top",
    photo: "/crew/cynthia.png",
  },
  {
    name: "DannyYak",
    role: "Marketing",
    labelAt: "bottom",
    photo: "/crew/danny.png",
  },
  {
    name: "Divine",
    role: "Social Media",
    labelAt: "top",
    photo: "/crew/divine.png",
  },
  {
    name: "Snazzy",
    role: "Legal",
    labelAt: "bottom",
    photo: "/crew/snazzy.png",
  },
  {
    name: "Deon",
    role: "Tech",
    labelAt: "top",
    photo: "/crew/deon.png",
  },
];

/**
 * What ITH does, stated as capability rather than as past work.
 *
 * The events sequence already proves the track record; this answers the
 * different question a prospective partner arrives with, which is "what can
 * you do for me". Four services, because that is what the brand demonstrably
 * offers — events, coverage, the podcast, and partnership itself.
 *
 * Copy here is written from what the site already evidences, so it needs no
 * client confirmation to be accurate.
 */

export type Service = {
  title: string;
  description: string;
  /** Proof point. Drawn from figures already in site.ts stats. */
  note: string;
  /**
   * Revealed under the cursor while the row is hovered. Real work rather than
   * an illustration — the image is the evidence for the row it belongs to.
   */
  image: string;
};

export const services: Service[] = [
  {
    title: "Events",
    description:
      "We host and produce — dinners, screenings, summits. From the room list to the run of show to what it looks like afterwards.",
    note: "20+ hosted",
    image: "/redot%20x%20ith%20x%20dinner.jpg",
  },
  {
    title: "Coverage",
    description:
      "On the ground with a camera, not watching a livestream. Photography and video that treats an event as something that happened to people.",
    note: "2,000+ frames",
    image: "/unchainsummer.jpg",
  },
  {
    title: "The podcast",
    description:
      "Long-form conversation with the people actually building. Africa's Web3 story told by the ones in it, on the record.",
    note: "94 episodes",
    image: "/videos/movienight-poster.jpg",
  },
  {
    title: "Partnership",
    description:
      "Media partner, event partner, or both. Brands come to us when they need a room filled and the result documented properly.",
    note: "8 partners",
    image: "/Technova.jpg",
  },
];
