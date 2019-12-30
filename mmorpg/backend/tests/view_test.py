from typing import Type, Dict

from django.contrib.auth.models import User
from django.test import SimpleTestCase
from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework.views import APIView


class ViewTest(SimpleTestCase):
    def build_view(self, view_type: Type[APIView]):
        self.factory = APIRequestFactory()
        self.view = view_type.as_view()
        self.user = None

    def build_view_and_user(self, view_type: Type[APIView]):
        self.build_view(view_type)
        self.user = User.objects.create(username='test')
        self.user.email = 'test@test.com'

    def make_post_request(self, url: str, params: Dict[str, any], url_id: int = None, data_format: str = 'json'):
        if self.factory is None:
            raise TestException('must "build_view_and_user" before making requests')

        request = self.factory.post(url, params, format=data_format)
        if self.user:
            force_authenticate(request, user=self.user)

        if url_id is not None:
            return self.view(request, url_id)
        return self.view(request)


class TestException(Exception):
    pass
