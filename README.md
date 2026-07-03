# Tarkov Map Website

Basic Tarkov maps website written using Vue. I don't maintain this, just a fun project I made a couple years ago.


## To deploy to docker

```bash
# Build and push container
docker buildx build --platform linux/amd64,linux/arm64 -t registry.rmnad.net/tarkov-map-website:latest --push .

# Then redeploy in portainer
```