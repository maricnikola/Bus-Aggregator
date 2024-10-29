from django.contrib.auth.models import User
from ..models import Location, UserLocation


class UserLocationService:
    @staticmethod
    def create_user(validated_data):
        user_id = validated_data.pop('user_id')  
        user = User.objects.get(id=user_id)  
        
        location_data = validated_data.pop('location')  
        location, created = Location.objects.get_or_create(**location_data)

        user_location = UserLocation.objects.create(user=user, location=location, **validated_data)

        return user_location