import json

from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User, Group
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from mmorpg.backend.models import Character, CharacterTemplate
from mmorpg.backend.serializers import UserSerializer, GroupSerializer, TokenSerializer, CharacterSerializer, \
    CharacterTemplateSerializer
from mmorpg.backend.services import character_services
from mmorpg.backend.services.user_services import username_exists, create_user


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
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(status=status.HTTP_401_UNAUTHORIZED)


class SignupView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        name_exists = username_exists(request.data['username'])
        if name_exists:
            response = Response(status=status.HTTP_409_CONFLICT, data='Username already exists')
        else:
            user = create_user(request.data['username'], request.data['password'])
            response = Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

        return response


class CharacterTemplateView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, template_id=None):
        if template_id is not None:
            template = character_services.get_character_template_by_id(template_id)
            serializer = CharacterTemplateSerializer(template)
            return Response(serializer.data)
        else:
            templates = character_services.get_all_character_templates()
            serializer = CharacterTemplateSerializer(templates, many=True)
            return Response(serializer.data)

    def post(self, request):
        if request.user.username == 'admin':
            template = CharacterTemplate.objects.create(
                race=request.data.get('race'),
                character_class=request.data.get('charClass'),
                sprite_sheet=request.data.get('spriteSheet'),
                animations=json.loads(request.data.get('animations'))
            )
            return Response(CharacterTemplateSerializer(template).data)
        else:
            return Response(status.HTTP_401_UNAUTHORIZED)


class CharacterView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, character_id=None):
        if character_id is not None:
            if character_services.has_permissions_for_character(request.user.id, character_id):
                character = character_services.get_character_by_id(character_id)
                serializer = CharacterSerializer(character)
                return Response(serializer.data)
            else:
                return Response(status.HTTP_401_UNAUTHORIZED)
        else:
            characters = character_services.get_all_characters_by_user_id(request.user.id)
            serializer = CharacterSerializer(characters, many=True)
            return Response(serializer.data)

    def post(self, request):
        if character_services.character_name_exists(request.data.get('name')):
            response = Response(status=status.HTTP_409_CONFLICT, data='Character name already exists')
        else:
            character = character_services.create_character(
                name=request.data.get('name'),
                template_id=request.data.get('templateId'),
                user_id=request.user.id,
            )
            response = Response(CharacterSerializer(character).data, status=status.HTTP_201_CREATED)
        return response

    def delete(self, request, character_id=None):
        if character_services.has_permissions_for_character(request.user.id, character_id):
            character_services.delete_character(character_id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
