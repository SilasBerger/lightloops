from machine import Pin
import neopixel
import asyncio


class LedEngine:
    
    def __init__(self, led_config):
        self._strip = neopixel.NeoPixel(Pin(led_config["pin"]), led_config["count"], bpp=3)  # bpp=4 for RGBW, 3 for RGB
        self._current_task = None

    async def _display_pattern(self, led_values):
        for i in range(len(self._strip)):
            self._strip[i] = led_values[i % len(led_values)]
        self._strip.write()

    @staticmethod
    def _resolve_colors(colors, vars):
        if isinstance(colors, str):
            # Colors is a pattern var. Get the colors list from there and resolve it.
            return LedEngine._resolve_colors(vars["patterns"][colors], vars)
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
            return vars["durations"][duration] / 1000
        elif isinstance(duration, int):
            # Duration is an int. Return it as is.
            return duration / 1000
        else:
            return None

    async def _execute_intervals(self, intervals, vars):
        for interval in intervals:
            colors = LedEngine._resolve_colors(interval["colors"], vars)
            duration= LedEngine._resolve_duration(interval.get("duration", None), vars)
            await self._display_pattern(colors)
            if duration is not None:
                # TODO: Fading...
                await asyncio.sleep(duration)
            
        self._current_task = None

    async def _run_once_or_loop(self, intervals, vars):
        if vars["loop"]:
            while True:
                await self._execute_intervals(intervals, vars)
        else:
            await self._execute_intervals(intervals, vars)

    async def _display(self, scene):
        vars = {
            "durations": scene.get("durations", {}),
            "colors": scene.get("colors", {}),
            "patterns": scene.get("patterns", {}),
            "fade": scene.get("fade", False),
            "loop": scene.get("loop", False),
        }
        await self._run_once_or_loop(scene["intervals"], vars)

    def display(self, scene):
        # TODO: Cancelling the current task does not seem to break the loop. Need to find a way to do this.
        if (self._current_task and not self._current_task.done()):
            self._current_task.cancel()
        self._current_task = asyncio.create_task(self._display(scene))
