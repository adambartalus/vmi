import secrets
from datetime import date

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


# Create your models here.


class GymPassType(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(null=True)
    valid_for = models.DurationField(null=True)
    visit_limit = models.PositiveSmallIntegerField(null=True)
    price = models.PositiveIntegerField()
    purchasable = models.BooleanField(default=True)

    class Meta:
        unique_together = ('name', 'price',)

    def __str__(self):
        return f'{self.name} ({self.price} Ft)'


class GymPass(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name=_('User'),
        related_name='gym_passes'
    )
    gym_pass_type = models.ForeignKey(GymPassType, on_delete=models.PROTECT)
    valid_from = models.DateField(verbose_name=_('Valid from'))
    valid_to = models.DateField(verbose_name=_('Valid to'))
    token = models.CharField(max_length=32, unique=True)

    def save(self, *args, **kwargs):
        if not self.id and not self.valid_to:
            self.valid_to = self.valid_from + self.gym_pass_type.valid_for
            self.token = secrets.token_hex(16)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.owner} - {self.gym_pass_type.name}'

    def active_visit(self):
        return self.visits.filter(check_out_time__isnull=True).first()

    def uses_left(self):
        if self.gym_pass_type.visit_limit is None:
            return -1
        return self.gym_pass_type.visit_limit - self.visits.count()

    def is_valid(self):
        today = date.today()
        return self.valid_from <= today and (not self.valid_to or self.valid_to >= today)

    def is_usable(self):
        return self.is_valid() and (self.uses_left() == -1 or self.uses_left() > 0)


class Padlock(models.Model):
    padlock_id = models.TextField()
    text = models.CharField(max_length=40, null=True)

    def __str__(self):
        return f'(#{self.padlock_id}) {self.text}'

    def available(self):
        return self.visits.filter(check_out_time__isnull=True).first() is None

    def active_visit(self):
        return self.visits.filter(check_out_time__isnull=True).first()

    def used_by(self):
        visit = self.active_visit()
        if not visit:
            return None
        return visit.user.email


class GymVisit(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='visits')
    padlock = models.ForeignKey(Padlock, on_delete=models.CASCADE, related_name='visits')
    gym_pass = models.ForeignKey(GymPass, on_delete=models.CASCADE, related_name='visits')
    check_in_time = models.DateTimeField()
    check_out_time = models.DateTimeField(null=True)
