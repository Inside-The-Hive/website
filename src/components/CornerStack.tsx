import { CookieConsent } from "./CookieConsent";
import { PartnerPrompt } from "./PartnerPrompt";
import { SpotifyPrompt } from "./SpotifyPrompt";
import { getPodcastFeed } from "@/lib/content";

/**
 * The bottom-right corner, shared.
 *
 * The scroll prompts and the cookie choice live here. Pinned independently
 * they overlapped, and the prompt — being the later layer — covered the
 * consent card and swallowed the clicks meant for its buttons. One flex
 * column stacks them instead, so each keeps its own space whichever is
 * showing.
 *
 * The two prompts additionally coordinate through `data-ith-prompt` on the
 * body so only one of them is open at a time — see SpotifyPrompt for the
 * contract. The consent card is independent and may sit under either.
 *
 * The wrapper itself ignores the pointer; only the cards inside take it, so
 * an empty corner never blocks the page beneath it.
 */
export function CornerStack() {
  // Server component: the newest episode's art rides down to the Spotify
  // prompt as a prop, so the client bundle never carries the feed.
  const feed = getPodcastFeed();
  const newest = feed
    ? [...feed.episodes].sort(
        (a, b) =>
          new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
      )[0]
    : undefined;

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-3 z-50 flex flex-col items-end gap-3 sm:inset-x-auto sm:right-5 sm:bottom-5">
      {/* The prompt sits above the consent card: the cookie choice is the more
          urgent and belongs nearer the thumb. */}
      <PartnerPrompt />
      <CookieConsent />
      {/* Mounted here because this is the shared overlay mount and the feed
          prop is fetched above, but it portals to the body and renders as a
          centred modal — it never occupies the corner. */}
      <SpotifyPrompt cover={newest?.cover} episodeTitle={newest?.title} />
    </div>
  );
}
