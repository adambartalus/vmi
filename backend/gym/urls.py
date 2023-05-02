from django.urls import path
from rest_framework import routers

from .views import PadlockViewSet, GymVisitViewSet, GymPassViewSet, GymPassTypeViewSet, verify_gym_pass

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'padlocks', PadlockViewSet)
router.register(r'visits', GymVisitViewSet)
router.register(r'passes', GymPassViewSet)
router.register(r'pass-types', GymPassTypeViewSet)
urlpatterns = [
    path('verify-pass', verify_gym_pass)
]

urlpatterns += router.urls
