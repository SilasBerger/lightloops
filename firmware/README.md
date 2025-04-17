# LightLoops Firmware
## Setup
- `python3 -m venv venv`
- `source ./venv/bin/activate`
- `pip install -r requirements.txt`
- `cp example.config.json src/config.json` and fill in the correct values.

**Note:** The `/src` directory contains a `device_id` file to support development using the `mpremote mount` command.

## CLI Usage
The CLI is used to install and configure the LightLoops firmware on ESP32 devices.

Run `./lldevice --help` to see a list of available commands.

## ESP32 Development
- Flash the MicroPython firmware to the ESP32 device, e.g. using [this repo](https://github.com/SilasBerger/nodemcu-setup?tab=readme-ov-file#flashing-firmware).
- List files on the device: `./mpremote fs ls`.
- Copy a file to the device: `./mpremote fs cp src/main.py :main.py` (remote parts start with a `:`).
- Run a script on the device (no need to copy it over first): `./mpremote run src/main.py`. **Caution:** Imports will be resolved on the device.
- Mount and execute a folder on the device (no need to copy it over first): `./mpremote mount src/ exec "import main"`.
- Run the main file on the device (after copying it over): `./mpremote`, then `import main`. 