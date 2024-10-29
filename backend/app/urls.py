from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import RegisterUserView, CustomTokenObtainPairView, ActivateMail, RegisterView, GetCSRFToken, LoginView, LogoutView, CarrierList, ProviderList,SearchDeparturesView, BusStationList,AddUserLocationView, UserDepartureListView, UserLocationView, index


urlpatterns = [
    path('', index, name='index'),
    path('search/', SearchDeparturesView.as_view(), name='search_departures'),
    path("api/user/register/", RegisterUserView.as_view(), name="register"),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='get_token'),
    path('activate/<uidb64>/<token>', ActivateMail.as_view(), name='activate'),
    path('login',LoginView.as_view(), name='login_view'),   
    path('logout', LogoutView.as_view(), name='logout_view'),
    path('signup', RegisterView.as_view()),
    path("api/add-user-location/", AddUserLocationView.as_view(), name='add-user-location'),
    path('csrf_cookie',GetCSRFToken.as_view()),
    path('api/carriers/', CarrierList.as_view(), name='carrier-list'),
    path('api/providers/', ProviderList.as_view(), name='provider-list'),
    path('api/bus-stations/', BusStationList.as_view(), name='bus-station-list'),
    path('api/user-departures/', UserDepartureListView.as_view(), name='user-departure-list'),
    path('api/get-user-location/<int:user_id>/', UserLocationView.as_view(), name='user-departure-list')
] 
