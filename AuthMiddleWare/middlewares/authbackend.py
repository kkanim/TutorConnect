from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailOrUsernameAuthBackend(ModelBackend):
    """
    Custom authentication backend to allow login with either email or username.
    """

    def authenticate(self, request, username_email=None, password=None, **kwargs):
        """
        Overrides the default authenticate method to check for both email and username.
        """

        print("HOHOHO")
        print(username_email, password)

        user = User.get_user_by_email(email=username_email) if "@" in username_email else User.get_user_by_username(username=username_email)

        # Check password
        if user and user.check_password(password):
            return user
        return None