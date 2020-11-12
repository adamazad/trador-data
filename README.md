# Trador Back-End

Both servers share `User` model, so a monorepo was ideal at the moment. However, an ideal configuration would be three packages:

1. `trador-models`: a NPM packge containing all the models with types. Installed from source as a dependency.
2. `auth-server`: contains all Auth controllers and services.
3. `api-server`: contains all API controllers and services.

## Auth Server

See [`src/servers/auth-server`](src/servers/auth-server)

## API Server

See [`src/servers/api-server`](src/servers/api-server)
