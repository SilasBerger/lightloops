from cleo.commands.command import Command
from cleo.helpers import argument, option
from cleo.application import Application

class GreetCommand(Command):
    name = "greet"
    description = "Greet someone"
    arguments = [
        argument('name', description='Who do you want to greet?', optional=True),
    ]
    options = [
        option('--yell', '-y', description='Yell the greeting', flag=True),
        option('--prefix', description='Add a custom prefix', flag=False),
    ]

    def handle(self):
        name = self.argument("name")

        if name:
            text = f"Hello {name}"
        else:
            text = "Hello"

        if self.option("yell"):
            text = text.upper()

        self.line(text)


application = Application()
application.add(GreetCommand())

if __name__ == "__main__":
    application.run()