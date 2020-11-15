# Trador Back-End

Both servers share `User` model, so a monorepo was ideal at the moment. However, an ideal configuration would be three packages:

1. `trador-models`: a NPM packge containing all the models with types. Installed from source as a dependency.
2. `auth-server`: contains all Auth controllers and services.
3. `api-server`: contains all API controllers and services.

## Auth Server

See [`src/servers/auth-server`](src/servers/auth-server)

## API Server

See [`src/servers/api-server`](src/servers/api-server)

# Building

Run

```
$ npm run build
```

# Deployment

Crate a copy of `.env.sample` and rename it to `.env`

```
$ cp .env.sample .env
```

All can be left as they are except for `MONGO_URI`.

Both servers can be deployed using [PM2](https://pm2.io) in a single command. The configurations are in `ecosystem.config.js`. In command line, type:

```
$ pm2 start ecosystem.config.js
```

Each server is configured to have have to insatnces, which is more than enough for a small-scale application.

Logs can be traced using

```
$ pm2 logs
```

# Proxy

You can setup an Nginx proxy like this:

```nginx
server {
  listen 80;
  listen [::]:80;
  server_name auth.app.io;
  location / {
    proxy_pass http://127.0.0.1:4001;
  }
}
server {
  listen 80;
  listen [::]:80;
  server_name api.app.io;
  location / {
    proxy_pass http://127.0.0.1:4002;
  }
}
```
