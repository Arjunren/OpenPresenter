# Contributing to OpenPresenter

Thanks for helping improve OpenPresenter.

## Development

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Run `npm run dev` for local development.
4. Run `npm run check` before opening a pull request.

Keep PPTX parsing separate from React rendering, preserve client-side processing,
and add a regression test for parser or renderer fixes. Never commit presentations
that contain private information, credentials, or copyrighted material without permission.

## Pull requests

Describe the PPTX feature or bug, list the browsers tested, and note any known
rendering differences from Microsoft PowerPoint. Keep changes focused and do not
claim support for PowerPoint features that are not actually parsed and rendered.
