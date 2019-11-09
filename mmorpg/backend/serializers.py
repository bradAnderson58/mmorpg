from django.contrib.auth.models import User, Group
from rest_framework.serializers import HyperlinkedModelSerializer, Serializer, CharField, ModelSerializer

from mmorpg.backend.models import Character


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'groups', 'id']


class GroupSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class TokenSerializer(Serializer):
    token = CharField(max_length=255)


class CharacterSerializer(ModelSerializer):
    class Meta:
        model = Character
        fields = ('id', 'name', 'race', 'level', 'sprite')

    def to_representation(self, instance):
        ret = super(CharacterSerializer, self).to_representation(instance)
        ret['characterClass'] = instance.character_class
        return ret
