# LightLoops Firmware
## Setup
- `python3 -m venv venv`
- `source ./venv/bin/activate`
- `pip install -r requirements.txt`

## CLI Usage
- `lldevice`: Hardware config tool.
  - `flash`: Flash the lightloops firmware to the device (not the MicroPython firmware).
  - `id`: ID tools.
    - `get`: Read device id.
    - `generate`: Generate a device ID file if one doesn't yet exist.
    - `-f, --force`: Overwrite ID file if exists.
  - `config`: Config tools (server URL, etc.).
    - `read`: Read the current config if exists.
    - `write -f <filename>`: Write a config to the devices.