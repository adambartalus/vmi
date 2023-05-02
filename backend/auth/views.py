from django.conf import settings
from django.contrib.auth.models import Group, update_last_login
from django.utils.translation import gettext_lazy as _
from django.core.mail import send_mail
from django.template.loader import get_template
from google.auth.transport import requests
from google.oauth2 import id_token
from rest_access_policy import AccessViewSetMixin
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from auth.authentication import get_tokens_for_user
from gym_management import settings
from .models import User, UserProviders
from .policies import UserAccessPolicy, GroupAccessPolicy
from .serializers import MyTokenObtainPairSerializer, UserSerializer, RegisterSerializer, PasswordChangeSerializer, \
    GroupSerializer, UserReadSerializer, UserUpdateSerializer


# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def authenticated_user(request):
    return Response(UserReadSerializer().to_representation(request.user))


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def google_auth(request):
    response = Response()
    token = request.data.get('google_token')
    decoded_token = id_token.verify_oauth2_token(token, requests.Request(), settings.GOOGLE_CLIENT_ID)

    google_uid = decoded_token['sub']
    provider_acc = UserProviders.objects.filter(provider='google', provider_uid=str(google_uid)).first()
    if provider_acc is None:
        user = User.objects.create(
            email=decoded_token['email'],
            first_name=decoded_token['given_name'],
            last_name=decoded_token['family_name']
        )
        user.set_unusable_password()
        user.save()
        user.groups.add(Group.objects.get(name='member'))
        UserProviders(
            user=user,
            provider='google',
            provider_uid=google_uid
        ).save()
    else:
        user = provider_acc.user
    data = get_tokens_for_user(user)
    if settings.SIMPLE_JWT['UPDATE_LAST_LOGIN']:
        update_last_login(None, user)
    response.set_cookie(
        key=settings.SIMPLE_JWT['ACCESS_TOKEN_COOKIE_NAME'],
        value=data["access"],
        expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
        secure=settings.SIMPLE_JWT['ACCESS_TOKEN_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['ACCESS_TOKEN_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['ACCESS_TOKEN_COOKIE_SAMESITE']
    )
    response.set_cookie(
        key=settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_NAME'],
        value=data["refresh"],
        expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
        secure=settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_SAMESITE']
    )
    response.data = UserSerializer().to_representation(user)
    return response


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        response = Response(
            UserReadSerializer().to_representation(serializer.user)
        )
        response.set_cookie(
            key=settings.SIMPLE_JWT['ACCESS_TOKEN_COOKIE_NAME'],
            value=serializer.validated_data['access'],
            expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
            secure=settings.SIMPLE_JWT['ACCESS_TOKEN_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['ACCESS_TOKEN_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['ACCESS_TOKEN_COOKIE_SAMESITE']
        )
        response.set_cookie(
            key=settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_NAME'],
            value=serializer.validated_data['refresh'],
            expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
            max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
            secure=settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_SAMESITE']
        )
        return response


class MyTokenRefreshView(TokenRefreshView):
    def get(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT.get('REFRESH_TOKEN_COOKIE_NAME'))
        serializer = self.get_serializer(data={
            'refresh': refresh_token
        })

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])
        response = Response("Success")
        response.set_cookie(
            key=settings.SIMPLE_JWT['ACCESS_TOKEN_COOKIE_NAME'],
            value=serializer.validated_data['access'],
            expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
            secure=settings.SIMPLE_JWT['ACCESS_TOKEN_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['ACCESS_TOKEN_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['ACCESS_TOKEN_COOKIE_SAMESITE']
        )
        return response


class RegisterView(APIView):
    permission_classes = (AllowAny, )
    authentication_classes = ()
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.create(email=serializer.validated_data['email'])
        user.set_password(serializer.validated_data['password'])
        user.save()
        message = get_template('welcome.html').render({
            'name': user.get_full_name()
        })
        send_mail('Registration', None, None, [user.email], fail_silently=False, html_message=message)

        return Response(status=201)


def blacklist_token(token):
    try:
        outstanding_token = OutstandingToken.objects.get(token=token)
        blacklisted_token = BlacklistedToken(token=outstanding_token)
        blacklisted_token.save()
    except OutstandingToken.DoesNotExist:
        token = RefreshToken(token)
        token.blacklist()


class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_NAME'])
        if refresh_token is not None:
            blacklist_token(refresh_token)
        response = Response()
        response.set_cookie(
            key=settings.SIMPLE_JWT['ACCESS_TOKEN_COOKIE_NAME'],
            value='',
            samesite=settings.SIMPLE_JWT['ACCESS_TOKEN_COOKIE_SAMESITE']
        )
        return response


class GroupViewSet(ModelViewSet):
    serializer_class = GroupSerializer
    queryset = Group.objects.all()
    access_policy = GroupAccessPolicy

    def paginate_queryset(self, queryset):
        if 'page' in self.request.query_params:
            return super().paginate_queryset(queryset)
        return None


class UserViewSet(AccessViewSetMixin, ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    access_policy = UserAccessPolicy

    def paginate_queryset(self, queryset):
        if 'page' in self.request.query_params:
            return super().paginate_queryset(list(queryset))
        return None

    def get_queryset(self):
        active = self.request.query_params.get('active')
        name = self.request.query_params.get('name')
        email = self.request.query_params.get('email')
        filtered = self.queryset.all()
        if active == 'true':
            filtered = filter(lambda u: u.active_visit() is not None, filtered)
        elif active == 'false':
            filtered = filter(lambda u: u.active_visit() is None, filtered)
        if name is not None:
            filtered = filter(lambda u: name in u.get_full_name(), filtered)
        if email is not None:
            filtered = filter(lambda u: email in u.email, filtered)
        return filtered

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return UserReadSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer

class PasswordChangeView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = PasswordChangeSerializer

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)

        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if user.check_password(old_password):
                user.set_password(new_password)
                user.save()
                # TODO: log the user out?
                return Response({'detail': _('Password changed successfully.')})
            else:
                return Response({'errors': {'old_password': 'Helytelen jelszó'}}, status=400)
        else:
            return Response({'errors': serializer.errors}, status=400)
