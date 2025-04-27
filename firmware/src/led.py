from machine import Pin
import neopixel
import asyncio


class LedTask:

    def __init__(self, strip):
        self._strip = strip
        self._running = False
        self._async_task = None

    @staticmethod
    def _resolve_colors(colors, vars):
        if isinstance(colors, str):
            # Colors is a pattern var. Get the colors list from there and resolve it.
            return LedTask._resolve_colors(vars["patterns"][colors], vars)
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

    async def _display_pattern(self, led_values):
        for i in range(len(self._strip)):
            self._strip[i] = led_values[i % len(led_values)]
        self._strip.write()

    async def _execute_intervals(self, intervals, vars):
        for interval in intervals:
            if not self._running:
                break

            colors = LedTask._resolve_colors(interval["colors"], vars)
            duration= LedTask._resolve_duration(interval.get("duration", None), vars)
            await self._display_pattern(colors)
            if duration is not None:
                # TODO: Fading...
                await asyncio.sleep(duration)
            
        self._current_task = None

    async def _run_once_or_loop(self, intervals, vars):
        if vars["loop"]:
            while True and self._running:
                await self._execute_intervals(intervals, vars)
        else:
            await self._execute_intervals(intervals, vars)

    def run(self, intervals, vars):
        self._running = True
        self._async_task = asyncio.create_task(self._run_once_or_loop(intervals, vars))

    def cancel(self):
        if self._async_task:
            self._async_task.cancel()
            self._async_task = None
        self._running = False


class LedEngine:
    
    def __init__(self, led_config):
        self._strip = neopixel.NeoPixel(Pin(led_config["pin"]), led_config["count"], bpp=3)  # bpp=4 for RGBW, 3 for RGB
        self._current_task = None

    def _display(self, scene):
        vars = {
            "durations": scene.get("durations", {}),
            "colors": scene.get("colors", {}),
            "patterns": scene.get("patterns", {}),
            "fade": scene.get("fade", False),
            "loop": scene.get("loop", False),
        }
        self._current_task = LedTask(self._strip)
        self._current_task.run(scene["intervals"], vars)

    def display(self, scene):
        if self._current_task:
            self._current_task.cancel()
        self._display(scene)
