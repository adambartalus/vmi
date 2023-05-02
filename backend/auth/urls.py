from django.urls import path
from rest_framework import routers

from .views import MyTokenObtainPairView, UserViewSet, RegisterView, google_auth, authenticated_user, \
    MyTokenRefreshView, \
    PasswordChangeView, LogoutView, GroupViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', MyTokenObtainPairView.as_view()),
    path('logout', LogoutView.as_view()),

    path('google-auth', google_auth),
    path('refresh', MyTokenRefreshView.as_view()),
    path('change-password', PasswordChangeView.as_view()),
    path('user', authenticated_user)
]
