from django.shortcuts import redirect, render
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import SignUpSerializer, LogInSerializer, UpdateDetailsSerializer
from django.contrib.auth import logout, login
from .models import Tutor
from .forms import TutorForm, ReviewForm



@api_view(["POST", "GET"])
def signup_user(request):
    if request.method == "GET":
        return Response({ 'message': 'This is the signup page', 'success': True }, status=status.HTTP_200_OK)


    serializer = SignUpSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return redirect("login_user")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST", "GET"])
def login_user(request):
    if request.method == "GET":
        return Response({ 'message': 'This is the login page', 'success': True }, status=status.HTTP_400_BAD_REQUEST)
    try:
        serializer = LogInSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            if user:
                login(request._request, user)
                response = Response(
                    {"message": "Login successful", "success": True, "user": user.to_dict()},
                    status=status.HTTP_200_OK
                )
                return response
        return Response({"message": "Invalid credentials", 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        print("Error in login: ", str(e))
        return Response({'message': 'An error occured... try again', 'success': False }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# List tutors with filtering options
def tutor_list(request):
    subject = request.GET.get('subject')
    min_rating = request.GET.get('min_rating')
    availability = request.GET.get('availability')

    tutors = Tutor.objects.all()
    if subject:
        tutors = tutors.filter(subject_icontains=subject)
    if min_rating:
        tutors = tutors.filter(average_rating_gte=min_rating)
    if availability == 'true':
        tutors = tutors.filter(availability=True)
    elif availability == 'false':
        tutors = tutors.filter(availability=False)

    return render(request, 'tutor_list.html', {'tutor':tutors})

# Add a new tutor
def add_tutor(request):
    if request.method == 'POST':
        form = TutorForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('tutor_list')
    else:
        form = TutorForm()
    return render(request, 'add_tutor.html', {'form':form})

# Add a new review
def add_review(request):
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('tutor_list')
    else:
        form = ReviewForm()
    
    return render(request, 'add_review.html', {'form': form})
    

@permission_classes([IsAuthenticated])
@api_view(["PUT"])
def update_user(request):
    try:
        serializer = UpdateDetailsSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            request.user = user
            return Response(
                {"message": "User details updated successfully", 'user': request.user.to_dict()},
                status=status.HTTP_200_OK
            )
        # Unauthorized
        return Response({'message': 'Unauthorized access', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        print("Error in update_user", e)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
@api_view(["DELETE"])
def logout_user(request):
    logout(request)
    return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)


