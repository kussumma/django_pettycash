from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from . import consumers
from django.core.asgi import get_asgi_application

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter([
        path("notifications/", consumers.NotificationConsumer.as_asgi()),
    ]),
})
