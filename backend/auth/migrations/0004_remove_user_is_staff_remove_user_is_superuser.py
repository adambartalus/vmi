# Generated by Django 4.1.7 on 2023-03-19 16:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('my_auth', '0003_alter_provideraccount_provider_uid'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='is_staff',
        ),
        migrations.RemoveField(
            model_name='user',
            name='is_superuser',
        ),
    ]
