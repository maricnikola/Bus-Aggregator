from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()

class UserService:
    @staticmethod
    def create_user(validated_data):
        password = validated_data.pop("password")
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            is_active=False  
        )
        user.set_password(password)

        try:
            user.save()
        except Exception as e:
            raise ValidationError(f"User creation failed: {str(e)}")

        return user
