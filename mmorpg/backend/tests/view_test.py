from typing import Type, Dict

from django.contrib.auth.models import User
from django.test import SimpleTestCase
from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework.views import APIView


class ViewTest(SimpleTestCase):
    user = None
    factory = None

    def build_view(self, view_type: Type[APIView]):
        self.factory = APIRequestFactory()
        self.view = view_type.as_view()

    def build_view_and_user(self, view_type: Type[APIView]):
        self.build_view(view_type)
        self.user = User(id=42, username='test')
        self.user.email = 'test@test.com'

    def make_post_request(self, url: str, params: Dict[str, any], url_id: int = None, data_format: str = 'json'):
        self.check_factory()

        request = self.factory.post(url, params, format=data_format)
        if self.user:
            force_authenticate(request, user=self.user)

        if url_id is not None:
            return self.view(request, url_id)
        return self.view(request)

    def make_get_request(self, url: str, params: Dict[str, any], url_id: int = None):
        self.check_factory()

        request = self.factory.get(url, params)
        force_authenticate(request, user=self.user)
        if url_id is not None:
            return self.view(request, url_id)
        else:
            return self.view(request)

    def make_delete_request(self, url: str, params: Dict[str, any], url_id: int, data_format: str = 'json'):
        self.check_factory()

        request = self.factory.delete(url, params, format=data_format)
        force_authenticate(request, user=self.user)
        return self.view(request, url_id)

    def check_factory(self):
        if self.factory is None:
            raise TestException('must "build_view" before making requests')


class TestException(Exception):
    pass
