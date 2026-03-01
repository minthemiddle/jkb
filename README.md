# JKB Fully Static

## Lighthouse (simple)

App URL is always available at:

`https://jkb-fully-static.test`

Run Lighthouse directly against that URL:

```bash
npx lighthouse https://jkb-fully-static.test/index.html \
  --only-categories=performance,accessibility,best-practices,seo \
  --view
```

Optional: save JSON report

```bash
npx lighthouse https://jkb-fully-static.test/index.html \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json \
  --output-path=./lighthouse-report.json
```
