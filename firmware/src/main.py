import micropython
import machine
import foo.demo

micropython.mem_info()  # Shows heap memory usage
print(machine.freq())  # Displays CPU frequency (typically 240000000 Hz)
