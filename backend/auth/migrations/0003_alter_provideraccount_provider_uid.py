# Generated by Django 4.1.7 on 2023-03-09 17:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_auth', '0002_provideraccount'),
    ]

    operations = [
        migrations.AlterField(
            model_name='provideraccount',
            name='provider_uid',
            field=models.TextField(),
        ),
    ]
