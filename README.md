# Vortex API docs

Community reference for scripting [Vortex](https://playvortex.io) games in Luau, published at **https://xrookiefight.github.io/VortexAPI-Docs/**.

> Unofficial, not affiliated with or endorsed by Vortex.

The reference pages are generated from [`data/api.json`](data/api.json), the same file [VortexStudio-MCP](https://github.com/xRookieFight/VortexStudio-MCP) uses for its API tools and linter. The guides under `docs/guide` are written by hand.

## Working on it

You need Node 20 or newer.

```sh
npm install
npm run dev       # live preview at http://localhost:5173/VortexAPI-Docs/
npm run build     # static site in docs/.vitepress/dist
```

Both commands regenerate `docs/reference` from the data file first. That folder is gitignored, don't edit it by hand.

## Updating the API data

VortexStudio-MCP owns `api.json`. Make API changes there first, then pull them in here:

```sh
npm run sync-api
```

Review the diff and commit it. Pushing to `main` deploys the site.

## Deployment

`.github/workflows/deploy.yml` builds the site and publishes it with GitHub Pages on every push to `main`. In the repository settings, Pages has to use **GitHub Actions** as its source. For a custom domain, set the `DOCS_BASE` environment variable to `/` in the workflow and add the domain in the Pages settings.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE), for both code and content. Vortex is proprietary software owned by its developers.
