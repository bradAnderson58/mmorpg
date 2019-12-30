from unittest.mock import patch, ANY

from rest_framework import status

from mmorpg.backend.tests.view_test import ViewTest
from mmorpg.backend.views import LoginView


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
    pass
