import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Every image on the site goes through here.
 *
 * Photography and video have not been delivered yet. When `src` is absent this
 * renders a designed skeleton — a carbon field at the correct aspect ratio with
 * a slow honey shimmer — so the layout is final and testable now, and dropping
 * real assets in later is a content-file change with zero component edits.
 *
 * The skeleton is a deliberate state, not a grey box.
 */

type Ratio = "16/9" | "4/5" | "3/2" | "1/1";

const ratioClass: Record<Ratio, string> = {
  "16/9": "aspect-video",
  "4/5": "aspect-[4/5]",
  "3/2": "aspect-[3/2]",
  "1/1": "aspect-square",
};

export function HiveMedia({
  src,
  alt,
  ratio = "3/2",
  priority = false,
  sizes = "100vw",
  className,
  /** Second frame, cross-faded in on parent hover. Proof a real set exists. */
  hoverSrc,
  fill = true,
  /** Hide the pending-state caption where the frame sits behind other content. */
  quiet = false,
}: {
  src?: string | null;
  /**
   * Describes the moment, not the file. The content schema enforces a minimum
   * length so `"event photo 2"` cannot ship.
   */
  alt: string;
  ratio?: Ratio;
  priority?: boolean;
  sizes?: string;
  className?: string;
  hoverSrc?: string | null;
  fill?: boolean;
  quiet?: boolean;
}) {
  const pending = !src || src.startsWith("TODO");

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-ash",
        fill && ratioClass[ratio],
        className,
      )}
    >
      {pending ? (
        <Skeleton alt={alt} quiet={quiet} />
      ) : (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            className={cn(
              "object-cover",
              "transition-[filter,opacity,transform] duration-(--dur-base) ease-(--ease-out-expo)",
              "group-hover:saturate-[0.6]",
              hoverSrc && "group-hover:opacity-0",
            )}
          />
          {hoverSrc && !hoverSrc.startsWith("TODO") && (
            <Image
              src={hoverSrc}
              alt=""
              aria-hidden
              fill
              sizes={sizes}
              loading="lazy"
              className={cn(
                "object-cover opacity-0",
                "transition-opacity duration-(--dur-base) ease-(--ease-out-expo)",
                "group-hover:opacity-100",
              )}
            />
          )}
        </>
      )}
    </div>
  );
}

/**
 * Pending-media state. Announced to assistive tech so a screen reader user is
 * told the media is not available yet rather than meeting silence.
 */
function Skeleton({ alt, quiet = false }: { alt: string; quiet?: boolean }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      role="img"
      aria-label={`${alt} — image coming soon`}
      style={{
        // A warm wash with enough weight to read as a deliberate panel against
        // the white page, rather than as a hole in the layout.
        background:
          "linear-gradient(160deg, color-mix(in srgb, var(--color-honey) 18%, var(--color-ash)), color-mix(in srgb, var(--color-propolis) 7%, var(--color-ash)))",
      }}
    >
      {/* Hairline frame so the empty state still reads as composed. */}
      <div className="u-rule absolute inset-0 border" />

      {/* Honey shimmer sweep. Suppressed under reduced motion by the global
          rule in globals.css. */}
      <div
        className="absolute -inset-x-full inset-y-0 opacity-30"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-honey), transparent)",
          animation: "hive-shimmer 2.6s var(--ease-out-expo) infinite",
        }}
      />

      {/* Says what the state is, so an empty frame is never mistaken for a
          broken image. Suppressed where the frame sits behind other content. */}
      {!quiet && (
        <span className="u-label absolute right-4 bottom-4 text-ink/35">
          Photography coming
        </span>
      )}
    </div>
  );
}
