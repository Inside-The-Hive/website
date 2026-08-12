/**
 * Partner and coverage logos for the homepage marquee.
 *
 * Only brands ITH has a real, confirmed relationship with. `logo: null` renders
 * the wordmark in Space Mono instead of an image — deliberate, and honest until
 * real logo files arrive with the brand kit.
 *
 * TODO(client): supply logo SVGs, and confirm this list is complete and
 * approved for public display.
 */

export type Partner = {
  name: string;
  url?: string;
  logo: string | null;
};

export const partners: Partner[] = [
  // Recovered from the live site and its linked X posts.
  { name: "Redots Club", url: "https://x.com/RedotsClub", logo: null },
  { name: "RedotPay", logo: null },
  { name: "TechNova Summit", url: "https://x.com/TechNovasummit", logo: null },
  // Named in the brief as events ITH has covered on the ground.
  { name: "ETHDenver", logo: null },
  { name: "Token2049 Singapore", logo: null },
];
