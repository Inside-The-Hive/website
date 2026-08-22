/**
 * What partners and podcast guests say about working with Inside The Hive.
 *
 * TODO(client): every quote below is a PLACEHOLDER. None of these people have
 * said these words. They exist so the six candidate designs can be compared
 * against realistic copy — real length, real shape, real name-and-role
 * attribution — and must be replaced before this section ships.
 *
 * A fabricated testimonial is worse than a missing one: it is a false statement
 * attributed to a named third party. `placeholder: true` marks every entry, and
 * the preview page renders a banner off the back of it, so an unreplaced quote
 * cannot quietly reach production.
 *
 * The names are drawn from `partners.ts` — brands ITH genuinely works with — so
 * the layouts are tested at the name lengths that will really appear.
 */

export type Testimonial = {
  /** The quote itself. Kept to roughly 100-220 characters. */
  quote: string;
  /** Person speaking, as it should be printed. */
  name: string;
  /** Their role and organisation, on one line. */
  role: string;
  /**
   * Portrait or logo. Null renders the initial in a honey cell, the same
   * fallback `team.ts` and `partners.ts` use.
   */
  image: string | null;
  /**
   * The one line worth setting large when a design pulls a fragment out of the
   * full quote. Must be a literal substring of `quote` so the pull and the
   * source never disagree.
   */
  pull: string;
  /**
   * True when `name` is a person, false when it is a company.
   *
   * Several of the designs set names in Sacramento. A script face reads as a
   * signature, which is right for a person and wrong for a brand — "TechNova
   * Summit" in handwriting looks like someone signed for the company rather
   * than like the company speaking. Brands fall back to Inter.
   */
  isPerson: boolean;
  /** Never render as real copy while true. */
  placeholder: true;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "They filled the room and then made it look like the room had always been full. We have worked with agencies that do one or the other. Not both, and never this fast.",
    pull: "made it look like the room had always been full",
    name: "Redots Club",
    role: "Partner — Dinner Night, Lagos",
    image: "/redot-x-ith-x-dinner.webp",
    isPerson: false,
    placeholder: true,
  },
  {
    quote:
      "The team was on the ground before we were. By the time the summit opened they already knew who mattered in the building and had the shots to prove it.",
    pull: "on the ground before we were",
    name: "TechNova Summit",
    role: "Partner — TechNova, Abuja",
    image: "/Technova.webp",
    isPerson: false,
    placeholder: true,
  },
  {
    quote:
      "Most podcasts want a soundbite. This one wanted the actual argument. I said things on that show I had not managed to say properly anywhere else.",
    pull: "wanted the actual argument",
    name: "Guest Name",
    role: "Founder — Episode 31",
    image: "/UNCHAIN%20SUMMER%20x%20NFT%20NG%20x%20ITH%20(93%20of%2051).jpg",
    isPerson: true,
    placeholder: true,
  },
  {
    quote:
      "Coverage that treats an event as something that happened to people, not as content. That distinction is the entire reason we came back for the second one.",
    pull: "something that happened to people",
    name: "UNCHAIN Summer",
    role: "Partner — Summer Series",
    image: "/unchainsummer.webp",
    isPerson: false,
    placeholder: true,
  },
  {
    quote:
      "African Web3 gets covered from a distance, usually badly. Inside The Hive covers it from inside it. The difference shows in every frame they publish.",
    pull: "covers it from inside it",
    name: "Guest Name",
    role: "Builder — Episode 24",
    image: "/movienight.webp",
    isPerson: true,
    placeholder: true,
  },
  {
    quote:
      "We asked for a media partner and got a production team. Two thousand frames later I still cannot point at one that we would not publish ourselves.",
    pull: "asked for a media partner and got a production team",
    name: "RedotClub",
    role: "Partner — Product Launch",
    image: "/movienight.webp",
    isPerson: false,
    placeholder: true,
  },
];
