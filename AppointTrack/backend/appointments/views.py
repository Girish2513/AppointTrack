

# import logging
# from django.utils import timezone
# from rest_framework import viewsets, generics, permissions, status, filters
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from django_filters.rest_framework import DjangoFilterBackend
# from .models import Appointment
# from .serializers import AppointmentSerializer, UserRegistrationSerializer
# from django_filters import rest_framework as django_filters

# # Initialize logger
# logger = logging.getLogger(__name__)

# # ✅ Register User API
# class RegisterUserAPIView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = UserRegistrationSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # ✅ Custom Filters for Appointment
# class AppointmentFilter(django_filters.FilterSet):
#     date_gte = django_filters.DateFilter(field_name='date', lookup_expr='gte')
#     date_lte = django_filters.DateFilter(field_name='date', lookup_expr='lte')
#     status = django_filters.ChoiceFilter(choices=Appointment.STATUS_CHOICES)

#     class Meta:
#         model = Appointment
#         fields = ['status', 'date_gte', 'date_lte']


# # ✅ Appointment ViewSet with Filtering and Ordering
# class AppointmentViewSet(viewsets.ModelViewSet):
#     serializer_class = AppointmentSerializer
#     permission_classes = [IsAuthenticated]
#     filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
#     filterset_class = AppointmentFilter
#     ordering_fields = ['date', 'status', 'created_at']
#     ordering = ['date']  # Default ordering

#     def get_queryset(self):
#         """Return only the appointments of the logged-in user."""
#         queryset = Appointment.objects.filter(user=self.request.user)

#         # Get query parameters for filtering and ordering
#         ordering = self.request.query_params.get('ordering', 'date')
#         status = self.request.query_params.get('status', None)
#         date_start = self.request.query_params.get('date__gte', None)
#         date_end = self.request.query_params.get('date__lte', None)

#         # Log received parameters
#         logger.debug(f"Received Params -> ordering={ordering}, status={status}, date_start={date_start}, date_end={date_end}")

#         # Apply filters
#         if status:
#             logger.debug(f"Filtering by status: {status}")
#             queryset = queryset.filter(status=status)

#         if date_start:
#             logger.debug(f"Filtering by start date: {date_start}")
#             queryset = queryset.filter(date__gte=date_start)

#         if date_end:
#             logger.debug(f"Filtering by end date: {date_end}")
#             queryset = queryset.filter(date__lte=date_end)

#         # Apply ordering
#         logger.debug(f"Ordering by: {ordering}")
#         queryset = queryset.order_by(ordering)

#         # Log the final SQL query
#         logger.debug(f"Final SQL Query -> {str(queryset.query)}")

#         return queryset

#     def perform_create(self, serializer):
#         """Assign the logged-in user to the new appointment."""
#         serializer.save(user=self.request.user)


# # ✅ Appointment List & Create View (Generic API)
# class AppointmentListCreateView(generics.ListCreateAPIView):
#     serializer_class = AppointmentSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         """Return only the appointments of the logged-in user."""
#         return Appointment.objects.filter(user=self.request.user)

#     def perform_create(self, serializer):
#         """Assign the logged-in user to the appointment."""
#         serializer.save(user=self.request.user)


# # ✅ Appointment Detail View (Retrieve, Update, Delete)
# class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = AppointmentSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         """Return only the appointments of the logged-in user."""
#         return Appointment.objects.filter(user=self.request.user)


# # ✅ Filtered List View with Ordering (for specific use case)
# class AppointmentListView(generics.ListAPIView):
#     serializer_class = AppointmentSerializer
#     permission_classes = [permissions.IsAuthenticated]
#     filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
#     filterset_fields = ['date', 'status']
#     ordering_fields = ['date', 'created_at']

#     def get_queryset(self):
#         """Return only the appointments of the logged-in user."""
#         queryset = Appointment.objects.filter(user=self.request.user)

#         # Handle custom filtering
#         status = self.request.query_params.get('status', None)
#         if status:
#             queryset = queryset.filter(status=status)

#         # Handle custom ordering
#         ordering = self.request.query_params.get('ordering', 'date')
#         queryset = queryset.order_by(ordering)

#         return queryset

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


# ✅ Appointment ViewSet with Filtering and Ordering
# class AppointmentViewSet(viewsets.ModelViewSet):
#     serializer_class = AppointmentSerializer
#     permission_classes = [IsAuthenticated]
#     filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
#     filterset_class = AppointmentFilter
#     ordering_fields = ['date', 'status', 'created_at']
#     ordering = ['date']  # Default ordering

#     def get_queryset(self):
#         """Return only the appointments of the logged-in user."""
#         queryset = Appointment.objects.filter(user=self.request.user)

#         # Get query parameters for custom behavior
#         status = self.request.query_params.get('status', None)
#         ordering = self.request.query_params.get('ordering', 'date')

#         logger.debug(f"Query Params: {self.request.query_params}")

#         # ✅ Handle 'status=all' case
#         if status and status != 'all':
#             queryset = queryset.filter(status=status)

#         # ✅ Apply ordering safely
#         if ordering:
#             queryset = queryset.order_by(ordering)

#         logger.debug(f"Final SQL Query -> {str(queryset.query)}")
#         return queryset

#     def perform_create(self, serializer):
#         """Assign the logged-in user to the new appointment."""
#         serializer.save(user=self.request.user)

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
