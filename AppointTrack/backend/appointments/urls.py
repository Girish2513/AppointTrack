from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterUserAPIView,
    AppointmentViewSet,
    AppointmentDetailView
)
from . import views
# Using Django REST Framework's router for ViewSets
router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet, basename='appointment')


urlpatterns = [
    # JWT Authentication
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Login
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh token
    
    # Register user
    path('register/', RegisterUserAPIView.as_view(), name='register'),

    # Appointment APIs
    # path('appointments/', AppointmentListCreateView.as_view(), name='appointment-list-create'),
    path('appointments/<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),

    # Include router-generated URLs
    path('', include(router.urls)),  
]
