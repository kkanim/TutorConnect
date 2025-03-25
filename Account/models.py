from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.timezone import now
from django.contrib.auth.models import AbstractUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_student(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_tutor", False)
        user = self.create_user(username, email, password, **extra_fields)
        student = Student(user=user)
        student.save()
        return user

    def create_tutor(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_tutor", True)
        user = self.create_user(username, email, password, **extra_fields)
        tutor = Tutor(user=user)
        tutor.save()
        return user

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
    def create_user(cls, **extra_fields):
        # Checks account type to create user or tutor in a try block
        username = extra_fields.pop('username', None)
        email = extra_fields.pop('email', None)
        password = extra_fields.pop('password', None)

        if not username or not email or not password:
            return False

        try:
            if extra_fields.get("is_tutor", False):
                return cls.objects.create_tutor(username, email, password, **extra_fields)
            return cls.objects.create_student(username, email, password, **extra_fields)
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
    
    @classmethod
    def delete_user(cls, self):
        try:
            cls.objects.filter(id=self.id).delete()
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
        return {k: v for k, v in self.__dict__.items() if k not in ["_state", "password", "backend"]}








class Tutor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='tutor_profile')
    bio = models.TextField(blank=True)
    subjects = models.CharField(max_length=200)
    average_rating = models.FloatField(default=0.0)
    max_slots = models.IntegerField(default=4)
    availability = models.BooleanField(default=False)

    def available_slots(self):
        booked_slots = Booking.objects.filter(tutor=self, status="booked").count()
        return self.max_slots - booked_slots

    def calculate_average_rating(self):
        reviews = self.reviews.all()
        if reviews.exists():
            total_rating = sum(r.rating for r in reviews)
            self.average_rating = total_rating / max(reviews.count(), 1)  # Handle division by zero
        else:
            self.average_rating = 0.0
        self.save()

    def __str__(self):
        return self.user.username

class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

    def has_booked_tutor(self, tutor):
        """Returns True if the student has booked this tutor before."""
        return self.booking_set.filter(tutor=tutor).exists()

    def upcoming_sessions(self):
        """Returns a queryset of future bookings for the student."""
        return self.booking_set.filter(session_time__gt=now()).order_by("session_time")

    def past_sessions(self):
        """Returns a queryset of past bookings for the student."""
        return self.booking_set.filter(session_time__lt=now()).order_by("-session_time")

    def cancel_booking(self, booking_id):
        """Cancels a booking if it exists."""
        booking = self.booking_set.filter(id=booking_id, session_time__gt=now()).first()
        if booking:
            booking.delete()
            return True
        return False

    def total_sessions(self):
        """Returns the total number of sessions a student has booked."""
        return self.booking_set.count()

    def last_booked_tutor(self):
        """Returns the last tutor the student booked a session with."""
        last_booking = self.booking_set.order_by("-session_time").first()
        return last_booking.tutor if last_booking else None



class Booking(models.Model):
    STATUS_CHOICES = [
        ("booked", "Booked"),
        ("completed", "Completed"),
        ("canceled", "Canceled"),
    ]

    tutor = models.ForeignKey(Tutor, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    session_time = models.DateTimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="booked")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("tutor", "session_time")  # Prevent double booking

    def __str__(self):
        return f"{self.student.user.username} booked {self.tutor.user.username} at {self.session_time}"


class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.user.username}"


class Review(models.Model):
    tutor = models.ForeignKey(Tutor, related_name='reviews', on_delete=models.CASCADE)
    student_name = models.CharField(max_length=100)
    rating = models.PositiveSmallIntegerField( # Rating from 1 to 5
    validators = [MinValueValidator(1), MaxValueValidator(5)]  # Rating Validation
    ) 
    comment = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.tutor.calculate_average_rating()

    def __str__(self):
        return f'{self.tutor.user.username}-{self.student_name} - {self.rating}'


