from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from django.conf import settings


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class CookieBasedJWTAuthentication(JWTAuthentication):

    def authenticate(self, request):
        raw_token = request.COOKIES.get(settings.SIMPLE_JWT.get('ACCESS_TOKEN_COOKIE_NAME'))
        if raw_token is None:
            return None
        validated_token = self.get_validated_token(raw_token)
        user = self.get_user(validated_token)

        return user, validated_token

    def authenticate_header(self, request):
        return f"Cookie {settings.SIMPLE_JWT['ACCESS_TOKEN_COOKIE_NAME']}"

