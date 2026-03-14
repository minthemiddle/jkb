# Nginx Server Notes

This project now uses these public canonical URLs:

- `/`
- `/konzerte/`
- `/eindruecke/`
- `/leitung/`
- `/mitsingen/`
- `/stimmbildung/`
- `/unterstuetzung/`
- `/impressum/`

These pages are intentionally `noindex,follow` and should stay reachable, but they are not part of the sitemap:

- `/aktive/`
- `/chorleben/`
- `/willkommen/`

## Goals

- serve static `.html` files on extensionless public URLs
- force one canonical URL per page
- preserve old WordPress URLs with `301` redirects
- avoid blocking crawlable assets
- serve `robots.txt` and `sitemap.xml` from the site root

## Recommended Nginx Config

Adjust `server_name`, certificate paths, and `root` for your server.

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name jungerkammerchorberlin.de www.jungerkammerchorberlin.de;
    return 301 https://jungerkammerchorberlin.de$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.jungerkammerchorberlin.de;
    return 301 https://jungerkammerchorberlin.de$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name jungerkammerchorberlin.de;

    root /var/www/jungerkammerchorberlin.de;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/jungerkammerchorberlin.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jungerkammerchorberlin.de/privkey.pem;

    charset utf-8;

    # Root canonicalization.
    location = /index.html {
        return 301 /;
    }

    # Redirect explicit .html requests to canonical trailing-slash URLs.
    location ~ ^/(.+)\.html$ {
        return 301 /$1/;
    }

    # Redirect slashless page requests like /konzerte to /konzerte/
    # when a matching static HTML file exists.
    location ~ ^/[^./]+$ {
        if (-f $document_root$uri.html) {
            return 301 $uri/;
        }
        try_files $uri =404;
    }

    # Serve extensionless canonical routes from the matching .html file.
    location / {
        try_files $uri $uri/ @html_pages;
    }

    location @html_pages {
        rewrite ^/(.+)/$ /$1.html last;
        return 404;
    }

    # Static assets.
    location ~* \.(css|js|mjs|svg|png|jpg|jpeg|webp|gif|ico|woff2?)$ {
        access_log off;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        try_files $uri =404;
    }

    # XML/text endpoints should be directly reachable.
    location = /robots.txt {
        try_files $uri =404;
        access_log off;
    }

    location = /sitemap.xml {
        try_files $uri =404;
        access_log off;
    }

    # HTML should revalidate so metadata and event details update quickly.
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache";
    }

    # Optional compression.
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml application/xml application/rss+xml application/javascript application/json image/svg+xml;
}
```

## WordPress Redirects

These should be direct `301` redirects, not chains.

```nginx
location = /?page_id=58 { return 301 /konzerte/; }
location = /?page_id=29 { return 301 /leitung/; }
location = /?page_id=51 { return 301 /mitsingen/; }
location = /?page_id=105 { return 301 /unterstuetzung/; }
location = /?page_id=33 { return 301 /impressum/; }
```

Query-string redirects are cleaner with a small `if` block in the server context because `location` matching ignores query parameters:

```nginx
if ($arg_page_id = 58) {
    return 301 /konzerte/;
}

if ($arg_page_id = 29) {
    return 301 /leitung/;
}

if ($arg_page_id = 51) {
    return 301 /mitsingen/;
}

if ($arg_page_id = 105) {
    return 301 /unterstuetzung/;
}

if ($arg_page_id = 33) {
    return 301 /impressum/;
}
```

Useful path redirects from old and transitional URLs:

```nginx
rewrite ^/konzerte\.html$ /konzerte/ permanent;
rewrite ^/eindruecke\.html$ /eindruecke/ permanent;
rewrite ^/leitung\.html$ /leitung/ permanent;
rewrite ^/mitsingen\.html$ /mitsingen/ permanent;
rewrite ^/stimmbildung\.html$ /stimmbildung/ permanent;
rewrite ^/unterstuetzung\.html$ /unterstuetzung/ permanent;
rewrite ^/impressum\.html$ /impressum/ permanent;
rewrite ^/chorleben\.html$ /chorleben/ permanent;
rewrite ^/aktive\.html$ /aktive/ permanent;
rewrite ^/willkommen\.html$ /willkommen/ permanent;
rewrite ^/unterstuetzen/?$ /unterstuetzung/ permanent;
```

## Other SEO-Relevant Notes

- Do not block `/components/`, `/styles/`, `/fonts/`, or `/images/` in `robots.txt`.
- Keep only canonical, indexable pages in `sitemap.xml`.
- Use one canonical host only: `https://jungerkammerchorberlin.de`.
- Avoid redirect chains such as `http` -> `www` -> `.html` -> slash. Each old URL should resolve in one hop.
- Keep `404` responses real. Do not redirect unknown URLs to `/`.
- If you remove obsolete WordPress URLs with no replacement, prefer `410 Gone` over redirecting them all to the homepage.

Example:

```nginx
location = /feed/ {
    return 410;
}
```

## Launch Checks

Run these after deployment:

```bash
curl -I https://jungerkammerchorberlin.de/
curl -I https://jungerkammerchorberlin.de/index.html
curl -I https://jungerkammerchorberlin.de/konzerte
curl -I https://jungerkammerchorberlin.de/konzerte/
curl -I "https://jungerkammerchorberlin.de/?page_id=58"
curl -I https://jungerkammerchorberlin.de/robots.txt
curl -I https://jungerkammerchorberlin.de/sitemap.xml
```

Expected behavior:

- `/` returns `200`
- `/index.html` returns `301` to `/`
- `/konzerte` returns `301` to `/konzerte/`
- `/konzerte/` returns `200`
- `/?page_id=58` returns `301` to `/konzerte/`
- `robots.txt` and `sitemap.xml` return `200`
