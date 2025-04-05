

import logging
from django.utils import timezone
from rest_framework import viewsets, generics, permissions, status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Appointment
from .serializers import AppointmentSerializer, UserRegistrationSerializer
from django_filters import rest_framework as django_filters

# Initialize logger
logger = logging.getLogger(__name__)


# ✅ Register User API
class RegisterUserAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Custom Filters for Appointment
class AppointmentFilter(django_filters.FilterSet):
    date_gte = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    date_lte = django_filters.DateFilter(field_name='date', lookup_expr='lte')
    status = django_filters.ChoiceFilter(choices=Appointment.STATUS_CHOICES)

    class Meta:
        model = Appointment
        fields = ['status', 'date_gte', 'date_lte']




class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'date']
    ordering_fields = ['date', 'status', 'created_at']
    ordering = ['date']

    def get_queryset(self):
        return Appointment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ✅ Appointment Detail View (Retrieve, Update, Delete)
class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return only the appointments of the logged-in user."""
        return Appointment.objects.filter(user=self.request.user)
