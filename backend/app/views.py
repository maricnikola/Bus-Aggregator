from rest_framework import viewsets
from .serializers import DepartureSerializer
from datetime import datetime, timedelta
from django.utils.dateparse import parse_datetime
from django.db.models import F, ExpressionWrapper, DurationField
from django.utils.translation import gettext as _
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer, CarrierSerializer, ProviderSerializer, BusStationSerializer, UserLocationSerializer, LocationSerializer
from .models import Carrier, Provider, Departure, BusStation, Location, UserLocation
from .tokens import account_activation_token
from django.template.loader import render_to_string
from rest_framework.permissions import AllowAny
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_str
from django.http import HttpResponse
from rest_framework.views import APIView
from django.contrib.auth import login, logout, authenticate, get_user_model
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from rest_framework import permissions
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination
from .serializers import SearchDeparturesSerializer

"""def index(request):
    greeting = _("Hello, welcome to our site!")
    return render(request, "index.html" , {"greeting": greeting})
    # return HttpResponse("hello world")"""

def index(request):
    html = render_to_string("index.html", {})
    return HttpResponse(html)

class SearchDeparturesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        serializer = SearchDeparturesSerializer(data=request.GET)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        departures = Departure.objects.all()

        # Pretražuj prema inicijalnim uslovima
        if validated_data.get('departure_date'):
            departure_date = validated_data['departure_date']
            departures = departures.filter(departure_datetime__date=departure_date)
       
        if validated_data.get('start_station'):
            start_station = validated_data['start_station']
            departures = departures.filter(start_station__name__icontains=start_station)

        if validated_data.get('end_station'):
            end_station = validated_data['end_station']
            departures = departures.filter(end_station__name__icontains=end_station)

        if validated_data.get('passenger_count'):
            passenger_count = validated_data['passenger_count']
            departures = departures.filter(available_seats__gte=passenger_count)

        # Filtriraj samo ako je to zatraženo
        if validated_data.get('apply_filters'):
            if validated_data.get('carrier'):
                carrier = validated_data['carrier']
                departures = departures.filter(carrier__name__icontains=carrier)

            if validated_data.get('time_from') and validated_data.get('time_to'):
                time_from = validated_data['time_from']
                time_to = validated_data['time_to']
                departures = departures.filter(
                    departure_datetime__time__gte=time_from,
                    departure_datetime__time__lte=time_to
                )

            if validated_data.get('duration_from') and validated_data.get('duration_to'):
                duration_from = validated_data['duration_from']
                duration_to = validated_data['duration_to']
                departures = departures.annotate(
                    duration=ExpressionWrapper(
                        F('arrival_datetime') - F('departure_datetime'),
                        output_field=DurationField()
                    )
                ).filter(
                    duration__gte=timedelta(hours=duration_from),
                    duration__lte=timedelta(hours=duration_to)
                )

        serializer = DepartureSerializer(departures, many=True)
        return Response(serializer.data)

class ActivateMail(APIView):
    permission_classes = [AllowAny]
    def get(self, request, uidb64, token):
        User = get_user_model()
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except:
            User = None
        
        if User is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            html_page = render_to_string("confirmation_page.html",{
                "text": "Now you can login your account."
            })
            return HttpResponse(html_page)

        else:
            html_page = render_to_string("confirmation_page.html",{
                "text": "Activation link is invalid"
            })
            return HttpResponse(html_page)

@method_decorator(csrf_protect, name= 'dispatch')
class CheckAuthenticatedView(APIView):
    def get(self, request, format= None):
        try:
            isAuthenticated = User.is_authenticated

            if isAuthenticated:
                return JsonResponse({'message': 'success'})
            else: 
                return JsonResponse({'message': 'error'})
        except:
            return JsonResponse({'message': 'Error when checking authentication status'})

#Register view with session auth and csrf 
@method_decorator(csrf_protect, name= 'dispatch')
class RegisterView(APIView):
    permission_classes = (permissions.AllowAny, )
    
    def post(self, request, format= None):
        data = self.request.data
        username = data['username']
    
        password = data['password']
        password_confirm = data['password_confirm']

        email = data['email']

        if password != password_confirm:
            return JsonResponse({'message': "error password do not match"})

        if len(password) < 6: 
            return JsonResponse({"message": "error password must be at least 6 characters"})
        try:
            if User.objects.filter(username=username).exists():
                return JsonResponse({'message': 'error username already exists'})
            
            user = User.objects.create_user(username=username, password=password, email=email)
            user.is_active = False

            user.save()
            self.send_activation_email(request, user, user.email)

            return JsonResponse({"message": 'user created successfully'})
        
        except Exception as e:
            return JsonResponse({'message':'error when registering account ' + str(e)})
        
    def send_activation_email(self, request, user, to_email):
        mail_subject = "Activate your user account"
        message = render_to_string("email_activation.html",{
            'user':user.username,
            'domain': get_current_site(request).domain,
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': account_activation_token.make_token(user),
            'protocol': 'http'
        })
        email = EmailMessage(mail_subject, message, to=[to_email])
        email.content_subtype = "html"
        email.send()
            
@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )
    
    def get(self, request, format= None):
        return JsonResponse({'message': 'CSRF cookie set' })

#Login view with session auth and csrf token
@method_decorator(csrf_protect, name= 'dispatch')
class LoginView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format = None):
        data = self.request.data
        username = data['username']
        password = data['password']
        try:
            user = authenticate(request, username=username, password=password)
        
            if user is not None:
                login(request, user)
                return JsonResponse({'message': 'Login successful'}, status=200)
            return JsonResponse({'message': 'Invalid credentials'}, status=400)
        except:
            return JsonResponse({"message": "error when logging in"})
        
class LogoutView(APIView):
    def post(self, request, format= None):
        try:
            logout(request)
            return JsonResponse({'message': 'Loggout out'})
        except:
            return JsonResponse({'message': 'something went wrong when logging out'})

#Registration view with Token
class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CarrierList(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Carrier.objects.all()
    serializer_class = CarrierSerializer

class ProviderList(generics.ListAPIView):
    queryset = Provider.objects.all()
    serializer_class = ProviderSerializer

class BusStationList(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = BusStation.objects.all()
    serializer_class = BusStationSerializer

class AddUserLocationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_location_serializer = UserLocationSerializer(data=request.data)

        serializer = UserLocationSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()  
            return Response({'message': 'UserLocation added successfully'}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class UserLocationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user_location = UserLocation.objects.get(user_id=user_id)
        except UserLocation.DoesNotExist:
            return Response({'message': 'User location not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserLocationSerializer(user_location)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserDepartureListView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        location_serializer = LocationSerializer(data=request.data.get('location'))
        if not location_serializer.is_valid():
            return Response(location_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        name = location_serializer.validated_data['name']
        country = location_serializer.validated_data['country']

        try:
            location = Location.objects.get(name=name, country=country)
            bus_stations = BusStation.objects.filter(location=location)
            departures = Departure.objects.filter(start_station__in=bus_stations)

        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        unique_departures = {}
        for departure in departures:
            key = (departure.start_station.id, departure.end_station.id)
            if key not in unique_departures:
                unique_departures[key] = departure
            else:
                if departure.price < unique_departures[key].price:
                    unique_departures[key] = departure
        
        sorted_departures = list(unique_departures.values())

        serializer = DepartureSerializer(sorted_departures, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
