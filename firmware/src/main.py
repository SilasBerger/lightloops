import json
import sys
import wlan


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


def main():
    config = read_config()
    device_id = read_device_id()
    print(f"Device ID: {device_id}")
    wlan.connect(config["wlan"])


main()
