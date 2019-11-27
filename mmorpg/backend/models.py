import django_mysql.models as mysql_models
from django.contrib.auth.models import User
from django.db.models import Model, CharField, ForeignKey, CASCADE, IntegerField

from mmorpg.backend.utils.enum_utils import ChoiceEnum


class Race(ChoiceEnum):
    ELF = 'elf'
    DWARF = 'dwarf'
    HUMAN = 'human'
    HOBBIT = 'hobbit'


class CharacterClass(ChoiceEnum):
    FIGHTER = 'fighter'
    ROGUE = 'rogue'
    WIZARD = 'wizard'


class Character(Model):
    class Meta:
        db_table = 'mmo_character'

    user = ForeignKey(User, on_delete=CASCADE)
    name = CharField(max_length=32)
    race = CharField(max_length=6, choices=Race.choices())
    character_class = CharField(max_length=7, choices=CharacterClass.choices())
    level = IntegerField(default=1)
    sprite_sheet = CharField(max_length=32)
    animations = mysql_models.JSONField()
