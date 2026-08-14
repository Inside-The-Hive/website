/**
 * The crew.
 *
 * Everything here is TODO because these are real people — names, roles and
 * faces cannot be invented, and a placeholder that reads like a real person is
 * worse than an obvious blank. The section renders the designed empty state
 * until the client supplies them, so the layout is reviewable now.
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
};

/**
 * Photos are cut-outs on a transparent ground — the layout stands each person
 * against an angled colour panel, so a photo with its original background
 * would sit as a rectangle on top of that panel and lose the effect entirely.
 *
 * Cutting out happens before the file lands here; it is not something the site
 * can do to an arbitrary photograph. Each file is then trimmed to its
 * subject's alpha bounding box (the `-trim` suffix) so the image's edges are
 * the person's edges — without that, two portraits exported on different
 * canvases render at different scales and sit off their panels.
 */
export const team: TeamMember[] = [
  {
    name: "TODO(client): name",
    role: "TODO(client): role",
    photo: "/feezy-trim.png",
  },
  {
    name: "TODO(client): name",
    role: "TODO(client): role",
    photo: "/divine-trim.png",
  },
  {
    name: "TODO(client): name",
    role: "TODO(client): role",
    photo: "/danny-trim.png",
  },
  {
    name: "TODO(client): name",
    role: "TODO(client): role",
    photo: "/cynthia-trim.png",
  },
  {
    name: "TODO(client): name",
    role: "TODO(client): role",
    // Used as supplied — already cut out and framed like the others, so it
    // needs no trimming pass.
    photo: "/anya.png",
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
    note: "38 episodes",
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
