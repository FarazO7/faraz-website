"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Mail, Phone } from "lucide-react";
import { GitHubMark, LinkedInMark } from "./icons";
import { identity } from "@/lib/content";
import { linkProps } from "@/lib/links";
import { cn } from "@/lib/utils";

// Phone and email as small pills, LinkedIn and GitHub as round icon buttons
// whose names show on hover. Used under the hero buttons and in the footer
// (tone="dark"). The email pill copies the address: "Get in touch" already
// opens a mail app, so each control does one job.
export default function ContactRow({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copyEmail() {
    if (!(await copyText(identity.email))) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn("contact-row", tone === "dark" && "contact-row-dark", className)}>
      <a className="contact-pill" href={identity.phoneHref}>
        <Phone className="size-4" aria-hidden />
        {identity.phone}
      </a>
      <button
        type="button"
        className="contact-pill"
        data-tip={copied ? "Copied" : undefined}
        aria-label={`Copy email address ${identity.email}`}
        onClick={copyEmail}
      >
        {copied ? <Check className="size-4" aria-hidden /> : <Mail className="size-4" aria-hidden />}
        {identity.email}
      </button>
      <a className="contact-pill contact-icon" data-tip="LinkedIn" {...linkProps(identity.linkedin)}>
        <LinkedInMark className="size-4" />
        <span className="sr-only">LinkedIn (opens in a new tab)</span>
      </a>
      <a className="contact-pill contact-icon" data-tip="GitHub" {...linkProps(identity.github)}>
        <GitHubMark className="size-4" />
        <span className="sr-only">GitHub (opens in a new tab)</span>
      </a>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </div>
  );
}

// navigator.clipboard only exists in secure contexts (https, localhost), so
// the site opened at a plain-http LAN address falls back to a hidden textarea.
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const active = document.activeElement as HTMLElement | null;
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.append(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    active?.focus();
    return ok;
  }
}
