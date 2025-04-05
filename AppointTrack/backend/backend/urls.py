"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views.
For more information, please see:
https://docs.djangoproject.com/en/4.2/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,  # Generates Access & Refresh Tokens
    TokenRefreshView      # Refreshes Access Token
)
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

# Home API Response

def home(request):
    return JsonResponse({"message": "Welcome to the API. Use /api/ for endpoints."})

urlpatterns = [
    # Admin Panel
    path('admin/', admin.site.urls),

    # API Routing
    path('api/', include('appointments.urls')),  # Include app URLs

    # Authentication Endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # API Home Message
    path("", home),  

    # Frontend Index Page (Modify if required)
    path("", TemplateView.as_view(template_name="index.html")),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
