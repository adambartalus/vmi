from django.core.management import BaseCommand

from gym.models import Padlock
from faker import Faker
fake = Faker()


def run_seed():
    for i in range(200):
        Padlock.objects.create(
            padlock_id=fake.unique.random_int(),
            text=fake.text(max_nb_chars=50)
        )


class Command(BaseCommand):
    help = "seed database for testing and development."

    def handle(self, *args, **options):
        self.stdout.write('seeding data...')
        run_seed()
        self.stdout.write('done.')
