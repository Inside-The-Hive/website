import { cn } from "@/lib/cn";

/**
 * The signature element.
 *
 * A catalogue number carried by every event and every episode:
 * `HIVE / 2026 / 007`. It encodes something true — ITH's claim is "we were
 * there, and we have the archive to prove it", and a sequential, year-scoped
 * catalogue number is what an archive actually looks like.
 *
 * Sits on media, so it carries its own ink chip for legibility over any frame.
 * On parent-card hover it fills honey and the text stays ink — the one place
 * yellow appears at scale, and it never carries text on white.
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
  // Rendered with spaces around the separators so the id reads as a catalogue
  // number rather than a path.
  const display = id.split("/").join(" / ");

  return (
    <Tag
      className={cn(
        "u-label inline-block px-2 py-1 leading-none",
        "bg-ink text-white",
        "transition-colors duration-(--dur-fast) ease-(--ease-out-expo)",
        "group-hover:bg-honey group-hover:text-ink",
        "group-focus-visible:bg-honey group-focus-visible:text-ink",
        className,
      )}
    >
      {display}
    </Tag>
  );
}
