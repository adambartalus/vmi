from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.auth.password_validation import MinimumLengthValidator, NumericPasswordValidator
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.relations import SlugRelatedField
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, PasswordField

from auth.models import User
from gym.serializers import GymVisitReadSerializer


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['password'].label = _('Password')
        self.fields['email'].label = _('Email address')


class RegisterSerializer(serializers.ModelSerializer):
    password = PasswordField(
        label=_('Password'),
        error_messages={
            'null': 'A jelszó megadása kötelező',
            'required': 'A jelszó megadása kötelező',
            'blank': 'Adjon meg egy jelszót!',
        },
        trim_whitespace=False
    )
    confirm_password = PasswordField(
        label=_('Password confirmation'),
        error_messages={
            'null': 'Erősítse meg a jelszót!',
            'required': 'Erősítse meg a jelszót!',
            'blank': 'Erősítse meg a jelszót!',
        },
        trim_whitespace=False
    )

    class Meta:
        model = User
        fields = ['email', 'password', 'confirm_password']
        extra_kwargs = {
            'email': {
                'error_messages': {
                    'null': 'Az e-mail cím megadása kötelező',
                    'required': 'Az e-mail cím megadása kötelező',
                    'blank': 'Az e-mail cím nem lehet üres'
                }
            },
        }

    def validate_password(self, password):
        MinimumLengthValidator().validate(password)
        NumericPasswordValidator().validate(password)
        return password

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise ValidationError(_('The two password fields didn’t match.'))
        return attrs


class UserSerializer(serializers.ModelSerializer):
    active_visit = GymVisitReadSerializer(read_only=True)
    auth_providers = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='provider'
    )

    class Meta:
        model = get_user_model()
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'is_password_set',
            'active_visit',
            'auth_providers',
            'groups',
            'last_login',
            'date_joined',
        ]


class UserReadSerializer(UserSerializer):
    groups = GroupSerializer(many=True)


class UserUpdateSerializer(UserSerializer):

    def to_representation(self, instance):
        rep = super(UserUpdateSerializer, self).to_representation(instance)
        rep['groups'] = GroupSerializer(Group.objects.filter(pk__in=rep['groups']), many=True).data
        return rep

class PasswordChangeSerializer(serializers.Serializer):
    old_password = PasswordField(
        required=True,
        trim_whitespace=False,
        error_messages={
            'required': 'Adja meg a jelenlegi jelszavát!',
            'null': 'Adja meg a jelenlegi jelszavát!',
            'blank': 'Adja meg a jelenlegi jelszavát!',
        }
    )
    new_password = PasswordField(
        required=True,
        trim_whitespace=False,
        error_messages={
            'required': 'Adja meg az új jelszót!',
            'null': 'Adja meg az új jelszót!',
            'blank': 'Adja meg az új jelszót!',
        }
    )
    confirm_new_password = PasswordField(
        required=True,
        trim_whitespace=False,
        error_messages={
            'required': 'Erősítse meg az új jelszót!',
            'null': 'Erősítse meg az új jelszót!',
            'blank': 'Erősítse meg az új jelszót!',
        }
    )

    def validate(self, data):
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError(_('The two password fields didn’t match.'))
        return data

    def validate_new_password(self, password):
        MinimumLengthValidator().validate(password)
        NumericPasswordValidator().validate(password)
        return password
