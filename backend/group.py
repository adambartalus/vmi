import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gym_management.settings')

import django

django.setup()
from django.contrib.auth.models import Group


GROUPS = ['admin', 'recepció', 'tag']

for group in GROUPS:
    new_group, created = Group.objects.get_or_create(name=group)