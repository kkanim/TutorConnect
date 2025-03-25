from django import forms
from .models import Tutor, Review

class TutorForm(forms.ModelForm):
    class Meta:

        model = Tutor
        fields = ['bio', 'subjects']


class ReviewForm(forms.ModelForm):
    class Meta:

        model = Review
        fields = ['tutor', 'student_name', 'rating', 'comment']