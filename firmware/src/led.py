from machine import Pin
import neopixel
import asyncio


class LedEngine:
    
    def __init__(self, led_config):
        self._strip = neopixel.NeoPixel(Pin(led_config["pin"]), led_config["count"], bpp=3)  # bpp=4 for RGBW, 3 for RGB
        self._current_task = None

    async def _display_pattern(self, led_values):
        print("Displaying pattern:", led_values)
        for i in range(len(self._strip)):
            self._strip[i] = led_values[i % len(led_values)]
        self._strip.write()
        print("LED values written to strip:", led_values)

    @staticmethod
    def _resolve_colors(colors, vars):
        if isinstance(colors, str):
            # Colors is a pattern var. Get the colors list from there and resolve it.
            return LedEngine._resolve_colors(vars["patterns"].get(colors, colors), vars)
        elif isinstance(colors, list):
            # Colors is a list of lists.
            resolved_colors = []
            for color in colors:
                if isinstance(color, str):
                    # Color is a variable. Get the color from the vars.
                    resolved_colors.append(vars["colors"][color])
                elif isinstance(color, list):
                    # Color is a list of color values.
                    resolved_colors.append(color)
                else:
                    raise ValueError(f"Invalid color format: {color}")
            return resolved_colors
        else:
            raise ValueError(f"Invalid color format: {colors}") 
        
    @staticmethod
    def _resolve_duration(duration, vars):
        if isinstance(duration, str):
            # Duration is a variable. Get the duration from the vars.
            return vars["durations"].get(duration, duration)
        elif isinstance(duration, int):
            # Duration is an int. Return it as is.
            return duration
        else:
            return None

    async def _do_the_thing(self, intervals, vars):
        print("Running intervals:", intervals)
        for interval in intervals:
            print("Interval:", interval)
            colors = LedEngine._resolve_colors(interval["colors"], vars)
            duration= LedEngine._resolve_duration(interval.get("duration", None), vars)
            await self._display_pattern(colors)
            if duration is not None:
                # TODO: Fading...
                await asyncio.sleep(duration)
            
        self._current_task = None

    async def _run_intervals(self, intervals, vars):
        print("In run intervals")
        if vars["loop"]:
            while True:
                await self._do_the_thing(intervals, vars)
        else:
            await self._do_the_thing(intervals, vars)

    async def _display(self, scene):
        vars = {
            "durations": scene.get("durations", {}),
            "colors": scene.get("colors", {}),
            "patterns": scene.get("patterns", {}),
            "fade": scene.get("fade", False),
            "loop": scene.get("loop", False),
        }
        print("Calling run intervals")
        await self._run_intervals(scene["intervals"], vars)

    def display(self, scene):
        if (self._current_task and not self._current_task.done()):
            self._current_task.cancel()
        self._current_task = asyncio.create_task(self._display(scene))

    def demo_display_difficult_scene(self):
        difficult_scene = {
            "crossfade_duration": 200,  # Shorthand. Acts the same as putting crossfade_duration on every interval.
            "durations": {
                "on": 1000,
                "off": 500,
            },
            "colors": {
                "red": [255, 0, 0],
                "green": [0, 255, 0],
                "off": [0, 0, 0],
            },
            "patterns": {
                "a": ["red", "green"],
                "b": ["green", "red"],
                "c": ["red", "green", [120, 20, 205]],
            },
            "intervals": [
                {
                    "colors": "a",
                    "duration": 'on',
                },
                {
                    "colors": "off",
                    "duration": 'off',
                },
                {
                    "colors": "b",
                    "duration": 'on',
                },
                {
                    "colors": "off",
                    "duration": 'off',
                },
                {
                    "colors": "c",
                    "duration": 'on',
                },
                {
                    "colors": "off",
                    "duration": 'off',
                },
                {
                    "colors": ["red", "green", [0, 0, 255]],
                    "duration": "2000"
                },
                                {
                    "colors": "off",
                    "duration": 1000,
                },
            ],
        }
        self.display(difficult_scene)
    
    def demo_display_static_scene(self):
        simple_scene = {
            "intervals": [
                {
                    "colors": [[255, 255, 0]],
                }
            ]
        }
        self.display(simple_scene)

    def demo_display_randomized_scene(self):
        pass
        # TODO: Here, the intervals field needs to have a random generator.
    
    def demo_fading_bonanza(self):
        scene = {
            "loop": False,
            "colors": {
                "red": [255, 0, 0],
                "green": [0, 255, 0],
                "blue": [0, 0, 255],
                "off": [0, 0, 0],
            },
            "durations": {
                "static": 1000,
                "whenCrossfading": 500,
                "crossfadeDuration": 200,
            },
            "intervals": [
                {
                    "crossfade_duration": 'default_fade_duration',  # Duration of the crossfade from this to the next interval (if available).
                    "fade_in_duration": 1000,  
                    "fade_out_duration": 1000,  # Duration of the fade out. Has no effect if crossfade_duration is set on the next interval.
                },
                {
                    "colors": ["red"],
                    "duration": "static",
                },
                {
                    "colors": ["green"],
                    "duration": "static",
                },
                {
                    "colors": ["blue"],
                    "duration": "static",
                },
                {
                    "colors": ["off"],
                    "duration": "static",
                },
                {
                    "fade_in_duration": 200, # Duration of the fade in. Has no effect if crossfade_duration is set on the previous interval.
                    "colors": ["red"],
                    "duration": "whenCrossfading",
                    "crossfade_duration": 'crossfadeDuration',
                },
                {
                    "fade_in_duration": 5000,  # Should be ignored here, since we have a crossfade_duration set on the previous interval.
                    "colors": ["green"],
                    "duration": "whenCrossfading",
                    "crossfade_duration": 'crossfadeDuration',

                },
                {
                    "colors": ["blue"],
                    "duration": "whenCrossfading",
                    "fade_out_duration": 1000,  # Duration of the fade out. Has no effect if crossfade_duration is set on the next interval.
                },
                {
                    "colors": ["off"],
                    "duration": "static",
                },
                {
                    "colors": ["red", "green", "blue"],
                    "duration": "whenCrossfading",
                    "crossfade_duration": 'crossfadeDuration',
                },
                {
                    "colors": ["green", "blue", "red"],
                    "duration": "whenCrossfading",
                    "crossfade_duration": 'crossfadeDuration',
                },
                {
                    "colors": ["blue", "red", "green"],
                    "duration": "whenCrossfading",
                    "crossfade_duration": 'crossfadeDuration',
                    "fade_out_duration": 1000,
                },
            ]
        }
        self.display(scene)
