"use client";

import { useState } from "react";

/**
 * The notify-me field.
 *
 * There is no mailing list service wired to this site and no backend to post
 * to, so this does not pretend to store anything: it composes an email from
 * what was typed and hands it to the reader's own mail client. The address
 * goes to Inside The Hive either way, and nothing is silently dropped into a
 * form that leads nowhere — which is what a fake success message would be.
 *
 * TODO(client): when a mailing list exists (Buttondown, ConvertKit, Netlify
 * Forms), swap the submit handler for a real POST. The markup does not need
 * to change.
 */
export function NotifyForm({ mailto }: { mailto: string }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const address = mailto.replace(/^mailto:/, "");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;

    const subject = encodeURIComponent("Merch drop — add me to the list");
    const body = encodeURIComponent(
      `Please let me know when the Inside The Hive merch drops.\n\n${email}\n`,
    );
    window.location.href = `mailto:${address}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label htmlFor="merch-email" className="u-label text-ink/55">
        Hear about the drop
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="merch-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          // A hairline field on the white ground, matching the site's rules
          // rather than a boxed input with a radius — nothing else here is
          // drawn that way.
          className="u-rule min-h-12 w-full border-b bg-transparent px-0 text-ink placeholder:text-ink/35 focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          className="u-label inline-flex min-h-12 shrink-0 items-center justify-center bg-honey px-6 text-ink transition-colors duration-(--dur-fast) hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Notify me
        </button>
      </div>

      {/* Says what the button actually does. A reader who expects a stored
          signup and gets their mail client instead has been misled, however
          small the moment. */}
      <p aria-live="polite" className="text-sm text-ink/50">
        {sent
          ? "Your mail app should be open — send the message and you are on the list."
          : "Opens an email to us. We will write once, when it drops."}
      </p>
    </form>
  );
}
