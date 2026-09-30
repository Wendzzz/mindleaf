# Mindleaf — landing page

One-page site for Mindleaf, the app that turns personal growth books into ten-minute daily readings with an action and a reflection question. It is a standalone Vite + React + Motion project that doesn't touch the Piralax site in the parent folder.

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
npm run shoot    # build, then save desktop and mobile screenshots to out/
```

## Sections

| Section | Motion idea |
|---|---|
| Hero | The Atomic Habits cover rises, then its first seven days fan out from behind it; the word *start.* gets a hand-drawn underline |
| The pile | Half-read books drop onto a stack, each with a bookmark stuck early |
| How it works (`#how`) | Sticky scroll through one day: background goes morning → midday → night, the sun arcs across, the phone screen changes |
| Streak | A demo cursor taps "Finish Day 4" by itself (every 6s while on screen): the count rolls 11 → 12 and leaves burst out. Visitors can tap too, which stops the demo |
| Manifesto | Words light up as you scroll, over a photo with a green overlay |
| Library (`#library`) | Topic filter with animated pill; books lift off the shelf on hover |
| Book clubs (`#clubs`) | Chat bubbles arrive one by one, with a typing indicator |
| Pricing (`#pricing`) | Starter (free) and Plus at ₦5,000 per month |
| Final CTA (`#start`) | Waitlist form |

All motion respects the reduced-motion setting (`MotionConfig reducedMotion="user"` plus CSS fallbacks).

## Not done yet

- The waitlist form validates the email and shows a confirmation, but **it doesn't send anything anywhere yet**. Connect it to a real list (for example Netlify Forms, Mailchimp or ConvertKit) before launch.
- "Sign in", the footer links and the store badges are placeholders.

## Assets

- Book covers: Open Library (`public/img/covers/`). Fine for a pitch or prototype; for launch, get covers from publishers or a licensed book-data service.
- Photos: Unsplash (free to use).
- Font: Manrope, self-hosted with `@fontsource-variable/manrope`.
