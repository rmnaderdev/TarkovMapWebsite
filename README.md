# Tarkov Map Website

Basic Tarkov maps website written using Next.js (React). I don't maintain this, just a fun project I made a couple years ago.

Maps show a live extract/boss/hazard/loot overlay pulled from the [tarkov.dev API](https://tarkov.dev/api/). The map art itself comes from tarkov.dev's flat SVG maps (author Shebuka, [tarkov-dev-svg-maps](https://github.com/the-hideout/tarkov-dev-svg-maps/), CC BY-NC-SA 4.0) instead of hand-drawn poster maps, since the overlay needs marker positions to actually line up.

## Refreshing map data

Data only changes when the game wipes/patches, so it's fetched once and committed rather than pulled live:

```bash
# Refresh one map's extracts/bosses/hazards/loot + SVG (tarkov.dev's own slug, e.g. ground-zero not ground_zero)
pnpm fetch:map-data customs

# Regenerate the small home-page thumbnails after touching any map source image
pnpm generate:thumbnails
```

## To deploy to docker

```bash
# Build and push container
docker buildx build --platform linux/amd64,linux/arm64 -t registry.rmnad.net/tarkov-map-website:latest --push .

# Then redeploy in portainer
```