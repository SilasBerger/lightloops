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

## ESP32 Development
- Flash the MicroPython firmware to the ESP32 device, e.g. using [this repo](https://github.com/SilasBerger/nodemcu-setup?tab=readme-ov-file#flashing-firmware).
- List files on the device: `./mpremote fs ls`.
- Copy a file to the device: `./mpremote fs cp src/main.py :main.py` (remote parts start with a `:`).
- Run a script on the device (no need to copy it over first): `./mpremote run src/main.py`. **Caution:** Imports will be resolved on the device.
- Mount and execute a folder on the device (no need to copy it over first): `./mpremote mount src/ exec "import main"`
- Run the main file on the device (after copying it over): `./mpremote`, then `import main`. 