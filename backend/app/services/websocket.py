from enum import StrEnum

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from pydantic import BaseModel
from ..serializers import DepartureSerializer

class WebsocketEventTypes(StrEnum):
    DEPARTURE_CREATED = "update_departures"


class WebsocketService:
    def __init__(self):
        self.channel_layer = get_channel_layer()

    def send_message(self, type_event: WebsocketEventTypes, message: BaseModel):

        serializer = DepartureSerializer(message)
        json_message = serializer.data 

        async_to_sync(self.channel_layer.group_send)(
            "departures",
            {
                "type": type_event.value,
                "message": json_message,
            },
        )