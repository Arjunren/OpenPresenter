# OpenPresenter

> Present anywhere. No PowerPoint required.

OpenPresenter is an open-source web application for opening and presenting `.pptx`
files directly in a modern browser. Microsoft PowerPoint, Microsoft Office,
LibreOffice, and a server-side conversion service are not required.

## Features

- Local, browser-side PPTX validation, ZIP extraction, XML parsing, and rendering
- Responsive 16:9, 4:3, and custom slide dimensions
- Text runs with basic font, size, color, bold, italic, underline, alignment, and bullets
- Embedded PNG, JPEG, GIF, and SVG images
- Basic rectangles, rounded rectangles, ellipses, lines, triangles, fills, and borders
- Thumbnail navigation, slide overview, and mobile-friendly viewing
- Presentation mode with keyboard controls, auto-hiding controls, and fullscreen support
- Graceful per-slide and per-element failure handling

## How it works

1. The browser validates the selected file and ZIP signature.
2. JSZip reads the Office Open XML package locally.
3. The parser reads `ppt/presentation.xml`, relationships, ordered slide XML, and media.
4. PowerPoint EMU coordinates are normalized into responsive percentages.
5. React renders slide content with HTML, CSS, and SVG.

The normal application flow does not intentionally upload the presentation to a
server. Extracted images use temporary blob URLs that are revoked when the loaded
presentation is released.

## Supported PPTX features

The current MVP supports basic text, embedded raster/SVG images, common geometric
shapes, solid slide backgrounds, rotation, opacity in the normalized model, and
z-ordering. Support is intentionally progressive rather than pixel-identical to
Microsoft PowerPoint.

Not currently supported: SmartArt, charts, tables, groups, advanced theme/layout
inheritance, animations, PowerPoint Morph, audio/video, macros, ActiveX, 3D models,
advanced WordArt, and exact Microsoft font substitution. Unsupported content should
not prevent other slides from opening.

## Development

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run check
```

Production build and local preview:

```bash
npm run build
npm run preview
```

## Keyboard controls

- Next: Right Arrow, Down Arrow, Space, Enter, or Page Down
- Previous: Left Arrow, Up Arrow, Backspace, or Page Up
- First/last: Home or End
- Fullscreen: F
- Exit presentation: Escape

## Vercel deployment

Import the repository into Vercel and select the Vite framework preset. The core
application is a static frontend: Vercel serves the built assets while PPTX parsing
and rendering run in the visitor's browser.

## Privacy and security

OpenPresenter does not intentionally transmit selected presentations in its normal
local workflow and does not cache them permanently. PPTX files remain untrusted
input, so archive size/entry limits, package-structure validation, safe relationship
resolution, XML error handling, and React text nodes are used to reduce risk. See
[SECURITY.md](SECURITY.md) for reporting guidance.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Creator

OpenPresenter was created by **Arjunrenvon**.

[![GitHub](https://img.shields.io/badge/GitHub-Arjunren-181717?logo=github)](https://github.com/Arjunren)

## License

[MIT](LICENSE)
