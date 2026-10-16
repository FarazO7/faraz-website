# Claude Code Master Prompt: Redesign My Personal Portfolio Using CapsLock.global as the Visual Reference

## 1. Your Role

Act as a world-class creative director, senior product designer, motion designer, and senior frontend engineer.

You specialise in:
- Award-winning agency websites and creative portfolios.
- Editorial typography and bold visual storytelling.
- Advanced web animation and scroll-driven interactions.
- High-performance, responsive React and Next.js websites.
- Premium user experiences with meticulous attention to spacing, layout, colour, typography, and motion.

Your task is to completely transform the visual design of my existing personal portfolio website to closely match the visual quality, design language, interaction patterns, and animation sophistication of:

**Reference website:** https://capslock.global/

**My website to redesign:** https://faraz-website.vercel.app/

This is an implementation task, not a request for advice, a design proposal, or a list of recommendations. Inspect the project, understand the reference, modify the actual source code, run the application, and verify the finished result.

Do not stop after analysing the websites or explaining what you intend to do. Apart from one approval checkpoint after the design specification (Section 18, Step 5), carry the implementation through to completion.

---

## 2. The Most Important Constraint: Preserve All Existing Content

My existing website contains my professional identity, career history, achievements, quantified business impact, education, case studies, product projects, contact information, and external links.

**Every existing piece of content must remain intact. The scope of this task is visual design, layout, typography, animation, interaction, and presentation.**

Do not rewrite, shorten, paraphrase, remove, fabricate, or replace my content.

In particular, preserve:

- My name, professional title, introduction, and professional summary.
- My email address, phone number, LinkedIn, GitHub, and resume download.
- Every employer, role, employment date, and work-experience description.
- Every achievement, metric, percentage, monetary value, and quantified outcome.
- All education details.
- All case studies, their descriptions, document links, and supporting material.
- All products I have built, including Signal and its live demo and repository links.
- All project descriptions, technical details, product links, and external references.
- Every existing navigation destination and functional interaction.
- All other text, metadata, assets, and meaningful functionality currently present.

The existing website is the source of truth for content. Inspect the actual source code and the rendered website before making changes.

Do not rely on memory, assumptions, or the reference website's content.

If a section is difficult to fit into the new design, redesign its layout rather than deleting or compressing its information.

You may reorganise the visual presentation of existing information when necessary, but do not change its meaning or omit any content.

Do not copy CapsLock's business copy, branding, logo, or company-specific assets into my personal portfolio.

### Full scope: every route and section

The site is more than the homepage. Before editing, list every route in SPEC.md. Known so far (verify against the source):

- The homepage.
- Ten case pages under /impact/: kyc-review-workflow, compliance-dashboard, risk-scoring, roles-permissions, aml-mock-service, signup-conversion, referral-growth, ai-proctoring, razorpay-route, and waitlist-automation. Eight are linked from the Impact metric cards. Compliance-dashboard and signup-conversion are linked only from "Read the case" links in the Experience section.

Homepage sections, in their current order:
- Navigation: FA monogram, seven section anchors, Download Resume.
- Hero: greeting, name, title, introduction, actions, phone, email, LinkedIn, GitHub, portrait.
- A logo strip of four employers and two schools.
- Impact: eight metrics grouped by employer.
- Selected Work: four case studies.
- Products I've shipped.
- Experience: Domains chips and four roles.
- Education.
- Achievements.
- GitHub ("Building in public").
- Skills & Credentials.
- Get in touch.
- Footer.

Products by their on-site names: Signal (live demo and repository), engagR (growth CRM; repository journey-mapper), Cairn, and Application Desk (repository job-apply-assistant-1). The GitHub section also lists lighthouse-qa-monitor, which appears nowhere else.

These interactions must keep working:
- the skip-to-content link
- every nav anchor
- every Download Resume link
- the Zomato "View 4 documents" control and all four documents
- the "All skills (92)" expander
- every metric card and every "Read the case" link
- the phone and email links
- the "(opens in a new tab)" labels for screen readers

Every route keeps all of its content and links. Preservation is proven by the automated content check described in Sections 6 and 15, not by visual inspection.

---

## 3. Audience and Readability Guardrails

My audience is recruiters and hiring managers who skim. Motion must never stand between them and my content.

- No preloader or intro screen. My name, title, and both primary actions (Get in touch, Download Resume) must be readable and clickable within about one second of load. The entrance sequence must finish within about 1.5 seconds.
- All content must be present in the server-rendered HTML. Apply pre-animation hidden states only after JavaScript runs, so search engines, visitors without JavaScript, and failed scripts still see everything.
- My site is far denser than the reference. Reserve the most dramatic treatments for the hero, the metrics, section headings, and the products. Keep text-heavy sections calm and scannable.
- Long-form text (experience bullets, case-study descriptions, skills) gets a reading-first treatment: body text of at least 16px, comfortable line lengths, and WCAG AA contrast.

