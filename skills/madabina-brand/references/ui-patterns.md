# Madabina UI patterns

This reference records a visual inspection of the public home page at `https://madabina.com/` on 2026-10-15 and the merchant dashboard screenshot supplied with the request. These are interface observations, not a substitute for current code, a full design-token system, or an account's live data. Recheck the target surface before making implementation decisions.

## Public marketing site

The home page presents Madabina as a COD commerce platform for Algerian merchants. Its visual hierarchy moves from brand and navigation to the offer, product benefits, market proof, mission, signup call to action, FAQ, and a dark contact footer.

- On the narrow viewport inspected, the header is white with the wordmark at the left and compact outlined account/menu controls at the right.
- The hero uses a photographic background under a deep blue/navy overlay. A small uppercase cyan eyebrow precedes a large bold white headline, concise supporting text, and two distinct actions: a light primary button and a transparent outlined secondary button.
- The launch offer sits in a translucent blue panel with a fine cyan edge. Countdown values are separated into individual tiles; the main offer action spans the panel width.
- The benefits section uses a white background, centered heading and introduction, and three bordered cards with pale-blue icon tiles.
- A charcoal proof section creates the strongest background contrast. Cyan highlights short COD, speed, and multi-store proof labels.
- The mission section uses a pale cool-gray surface and stacked white information cards. A saturated blue signup panel and a white bordered FAQ follow it; the footer returns to charcoal.
- Across these sections, headings are bold and dark or white according to surface, body text is muted, and cards use restrained borders, rounded corners, and light shadows.

Use these patterns when working on the public marketing site. Do not assume every public page needs the hero photograph, offer countdown, or three-card layout; preserve the actual page purpose and existing responsive components.

## Merchant dashboard screenshot

The supplied image shows a desktop merchant panel with a light, information-dense layout. It is visually separate from the public marketing page:

- A compact white top bar holds the Madabina wordmark, back navigation, points, locale, notifications, and merchant avatar.
- A pale sidebar groups navigation by area. The current destination is highlighted with blue text/icon on a soft blue-gray background; inactive navigation uses muted blue-gray line icons and labels.
- The main work area has a very light cool-gray background, a prominent page title with a muted explanatory subtitle, then white bordered cards with subtle shadows.
- A wide public-store card places store identity and URL at the left and compact copy, view, and add actions at the right. Affiliate and boost-points cards sit beneath it, followed by a grid of commerce metrics.
- Card titles and metric labels are muted or dark blue-gray; values are larger, dark, and easy to scan. Use outlined controls and simple line icons for secondary actions.

Use these dashboard patterns for merchant-console UI, not as a reason to bring marketing hero photography or full-width promotional panels into operational screens. Adapt the navigation and card grid to the target viewport and actual Filament or product components.

## Shared UI guidance

- Keep the Madabina wordmark recognizable and choose the light or white logo variant according to the surface; use the identity reference for asset paths and color context.
- Keep one clear primary action per region, with secondary actions visually quieter. Give icon-only controls accessible names and preserve visible keyboard focus.
- Keep text readable against both light and dark surfaces. Do not rely on color alone to communicate navigation state, status, or metrics.
- The public home page inspected is French. Preserve the selected locale and ensure Arabic interfaces use right-to-left layout without mirroring the logo or other brand marks.
- The screenshot contains example-specific store URLs, referral code, points, and order metrics. Treat these as dynamic merchant data, not brand copy or design tokens; use neutral placeholders in examples unless the user supplies approved data.
- Before implementing UI changes, inspect the current target product's components, CSS variables, responsive behavior, and accessibility patterns. If the live site, screenshot, and source differ, follow the target surface's maintained implementation and explain the discrepancy.
