import { identity } from "./content";
import { withBase } from "./utils";

// Every mailto: and external link renders through here, so they all open in a
// new tab: a browser whose mail handler is a web app (Gmail) would otherwise
// replace this site in the same tab. noopener/noreferrer keep the new tab from
// reaching back. tel:, in-page anchors and same-site paths are left alone.
// scripts/check-content.ts fails the build on a hand-written target="_blank"
// or mailto: in app/ or components/, and `npm run verify` checks the output.
export function linkProps(href: string): { href: string; target?: "_blank"; rel?: string } {
  return /^(mailto:|https?:\/\/)/.test(href)
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };
}

// Every Download Resume link: the fixed path plus the PDF's fingerprint (?v=),
// so a new resume is never served from a cache, under a clear file name.
export function resumeLinkProps(): { href: string; download: string } {
  return {
    href: withBase(`${identity.resumePath}?v=${identity.resumeVersion}`),
    download: identity.resumeFileName,
  };
}
