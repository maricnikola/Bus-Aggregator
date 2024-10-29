from ..models import Departure
from django.core.exceptions import ValidationError
from django.db import transaction

class DepartureService:

    @staticmethod
    def create_departure(data):
        departure = Departure(
            carrier = data['carrier'],
            provider = data['provider'],
            start_station = data['start_station'],
            end_station = data['end_station'],
            departure_datetime = data['departure_datetime'],
            arrival_datetime = data['arrival_datetime'],
            total_seats = data['available_seats'],
            available_seats = data['total_seats'],
            provider_website = data['provider_website']
        )
        try:
            departure.save()

        
        except Exception as e:
            raise ValidationError(f"User creation failed: {str(e)}")
