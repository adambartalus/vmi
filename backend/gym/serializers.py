from django.contrib.auth import get_user_model
from django.utils.duration import duration_iso_string
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Padlock, GymVisit, GymPass, GymPassType


class IsoDurationField(serializers.DurationField):
    default_error_messages = serializers.DurationField.default_error_messages
    default_error_messages['invalid'] = _('Duration has wrong format. Use one of these formats instead: {format}.') + \
                                        ' Az ISO 8601 formátum is használható'

    def to_representation(self, value):
        return duration_iso_string(value)


class GymPassTypeSerializer(serializers.ModelSerializer):
    valid_for = IsoDurationField(default=None, allow_null=True)

    class Meta:
        model = GymPassType
        fields = ['id', 'name', 'description', 'valid_for', 'visit_limit', 'price', 'purchasable']
        extra_kwargs = {
            'name': {
                'error_messages': {
                    'required': 'A név megadása kötelező',
                    'null': 'A név megadása kötelező',
                }
            },
            'price': {
                'error_messages': {
                    'required': 'A név megadása kötelező',
                    'null': 'Az ár megadása kötelező',
                }
            }
        }

    def validate_price(self, price):
        if price and price <= 0:
            raise ValidationError('Az árnak pozitív számnak kell lennie')
        return price

    def validate_visit_limit(self, limit):
        if limit and limit <= 0:
            raise ValidationError('Az alkalom korlátnak pozitív számnak kell lennie')
        return limit

class GymVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = GymVisit
        fields = ['id', 'user', 'padlock', 'gym_pass', 'check_in_time', 'check_out_time']

    def validate_padlock(self, padlock):
        visit = padlock.active_visit()
        if visit is not None and visit != self.instance:
            raise serializers.ValidationError('A lakat használatban van')
        return padlock

    def validate_user(self, user):
        visit = user.active_visit()
        if visit is not None and visit != self.instance:
            raise serializers.ValidationError('A felhasználó már becsekkolt')
        return user

    def validate(self, attrs):
        end = attrs.get('check_out_time')
        if end is None and self.instance:
            end = self.instance.check_out_time
        start = attrs.get('check_in_time') or self.instance.check_in_time
        if start and end and end < start:
            raise serializers.ValidationError('A kilépés ideje nem lehet előbb, mint a belépés ideje')
        return attrs


class GymPassNestedGymVisitSerializer(GymVisitSerializer):
    class Meta(GymVisitSerializer.Meta):
        fields = None
        exclude = ['gym_pass']


class GymPassNestedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['email', 'first_name', 'last_name', 'id']


class GymPassSerializer(serializers.ModelSerializer):
    valid_to = serializers.DateField(allow_null=True, required=False)

    class Meta:
        model = GymPass
        fields = ['id', 'valid_from', 'valid_to', 'is_valid', 'owner', 'gym_pass_type', 'uses_left', 'token']
        read_only_fields = ['token']
        extra_kwargs = {
            'owner': {
                'error_messages': {
                    'required': 'Válassza ki a felhasználót!',
                    'null': 'Válassza ki a felhasználót!'
                }
            },
            'gym_pass_type': {
                'error_messages': {
                    'required': 'Válassza ki a jegytípust!',
                    'null': 'Válassza ki a jegytípust!',
                }
            }
        }

    def validate(self, attrs):
        valid_from = attrs.get('valid_from') if attrs.get('valid_from') else self.instance.valid_from
        valid_to = attrs.get('valid_to') if attrs.get('valid_to') else self.instance.valid_to
        if valid_from and valid_to and valid_to < valid_from:
            raise ValidationError({'valid_to': _('Valid to date/time cannot be earlier than valid from date/time.')})

        return attrs

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['owner'] = GymPassNestedUserSerializer().to_representation(get_user_model().objects.get(pk=ret['owner']))
        return ret


class GymPassReadSerializer(GymPassSerializer):
    gym_pass_type = GymPassTypeSerializer(read_only=True)


class GymVisitNestedPassSerializer(GymPassSerializer):
    class Meta(GymPassSerializer.Meta):
        fields = ['id', 'valid_from', 'owner', 'gym_pass_type', 'uses_left']


class PadlockNestedGymVisitSerializer(serializers.ModelSerializer):
    gym_pass = GymVisitNestedPassSerializer(read_only=True)

    class Meta:
        model = GymVisit
        exclude = ['padlock']
        ordering = ['check_out_time']


class PadlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Padlock
        fields = ['id', 'padlock_id', 'text', 'used_by']
        extra_kwargs = {
            'padlock_id': {
                'error_messages': {
                    'null': 'Az azonosító megadása kötelező',
                    'required': 'Az azonosító megadása kötelező',
                    'blank': 'Az azonosító megadása kötelező'
                }
            },
        }


class GymVisitNestedPadlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Padlock
        fields = '__all__'

    def validate_gym_pass(self, value):
        if not value.is_valid() and (self.instance is None or value != self.instance.gym_pass):
            raise serializers.ValidationError('The pass is not valid')
        return value


class GymVisitCreateSerializer(GymVisitSerializer):
    class Meta(GymVisitSerializer.Meta):
        read_only_fields = ['check_out_time']


class GymVisitReadSerializer(GymVisitSerializer):
    padlock = GymVisitNestedPadlockSerializer()
    gym_pass = GymVisitNestedPassSerializer()
    user = GymPassNestedUserSerializer()


class GymVisitUpdateSerializer(GymVisitSerializer):
    padlock = GymVisitNestedPadlockSerializer(read_only=True)

    class Meta(GymVisitSerializer.Meta):
        read_only_fields = ['check_in_time', 'gym_pass']
