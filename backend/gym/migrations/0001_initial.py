# Generated by Django 4.1.7 on 2023-02-16 12:26

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='GymPass',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('valid_from', models.DateField()),
                ('valid_to', models.DateField()),
                ('session_limit', models.PositiveSmallIntegerField()),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Padlock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=40)),
            ],
        ),
        migrations.CreateModel(
            name='GymSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.DateTimeField(auto_now_add=True)),
                ('end_time', models.DateTimeField()),
                ('gym_pass', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='gym.gympass')),
                ('padlock', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='gym.padlock')),
            ],
        ),
    ]
