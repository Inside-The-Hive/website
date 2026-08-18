"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useEffect, useState } from "react";
import { readConsent } from "./CookieConsent";

/**
 * Analytics, gated on consent.
 *
 * The script is not rendered at all until the visitor has accepted, so
 * declining means it never loads rather than loading and being asked not to
 * report. It listens for the consent event as well as reading storage on
 * mount, so accepting takes effect on the spot instead of on the next visit.
 */
export function Analytics({ gaId }: { gaId: string }) {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    setGranted(readConsent() === "granted");

    const onDecision = (event: Event) => {
      setGranted((event as CustomEvent<string>).detail === "granted");
    };
    window.addEventListener("ith-consent", onDecision);
    return () => window.removeEventListener("ith-consent", onDecision);
  }, []);

  if (!granted) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
