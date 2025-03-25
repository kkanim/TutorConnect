from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate

User = get_user_model()


class SignUpSerializer(serializers.ModelSerializer):
    ACCOUNT_TYPES = (("student", "Student"), ("tutor", "Tutor"))

    account_type = serializers.ChoiceField(choices=ACCOUNT_TYPES, required=True)  # Determines account type
    password = serializers.CharField(write_only=True, required=True, style={"input_type": "password"})

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "phone_number", "college", "year", "account_type", "first_name", "last_name"]
        extra_kwargs = {
            "password": {"write_only": True},
        }


    def create(self, validated_data):
        account_type = validated_data.pop("account_type")  # Extract the account type

        is_tutor = False if account_type == 'student' else True
        validated_data['is_tutor'] = is_tutor

        user = User.create_user(**validated_data)

        return user


class LogInSerializer(serializers.Serializer):
    username_email = serializers.CharField(required=True)  # Can be email or username
    password = serializers.CharField(write_only=True, required=True, style={"input_type": "password"})

    def validate(self, data):
        username_email = data["username_email"]  # Can be email or username
        password = data["password"]

        # Authenticate user using username & password
        user = authenticate(username_email=username_email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid credentials")

        return user  # Return authenticated user


class UpdateDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "phone_number", "college", "year", "days_available", "courses"]
