from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _


# Create your models here.


class UserManager(BaseUserManager):

    def create_user(self, email, password=None):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            email,
            password=password,
        )
        user.groups.add('admin')
        user.save(using=self._db)
        return user


class User(AbstractUser):
    username = None
    is_staff = None
    is_superuser = None
    email = models.EmailField(_('email address'), unique=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        if not self.id and not self.password:
            self.set_unusable_password()
        super().save(*args, **kwargs)

    def is_admin(self):
        return self.groups.filter(name__exact='admin').exists()

    def is_password_set(self):
        return self.has_usable_password()

    def active_visit(self):
        return self.visits.filter(check_out_time__isnull=True).first()

    def valid_passes(self):
        return filter(lambda g_pass: g_pass.is_valid(), self.gym_passes.all())

    def invalid_passes(self):
        return filter(lambda g_pass: not g_pass.is_valid(), self.gym_passes.all())


class UserProviders(models.Model):
    GOOGLE = 'google'
    PROVIDER_CHOICES = [
        (GOOGLE, 'google'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='auth_providers')
    provider = models.TextField(choices=PROVIDER_CHOICES)
    provider_uid = models.TextField()
