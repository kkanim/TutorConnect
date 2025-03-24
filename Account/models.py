from django.db import models
from .models.user import CustomUser
from django.core.validators import MinValueValidator, MaxValueValidator


class Tutor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='tutor_profile')
    bio = models.TextField(blank=True)
    subjects = models.CharField(max_length=200)  # Comma-separated subjects
    availability = models.BooleanField(default=True)
    average_rating = models.FloatField(default=0.0)

    def calculate_average_rating(self):
        reviews = self.reviews.all()
        if reviews.exists():
            total_rating = sum(r.rating for r in reviews)
            self.average_rating = total_rating / max(reviews.count(), 1)  # Handle divdion by zero
        else:
            self.average_rating = 0.0
        self.save()

    def __str__(self):
        return self.user.username


class Review(models.Model):
    tutor = models.ForeignKey('Tutor', related_name='reviews', on_delete=models.CASCADE)
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
