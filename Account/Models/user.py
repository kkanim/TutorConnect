from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_tutor(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_tutor", True)
        return self.create_user(username, email, password, **extra_fields)

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    year = models.IntegerField(null=True, blank=True)
    courses = models.JSONField(null=True, blank=True)
    college = models.CharField(max_length=255, null=True, blank=True)
    days_available = models.JSONField(null=True, blank=True)
    is_tutor = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)  # Required for Django auth
    is_staff = models.BooleanField(default=False)

    objects = UserManager()  # Use custom user manager

    USERNAME_FIELD = "email"  # Use email for authentication by default
    REQUIRED_FIELDS = ["username"]  # Username is still required

    def __str__(self):
        return self.username
    
    @classmethod
    def create_user(cls, username, email, password, **extra_fields):
        # Checks account type to create user or tutor in a try block
        try:
            if extra_fields.get("is_tutor", False):
                return cls.objects.create_tutor(username, email, password, **extra_fields)
            return cls.objects.create_user(username, email, password, **extra_fields)
        except Exception as e:
            print("---Error [Create User] ---: ", str(e))
            return False
        
    # Check user password
    def check_password(self, password):
        return super().check_password(password)
    
    def update_password(self, password):
        try:
            self.set_password(password)
            self.save()
            return True
        except Exception as e:
            print("---Error [Update Password] ---: ", str(e))
            return False
    
    def delete_user(self):
        try:
            self.delete()
            return True
        except Exception as e:
            print("---Error [Delete User] ---: ", str(e))
            return False
    
    def update_details(self, **kwargs):
        kwargs.pop('password', None)

        try:
            for k, v in kwargs.items():
                setattr(self, k, v)
            self.save()
            return True
        except Exception as e:
            print("---Error [Update Details] ---: ", str(e))
            return False
    
    @classmethod
    def get_user_by_id(cls, user_id):
        try:
            return cls.objects.get(id=user_id)
        except Exception as e:
            print("---Error [Get User By ID] ---: ", str(e))
            return None
    
    @classmethod
    def get_user_by_email(cls, email):
        try:
            return cls.objects.get(email=email)
        except Exception as e:
            print("---Error [Get User By Email] ---: ", str(e))
            return None
    
    @classmethod
    def get_user_by_username(cls, username):
        try:
            return cls.objects.get(username=username)
        except Exception as e:
            print("---Error [Get User By Username] ---: ", str(e))
            return None

    @classmethod
    def get_user_by_phone_number(cls, phone_number):
        try:
            return cls.objects.get(phone_number=phone_number)
        except Exception as e:
            print("---Error [Get User By Phone Number] ---: ", str(e))
            return None
    
    def to_dict(self):
        # Dynamic filtering of fields without password but ID included
        return {k: v for k, v in self.__dict__.items() if k not in ["_state", "password"]}




