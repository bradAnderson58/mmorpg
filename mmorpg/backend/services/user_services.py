from django.contrib.auth.models import User


def username_exists(name: str) -> bool:
    return User.objects.filter(username=name).exists()


def create_user(name: str, password: str) -> User:
    return User.objects.create_user(
        username=name,
        password=password,
    )
