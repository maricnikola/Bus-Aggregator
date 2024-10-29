from django.contrib.auth.models import User
from .models import Carrier, Provider, Departure, Location, BusStation, UserLocation
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from .services.user_service import UserService
from .services.email_service import EmailService
from .services.departure_service import DepartureService
from .services.user_location_service import UserLocationService


class UserSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["id", "username", "password", "password_confirm", "email", "first_name", "last_name"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
            "first_name": {"required": True},
            "last_name": {"required": True}
        }

    def validate(self, data):
        password = data.get("password")
        password_confirm = data.pop("password_confirm", None)  

        if password != password_confirm:
            raise serializers.ValidationError("passwords do not match")
        
        return data
    
    def create(self, validated_data):
        user = UserService.create_user(validated_data)
        
        request = self.context.get('request')  
        to_email = validated_data.get('email')
        EmailService.send_activation_email(request, user, to_email)

        return user
    
class CarrierSerializerForDeparture(serializers.ModelSerializer):
     class Meta:
        model = Carrier
        fields = ('id','name')

class ProviderSerializerForDeparture(serializers.ModelSerializer):
     class Meta:
        model = Provider
        fields = ('id','name')

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('name', 'country')

class BusStationSerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    class Meta:
        model = BusStation
        fields = '__all__'

class DepartureSerializer(serializers.ModelSerializer):
    carrier = CarrierSerializerForDeparture()
    provider = ProviderSerializerForDeparture()
    start_station = BusStationSerializer()
    end_station = BusStationSerializer()
    class Meta:
        model = Departure
        fields = '__all__'

    def create(self, data):
        DepartureService.create_departure(data)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        if not user.is_active:
            raise AuthenticationFailed('User account is disabled')

        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email

        return token
    

class CarrierSerializer(serializers.ModelSerializer):
    headquarters = LocationSerializer()
    class Meta:
        model = Carrier
        fields = '__all__'

class ProviderSerializer(serializers.ModelSerializer):
    headquarters = LocationSerializer()
    class Meta:
        model = Provider
        fields = '__all__'

class UserLocationSerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    user_id = serializers.IntegerField(write_only=True)  

    class Meta:
        model = UserLocation
        fields = ['user_id', 'location']  

    def create(self, validated_data):
        user_location = UserLocationService.create_user(validated_data)

        return user_location

class SearchDeparturesSerializer(serializers.Serializer):
    departure_date = serializers.DateField(format="%Y-%m-%d", required=True)
    start_station = serializers.CharField(max_length=255, required=True)
    end_station = serializers.CharField(max_length=255, required=True)
    passenger_count = serializers.IntegerField(min_value=1, required=True)
    carrier = serializers.CharField(max_length=255, required=False)
    time_from = serializers.TimeField(format="%H:%M", required=False)
    time_to = serializers.TimeField(format="%H:%M", required=False)
    duration_from = serializers.IntegerField(required=False)
    duration_to = serializers.IntegerField(required=False)
    apply_filters = serializers.BooleanField(required=False, default=False)

