# Contributing

Corrections and new guides are very welcome. Vortex doesn't publish its API, so everything here comes from the engine binaries and from people testing things in Studio.

## Fixing the reference

Reference pages are generated from `data/api.json`. That file lives in [VortexStudio-MCP](https://github.com/xRookieFight/VortexStudio-MCP), so send API corrections there (a missing method, a wrong signature, something marked unverified that you've confirmed). Once merged, `npm run sync-api` brings it here.

When you report something, say how you checked it, ideally with the script you ran in Studio. Things nobody has tested in Vortex stay marked `unverified`.

## Writing guides

Guides live in `docs/guide`. Add new pages to the sidebar in `docs/.vitepress/config.mts`.

* Write for someone making their first Vortex game. Short paragraphs, real examples.
* Every code sample should run in Vortex as written. Only use APIs that exist in the reference.
* Link to reference pages instead of repeating them.
* Point out Roblox habits that don't work in Vortex when they're relevant.

## Checking your change

```sh
npm install
npm run build
```

The build fails on dead links, so a green build means every link resolves.

## Commits

Short imperative titles in sentence case, no trailing period, for example `Add a guide on tweens`.
