# LightLoops
Colorful tinywhoop loops.

## Usage
### Setup
- Run `nvm use`.
- Run `yarn install`.
- Run `docker compose -f dev_services.compose.yml up -d` to set up dev services.
- Run `yarn db:migrate` to run pending migrations, generate the client code, and create the db if it doesn't yet exist.

### Commands & scripts
- `yarn db:migrate:dev`: Create a new db migration from changes in `schema.prisma`.
- `yarn db:migrate`: Apply pending migrations to the db (and create the db if it doesn't yet exist).
- `scripts/dev_db_connect_postgres.sh`: Connect to dev DB `postgres` as user `postgres`.
- `scripts/dev_db_connect_lightloops_api.sh`: Connect to dev DB `lightloops_api` as user `lightloops_api`.
- `scripts/purge_dev_services.sh`: Delete dev services containers and volumes.

## Dev Concepts and ideas
### The `ll_flasher` utility
- `ll_flasher`: Hardware config tool.
  - `flash`: Flash the lightloops firmware to the device (not the MicroPython firmware).
  - `id`: ID tools.
    - `get`: Read device id.
    - `generate`: Generate a device ID file if one doesn't yet exist.
    - `-f, --force`: Overwrite ID file if exists.
  - `config`: Config tools (server URL, etc.).
    - `read`: Read the current config if exists.
    - `write -f <filename>`: Write a config to the devices.

### API keys and user accounts
- At a fundamental level, there is a `device_api_key` and a `web_api_key`. All device endpoints expect the former, while all endpoints serving the web UI expect the latter. This includes the request for a WebSocket connection on either side.
- Device registration: If a device (via its config file and `ll_flasher config -f some.llconfig.json`) knows the server ID and the `device_api_key`, it is considered to have the right to register with that server.
- Upon startup, a device will call `POST /device/<device_id>/readConfig/` and provide the correct `device_api_key` as a header, as well as its hardware name as a payload value. If the device is not yet known to the server – i.e. there is no entry in the `devices` table – such an entry is created. The hardware name is used as the name value. In any case, as long as the API key is correct, the device will receive a full configuration (including ledChoreo, if a value is set in the currently loaded profile). This endpoint is also queried whenever devices read a `RELOAD_CONFIG` command through their WS connection.
- Concerning API keys: There might be some merit to allowing users to create additional API keys for both devices and the WebUI. The former could be useful if a user wants to allow a friend's device(s) to connect to their server. This, however, would reqired the friend to "expose" their `device_api_key`, unless devices also support storing multiple API keys and have a way to figure out which one to use with a given server (like a `/devices/checkApiKey` endpoint, which returns `204` if the server accepts the key or `401` if it rejects it, or a `devices/selectApiKey` endpoint which returns the correct one out of some maximum number of allowed keys). In any case, this raises the question of whether admins should have a way to know what API keys were used at any point by a given device, so they can delete these keys if they no longer want to support the devivce. As far as a multi-web-api-key setup is concerned, this could be useful to allow a friend temporary access to all settings. This, however, is already close to a basic username / password system – especially since we would probably want each web API key to be associated with some kind of name, so an admin can know which key(s) to delete later on. It might also be an option to store device API keys as key/value pairs, so we could store a key named `letting_my_friend_try_this_out` on the device, telling the friend to add that key to their server via the WebUI, and then having the device not as which key is valid, but for a list of known keynames. This, again, would move the concept closer to a basic username/password setup, with the addition of an account type (`device` or `web`), and default entries being created at first launch via env vars. Maybe the default values could always be env vars and never be stored to the DB, or maybe it is stored to the db but there is a way for the `root` web user to change all passwords, including their own.