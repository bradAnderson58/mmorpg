
from django.urls import path, include
from rest_framework import routers

from mmorpg.backend import views
from mmorpg.backend.views import LoginView

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', LoginView.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
