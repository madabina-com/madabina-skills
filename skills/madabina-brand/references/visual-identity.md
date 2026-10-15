# Madabina visual identity reference

This reference records brand assets and visual choices verified in current Madabina products. It is not a complete corporate brand manual. Recheck the target product before applying a value outside the context where it is documented.

Source paths beginning with `../` are relative to the `madabina-skills` repository root and are available in the Madabina workspace checkout; they may not exist in a consumer's project after installing this skill.

## Logo assets

| Asset | Use |
| --- | --- |
| `https://cdn.madabina.com/static/madabina/logo/logo-madabina.svg` | Scalable Madabina logo for web and documents when the target can load the public CDN asset |
| `https://cdn.madabina.com/static/madabina/logo/logo-madabina.png` | Madabina logo variant used by the web app on light surfaces |
| `https://cdn.madabina.com/static/madabina/logo/logo-madabina-white.png` | White logo variant used on dark surfaces |
| `https://cdn.madabina.com/static/madabina/icon/madabina-icon-app.jpg` | Compact circular brand icon |
| `https://cdn.madabina.com/static/madabina/icon/favicon/favicon.ico` | Madabina favicon.ico |

## Colors observed in current products

| Color | Observed use |
| --- | --- |
| `#0b61ab` | Primary blue for public-site links, controls, and calls to action |
| `#20c0f1` | Cyan accent and visible keyboard-focus color |
| `#222831` | Charcoal used for dark surfaces such as public-site footers |

These values recur in the web app and the Madabina OS visual pack. They are useful brand references, but do not imply that every product surface must use all three colors or that they define every semantic token. Check the target product's current styles before introducing a new palette.

## Typography and layout

- The web app's current base stylesheet declares `Instrument Sans` with system sans-serif fallbacks. Treat this as a web-app implementation choice, not a confirmed font mandate for every Madabina product.
- Preserve the target product's existing spacing, typography, and component patterns unless the user requests a redesign.
- Keep sufficient contrast and visible focus indicators. Verify text and controls in both light and dark contexts when both are supported.
- Madabina products support French, English, and Arabic. Preserve Arabic script and right-to-left flow; do not transliterate or mirror brand marks.