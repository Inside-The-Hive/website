import { cn } from "@/lib/cn";

/**
 * The signature element.
 *
 * A monospace catalogue number carried by every event and every episode:
 * `HIVE / 2026 / 007`. It encodes something true — ITH's claim is "we were
 * there, and we have the archive to prove it", and a sequential, year-scoped
 * catalogue number is what an archive actually looks like.
 *
 * Hover behaviour is driven by the parent card via the `group` class: the chip
 * fills honey and inverts to ink at --dur-fast, snapping before the image
 * settles at --dur-base. That mismatch is deliberate — it reads as mechanical
 * rather than soft.
 */

export function HiveId({
  id,
  className,
  as: Tag = "span",
}: {
  /** Raw id from frontmatter, e.g. "HIVE/2026/007". */
  id: string;
  className?: string;
  as?: "span" | "div";
}) {
  // Rendered with hair spaces around the separators so the id reads as a
  // catalogue number rather than a path.
  const display = id.split("/").join(" / ");

  return (
    <Tag
      className={cn(
        "u-label inline-block border px-2 py-1 leading-none",
        "border-propolis/60 text-wax",
        "transition-colors duration-(--dur-fast) ease-(--ease-out-expo)",
        "group-hover:border-honey group-hover:bg-honey group-hover:text-ink",
        "group-focus-visible:border-honey group-focus-visible:bg-honey group-focus-visible:text-ink",
        className,
      )}
    >
      {display}
    </Tag>
  );
}
