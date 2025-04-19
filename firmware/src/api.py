import urequests
import json


_EP_DEVICE = "/device"


class Api():

    def __init__(self, device_id, api_config, device_config = {}):
        self._device_id = device_id
        self._base_url = api_config["base_url"]
        self._api_key = api_config["key"]
        self._name = device_config["name"] if "name" in device_config else self._device_id
        self._description = device_config["description"] if "description" in device_config else None

    def _default_headers(self):
        return {
            "Authorization": f"ApiKey-v1 {self._api_key}",
            "content-type": "application/json"
        }

    def register_device(self):
        print(self._base_url + _EP_DEVICE)
        print(self._default_headers())
        data = json.dumps({
            "id": self._device_id,
            "name": self._name,
            "description": self._description
        })
        print(data)
        res = urequests.request(
            "POST",
            self._base_url + _EP_DEVICE,
            data = data,
            headers = self._default_headers()
        )
        print(res.status_code)
        print(res.text)