---

## 4. Decisions Already Made

These settle questions you would otherwise have to guess at.

1. **Hero introduction.** My introduction paragraph stays verbatim, but it does not have to sit in the first viewport. The first viewport must show my name, my title, and both primary actions.
2. **Hero stat strip.** The reference places a row of large numbers directly under its hero. You may repeat up to three of my existing metrics there, with exact values and labels. Each must link to the same /impact/ page as its card. The Impact section still shows all eight. Name your three picks in SPEC.md.
3. **Case pages.** All ten /impact/ pages receive the new design system, not just the homepage.
4. **Product visuals.** You may capture real screenshots of my live Signal demo (https://signal-theta-ten.vercel.app) to use as its visual. Projects without a live demo get typographic compositions. Do not create mock-ups or invented interfaces.
5. **Hero visual.** The reference's hero relies on video and image assets I do not have. Lead with typography and my portrait. You may propose a lightweight CSS or SVG treatment in SPEC.md if it echoes a specific reference effect without copying its files.
6. **Scrolling.** Keep native scrolling unless the reference demonstrably uses a smooth-scroll library. If you add one, anchor links, keyboard scrolling, find-in-page, and reduced motion must still work.
7. **Social previews.** Restyle the theme colour and the generated Open Graph and Twitter images to match the new palette, keeping their text unchanged.

---

## 5. My Notes on the Reference

I have seen the reference in motion, which screenshots cannot show. Treat these notes as the authority on how it should feel.

What I like most, in priority order:
1. [fill in]
2. [fill in]
3. [fill in]

Animations I want reproduced (what triggers each one, what moves, and how fast it feels):
- [fill in]

Things on the reference I do not want on my site:
- [fill in]

If I have attached screenshots of the reference, treat them as the moments I care about most.

If this section still contains "[fill in]" placeholders, rely on browser observation and the reference's compiled files. List in SPEC.md the specific animations you plan to reproduce, so I can approve them at the checkpoint.

---

## 6. Phase One: Inspect the Existing Project

Before editing anything, investigate the repository.

### Inspect the following

1. Identify the current framework and version.
2. Determine whether the project uses Next.js, React, Vite, or another framework.
3. Identify the package manager and inspect the package manifest.
4. Examine the project structure and identify the main application entry points.
5. Find the homepage, every other route (including the /impact/ case pages), page components, layout components, navigation, footer, and reusable UI components.
6. Inspect all CSS, Tailwind configuration, design tokens, global styles, and font-loading configuration.
7. Identify existing animation libraries and interaction implementations.
8. Identify the image assets, logos, screenshots, icons, case-study thumbnails, and resume file.
9. Check how the current project handles responsive layouts, metadata, routing, and external links.
10. Identify the existing build and deployment configuration.

Read the existing project instructions, including CLAUDE.md, if present. Respect the established project architecture and conventions.

Do not assume the project uses a particular framework or that files exist at predetermined paths.

### Establish a baseline

Before changing code:

- Run the existing application using its documented development command.
- Run the existing production build if the project can currently build.
- Inspect the current homepage and the /impact/ pages at desktop and mobile sizes.
- Identify existing functionality that must not regress.
- Record any pre-existing errors separately from errors introduced by your changes.
- If the build or any feature needs environment variables that exist only on Vercel, do not invent or commit values. Record what is missing and treat the resulting failures as pre-existing.

Do not replace the application with a new project or rebuild it from scratch unnecessarily.

Do not modify deployment settings, environment variables, or unrelated application logic unless a specific change is required for the redesign.

### Capture the content baseline

"Preserve all content" must be provable, not eyeballed. Before changing any code:

1. Run the current site (a production build if possible). For every route, save the following to `docs/redesign/baseline/`:
   - all text, including text inside collapsed or hidden UI
   - every link's href and accessible name
   - every image's src and alt text
   - the page metadata (title, description, Open Graph)
   If some content appears only after an interaction, trigger it during capture or record it separately.
2. Write a comparison script, for example `scripts/content-check.mjs`. It should capture the same data from the running site and report two things:
   - (a) any baseline text, link, or alt text that is missing or changed
   - (b) any visible text that is new, such as "Menu" or "Close", so I can approve it
   Prefer Node built-ins. If a parser or headless browser is genuinely needed, add it as a devDependency and list it in the final report.
3. Run the script against the unchanged site and confirm that it reports zero differences.
4. If content is hard-coded inside components, you may move it verbatim into a content module before restyling, provided the script still reports zero differences afterwards.
5. Compare the local content with the live site and record any differences in SPEC.md. Do not resolve them yourself.
6. Record baseline Lighthouse scores for mobile and desktop. Take "before" screenshots of the homepage at 1440, 1024, 768, 390, and 320px, and of one /impact/ page at 1440 and 390px.

---

## 7. Phase Two: Conduct a Visual Audit of CapsLock.global

Reference URL: https://capslock.global/

Do not implement the redesign based on the site's name, a generic agency aesthetic, or assumptions about its colours.

First, inspect the actual live website as thoroughly as your available tools allow.

### What is already known (verify it)

- The reference is built with Astro, with view transitions enabled, and serves its compiled CSS and JavaScript from /_astro/. Read those files to measure real colours, font declarations, breakpoints, durations, easing curves, and which animation or scroll libraries it uses.
- Its homepage is sparse and built around imagery and video:
  - a short headline with one word set apart
  - a hero built from planet videos and layered colour images
  - a row of three large stats
  - four capability panels with their own background images
  - a captioned photo gallery
  - a series of statement headlines
  - a large closing headline with two actions
- Inspect its inner pages too (Solution, Culture, Careers, and Contact). They may contain patterns for denser content, such as listings, that suit my Experience and Skills sections better than anything on its homepage.
- Screenshots show composition, the compiled files give exact values, and my notes in Section 5 describe the motion. Mark anything you infer rather than measure as inferred.

### Browser inspection

If browser automation or browser tools are available, open the reference website and inspect it directly.

Use screenshots and, where possible, browser developer tools to investigate:

- The initial viewport.
- The page at different scroll positions.
- The navigation before and after interaction.
- Hero text and any animated headline treatments.
- Section transitions.
- Hover states.
- Image and card animations.
- Scrolling behaviour.
- Any pinned or sticky sections.
- Footer transitions and contact interactions.
- Desktop, tablet, and mobile layouts.

If browser automation is available, use it to inspect the reference at approximately 1440px, 1024px, 768px, and 390px viewport widths.

Wait for relevant animations to finish before capturing screenshots, and inspect the page both before and after interactions.

If direct browser inspection is unavailable, use the available terminal, HTTP requests, source files, public stylesheets, and other accessible resources to investigate the website. Do not pretend to have observed effects that you could not inspect.

### Build a reference design specification

Before implementation, determine the following as accurately as possible.

**A. Colour system**
- Main page background.
- Alternate section backgrounds.
- Primary text colour.
- Secondary and muted text colours.
- Brand accent colours.
- Button colours and hover colours.
- Borders, dividers, overlays, and surface colours.
- How colour changes across different sections.

Record actual hexadecimal or equivalent colour values when they can be established from the rendered site or its stylesheets.

Do not invent exact brand colours and claim they came from the reference.

**B. Typography**
- Actual font family or font families, where identifiable.
- Available font weights.
- Headline font size and weight.
- Body font size and line height.
- Heading line height.
- Letter spacing and text transformations.
- Relative typography scales across the page.
- How headings wrap and align.
- How display text contrasts with supporting copy.

Inspect the actual font declarations or font files where possible. If the exact typeface is unavailable, select the closest legally usable alternative with similar letterforms, width, weight, and personality.

**C. Layout and composition**
- Maximum content width.
- Outer page margins.
- Grid structure.
- Column proportions.
- Section padding and spacing.
- Headline alignment.
- Card dimensions and image proportions.
- Corner radii and border treatments.
- Navigation placement.
- Footer composition.
- How the layout changes on mobile.

**D. Animation and interaction**
- Initial page-load animations.
- Headline and character reveals.
- Staggered element entrances.
- Scroll-triggered animations.
- Image reveals and masking.
- Hover transitions.
- Card movement and scaling.
- Navigation and menu transitions.
- Marquees or repeated moving elements, if present.
- Sticky and pinned sections, if present.
- Button interaction effects.
- Cursor interactions, if present.
- Animation duration, easing, sequencing, and stagger intervals.

Record the behaviour you actually observe. Do not add an effect merely because it is popular on creative websites.

**E. Overall design character**

Identify the visual principles that make CapsLock distinctive: its hierarchy, contrast, composition, use of whitespace, visual rhythm, image treatment, and relationship between motion and content.

The objective is to reproduce its design principles and overall experience as faithfully as possible while adapting them to my portfolio.

### Originality rules

Use the reference for measurement and observation only. Do not copy its source code, CSS, JavaScript, font files, images, or videos into my repository, and do not hotlink its assets. If its typeface is commercial, use the closest freely licensed alternative and name the substitution in SPEC.md. Keep my existing framework; do not migrate the site to Astro.

---

## 8. Phase Three: Translate the Reference Into My Portfolio

My portfolio should feel like a premium, motion-rich creative agency website, but it must remain recognisably a professional product manager's portfolio.

Do not turn it into a generic developer template.

Do not turn it into a SaaS landing page.

Do not preserve the old design simply because it already exists.

Use the existing content and functionality as the foundation while substantially redesigning the visual experience.

### Overall creative direction

Aim for a polished, distinctive, high-end website with:

- Strong visual hierarchy.
- Bold, editorial typography.
- A deliberate, reference-matched colour system.
- Large-scale visual composition.
- Sophisticated section transitions.
- Purposeful motion.
- Distinctive project and achievement presentations.
- Consistent spacing and alignment.
- Strong contrast and readable content.
- Excellent desktop and mobile execution.

Avoid generic gradients, excessive glassmorphism, random floating circles, unnecessary shadows, and decorative effects that are not supported by the reference's visual language.

Do not simply change the background colour and font size of the existing website. Redesign the composition of each section.

### Section mapping

Write an explicit mapping from reference patterns to my sections in SPEC.md. Start from this hypothesis and confirm or revise it after inspection:

- Reference menu → my seven nav anchors and Download Resume.
- Reference hero headline and stat row → my name and title, plus the optional stat strip (Section 4, item 2).
- Reference four capability panels with their own backgrounds → my four products.
- Reference captioned photo gallery → possibly my four case-study previews.
- Reference closing headline with two actions → my Get in touch section.
- Reference footer → my footer.

Where nothing on the reference fits (likely Experience, Education, Achievements, GitHub, and Skills & Credentials), extend the system to those sections. Use the same tokens, type scale, spacing, and motion vocabulary, optimised for reading rather than spectacle. Do not invent substitutes for reference sections that depend on assets I do not have, such as its videos and team photography.

### A. Navigation

Transform the existing navigation into a visually distinctive, reference-inspired navigation system.

Requirements:
- Preserve the existing logo or identity and all current navigation destinations.
- Match the reference's navigation positioning, spacing, typography, and interaction style where appropriate.
- Use subtle, deliberate transitions.
- Ensure that all navigation items remain legible and functional.
- Make the mobile navigation polished and usable.
- Avoid introducing a menu item that leads nowhere.
- Preserve existing links and their destinations.
- Make every anchor land below any fixed header (for example with `scroll-margin-top`), and keep keyboard focus behaviour sensible.

If the reference uses an overlay or animated menu, reproduce the observed interaction where appropriate.

### B. Hero section

The hero should make an immediate visual impression.

Use my existing name, title, and introduction without rewriting them.

Explore the reference's actual approach to:
- Headline scale.
- Text alignment.
- Line breaks.
- Font weight.
- Text reveal timing.
- Negative space.
- Supporting text placement.
- Contact and resume actions.
- Image or portrait positioning, if applicable.

My professional identity should be the visual anchor of the first viewport.

The entrance animation should feel deliberate and polished, not like a collection of unrelated fade-ins.

If the reference uses character-by-character or line-by-line reveals, reproduce that treatment where appropriate.

Preserve all existing hero actions and their functionality.

Follow Section 4 for the placement of the introduction, the optional stat strip, and the hero visual.

Keep the logo strip of four employers and two schools that currently sits below the hero, restyled to fit the new system.

### C. Professional impact and metrics

My portfolio includes quantified results from my product management work.

Present the existing metrics as visually compelling impact statements, inspired by the reference's actual numerical and typographic treatments.

Requirements:
- Preserve every existing number and its corresponding explanation.
- Use typography, spacing, and layout to emphasise the numbers.
- Consider staggered reveals or number animations only where they suit the reference.
- If counters animate, they must end at the exact original values.
- Do not change percentages, currency, units, signs, or time periods.
- Do not animate every number unnecessarily.
- Keep the supporting explanations readable and accessible.
- Keep the grouping by employer, including the employer names and date ranges, and keep every card's link to its /impact/ page.

The result should communicate measurable product impact immediately.

### D. Case studies

Preserve all existing case studies and all of their descriptions and document links.

Redesign the presentation to feel more editorial and visually engaging.

Consider, based on the reference:
- Asymmetric or modular grids.
- Large project titles.
- Carefully proportioned thumbnails.
- Full-width or alternating project compositions.
- Image reveal effects.
- Subtle hover movement.
- Clear category labels.
- Prominent project actions.

Use existing case-study images and documents wherever possible.

Do not invent project screenshots, claim that conceptual designs are shipped products, or substitute unrelated images.

Where a project has multiple documents, preserve every document and its current destination.

Zomato — Increasing Reviews has four documents behind a "View 4 documents" control. Keep the control working and all four destinations intact.

Make the entire experience feel cohesive rather than rendering every project as an identical generic card.

### E. Products I have built

Preserve every existing product and project, including Signal, engagR (the growth CRM), Cairn, Application Desk (the job-search agent), and any other projects currently shown.

Keep every description, feature explanation, technical detail, repository link, and live demo link.

Give the projects a distinctive visual treatment that reflects the reference's layout and animation language.

Where appropriate:
- Create strong typographic hierarchy.
- Use existing screenshots or preview assets.
- Add subtle image reveals.
- Introduce meaningful hover states.
- Make the project title and primary action easy to find.
- Use different compositions when justified by the available assets and content.

Do not fabricate product screenshots or introduce misleading product functionality.

The reference's four capability panels are a natural model for my four products. For product visuals, follow Section 4, item 4.

### F. Experience and career history

Preserve the full career history, role titles, dates, company names, domain labels, achievement descriptions, and other existing details.

Improve the way this information is presented.

Explore the reference's grid, spacing, typography, and section transitions to make the experience section feel integrated with the new visual system.

Do not sacrifice detail for visual minimalism.

If there is substantial text, use expandable content only if it preserves discoverability and the existing information remains available. Prefer a well-designed layout that presents the content clearly without requiring unnecessary clicks.

Keep the Domains chips and every "Read the case" link to the /impact/ pages. Before inventing a layout for this much text, check whether the reference's inner pages offer a suitable pattern.

### G. Education, contact details, and footer

Preserve all education information and its existing supporting assets.

Redesign the contact section and footer to create a strong conclusion to the experience.

Use the reference's actual footer and closing-section composition as inspiration.

Preserve:
- My email address.
- My phone number.
- LinkedIn.
- GitHub.
- Resume download.
- Existing external project links.
- Existing legal or informational links, if present.

Ensure that all links remain clickable and that the visual treatment makes the primary contact action obvious.

If the reference uses a distinctive closing headline or animated transition, adapt the design treatment without changing my existing copy.

### H. Achievements

The Achievements list appears to be rendered twice in the page's HTML. Find out why (a marquee or a responsive duplicate), keep the behaviour, and hide any visual-only copy from screen readers.

### I. GitHub: "Building in public"

Keep the contribution graph, all five repository cards, and the "All repositories" link.

The graph may depend on an external service or an environment variable that exists only on Vercel. Restyle its container, but do not change how its data is fetched. If it fails locally, report it rather than replacing it.

### J. Skills & Credentials

Keep the introductory sentence, the five skill groups, the "All skills (92)" expander with all six categories, and the five certifications. Give this section a reading-first, scannable treatment.

### K. Case pages under /impact/

Apply the new design system to all ten case pages: typography, colour, spacing, navigation, and footer. Keep every word, metric, and link. Moving from a metric card to its case page and back should feel like one continuous experience.

---

## 9. Typography Implementation

Typography is a major part of this redesign.

Do not select a font simply because it is fashionable.

First identify the reference's actual typography as closely as possible.

Then implement a consistent typography system using reusable CSS variables or the project's existing design-token mechanism.

Define appropriate tokens for:
- Display and hero typography.
- Section headings.
- Project headings.
- Body text.
- Secondary text.
- Labels and metadata.
- Navigation.
- Buttons.

Use responsive font sizes, preferably with CSS `clamp()` where appropriate.

Ensure that:
- Large headlines wrap intentionally.
- Line lengths remain comfortable.
- Text does not overflow its containers.
- Font weights are consistent.
- Letter spacing is appropriate to each size.
- Mobile typography remains balanced.
- Fonts load efficiently.
- There is no avoidable flash of unstyled text.

If the exact reference font is identifiable and legally usable, use it. Otherwise, select a close alternative and explain the substitution in your final summary.

Avoid loading several font families without a clear design reason.

Keep using the project's existing font-loading mechanism (the current site appears to use next/font), so fonts are self-hosted and do not cause layout shift.

The reference sets one or two words apart in many of its headlines. You may apply that treatment to an existing word in my headings; never add or change words.

---

## 10. Colour and Design Tokens

Create a unified design system based on the reference's observed colours.

Use the existing project's token system if one exists. Otherwise, establish centralised CSS custom properties.

The tokens should cover:
- Primary background.
- Alternate background.
- Primary text.
- Secondary text.
- Accent.
- Interactive accent states.
- Borders and dividers.
- Card or surface backgrounds.
- Overlay colours.
- Focus indicators.

Apply these consistently across the navigation, hero, metrics, case studies, products, experience, education, achievements, GitHub, skills, footer, and the /impact/ pages.

Match the reference's use of contrast and section-level colour changes rather than forcing the entire site into a single background.

Avoid introducing colours outside the established system unless a genuine asset or accessibility requirement justifies them.

Verify text contrast and interactive-state visibility.

Do not use a guessed palette and label it an exact reproduction.

Update the theme colour and the generated Open Graph and Twitter images to the new palette, as decided in Section 4, item 7.

---

## 11. Animation System: A Major Priority

The quality of the animation is central to this project.

Study the actual reference animations and recreate their character, timing, and behaviour as closely as feasible.

Do not implement a collection of generic animations without reference to the source website.

### A. Page-load choreography

Build an intentional opening sequence using the reference's observed patterns.

Potential elements include:
- Navigation entrance.
- Headline reveal.
- Supporting text entrance.
- Primary action entrance.
- Image or graphic reveal.

Use the effects that are actually relevant to the reference.

Avoid making users wait for the content to become usable. The page should remain understandable if an animation does not run.

Do not add a preloader or intro screen; the timing limits in Section 3 apply.

### B. Text animation

Where the reference uses animated typography, reproduce the treatment carefully.

Possible techniques include:
- Line-by-line reveals.
- Character or word staggering.
- Masked text transitions.
- Vertical text reveals.
- Subtle positional transitions.

Avoid breaking screen-reader accessibility when splitting text into individual characters. Preserve a readable accessible text equivalent.

Do not animate every paragraph. Reserve the strongest effects for high-impact headings and selected transitions.

### C. Scroll-driven reveals

Use the reference's observed scroll behaviour to guide:
- Section entrances.
- Heading reveals.
- Image masks.
- Card transitions.
- Metric entrances.
- Sequential content reveals.

The animations must behave correctly during normal scrolling, fast scrolling, reverse scrolling, and resizing.

Do not hide content permanently when JavaScript or an animation library fails.

Avoid excessive scroll-jacking. Native scrolling should remain natural.

Follow Section 4, item 6 on smooth-scroll libraries.

### D. Hover interactions

Implement deliberate hover states for interactive cards, buttons, navigation links, and project previews.

Match the reference's actual interaction language where observable.

Potential treatments include:
- Small positional movement.
- Image scaling or clipping.
- Underline animation.
- Colour transitions.
- Arrow movement.
- Button fills or inversions.

Do not add hover movement to non-interactive content merely for decoration.

Every interactive element must also have a visible keyboard-focus state.

### E. Continuous animations

If the reference contains moving marquees, repeated graphics, or continuous motion, reproduce the relevant pattern.

Use continuous movement sparingly and only where it improves fidelity.

Avoid:
- Constant distracting motion.
- Excessive parallax.
- Animations that compete with important text.
- Heavy WebGL effects that are not justified by the reference.
- Cursor effects that interfere with clicking or text selection.

### F. Timing and easing

Inspect the actual animation timing if possible.

Use consistent easing and duration tokens where appropriate rather than scattering arbitrary transition values throughout the codebase.

Animations should feel coordinated and intentional.

Use transform and opacity for motion where feasible. Avoid unnecessary layout-triggering animations.

### G. Animation library selection

Inspect the current dependencies before choosing an implementation.

- Reuse an existing animation library if it is suitable.
- Use CSS animations and transitions for effects that do not need a JavaScript animation engine.
- If the reference requires sophisticated scroll choreography and the project can support it, consider GSAP and ScrollTrigger.
- Consider a lightweight React animation library only when it materially simplifies the implementation.

Do not install several overlapping animation libraries.

Do not introduce a large dependency solely for a simple fade or slide.

If adding a dependency, verify that it is compatible with the existing framework and production build.

Clean up event listeners, animation contexts, observers, and animation instances correctly when components unmount.

### H. Accessibility and reduced motion

Respect `prefers-reduced-motion`.

When reduced motion is enabled:
- Remove or simplify nonessential motion.
- Ensure all content is immediately visible.
- Avoid scroll-dependent visibility that makes content inaccessible.
- Keep every action and interaction functional.

Provide a graceful fallback if JavaScript-based animations fail.

### I. Page transitions

The reference has page transitions enabled. Add transitions between the homepage and the /impact/ pages only if the installed framework version supports them without experimental flags; otherwise skip them. Any page transition must respect reduced motion and must not noticeably delay navigation.

---

## 12. Image Treatment and Assets

Use the existing website assets wherever possible.

Inspect available image files and determine which assets belong to each current section.

Preserve:
- Profile or identity imagery.
- Employer logos.
- Education logos.
- Case-study thumbnails.
- Project previews.
- Existing iconography.
- Resume and document assets.

Do not remove meaningful assets simply because the new layout differs.

Reproduce the reference's image presentation where appropriate, including observed aspect ratios, clipping, cropping, transitions, and layout proportions.

If the reference uses imagery as a large compositional element, adapt the principle using my own relevant assets rather than copying the reference's company imagery.

Avoid unnecessary stock images and random decorative graphics.

Zamplitude currently has a "Z" letter mark rather than a logo image. Keep it, and do not source a logo from the web.

For product visuals, follow Section 4, item 4. Do not download, hotlink, or recreate the reference's images or videos.

Ensure images have appropriate alt text, dimensions, and loading behaviour. Avoid layout shifts during loading.

---

## 13. Technical Requirements

The result must be a functioning, production-ready implementation in the existing repository.

### Preserve the existing stack

- Keep the current framework unless there is a compelling technical reason not to.
- Reuse existing components and architecture where appropriate.
- Do not rewrite the application from scratch.
- Do not replace real content with mock data.
- Do not introduce unnecessary dependencies.
- Do not alter unrelated backend logic or integrations.
- Do not remove existing features to make the implementation easier.

### Code quality

- Keep components understandable and maintainable.
- Use reusable design tokens.
- Avoid duplicating large amounts of styling.
- Avoid unnecessary global CSS overrides.
- Keep responsive behaviour predictable.
- Ensure React keys, effects, and event handlers are correct.
- Avoid hydration mismatches.
- Prevent layout shifts caused by animations.
- Ensure animation initial states cannot leave content invisible; apply pre-animation hidden states only after JavaScript has run.
- Preserve semantic HTML.
- Preserve accessibility and keyboard navigation.

If the existing application uses Next.js, follow the conventions of the installed Next.js version, including server and client component boundaries. Do not turn the entire application into a client-rendered component without necessity.

### Performance

Aim for smooth animation and fast page rendering.

- Prefer GPU-friendly transforms and opacity.
- Avoid excessive DOM elements for animated text.
- Avoid continuous JavaScript animation loops when CSS can do the job.
- Lazy-load below-the-fold images where appropriate.
- Avoid unnecessary re-renders.
- Prevent horizontal overflow.
- Keep mobile performance in mind.
- Avoid loading large media assets when they are not needed.
- Avoid animation libraries or plugins that are not being used.

---

## 14. Responsive Design

The redesign must work at all of the following approximate viewport widths:

- 1440px desktop.
- 1024px laptop or tablet landscape.
- 768px tablet.
- 390px mobile.
- 320px narrow mobile.

Do not simply shrink the desktop layout.

Rework the layout where necessary:
- Scale typography responsively.
- Adjust grids and column counts.
- Reflow large headings.
- Resize and reposition imagery.
- Adapt navigation.
- Reduce or simplify complex animations.
- Preserve the visual hierarchy.
- Keep buttons and interactive targets usable.
- Prevent clipped text and horizontal scrolling.
- Use `svh` or `dvh` units rather than `100vh` for full-height sections, so mobile browser bars do not cause jumps.

The mobile experience should feel intentionally designed, not like a fallback.

Verify that every section remains readable and that no essential content disappears at smaller sizes.

---

## 15. Verification and Quality Assurance

Do not declare the task complete immediately after writing the code.

### Build verification

Run the existing production build.

Run linting and type checks if the project supports them.

Resolve errors introduced by the redesign.

Do not conceal failures by removing scripts, weakening type checks, or suppressing meaningful warnings.

If a check fails because of an existing unrelated issue, identify it separately.

### Browser verification

If browser automation is available, inspect the updated website at desktop and mobile sizes.

Check:
- The initial viewport.
- Every major section.
- Every /impact/ case page.
- Navigation, including anchor links landing below the header.
- Hero animations.
- Scrolling and section transitions.
- Metrics.
- Case-study cards.
- Project links.
- Resume download.
- Contact links.
- Footer.
- Mobile menu.
- Reduced-motion behaviour.

Inspect the console and network requests for relevant errors.

Look for:
- Broken images.
- Incorrect font loading.
- Horizontal overflow.
- Text clipping.
- Misaligned grids.
- Inaccessible controls.
- Animations that fail to trigger.
- Elements that remain invisible.
- Broken links.
- React hydration errors.
- Unexpected layout shifts.

### Content integrity audit

Run the content-check script from Section 6 at the end of every phase and again after the final build. The final run must report zero missing or changed items on every route. Differences in whitespace or line breaks are acceptable. Any other difference means the design must change, not the content. List any new visible text in the final report for my approval.

Then compare the redesigned site with the original content and implementation.

Verify that all existing sections, text, numerical values, assets, and functional links remain present.

Do not assume that preserving the main headings is enough. Check detailed achievement descriptions, case-study links, project descriptions, and the full experience history.

### Performance and accessibility measurement

Run Lighthouse on the redesign for mobile and desktop and compare it with the baseline from Section 6:
- Accessibility and Best Practices must not fall below the baseline.
- Performance must not fall more than 5 points below the baseline.
- Cumulative Layout Shift must be 0.1 or lower.

Confirm that there are no console errors and no horizontal overflow at 1440, 1024, 768, 390, and 320px. If Lighthouse cannot run in this environment, say so.

### Visual comparison

Compare the redesigned website against CapsLock at equivalent viewport sizes.

Evaluate:
- Typography.
- Colour.
- Layout.
- Spacing.
- Section transitions.
- Animation character.
- Navigation.
- Image treatment.
- Overall visual polish.

The target is a recognisable adaptation of the reference's design language, not merely a modern-looking portfolio.

Save "after" screenshots at the same sizes as the "before" set.

Iterate on visible problems before finishing.

### Independent review

Before finishing, have a subagent review the diff against SPEC.md and this brief in a fresh context. Fix gaps that affect correctness or the stated requirements, and treat style preferences as optional.

---

## 16. Git, Working Files, and Deployment Safety

This website is deployed on Vercel.

The task is to implement the redesign in the local repository. Do not assume that the local directory is the correct project until you verify it.

Before modifying files:
- Confirm the repository root.
- Inspect `git status`.
- Identify the current branch.
- Inspect existing uncommitted changes.

Preserve unrelated user changes.

Do not discard, reset, overwrite, or clean up unrelated work.

### Branch and commits

- After these checks, create a branch named `redesign/capslock` from the current branch.
- Commit locally at the end of each phase with a clear message.
- Stage only files you changed for the redesign. Never include my pre-existing uncommitted changes in your commits.
- If my uncommitted changes touch a file you need to edit, ask me before editing it.
- Never push and never trigger a deployment. I will push the branch myself to get a Vercel preview.

Do not expose environment variables, credentials, or secrets.

### Working files

Keep these files current so the work survives context compaction and new sessions:

- `docs/redesign/BRIEF.md`: the complete text of this brief, unchanged, including my notes in Section 5.
- `docs/redesign/SPEC.md`: the design specification, route list, section mapping, decisions, font substitutions, and differences between local and live content.
- `docs/redesign/PROGRESS.md`: a checklist of the steps in Section 18, updated as you go.
- `docs/redesign/baseline/` and the content-check script (Section 6).
- `docs/redesign/screenshots/`: before, after, and reference screenshots. Do not commit this folder.

After any context compaction, or at the start of a new session, re-read BRIEF.md, SPEC.md, and PROGRESS.md before continuing.

The final implementation should be ready for me to review and deploy through my existing workflow.

---

## 17. Definition of Done

The task is complete only when all applicable criteria below have been satisfied:

1. The existing website has been visually redesigned rather than superficially restyled.
2. The reference website has been inspected to the extent supported by the available tools.
3. The typography, palette, spacing, composition, and motion closely follow the reference's observed design language.
4. The original portfolio content remains intact.
5. Existing links, downloads, navigation, and product demos still work.
6. Every major section has been integrated into the new design system.
7. Desktop and mobile layouts have been implemented.
8. Animations are purposeful, performant, and accessible.
9. The production build passes, or any pre-existing failure is explicitly documented.
10. The final implementation has been visually verified wherever browser tooling permits.
11. No unrelated project functionality or configuration has been unnecessarily changed.
12. The work is ready for my review before deployment.
13. All ten /impact/ case pages use the new design system.
14. The content check reports zero missing or changed items on every route, and any new visible text is listed for my approval.
15. Lighthouse results meet the thresholds in Section 15, or the reason they could not be measured is documented.
16. There are no console errors and no horizontal overflow at any of the five tested widths.
17. The audience guardrails in Section 3 hold.
18. The specification was approved at the checkpoint, and the final report described in Section 18 is complete.

---

## 18. Final Execution Instructions

Work in this order:

**Step 1 — Set up.** Confirm the repository root and git state (Section 16), and create the redesign branch. Save the complete text of this brief, unchanged, to `docs/redesign/BRIEF.md`, and create `docs/redesign/PROGRESS.md`.

**Step 2 — Inspect my project.** Inspect the repository, the current website, every route, and existing functionality (Section 6). Capture the content baseline, then write and validate the content-check script. Record baseline Lighthouse scores and take "before" screenshots. Commit.

**Step 3 — Inspect the reference.** Inspect CapsLock.global, including its inner pages and compiled assets, and document its actual visual and animation patterns (Section 7).

**Step 4 — Write the specification.** Write SPEC.md, covering:
- fonts and substitutions, colours, typography scales, spacing, layout, and motion with measured timings
- the route list and the section mapping (Section 8)
- your three stat-strip picks and the animations you will reproduce
- any local-versus-live content differences, and anything you could not verify

Commit.

**Step 5 — Checkpoint.** Summarise SPEC.md for me and wait for my approval. This is the only time you stop for approval, apart from the uncommitted-changes case in Section 16.

**Step 6 — Implement** the redesign in the existing application, committing at the end of each major section.

**Step 7 — Run and inspect** the result in the browser.

**Step 8 — Fix** visual, responsive, accessibility, and functional issues.

**Step 9 — Verify.** Run all the checks in Section 15:
- the production build, linting, and type checks
- the content check
- Lighthouse
- reduced motion
- "after" screenshots
- the independent review

Fix what they find. Commit.

**Step 10 — Report.** Write the final report, covering:
- files changed
- dependencies added and why
- font substitutions
- deliberate deviations from the reference and why
- the content-check output, including any new visible text for my approval
- Lighthouse before and after
- where the screenshots are
- pre-existing issues and missing environment variables
- known limitations
- the commands to preview locally

Do not ask me to approve every minor design decision. Use your judgement as a senior designer and engineer, guided by the reference website and the constraints above.

If access to the reference website or browser automation is unavailable, proceed using the strongest evidence available and clearly identify anything that could not be verified.

**Final priority, in order:**
1. Preserve all existing content and functionality.
2. Match the reference website's actual visual design language.
3. Reproduce its distinctive animation and interaction patterns.
4. Deliver excellent responsive design.
5. Maintain performance, accessibility, and code quality.

The audience guardrails in Section 3 apply at every priority level.

The finished result should feel like my existing portfolio has been art-directed and rebuilt by the same calibre of creative team responsible for the reference website, while remaining unmistakably my own professional portfolio.
