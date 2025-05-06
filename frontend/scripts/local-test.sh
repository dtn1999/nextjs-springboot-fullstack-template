#!/bin/bash

# 1. Build project
bun run build

# 2. Builder docker image
docker build -t cozi/cozi-stay .

# 3. Run docker container
docker run -p 3000:3000 --env-file .env.local -v /var/run/docker.sock:/var/run/docker.sock:ro cozi/cozi-stay