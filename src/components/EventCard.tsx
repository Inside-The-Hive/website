import Link from "next/link";
import { HiveId } from "@/components/HiveId";
import { HiveMedia } from "@/components/HiveMedia";
import { cn } from "@/lib/cn";
import { formatEventDate } from "@/lib/content";
import type { Event } from "@/lib/content/schema";

/**
 * Card anatomy, borrowed from both references and stripped to the same
 * discipline: media, hive ID, title, one kicker line, role tag. Nothing else.
 *
 * No shadow, no radius, no container — separation comes from space alone.
 * `group` drives the coordinated hover: media desaturates and cross-fades to
 * the second gallery frame at --dur-base while the chip snaps honey at
 * --dur-fast.
 */

export function EventCard({
  event,
  ratio = "4/5",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className,
  priority = false,
}: {
  event: Event;
  ratio?: "16/9" | "4/5" | "3/2" | "1/1";
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <article className={cn("group", className)}>
      <Link href={`/events/${event.slug}`} className="block">
        <div className="relative">
          <HiveMedia
            src={event.heroMedia.src}
            alt={event.heroMedia.alt}
            hoverSrc={event.gallery[0]?.src}
            ratio={ratio}
            sizes={sizes}
            priority={priority}
          />
          <HiveId id={event.hiveId} className="absolute top-4 left-4" />
        </div>

        <div className="mt-5 flex items-baseline justify-between gap-4">
          <h3 className="text-(length:--text-h3) text-ink">{event.title}</h3>
          <span className="u-label shrink-0 text-ink/55">
            {formatEventDate(event.date)}
          </span>
        </div>

        <p className="mt-2 max-w-prose text-small text-ink/70">{event.summary}</p>

        <p className="u-label mt-4 flex gap-3 text-ink">
          <span>{event.role}</span>
          <span aria-hidden className="text-ink/40">
            /
          </span>
          <span className="text-ink/55">{event.location}</span>
        </p>
      </Link>
    </article>
  );
}
