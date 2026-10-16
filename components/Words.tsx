import { Fragment, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

// Splits a heading into word masks for the reveal (globals.css .wm/.w). The
// words stay real text, separated by real spaces, so screen readers, search
// and find-in-page read the sentence unchanged. `accent` names an existing
// run of words to set in the serif italic; it never adds or changes words.
export default function Words({
  text,
  accent,
  className,
}: {
  text: string;
  accent?: string;
  className?: string;
}) {
  const words = text.split(" ");
  const accentWords = accent ? accent.split(" ") : [];
  const start = accentWords.length
    ? words.findIndex((_, i) => accentWords.every((a, j) => words[i + j] === a))
    : -1;

  return words.map((word, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <span className="wm">
        <span
          className={cn(
            "w",
            start >= 0 && i >= start && i < start + accentWords.length && "accent",
            className,
          )}
          style={{ "--wi": i } as CSSProperties}
        >
          {word}
        </span>
      </span>
    </Fragment>
  ));
}
