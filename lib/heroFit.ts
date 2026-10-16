// Whether the hero's portrait and copy fit one screen with room to spare: the
// condition for the sticky scroll stage (components/HeroStage.tsx). The same
// test runs twice: inline during parsing, before first paint (HERO_FITS_JS,
// rendered by components/Hero.tsx), and on the client after a width change
// or a client-side navigation (heroFits).
const PAD = 152; // .hero-top padding: 6.5rem + 3rem

export function heroFits(stage: HTMLElement): boolean {
  const portrait = stage.querySelector(".hero-portrait");
  const copy = stage.querySelector(".hero-copy");
  if (!portrait || !copy) return false;
  const content = copy.getBoundingClientRect().bottom - portrait.getBoundingClientRect().top + PAD;
  return window.innerHeight >= 560 && content <= window.innerHeight - 16;
}

export const HERO_FITS_JS = `(function(){var s=document.getElementById("hero-stage");if(!s||matchMedia("(prefers-reduced-motion: reduce)").matches)return;var p=s.querySelector(".hero-portrait"),c=s.querySelector(".hero-copy");if(innerHeight>=560&&c.getBoundingClientRect().bottom-p.getBoundingClientRect().top+${PAD}<=innerHeight-16){s.setAttribute("data-live","");s.setAttribute("data-copy","on")}})()`;
