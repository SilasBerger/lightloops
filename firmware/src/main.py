import json
import sys
import wlan
import api
from api import api, init as init_api
from error_handler import ErrorHandler


def read_config():
    try:
        with open("./config.json") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading config: {e}")
        sys.exit(1)


def read_device_id():
    try:
        with open("./device_id") as f:
            return f.read().strip()
    except Exception as e:
        print(f"Error reading device ID: {e}")
        sys.exit(1)


def perform_handshake():
    reg_response = api().register_device()
    if reg_response.get_status_code() == 200:
        print("Device successfully registered with API.")
    else:
        ErrorHandler.log_and_exit(f"Failed to register device with API: {str(reg_response)}")
    # TODO: Establish Socket.io connection.
    print("Handshake complete.")


def connect_wlan(wlan_config):
    error = wlan.connect(wlan_config)
    if error:
        ErrorHandler.log_error_and_exit(error)


def main():
    # TODO: Set LED strip to flashing blue to show init state.
    config = read_config()
    device_id = read_device_id()
    print(f"Device ID: {device_id}")
    connect_wlan(config["wlan"])
    init_api(device_id, config["api"], config["device"] if "device" in config else {})
    perform_handshake()
    # TODO: Set LED strip to static green for 3-5s to show ready state.


try:
    main()
except Exception as e:
    ErrorHandler.log_error_and_exit(f"Unknown error occurred: {str(e)}")
