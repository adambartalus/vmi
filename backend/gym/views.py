from django.utils.translation import gettext_lazy as _
from rest_access_policy import AccessViewSetMixin
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Padlock, GymVisit, GymPass, GymPassType
from .policies import PadlockAccessPolicy, GymPassAccessPolicy, GymVisitAccessPolicy
from .serializers import PadlockSerializer, GymPassSerializer, GymVisitSerializer, GymVisitReadSerializer, \
    GymVisitUpdateSerializer, GymVisitCreateSerializer, GymPassReadSerializer, GymPassTypeSerializer


# Create your views here.

@api_view(['POST'])
def verify_gym_pass(request):
    qr_code = request.data.get('qr_code')
    gym_pass = GymPass.objects.get(token=qr_code)
    if gym_pass is None:
        return Response(False)
    return Response(GymPassSerializer().to_representation(gym_pass))


class GymPassTypeViewSet(ModelViewSet):
    serializer_class = GymPassTypeSerializer
    queryset = GymPassType.objects.all()

    def get_queryset(self):
        sort = self.request.query_params.get('sort')
        if sort is not None:
            [order_by, order] = sort.split(',')
            if order == 'desc':
                order_by = '-' + order_by
            return self.queryset.order_by(order_by)
        return self.queryset.all()

    def paginate_queryset(self, queryset):
        if 'page' in self.request.query_params:
            return super().paginate_queryset(queryset)
        return None


class PadlockViewSet(AccessViewSetMixin, ModelViewSet):
    queryset = Padlock.objects.all()
    serializer_class = PadlockSerializer
    access_policy = PadlockAccessPolicy

    def paginate_queryset(self, queryset):
        if 'page' in self.request.query_params:
            return super().paginate_queryset(list(queryset))
        return None

    def get_queryset(self):
        available = self.request.query_params.get('available')
        padlock_id = self.request.query_params.get('padlock_id')
        text = self.request.query_params.get('text')
        filtered = self.queryset.all()
        if available == 'true':
            filtered = filter(lambda p: p.available(), self.queryset)
        elif available == 'false':
            filtered = filter(lambda p: not p.available(), self.queryset)
        if padlock_id is not None:
            filtered = filter(lambda p: padlock_id in p.padlock_id, filtered)
        if text is not None:
            filtered = filter(lambda p: text in p.text, filtered)
        return filtered


class GymVisitViewSet(AccessViewSetMixin, ModelViewSet):
    queryset = GymVisit.objects.all()
    access_policy = GymVisitAccessPolicy

    def get_queryset(self):
        return self.access_policy.scope_queryset(
            self.request, self.queryset.all()
        )

    def paginate_queryset(self, queryset):
        if 'page' in self.request.query_params:
            return super().paginate_queryset(queryset)
        return None

    def get_serializer_class(self):
        # Define your HTTP method-to-serializer mapping freely.
        # This also works with CoreAPI and Swagger documentation,
        # which produces clean and readable API documentation,
        # so I have chosen to believe this is the way the
        # Django REST Framework author intended things to work:
        if self.action in ['list', 'retrieve']:
            # Since the ReadSerializer does nested lookups
            # in multiple tables, only use it when necessary
            return GymVisitReadSerializer
        elif self.action == 'create':
            return GymVisitCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return GymVisitUpdateSerializer
        return GymVisitSerializer


class GymPassViewSet(AccessViewSetMixin, ModelViewSet):
    queryset = GymPass.objects.all()
    access_policy = GymPassAccessPolicy
    pagination_class = None

    def get_queryset(self):
        base_qs = self.access_policy.scope_queryset(
            self.request, self.queryset
        )
        valid = self.request.query_params.get('valid')
        if valid == 'true':
            return list(filter(lambda gpass: gpass.is_valid(), base_qs))
        elif valid == 'false':
            return list(filter(lambda gpass: not gpass.is_valid(), base_qs))
        return base_qs

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            # Since the ReadSerializer does nested lookups
            # in multiple tables, only use it when necessary
            return GymPassReadSerializer
        return GymPassSerializer

    def get_view_name(self):
        return _(super().get_view_name())
