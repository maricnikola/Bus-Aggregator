from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer


class DeparturesConsumer(JsonWebsocketConsumer):
    def update_departures(self, event):
        message = event["message"]
        self.send_json(message)

    def connect(self):
        super().connect()
        async_to_sync(self.channel_layer.group_add)(
            "departures",
            self.channel_name 
        )

    def disconnect(self, close_code):
        self.channel_layer.group_discard(
            "departures",
            self.channel_name
        )
