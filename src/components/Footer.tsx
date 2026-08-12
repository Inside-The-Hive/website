import Link from "next/link";
import { footerGroups, site } from "@/content/site";

/**
 * Four groups, under 12 links total. The current site has ~20 links in three
 * undifferentiated columns.
 */

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="u-rule border-t">
      <div className="u-gutter u-section">
        <div className="flex flex-col gap-16 lg:flex-row lg:justify-between">
          <div className="max-w-md">
            <p className="font-display text-(length:--text-h3) leading-[0.95] font-extrabold tracking-[-0.03em] text-wax">
              {site.name}
            </p>
            <p className="mt-4 text-wax/80">
              African Web3 media. We host the room, cover the room, and put a microphone
              in it.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4"
          >
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="u-label font-mono text-honey">{group.title}</h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      {"external" in link && link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener"
                          className="inline-flex min-h-11 items-center text-small text-wax/80 transition-colors duration-(--dur-fast) hover:text-honey"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="inline-flex min-h-11 items-center text-small text-wax/80 transition-colors duration-(--dur-fast) hover:text-honey"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p className="u-label mt-20 text-wax/60">
          © {year} {site.name}
        </p>
      </div>
    </footer>
  );
}
