# Tarkov Map Website

Basic Tarkov maps website written using Vue. I don't maintain this, just a fun project I made a couple years ago.


## To deploy to docker

```bash
# Build container
docker build -t registry.rmnad.net/tarkov-map-website:latest .

# Push to container registry
docker push registry.rmnad.net/tarkov-map-website:latest

# Then redeploy in portainer
```