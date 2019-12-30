from unittest.mock import patch, ANY

from rest_framework import status

from mmorpg.backend.models import CharacterTemplate, Character
from mmorpg.backend.tests.view_test import ViewTest
from mmorpg.backend.views import LoginView, SignupView, CharacterTemplateView, CharacterView


class LoginViewTest(ViewTest):

    @patch('mmorpg.backend.views.authenticate')
    @patch('mmorpg.backend.views.login')
    @patch('mmorpg.backend.views.TokenSerializer')
    def test_login_post(self, mock_serializer, mock_login, mock_auth):
        mock_auth.return_value = None
        self.build_view(LoginView)

        response = self.make_post_request(
            '/auth/login/',
            {'username': 'test', 'password': 'bad_password'},
        )

        mock_auth.assert_called_once_with(ANY, username='test', password='bad_password')
        mock_login.assert_not_called()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        mock_auth.return_value = 'valid_user'
        response = self.make_post_request(
            '/auth/login/',
            {'username': 'test', 'password': 'correct_password'}
        )
        mock_auth.assert_called_with(ANY, username='test', password='correct_password')
        mock_login.assert_called_once_with(ANY, 'valid_user')
        mock_serializer.assert_called_once_with('valid_user')
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)


class SignupViewTest(ViewTest):

    @patch('mmorpg.backend.views.username_exists')
    @patch('mmorpg.backend.views.create_user')
    def test_signup_post(self, mock_create, mock_exists):
        mock_exists.return_value = True
        self.build_view(SignupView)

        response = self.make_post_request(
            '/api/signup/',
            {'username': 'existing_acct', 'password': 'new_password'}
        )

        mock_exists.assert_called_once_with('existing_acct')
        self.assertEqual(response.data, 'Username already exists')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

        mock_exists.return_value = False

        response = self.make_post_request(
            '/api/signup',
            {'username': 'new_acct', 'password': 'new_password'}
        )
        mock_exists.assert_called_with('new_acct')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class CharacterTemplateViewTest(ViewTest):

    @patch('mmorpg.backend.views.character_services')
    def test_get_character_templates(self, mock_char):
        mock_char.get_all_character_templates.return_value = []
        self.build_view_and_user(CharacterTemplateView)

        response = self.make_get_request('/api/character_templates/', {})
        mock_char.get_all_character_templates.assert_called_once()
        self.assertEqual(response.data, [])
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('mmorpg.backend.views.character_services')
    def test_get_character_template_by_id(self, mock_char):
        mock_char.get_character_template_by_id.return_value = CharacterTemplate(race='elf', character_class='wizard')
        self.build_view_and_user(CharacterTemplateView)

        response = self.make_get_request('/api/character_templates/1/', {}, 1)
        mock_char.get_character_template_by_id.assert_called_once_with(1)
        self.assertEqual(response.data['race'], 'elf')
        self.assertEqual(response.data['characterClass'], 'wizard')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class CharacterViewTest(ViewTest):

    @patch('mmorpg.backend.views.character_services')
    def test_get_characters(self, mock_char):
        mock_char.get_all_characters_by_user_id.return_value = []
        self.build_view_and_user(CharacterView)

        response = self.make_get_request('/api/characters/', {})
        mock_char.get_all_characters_by_user_id.assert_called_once_with(42)
        self.assertEqual(response.data, [])
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('mmorpg.backend.views.character_services')
    def test_get_character_by_id(self, mock_char):
        mock_char.has_permissions_for_character.return_value = True
        mock_char.get_character_by_id.return_value = Character(name='Edwardo')
        self.build_view_and_user(CharacterView)

        response = self.make_get_request('/api/characters/1/', {}, 1)
        self.assertEqual(response.data['name'], 'Edwardo')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('mmorpg.backend.views.character_services')
    def test_create_character(self, mock_char):
        mock_char.character_name_exists.return_value = True
        mock_char.create_character.return_value = Character(name='new_character')
        self.build_view_and_user(CharacterView)

        response = self.make_post_request(
            '/api/characters/',
            {'name': 'existing_character', 'templateId': 1},
        )
        mock_char.character_name_exists.assert_called_once_with('existing_character')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(response.data, 'Character name already exists')

        mock_char.character_name_exists.return_value = False
        response = self.make_post_request(
            '/api/characters/',
            {'name': 'new_character', 'templateId': 1}
        )
        mock_char.character_name_exists.assert_called_with('new_character')
        mock_char.create_character.assert_called_once_with(name='new_character', template_id=1, user_id=42)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @patch('mmorpg.backend.views.character_services')
    def test_delete_character(self, mock_char):
        mock_char.has_permissions_for_character.return_value = True
        self.build_view_and_user(CharacterView)

        response = self.make_delete_request('/api/characters/1/', {}, 1)
        mock_char.has_permissions_for_character.assert_called_once_with(42, 1)
        mock_char.delete_character.assert_called_once_with(1)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
