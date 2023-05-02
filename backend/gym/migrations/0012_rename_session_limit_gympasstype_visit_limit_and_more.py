# Generated by Django 4.1.7 on 2023-04-08 12:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('gym', '0011_gymvisit_padlock_number_delete_gymsession_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='gympasstype',
            old_name='session_limit',
            new_name='visit_limit',
        ),
        migrations.RenameField(
            model_name='padlock',
            old_name='number',
            new_name='padlock_id',
        ),
        migrations.AlterField(
            model_name='gymvisit',
            name='gym_pass',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='visits', to='gym.gympass'),
        ),
        migrations.AlterField(
            model_name='gymvisit',
            name='padlock',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='visits', to='gym.padlock'),
        ),
        migrations.AlterField(
            model_name='gymvisit',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='visits', to=settings.AUTH_USER_MODEL),
        ),
    ]
