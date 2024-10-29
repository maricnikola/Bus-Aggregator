from django.db import models
from django.contrib.auth.models import User

class Location(models.Model):
    name = models.CharField(max_length=255)  
    country = models.CharField(max_length=255)  

    def __str__(self):
        return f"{self.name}, {self.country}"

class UserLocation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='location')
    
    def __str__(self):
        return f"{self.user.username} - {self.location.name}"
    
class Carrier(models.Model):
    name = models.CharField(max_length=255) 
    headquarters = models.ForeignKey(Location, on_delete=models.CASCADE)   
    phone = models.CharField(max_length=20)  
    contact_person = models.CharField(max_length=255)  
    email = models.EmailField()  
    logo = models.ImageField(upload_to='logos/', null=True, blank=True)

    def __str__(self):
        return self.name

class Provider(models.Model):
    name = models.CharField(max_length=255)  
    headquarters = models.ForeignKey(Location, on_delete=models.CASCADE)  
    phone = models.CharField(max_length=20)  
    contact_person = models.CharField(max_length=255)  
    email = models.EmailField()  
    website = models.URLField()  

    def __str__(self):
        return self.name

class BusStation(models.Model):
    name = models.CharField(max_length=255)  
    location = models.ForeignKey(Location, on_delete=models.CASCADE)  
    latitude = models.DecimalField(max_digits=9, decimal_places=6)  
    longitude = models.DecimalField(max_digits=9, decimal_places=6)  

    def __str__(self):
        return f"{self.name} - {self.location}"


class Departure(models.Model):
    carrier = models.ForeignKey('Carrier', on_delete=models.CASCADE,  null=True, blank=True) 
    provider = models.ForeignKey('Provider', on_delete=models.CASCADE,  null=True, blank=True)
    start_station = models.ForeignKey('BusStation', on_delete=models.CASCADE, related_name='start_station')  
    end_station = models.ForeignKey('BusStation', on_delete=models.CASCADE, related_name='end_station')  
    departure_datetime = models.DateTimeField()  
    arrival_datetime = models.DateTimeField()  
    total_seats = models.PositiveIntegerField()  
    available_seats = models.PositiveIntegerField()  
    provider_website = models.URLField()  
    price = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.carrier.name} - {self.start_station.name} to {self.end_station.name} on {self.departure_datetime}"

