import { z } from "zod";

/**
 * Content schemas.
 *
 * Frontmatter is validated at build time and an invalid file fails the build
 * rather than rendering something broken. That is deliberate: content is edited
 * by non-developers, and a loud build error is far cheaper than a silently
 * malformed page in production.
 */

/**
 * Alt text describes the moment, not the file.
 *
 * The current site ships `alt="Technova event photo 2"` five times over. This
 * refinement makes that class of alt text impossible to commit: it must be a
 * real sentence and must not be the generic "<something> photo <n>" pattern.
 */
const altText = z
  .string()
  .min(15, "Alt text must describe the moment, not the file (15 characters minimum)")
  .refine((value) => !/\bphoto\s*\d+\s*$/i.test(value.trim()), {
    message:
      'Alt text must not end in "photo <number>". Describe what is happening in the frame.',
  })
  .refine((value) => value.trim().split(/\s+/).length >= 3, {
    message: "Alt text must be at least three words.",
  });

/** An image with its required description. */
const imageSchema = z.object({
  src: z.string(),
  alt: altText,
});

/** Hero media: a still or a video with a poster frame. */
const heroMediaSchema = z.object({
  type: z.enum(["image", "video"]),
  src: z.string(),
  poster: z.string().optional(),
  alt: altText,
});

/** The role ITH played. Drives the tag on every event card. */
export const eventRoles = ["Host", "Media Partner", "Coverage"] as const;

export const eventSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, digits and hyphens only"),
  /** Catalogue number, e.g. HIVE/2026/007. The signature element. */
  hiveId: z
    .string()
    .regex(/^HIVE\/\d{4}\/\d{3}$/, "Hive ID must look like HIVE/2026/007"),
  date: z.coerce.date(),
  location: z.string().min(1),
  role: z.enum(eventRoles),
  partner: z.string().optional(),
  partnerUrl: z.string().url().optional(),
  summary: z
    .string()
    .min(1)
    .max(120, "Summary is the card kicker line — keep it under 120 characters"),
  heroMedia: heroMediaSchema,
  gallery: z.array(imageSchema).default([]),
  socialEmbeds: z.array(z.string().url()).default([]),
  featured: z.boolean().default(false),
  /** Set true while media and copy are still placeholder. */
  draft: z.boolean().default(false),
});

export type Event = z.infer<typeof eventSchema> & { body: string };

/** The five real categories, recovered from the live site's /categories/*. */
export const episodeCategorySlugs = [
  "blockchain",
  "crypto",
  "web3",
  "nft",
  "creator-and-socialfi",
] as const;

export const episodeSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, digits and hyphens only"),
  hiveId: z
    .string()
    .regex(/^HIVE\/\d{4}\/\d{3}$/, "Hive ID must look like HIVE/2026/007"),
  /** Sequential episode number. Displayed alongside the hive ID. */
  episodeNumber: z.number().int().positive().optional(),
  date: z.coerce.date(),
  category: z.enum(episodeCategorySlugs),
  guest: z.string().optional(),
  guestRole: z.string().optional(),
  summary: z.string().min(1).max(200),
  /** Runtime as mm:ss or hh:mm:ss. */
  duration: z
    .string()
    .regex(/^(\d{1,2}:)?\d{1,2}:\d{2}$/, "Duration must look like 48:12 or 1:04:30")
    .optional(),
  /** At least one platform is required — an episode nobody can play is not an episode. */
  platforms: z
    .object({
      youtube: z.string().url().optional(),
      spotify: z.string().url().optional(),
      apple: z.string().url().optional(),
      pocketCasts: z.string().url().optional(),
      audiomack: z.string().url().optional(),
      castbox: z.string().url().optional(),
    })
    .refine((value) => Object.values(value).some(Boolean), {
      message: "An episode needs at least one platform link.",
    }),
  coverImage: imageSchema.optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
});

export type Episode = z.infer<typeof episodeSchema> & { body: string };
