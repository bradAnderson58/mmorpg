import json

from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User, Group
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from mmorpg.backend.models import Character
from mmorpg.backend.serializers import UserSerializer, GroupSerializer, TokenSerializer, CharacterSerializer


class UserViewSet(ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)


class GroupViewSet(ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class LoginView(CreateAPIView):
    permission_classes = (AllowAny,)
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        username = request.data.get("username", "")
        password = request.data.get("password", "")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            serializer = TokenSerializer(user)
            return Response(serializer.data)
        return Response(status=status.HTTP_401_UNAUTHORIZED)


class SignupView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        print(request.data)
        name_exists = User.objects.filter(username=request.data['username']).exists()
        if name_exists:
            response = Response(status=status.HTTP_409_CONFLICT, data='Username already exists')
        else:
            user = User.objects.create(
                username=request.data['username'],
                password=request.data['password']
            )
            response = Response(UserSerializer(user).data)

        return response


class CharacterView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, character_id=None):
        if character_id is not None:
            if self.has_permissions(request.user, character_id):
                character = Character.objects.get(id=character_id)
                serializer = CharacterSerializer(character)
                return Response(serializer.data)
            else:
                return Response(status.HTTP_401_UNAUTHORIZED)
        else:
            characters = Character.objects.filter(user_id=request.user.id)
            serializer = CharacterSerializer(characters, many=True)
            return Response(serializer.data)

    def post(self, request):
        character = Character.objects.create(
            name=request.data.get('name'),
            race=request.data.get('race'),
            character_class=request.data.get('charClass'),
            user=request.user,
            sprite_sheet=request.data.get('spriteSheet'),
            animations=json.dumps(request.data.get('walkAnimation'))
        )
        return Response(CharacterSerializer(character).data)

    def delete(self, request, character_id=None):
        if self.has_permissions(request.user, character_id):
            Character.objects.get(id=character_id).delete()
            return Response(status.HTTP_204_NO_CONTENT)
        else:
            return Response(status.HTTP_401_UNAUTHORIZED)

    def has_permissions(self, user: User, character_id: int) -> bool:
        return (
            Character.objects
            .filter(user_id=user.id)
            .filter(id=character_id)
            .exists()
        )
