# PM2 deployment (Espaço Ice Laser)

Production process definition for the white-label server published at
`https://rocket-api.forous.com.br`.

## Layout on the host

```
iceautomation/
├── Rocket.Chat/            # this repository (source)
└── Rocket.Chat-runtime/
    └── bundle/             # built Meteor bundle (main.js)
```

- MongoDB: Docker container `rocketchat-mongo` (`mongo:8.0`, replica set `rs0`,
  bound to `127.0.0.1:27017`, `restart: unless-stopped`).
- The server listens on `127.0.0.1:3300` (`BIND_IP`); the public hostname is
  served by the Cloudflare tunnel in front of it, whose origin is
  `http://localhost:3300`. Without `BIND_IP` Meteor binds to `0.0.0.0` and the
  server is reachable over plain HTTP from the LAN.

## Public URL

`ROOT_URL` and `OVERWRITE_SETTING_Site_Url` must both carry the public
hostname. With `localhost:3300` in either one, `/api/info` reports
`"workspaceUrl":"localhost:3300"` and the mobile app and push notifications
point clients at an address they cannot reach. `OVERWRITE_SETTING_Site_Url`
enforces the value on every boot, so a `Site_Url` left in the database from an
earlier setup does not win.

Check after a restart:

```bash
curl -s https://rocket-api.forous.com.br/api/info | grep -o '"workspaceUrl":"[^"]*"'
# "workspaceUrl":"rocket-api.forous.com.br"
```

## Running

```bash
pm2 delete rocketchat   # env changes are not picked up by a plain restart
pm2 start deploy/pm2/ecosystem.config.cjs
pm2 save
```

Optional overrides: `RC_RUNTIME_DIR`, `RC_PUBLIC_URL`, `RC_MONGO_URL`, `RC_NODE_BIN`,
`RC_BIND_IP`.
