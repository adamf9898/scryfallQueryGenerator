# Scryfall Query Generator - Deployment Guide

This guide covers various deployment options for the Scryfall Query Generator web application.

## Table of Contents

- [Local Development](#local-development)
- [Static Hosting](#static-hosting)
- [GitHub Pages](#github-pages)
- [Netlify](#netlify)
- [Vercel](#vercel)
- [Traditional Web Hosting](#traditional-web-hosting)
- [PWA Features](#pwa-features)
- [Configuration](#configuration)

---

## Local Development

### Quick Start

The app is entirely client-side and requires no build process.

```bash
# Navigate to the generator directory
cd generator

# Option 1: Open directly in browser
open index.html

# Option 2: Use Python's built-in server
python3 -m http.server 8000

# Option 3: Use Node.js http-server
npx http-server -p 8000

# Option 4: Use PHP's built-in server
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

### File Structure

```
generator/
├── index.html        # Main HTML page
├── styles.css        # CSS styles
├── app.js            # JavaScript application
├── config.json       # Configuration data
├── queries.json      # Pre-built query database
├── manifest.json     # PWA manifest
├── sw.js             # Service worker
├── README.md         # Documentation
└── docs/
    ├── API.md        # API documentation
    └── DEPLOYMENT.md # This file
```

---

## Static Hosting

The app can be deployed to any static file hosting service.

### Required Files

At minimum, deploy these files:
- `index.html`
- `styles.css`
- `app.js`
- `config.json`
- `queries.json`

### Optional PWA Files

For full PWA support, also include:
- `manifest.json`
- `sw.js`

---

## GitHub Pages

### Method 1: From Repository Root

1. Push the `generator` folder to your repository
2. Go to **Settings** > **Pages**
3. Select source: **Deploy from a branch**
4. Choose your branch and `/generator` folder
5. Save and wait for deployment

### Method 2: Dedicated Branch

1. Create a `gh-pages` branch:
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   cp -r generator/* .
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

2. Configure GitHub Pages to use `gh-pages` branch

### Access URL

Your app will be available at:
```
https://<username>.github.io/<repository>/
```

---

## Netlify

### Deploy via Drag & Drop

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag the `generator` folder onto the page
3. Your site is live immediately!

### Deploy via Git

1. Connect your GitHub repository
2. Set build settings:
   - **Base directory**: `generator`
   - **Build command**: (leave empty)
   - **Publish directory**: `generator`
3. Deploy

### netlify.toml

Create `generator/netlify.toml`:
```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

---

## Vercel

### Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to generator folder
cd generator

# Deploy
vercel

# Follow prompts
```

### Deploy via Dashboard

1. Import your repository
2. Set root directory to `generator`
3. No build command needed
4. Deploy

### vercel.json

Create `generator/vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

---

## Traditional Web Hosting

### FTP/SFTP Upload

1. Connect to your server via FTP client
2. Upload all files from `generator/` to your web root
3. Ensure proper file permissions:
   - Files: `644`
   - Directories: `755`

### cPanel

1. Log into cPanel
2. Open **File Manager**
3. Navigate to `public_html`
4. Upload files from `generator/`

### Apache Configuration

Optional `.htaccess` for caching:
```apache
# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 week"
  ExpiresByType application/javascript "access plus 1 week"
  ExpiresByType application/json "access plus 1 day"
</IfModule>
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/scryfall-generator;
    index index.html;

    # Compression
    gzip on;
    gzip_types text/css application/javascript application/json;

    # Caching
    location ~* \.(css|js)$ {
        expires 7d;
    }

    location ~* \.json$ {
        expires 1d;
    }
}
```

---

## PWA Features

The app includes Progressive Web App features.

### Service Worker

The `sw.js` file provides:
- Offline functionality
- Asset caching
- Fast repeat visits

### Installing the PWA

Users can install the app:
1. Open the site in Chrome/Edge
2. Click the install icon in the address bar
3. Or use browser menu > "Install app"

### Updating the Service Worker

When updating the app:
1. Increment the cache version in `sw.js`:
   ```javascript
   const CACHE_NAME = 'scryfall-query-generator-v2';
   ```
2. Deploy the new files
3. Users will get updates on next visit

---

## Configuration

### Environment-Specific Config

Create different config files for environments:

```
generator/
├── config.json         # Production
├── config.dev.json     # Development
└── config.staging.json # Staging
```

Switch configs in `app.js`:
```javascript
const configFile = window.location.hostname === 'localhost' 
  ? 'config.dev.json' 
  : 'config.json';
```

### Customizing Queries

Edit `queries.json` to add or modify query categories:
```json
{
  "custom_category": [
    "t:creature keyword:flying",
    "t:instant mv<=2"
  ]
}
```

---

## Security Headers

For production deployments, add these security headers:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | XSS protection |
| `Content-Security-Policy` | See below | Script/style restrictions |

### Example CSP

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://scryfall.com https://api.scryfall.com;
```

---

## Troubleshooting

### CORS Issues

If loading `config.json` fails locally:
- Use a local server instead of `file://`
- Or configure CORS headers on your server

### Service Worker Not Updating

1. Open DevTools > Application > Service Workers
2. Click "Update" or "Unregister"
3. Refresh the page

### Cache Issues

Clear the cache:
```javascript
// In browser console
caches.keys().then(names => names.forEach(name => caches.delete(name)));
```

---

## Performance Tips

1. **Enable Gzip/Brotli compression** on your server
2. **Set proper cache headers** for static assets
3. **Use a CDN** for global distribution
4. **Minify files** for production (optional)

### Minification

```bash
# CSS
npx clean-css-cli styles.css -o styles.min.css

# JavaScript
npx terser app.js -o app.min.js
```

Update `index.html` to use minified files.

---

## Monitoring

Consider adding analytics or error tracking:

```html
<!-- Before </body> -->
<script>
  // Simple page view tracking
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/analytics', JSON.stringify({
      page: location.pathname,
      timestamp: Date.now()
    }));
  }
</script>
```

---

## Support

For issues or questions:
- Open an issue on [GitHub](https://github.com/adamf9898/scryfallQueryGenerator)
- Check the [Scryfall API documentation](https://scryfall.com/docs/api)
