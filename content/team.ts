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

export const team: TeamMember[] = [
  { name: "TODO(client): name", role: "TODO(client): role", photo: null },
  { name: "TODO(client): name", role: "TODO(client): role", photo: null },
  { name: "TODO(client): name", role: "TODO(client): role", photo: null },
  { name: "TODO(client): name", role: "TODO(client): role", photo: null },
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
};

export const services: Service[] = [
  {
    title: "Events",
    description:
      "We host and produce — dinners, screenings, summits. From the room list to the run of show to what it looks like afterwards.",
    note: "20+ hosted",
  },
  {
    title: "Coverage",
    description:
      "On the ground with a camera, not watching a livestream. Photography and video that treats an event as something that happened to people.",
    note: "2,000+ frames",
  },
  {
    title: "The podcast",
    description:
      "Long-form conversation with the people actually building. Africa's Web3 story told by the ones in it, on the record.",
    note: "38 episodes",
  },
  {
    title: "Partnership",
    description:
      "Media partner, event partner, or both. Brands come to us when they need a room filled and the result documented properly.",
    note: "8 partners",
  },
];
