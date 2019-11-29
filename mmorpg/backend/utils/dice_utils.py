from typing import Iterable


def roll_dice(rolls: int, sides: int) -> Iterable[int]:
    return [_roll_die(sides)] * rolls


def sum_roll_dice(rolls: int, sides: int) -> int:
    return sum(roll_dice(rolls, sides))


def _roll_die(sides: int) -> int:
    # rand num gen in python?
    pass
