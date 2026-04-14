# Portfolio

Static single-page portfolio with a cyberpunk vertical timeline. Vanilla HTML/CSS/JS — no build step.

## Run locally

`fetch()` refuses `file://` in Chrome, so serve via a local HTTP server:

```bash
# Python 3
python -m http.server 8000

# Node
npx serve .
```

Then open http://localhost:8000.

## Edit content

All content lives in [data/projects.json](data/projects.json). Add a project by appending an object to the `projects` array:

```json
{
  "id": "slug",
  "title": "PROJECT NAME",
  "date": "2026",
  "tags": ["Tech", "Stack"],
  "description": "Two or three lines max.",
  "color": "#00f0ff",
  "video": "assets/videos/slug.webm",
  "poster": "assets/images/slug.svg",
  "link": "https://github.com/you/slug"
}
```

Drop the WebM/MP4 in [assets/videos/](assets/videos/) and the poster (SVG/WebP/JPG) in [assets/images/](assets/images/).

Projects should be ordered newest first.

### Video specs

- 15–30 seconds, muted, loopable
- WebM preferred (smaller), MP4 as fallback
- 16:9 aspect ratio (1280x720 or 1920x1080)

## Deploy

Push the whole folder to any static host — GitHub Pages, Netlify, Vercel, Surge. No config needed.

## Accessibility

- Respects `prefers-reduced-motion`
- Keyboard navigable with visible focus rings
- Semantic HTML
