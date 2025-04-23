# Firmware in Rust
## Dev environment setup
These commands need to be run in order to set up the esp-rs development environment on your device. They do not need to be run from within a Cargo project.

- `rustup toolchain install nightly --component rust-src`
- `cargo install ldproxy`
- `cargo install espflash`
- `cargo install espup`
- `espup install`
- Run in every development terminal: `source ~/export-esp.sh`

Alternatively, you can also use a container: https://docs.esp-rs.org/book/installation/using-containers.html.

### Optional tooling
- Template generator for esp-rs: `cargo install cargo-generate` (run `cargo generate esp-rs/esp-idf-template cargo`)

## Usage
After setting up the development environment, run `cargo run` to build and run the application on a connected ESP32 device.

## Resources
- [The official esp-rs book (online)](https://docs.esp-rs.org/book/)