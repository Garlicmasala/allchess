# allchess

An atlas and simulator surface for chess across time, cultures, and dimensions.

Public site: https://allchess.com

## Run locally

This is a dependency-free browser app. Serve the directory from a local HTTP server so browser modules and Web Crypto work consistently:

```sh
npx serve .
```

Then open the printed local URL. Run the test suite with `npm test` and syntax checks with `npm run check`.

## Scope

The current slice includes a searchable catalog of 35 historical, regional, modern, and dimensional chess worlds; an interactive local playground; English, Spanish, Japanese, and Arabic UI copy; and local-only accounts. Standard Chess has turn-aware movement and captures. The other variants provide interactive exploratory positions while their dedicated rule engines are built. Passwords are never stored directly: the browser derives a PBKDF2-SHA-256 hash with a random salt and 120,000 iterations. This local login is for the sandbox, not a substitute for a server-backed identity system.

Variant rules are represented as profiles in `core.js`, leaving room to add move engines independently as each game is implemented.