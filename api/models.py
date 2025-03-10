from django.db import models
import string
import random
import uuid


def generate_unique_code():
    while True:
        code = uuid.uuid4()
        if Room.objects.filter(code=code).count() == 0:
            break
    return str(code)


# Create your models here.
class Room(models.Model):
    code = models.CharField(max_length=36, unique=True, default=generate_unique_code)
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    current_song = models.CharField(max_length=50, null=True)
