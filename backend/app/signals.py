
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Departure
from .services.websocket import WebsocketService, WebsocketEventTypes

@receiver(post_save, sender=Departure)
def departure_created(sender, instance, created, **kwargs):
    if created:
        websocket_service = WebsocketService()

        websocket_service.send_message(
            type_event=WebsocketEventTypes.DEPARTURE_CREATED, 
            message=instance
        )
