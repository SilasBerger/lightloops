# Firmware in Rust
## Dev environment setup
### Option 1: On-device install (currently preferred)
These commands need to be run in order to set up the esp-rs development environment on your device. They do not need to be run from within a Cargo project.

- `rustup toolchain install nightly --component rust-src`
- `cargo install ldproxy`
- `cargo install espflash`
- `cargo install espup`
- `espup install`
- Run in every development terminal: `source ~/export-esp.sh`

Alternatively, you can also use a container: https://docs.esp-rs.org/book/installation/using-containers.html.

Optionally, install the template generator for esp-rs: `cargo install cargo-generate`. With that, you can run `cargo generate esp-rs/esp-idf-template cargo` to create a new esp-rs project.

### Option 2: Docker container (flashing not supported)
_Reference: https://docs.esp-rs.org/book/installation/using-containers.html_
- Run `docker build -t ll-esp-rs-dev -f esp-rs-dev.dockerfile .` to build the image.
- Run `docker container run --rm -it -v .:/home/esp/project ll-esp-rs-dev /bin/bash`.
- Run `cd project`.

In here, you can run `cargo build`, but `cargo run` won't work.

### Option 3: Podman container
_Reference: https://github.com/esp-rs/rust-build?tab=readme-ov-file#using-containers_
TBD.

## Usage
After setting up the development environment, make sure you have run `source ~/export-esp.sh` in your current terminal.

Then, run `cargo run` to build and run the application on a connected ESP32 device.

## Resources
- [The official esp-rs book (online)](https://docs.esp-rs.org/book/)