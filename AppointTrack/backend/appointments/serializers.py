


from rest_framework import serializers
from .models import Appointment
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
        extra_kwargs = {'user': {'read_only': True}}  # Prevent user from being required in the request

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["user"] = request.user  # Assign logged-in user
        return super().create(validated_data)  # Serialize all fields


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate_password(self, value):
        try:
            validate_password(value)  
        except ValidationError as e:
            raise ValidationError({"password": e.messages})
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
