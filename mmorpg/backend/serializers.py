from django.contrib.auth.models import User, Group
from rest_framework.serializers import HyperlinkedModelSerializer, Serializer, CharField


class UserSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups', 'id']


class GroupSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class TokenSerializer(Serializer):
    token = CharField(max_length=255)
