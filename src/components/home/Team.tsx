import Image from "next/image";
import Link from "next/link";
import { team } from "@/content/team";

/**
 * The crew.
 *
 * The lore says "someone young, out of school, with a camera" but never shows
 * who — and a media brand is its people. This closes that gap: the faces
 * behind the coverage, named, with what they actually do rather than a job
 * title.
 *
 * Portrait frames on a warm ground, echoing the poster treatment in the events
 * sequence so the two read as the same brand rather than two designs.
 *
 * Names are TODO until the client supplies them. Rather than render four rows
 * of "TODO(client)" to a visitor, unconfirmed members fall back to a numbered
 * placeholder cell — the layout is complete and reviewable, and nothing on the
 * page claims to be a person who has not been confirmed.
 */

function isPending(value: string) {
  return !value || value.startsWith("TODO");
}

export function Team() {
  const confirmed = team.filter(
    (member) => !isPending(member.name) && !isPending(member.role),
  );
  const pendingCount = team.length - confirmed.length;

  return (
    <section
      aria-labelledby="team-heading"
      className="u-section u-rule border-t text-ink"
    >
      <div className="u-gutter">
        <div className="mb-[clamp(3rem,7vh,5rem)] flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="team-heading" className="text-(length:--text-h2)">
            The crew
          </h2>
          <p className="u-label max-w-sm text-ink/55">
            The people in the room
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-x-8">
          {confirmed.map((member) => (
            <li key={member.name}>
              <div className="u-rule relative aspect-[4/5] overflow-hidden border bg-ash">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 22vw, 45vw"
                    className="object-cover"
                  />
                ) : (
                  // No photo yet. The initial in the brand's own geometry
                  // rather than a grey avatar silhouette.
                  <span
                    aria-hidden
                    className="absolute inset-0 grid place-items-center font-display text-(length:--text-h1) text-ink/12"
                  >
                    {member.name.charAt(0)}
                  </span>
                )}
              </div>

              <h3 className="mt-5 text-(length:--text-h3) text-ink">
                {member.url ? (
                  <Link
                    href={member.url}
                    target="_blank"
                    rel="noopener"
                    className="transition-colors duration-(--dur-fast) hover:text-propolis"
                  >
                    {member.name} <span aria-hidden>↗</span>
                  </Link>
                ) : (
                  member.name
                )}
              </h3>
              <p className="u-label mt-2 text-ink/55">{member.role}</p>
            </li>
          ))}

          {/* Placeholder cells for members not yet confirmed. Quiet on
              purpose — a page in front of a visitor should read as composed
              rather than unfinished, so these hold the grid's shape without
              announcing that something is missing. */}
          {Array.from({ length: pendingCount }).map((_, index) => (
            <li key={`pending-${index}`} aria-hidden>
              <div className="relative aspect-[4/5] overflow-hidden bg-ash">
                <span className="u-label absolute inset-0 grid place-items-center text-ink/15">
                  {String(confirmed.length + index + 1).padStart(2, "0")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
