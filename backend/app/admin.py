from django.contrib import admin
from .models import Carrier, Provider, Location, BusStation, Departure, UserLocation
from django import forms

# Register your models here.

@admin.register(Carrier)
class CarrierAdmin(admin.ModelAdmin):
    list_display = ('name', 'headquarters', 'phone', 'contact_person', 'email', 'logo')
    search_fields = ('name', 'email', 'logo')

@admin.register(Provider)
class ProviderAdmin(admin.ModelAdmin):
    list_display = ('name', 'headquarters', 'phone', 'contact_person', 'email', 'website')
    search_fields = ('name', 'email', 'website')

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'country')
    search_fields = ('name', 'country')

@admin.register(UserLocation)
class UserLocationAdmin(admin.ModelAdmin):
    list_display = ('user', 'location')
    search_fields = ('user', 'location')

class BusStationAdminForm(forms.ModelForm):
    class Meta:
        model = BusStation
        fields = '__all__'

    class Media:
        js = (
            'https://maps.googleapis.com/maps/api/js?key=AIzaSyBDPmV3s1MvOKVt1paSvrYhwlPmNloAOwE',
            'busstations/js/map.js',
        )

@admin.register(BusStation)
class BusStationAdmin(admin.ModelAdmin):
    form = BusStationAdminForm
    list_display = ('name', 'location', 'latitude', 'longitude')
    search_fields = ('name', 'location__name')
    change_form_template = 'admin/bus_station.html'

@admin.register(Departure)
class DepartureAdmin(admin.ModelAdmin):
    list_display = ('carrier', 'start_station', 'end_station', 'departure_datetime', 'arrival_datetime', 'total_seats', 'available_seats', 'provider_website')
    search_fields = ('carrier__name', 'start_station__name', 'end_station__name', 'provider_website')
    list_filter = ('departure_datetime', 'arrival_datetime', 'carrier', 'start_station', 'end_station')
