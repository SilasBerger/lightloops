# LightLoops Firmware
## Hardware setup
Flash the MicroPython firmware to the ESP32 device, e.g. using [this repo](https://github.com/SilasBerger/nodemcu-setup?tab=readme-ov-file#flashing-firmware).

## Firmware setup
- Run `python3 -m venv venv` to create a virtualenv.
- Run `source ./venv/bin/activate` to activate the virtualenv. This is is also required for interacting with any of the available CLIs.
- Run `pip install -r requirements.txt` to install all required packages.
- Run `cp example.config.json config.json` and fill in the correct values. This file can also be moved/copied to a different location (e.g. `~/lightloops.config.json`).

### Additional development setup
- Run `./lldevice.py write-config -f /path/to/config.json` to ensure a valid config file is present on the device. This is required when using `./lldevice.py dev`.

## Working with the various CLIs
### `lldevice.py`
The CLI is used to install and configure the LightLoops firmware on ESP32 devices, as well as during development. As a non-developer, this should be the only CLI you will need to use.

Run `./lldevice --help` to see a list of available commands.

### `mpremote`
MicroPython's default CLI for interacting with hardware devices. Can be used for interacting with the device's file system, as well as for running Python code on the device. `mpremote` is also used by the `lldevice.py`. For non-developers, the direct use of `mpremote` should generally not be necessary.

These are some useful `mpremote` commands that can come in handy during development:
- List files on the device: `./mpremote fs ls`.
- Copy a file to the device: `./mpremote fs cp src/main.py :main.py` (remote parts start with a `:`).
- Run a script on the device (no need to copy it over first): `./mpremote run src/main.py`. **Caution:** Imports will be resolved on the device.
- Mount and execute a folder on the device (no need to copy it over first): `./mpremote mount src/ exec "import main"`. **Caution:** Files outside this directory (including files on the device itself) will not be available.
- Run the main file on the device (after copying it over): `./mpremote`, then `import main`. 

### `esptool`
Mostly used for flashing firmware to ESP32 devices. Not particularly relevant to this project.