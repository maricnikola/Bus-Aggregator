from app.channels import DeparturesConsumer
from django.urls import path

websocket_urlpatterns = [
    path("ws/departure/update/", DeparturesConsumer.as_asgi()),
]