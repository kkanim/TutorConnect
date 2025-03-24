from django import forms
from .models import Tutor, Review

class TutorForm(forms.ModelForm):
    class Meta:

        model = Tutor
        fields = ['name', 'bio', 'subjects', 'availability']

class ReviewForm(forms.ModelForm):
    class Meta:

        model = Review
        field = ['tutor', 'student_name', 'rating', 'comment']
  