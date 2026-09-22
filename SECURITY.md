# Security Policy

## Reporting a vulnerability

Do not disclose an unpatched vulnerability in a public issue. Contact the project
owner privately through [GitHub](https://github.com/Arjunren) with reproduction
steps, affected versions, and the expected impact.

## Security model

OpenPresenter processes PPTX files locally in the browser. Uploaded presentations
are not intentionally sent to an application server or saved permanently. Files
remain untrusted input: archive limits, required-part checks, XML parsing errors,
internal relationship resolution, and React text rendering reduce risk, but users
should still avoid opening presentations from untrusted sources.

Only `http:`, `https:`, and `mailto:` should be considered for any future hyperlink
support. External relationships and active content must never execute automatically.
