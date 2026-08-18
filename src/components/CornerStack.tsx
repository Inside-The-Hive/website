import { CookieConsent } from "./CookieConsent";
import { PartnerPrompt } from "./PartnerPrompt";

/**
 * The bottom-right corner, shared.
 *
 * Both the partner prompt and the cookie choice live here, and both can be
 * open at once. Pinned independently they overlapped, and the prompt — being
 * the later layer — covered the consent card and swallowed the clicks meant
 * for its buttons. One flex column stacks them instead, so each keeps its own
 * space whichever is showing.
 *
 * The wrapper itself ignores the pointer; only the cards inside take it, so
 * an empty corner never blocks the page beneath it.
 */
export function CornerStack() {
  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-3 z-50 flex flex-col items-end gap-3 sm:inset-x-auto sm:right-5 sm:bottom-5">
      {/* The prompt sits above the consent card: the cookie choice is the more
          urgent of the two and belongs nearer the thumb. */}
      <PartnerPrompt />
      <CookieConsent />
    </div>
  );
}
