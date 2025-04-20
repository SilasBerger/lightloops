import json
import sys
import wlan
import api
import asyncio
from api import api, init as init_api
from error_handler import ErrorHandler
from ws import AsyncWebsocketClient


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


def handle_event(event):
    print(event)


async def observe_websocket_events(api_config):
    ws = AsyncWebsocketClient()

    websocket_uri = f"ws://{api_config["host"]}:{api_config["port"]}{api_config["ws_path"]}"

    # websocket_uri = "ws://192.168.0.203:3005/ws"
    print(f"Connecting to WebSocket server: {websocket_uri}")
    if not await ws.handshake(websocket_uri):
        raise Exception("An error occurred during WebSocket handshake")
    print("WebSocket handshake successful!")

    while await ws.open():
        event = json.loads(await ws.recv())
        print(event)
        handle_event(event)


def main():
    # TODO: Set LED strip to flashing blue to show init state.
    config = read_config()
    device_id = read_device_id()
    print(f"Device ID: {device_id}")
    connect_wlan(config["wlan"])
    init_api(device_id, config["api"], config["device"] if "device" in config else {})
    perform_handshake()
    # TODO: Set LED strip to static green for 1-3s to show ready state.
    print(api().get_device_profile())  # TODO: Send this to the lighting engine.
    asyncio.run(observe_websocket_events(config["api"]))


try:
    main()
except Exception as e:
    ErrorHandler.log_error_and_exit(f"Unknown error occurred: {str(e)}")
