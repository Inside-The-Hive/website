import type { Metadata } from "next";
import { site } from "@/content/site";
import { fontVariables } from "@/lib/fonts";
import { Analytics } from "@/components/Analytics";
import { CornerStack } from "@/components/CornerStack";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — African Web3 media`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — African Web3 media`,
    description: site.description,
    url: site.url,
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    site: site.twitterHandle,
    creator: site.twitterHandle,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={fontVariables}>
      {/* Browser extensions inject attributes onto <body> before React
          hydrates — ColorZilla's `cz-shortcut-listen`, Grammarly's
          `data-gr-*`, and others — which React reports as a hydration
          mismatch we cannot fix from here. This suppresses the warning for
          this element's attributes only; it does not extend to children, so
          real mismatches inside the tree are still reported. */}
      <body className="antialiased" suppressHydrationWarning>
        <a
          href="#main"
          className="u-label sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:bg-honey focus:px-4 focus:py-3 focus:text-ink"
        >
          Skip to content
        </a>

        <SmoothScroll>
          <ScrollProgress />
          <Nav />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </SmoothScroll>

        {/* Both corner cards, stacked rather than overlapping. */}
        <CornerStack />

        {/* Rendered only once consent is granted — declining means the script
            never loads at all. */}
        {gaId && <Analytics gaId={gaId} />}
      </body>
    </html>
  );
}
