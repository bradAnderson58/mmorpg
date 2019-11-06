from enum import Enum


class ChoiceEnum(Enum):
    @classmethod
    def choices(cls):
        return tuple((choice.value, choice.name) for choice in cls)

    def __str__(self):
        return self.value

    def __eq__(self, obj):
        if isinstance(obj, type(self)):
            return obj.value == self.value
        elif isinstance(obj, str):
            return obj == self.value
        return False
