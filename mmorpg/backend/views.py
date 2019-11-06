from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User, Group
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.settings import api_settings
from rest_framework.viewsets import ModelViewSet

from mmorpg.backend.models import Character
from mmorpg.backend.serializers import UserSerializer, GroupSerializer, TokenSerializer, CharacterSerializer

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


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
            serializer = TokenSerializer(data={
                "token": jwt_encode_handler(
                    jwt_payload_handler(user)
                )
            })
            serializer.is_valid()
            return Response(serializer.data)
        return Response(status=status.HTTP_401_UNAUTHORIZED)


class CharacterView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, character_id=None):
        if character_id is not None:
            has_permissions = (
                Character.objects
                .filter(user_id=request.user.id)
                .filter(id=character_id)
                .exists()
            )
            if not has_permissions:
                return Response(status.HTTP_401_UNAUTHORIZED)

            character = Character.objects.get(id=character_id)
            serializer = CharacterSerializer(character)
            return Response(serializer.data)

        else:
            characters = Character.objects.filter(user_id=request.user.id)
            serializer = CharacterSerializer(characters, many=True)
            return Response(serializer.data)

    def post(self, request):
        character = Character.objects.create(
            name=request.data.get('name'),
            race=request.data.get('race'),
            character_class=request.data.get('characterClass'),
            user=request.user
        )
        return Response(CharacterSerializer(character).data)
