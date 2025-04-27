import json
import sys
import wlan
import api
import asyncio
from api import api, init as init_api
from error_handler import ErrorHandler
from ws import AsyncWebsocketClient
from led import LedEngine


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
        ErrorHandler.log_error_and_exit(f"Failed to register device with API: {str(reg_response)}")
    print("Handshake complete.")


def connect_wlan(wlan_config):
    error = wlan.connect(wlan_config)
    if error:
        ErrorHandler.log_error_and_exit("WLAN connection failed.", error)


def handle_ws_message(msg):
    try:
        msg = json.loads(msg)
    except Exception as e:
        pass  # API should send proper events. If something goes wrong here, we just ignore it.
    
    event = msg['event']
    data = msg['data']

    if event == 'error':
        raise Exception(f"Error received from WebSocket: {data}")
    else:
        print(msg)



async def observe_websocket_events(device_id, api_config):
    ws = AsyncWebsocketClient()

    websocket_uri = f"ws://{api_config["host"]}:{api_config["port"]}{api_config["ws_path"]}?deviceId={device_id}&apiKey={api_config["key"]}"

    print(f"Connecting to WebSocket server: {websocket_uri}")
    if not await ws.handshake(websocket_uri):
        raise Exception("An error occurred during WebSocket handshake")
    print("WebSocket handshake successful!")

    while await ws.open():
        event = json.loads(await ws.recv())
        handle_ws_message(event)


async def try_out_leds(led_engine):
    print("Displaying static scene for 5s...")
    led_engine.demo_display_static_scene()
    await asyncio.sleep(5)

    print("Displaying difficult scene for 20s...")
    led_engine.demo_display_difficult_scene()
    await asyncio.sleep(20)

    print("Displaying static scene for 5s again...")
    led_engine.demo_display_static_scene()
    await asyncio.sleep(5)

    print("LED demo complete.")


async def main():
    # TODO: Set LED strip to flashing blue to show init state.
    config = read_config()
    device_id = read_device_id()
    print(f"Device ID: {device_id}")
    connect_wlan(config["wlan"])
    init_api(device_id, config["api"], config["device"] if "device" in config else {})
    perform_handshake()
    # TODO: Set LED strip to static green for 1-3s to show ready state.
    print(api().get_device_profile())  # TODO: Send this to the lighting engine.
    # TODO: Reactivate. await observe_websocket_events(device_id, config["api"])
    led_engine = LedEngine(config["led"])
    await try_out_leds(led_engine)
    # TODO: When this returns, the WS connection is closed. Either re-open or go to error state (red LEDs).


try:
    asyncio.run(main())
except Exception as e:
    ErrorHandler.log_error_and_exit(f"Unexpected error occurred.", e)
