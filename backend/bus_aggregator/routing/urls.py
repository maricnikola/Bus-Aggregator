from django.contrib import admin
from django.urls import include, path
from django.views.i18n import set_language
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', include('app.urls')),
    path('admin/', admin.site.urls),
    path('i18n', set_language, name='set_language'),
    path('api/', include('app.urls')),
    path('api-auth/',include('rest_framework.urls')),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)