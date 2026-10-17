import { ViewTransition } from "react";

// Crossfade between home and the impact pages (the reference uses Astro view
// transitions). Per page, not in the layout, so enter/exit fire on
// navigation; "none" for everything else. Browsers without the View
// Transitions API simply swap pages; reduced motion turns it off in CSS.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="auto" exit="auto" default="none">
      {children}
    </ViewTransition>
  );
}
