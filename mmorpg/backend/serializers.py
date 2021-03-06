import json

from django.contrib.auth.models import User, Group
from rest_framework.serializers import HyperlinkedModelSerializer, Serializer, CharField, ModelSerializer
from rest_framework_jwt.settings import api_settings

from mmorpg.backend.models import Character, CharacterTemplate

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'groups', 'id']


class GroupSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class TokenSerializer(ModelSerializer):
    class Meta:
        model = User

    def to_representation(self, instance):
        token = jwt_encode_handler(jwt_payload_handler(instance))
        return {
            'token': token,
            'userId': instance.id,
            'userName': instance.username
        }


class CharacterTemplateSerializer(ModelSerializer):
    class Meta:
        model = CharacterTemplate
        fields = ('id', 'race', 'animations')

    def to_representation(self, instance):
        ret = super(CharacterTemplateSerializer, self).to_representation(instance)
        ret['characterClass'] = instance.character_class
        ret['spriteSheet'] = instance.sprite_sheet
        return ret


class CharacterSerializer(ModelSerializer):
    template = CharacterTemplateSerializer(read_only=True)
    class Meta:
        model = Character
        fields = ('id', 'name', 'template', 'level')

    def to_representation(self, instance):
        ret = super(CharacterSerializer, self).to_representation(instance)
        return ret
