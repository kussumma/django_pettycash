import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

        if not self.channel_layer:
            print("self.channel_layer is None")

        await self.channel_layer.group_add("notifications", self.channel_name)
        print("Connected", self.channel_name)
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("notifications", self.channel_name)
        print("Disconnected", self.channel_name)
    
    async def notify(self, event):
        notification_count = event.get('notification_count', 0)
        event['notification_count'] = notification_count + 1
        await self.send(text_data=json.dumps(event))
