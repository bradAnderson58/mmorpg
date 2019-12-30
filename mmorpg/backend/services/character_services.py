import logging
from typing import Iterable

from mmorpg.backend.models import CharacterTemplate, Character

logger = logging.getLogger(__name__)


def get_all_character_templates() -> Iterable[CharacterTemplate]:
    return CharacterTemplate.objects.all()


def get_character_template_by_id(template_id: int) -> CharacterTemplate:
    return CharacterTemplate.objects.get(id=template_id)


def get_all_characters_by_user_id(user_id: int) -> Iterable[Character]:
    return Character.objects.filter(user_id=user_id)


def has_permissions_for_character(user_id: int, character_id: int) -> bool:
    return (
        Character.objects
        .filter(user_id=user_id)
        .filter(id=character_id)
        .exists()
    )


def get_character_by_id(character_id: int) -> Character:
    return Character.objects.get(id=character_id)


def create_character(name: str, template_id: int, user_id: int) -> Character:
    return Character.objects.create(
        name=name,
        template_id=template_id,
        user_id=user_id,
    )


def character_name_exists(name: str) -> bool:
    return Character.objects.filter(name=name).exists()


def delete_character(character_id: int) -> bool:
    num_deleted, meta = Character.objects.filter(id=character_id).delete()
    logger.info('deleted: %s', meta)
    return num_deleted > 0
