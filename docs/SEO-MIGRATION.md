# SEO Migration Notes

This static site uses extensionless canonical URLs for public pages:

- `/`
- `/konzerte/`
- `/eindruecke/`
- `/leitung/`
- `/mitsingen/`
- `/stimmbildung/`
- `/unterstuetzung/`
- `/impressum/`

These pages are intentionally marked `noindex,follow` and excluded from the sitemap because they are operational or member-oriented:

- `/aktive/`
- `/willkommen/`

## Required Redirects

Configure permanent `301` redirects from the old WordPress URLs to the new canonical paths before launch.

| Old URL | New URL |
| --- | --- |
| `/` | `/` |
| `/index.html` | `/` |
| `/?page_id=58` | `/konzerte/` |
| `/konzerte/` | `/konzerte/` |
| `/konzerte.html` | `/konzerte/` |
| `/eindruecke.html` | `/eindruecke/` |
| `/leitung/` | `/leitung/` |
| `/?page_id=29` | `/leitung/` |
| `/leitung.html` | `/leitung/` |
| `/mitsingen/` | `/mitsingen/` |
| `/?page_id=51` | `/mitsingen/` |
| `/mitsingen.html` | `/mitsingen/` |
| `/stimmbildung.html` | `/stimmbildung/` |
| `/unterstuetzen/` | `/unterstuetzung/` |
| `/?page_id=105` | `/unterstuetzung/` |
| `/unterstuetzung.html` | `/unterstuetzung/` |
| `/impressum/` | `/impressum/` |
| `/?page_id=33` | `/impressum/` |
| `/impressum.html` | `/impressum/` |
| `/chorleben.html` | `/chorleben/` |
| `/aktive.html` | `/aktive/` |
| `/willkommen.html` | `/willkommen/` |

## Deployment Notes

- Serve the public pages on extensionless paths and keep the HTML files behind those routes.
- Do not block JS, CSS, or image assets in `robots.txt`.
- Keep the XML sitemap limited to canonical, indexable URLs only.
