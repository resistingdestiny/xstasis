# xstasis.org

A content-first website for documenting club culture, built with Astro + TypeScript + TailwindCSS + MDX.

## Overview

xstasis is a trance-leaning travel and club journal that combines:
- **The Run**: A continuously updated living log of club visits
- **Club Wiki**: Deep-dive articles on individual clubs with Obsidian-style wiki linking
- **Articles**: Long-form explorations of club culture

## Tech Stack

- **Astro** - Static site generator
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **MDX** - Markdown with components
- **Fuse.js** - Client-side search

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:4321` to see your site.

## Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Search.astro
│   │   ├── TikTok.astro
│   │   ├── YouTube.astro
│   │   ├── SoundCloud.astro
│   │   ├── Vimeo.astro
│   │   └── Gallery.astro
│   ├── content/         # Content collections
│   │   ├── articles/    # Long-form articles
│   │   ├── clubs/       # Club wiki pages
│   │   ├── run/         # The living log
│   │   └── config.ts
│   ├── layouts/         # Page layouts
│   │   └── BaseLayout.astro
│   ├── lib/             # Utilities
│   │   ├── run-parser.ts
│   │   └── wikilinks.ts
│   ├── pages/           # Routes
│   │   ├── articles/
│   │   ├── clubs/
│   │   ├── index.astro
│   │   ├── run.astro
│   │   ├── rss.xml.ts
│   │   └── search-index.json.ts
│   └── styles/
│       └── global.css
└── package.json
```

## Adding Content

### Adding a Run Entry

The Run is a single living document at `src/content/run/the-run.mdx`. To add a new entry, append to the top of the file after the intro text:

```markdown
### 2024-12-07 | Club Name (City, Country)

Your notes about the visit go here. You can write as much or as little as you want.

Optional: Add media embeds or related links.

Related: [[Club Name]] [[Another Club]]
```

**Format Rules:**
- Date format: `YYYY-MM-DD`
- Club name, city, and country in parentheses
- Keep it chronological (newest first recommended, but not required)

### Adding a Club Wiki Page

Create a new MDX file in `src/content/clubs/` with the club name as filename (kebab-case):

```bash
src/content/clubs/berghain.mdx
```

**Frontmatter Template:**

```mdx
---
title: Berghain
city: Berlin
country: Germany
tags: [techno, minimal, industrial]
visited: true
djmagRank: 1        # Optional
djmagYear: 2024     # Optional
---

## Overview

Write your content here. Use standard Markdown syntax.

## Getting There

More sections...

Reference other clubs with [[Club Name]] syntax.
```

**Required Fields:**
- `title` - Club name
- `city` - City name
- `country` - Country name
- `tags` - Array of genre/style tags
- `visited` - Boolean (true/false)

**Optional Fields:**
- `djmagRank` - DJ Mag Top 100 Clubs ranking
- `djmagYear` - Year of the ranking

### Adding an Article

Create a new MDX file in `src/content/articles/`:

```bash
src/content/articles/my-article-title.mdx
```

**Frontmatter Template:**

```mdx
---
title: The Anatomy of a Perfect Night
date: 2024-03-01
tags: [culture, philosophy, techno]
summary: A one-paragraph summary that appears in article lists and social shares.
---

Your long-form content here.

You can reference clubs with [[Club Name]] syntax.
```

**Required Fields:**
- `title` - Article title
- `date` - Publication date (YYYY-MM-DD)
- `tags` - Array of topic tags
- `summary` - Short description

## Wiki Linking

Use `[[Club Name]]` syntax anywhere in your MDX content to create links between pages:

```markdown
I visited [[Berghain]] and [[Fabric]] on the same trip.
```

**How It Works:**
- If a club page exists, it creates a link to `/clubs/club-slug`
- If the page doesn't exist, it creates a search link to `/clubs?search=Club+Name`
- Links are styled with cyan color for existing pages, pink for missing pages

**Backlinks:**
- Pages automatically generate a "Backlinks" section
- Shows all other pages that reference the current page
- Works across clubs and articles

## Embedding Media

### TikTok

```mdx
<TikTok url="https://www.tiktok.com/@username/video/1234567890" />
```

### YouTube

```mdx
<YouTube id="dQw4w9WgXcQ" />
```

The ID is the part after `v=` in a YouTube URL.

### SoundCloud

```mdx
<SoundCloud url="https://soundcloud.com/artist/track" />
```

### Vimeo

```mdx
<Vimeo id="123456789" />
```

### Gallery

```mdx
<Gallery images={[
  {
    src: "/images/photo1.jpg",
    alt: "Description of photo",
    caption: "Optional caption"
  },
  {
    src: "/images/photo2.jpg",
    alt: "Another photo"
  }
]} />
```

**Notes:**
- All embeds are responsive
- If a URL or ID is missing, a friendly error message displays
- Place images in the `public/` folder to reference them

## Site Search

- Press `/` anywhere on the site to open search
- Search covers run entries, clubs, and articles
- Results update as you type
- Press `Esc` to close

## Building for Production

```bash
npm run build
```

Output goes to `./dist/` directory.

## Deploying

### Netlify

1. Connect your Git repository
2. Build command: `npm run build`
3. Publish directory: `dist`

### Vercel

1. Import your Git repository
2. Framework preset: Astro
3. Build command: `npm run build`
4. Output directory: `dist`

### Other Hosts

Any static hosting service works. Just build and upload the `dist/` folder.

## RSS Feed

Articles are available via RSS at `/rss.xml`

## SEO

- Automatic sitemap generation via Astro sitemap integration
- OpenGraph tags on every page
- Twitter card support
- Semantic HTML structure

## Customization

### Colors

Edit `tailwind.config.js` to change the neon accent colors:

```js
colors: {
  neon: {
    cyan: '#00ffff',    // Primary accent
    pink: '#ff00ff',    // Secondary accent
    blue: '#0080ff',
    green: '#00ff80',
  },
}
```

### Typography

Update `tailwind.config.js` fonts:

```js
fontFamily: {
  sans: ['Your Font', 'system-ui', 'sans-serif'],
  mono: ['Your Mono', 'monospace'],
}
```

Don't forget to update the Google Fonts link in `src/layouts/BaseLayout.astro`.

### Styling

Global styles are in `src/styles/global.css`. The site uses Tailwind utility classes throughout.

## Tips

- Write club pages as you visit them to capture fresh impressions
- Use tags consistently for better related content suggestions
- The Run is meant to be casual and immediate, clubs are detailed, articles are polished
- Wiki links create a knowledge graph over time
- Check the backlinks section to see how content connects
- See "The Mission" article for an example of personal narrative style

## License

MIT
