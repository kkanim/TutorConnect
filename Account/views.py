from django.shortcuts import redirect, render, get_object_or_404
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import SignUpSerializer, LogInSerializer, UpdateDetailsSerializer
from django.contrib.auth import logout, login, get_user_model
from .models import Tutor
from .forms import TutorForm, ReviewForm
from django.utils.timezone import now
from .models import Tutor, Student, Booking, Notification
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

User = get_user_model()

@login_required
@api_view(["GET"])
def home_page(request):
    return Response({'success': True, 'message': 'This is the Homepage', 'user': request.user.to_dict()}, status.HTTP_200_OK)



@api_view(["POST", "GET"])
def signup_user(request):
    if request.user.is_authenticated:
        return redirect('homepage')

    if request.method == "GET":
        return Response({ 'message': 'This is the signup page', 'success': True }, status=status.HTTP_201_CREATED)


    serializer = SignUpSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return redirect("login_user")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST", "GET"])
def login_user(request):
    if request.user.is_authenticated:
        return redirect("homepage")

    if request.method == "GET":
        return Response({ 'message': 'This is the login page', 'success': True }, status=status.HTTP_200_OK)
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
@login_required
@api_view(["GET"])
def tutor_list(request):
    subject = request.GET.get('subject', '')
    min_rating = request.GET.get('min_rating', 0.0)
    availability = request.GET.get('availability', False)

    tutors = Tutor.objects.all()
    if tutors:
        tutors_list = tutors.filter(subject__icontains=subject, availability=availability, average_rating_gte=min_rating)

    return render(request, 'tutor_list.html', {'tutor': tutors_list})

@login_required
@api_view(["DELETE"])
def delete_user(request):
    user = request.user
    if User.delete_user(user):
        return redirect('signup_user')
    return Response({'success': False, 'message': 'An error occured with procesing request'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Add a new tutor
@login_required
@api_view(["POST", "GET"])
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
@login_required
@api_view(["POST", "GET"])
def add_review(request):
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('tutor_list')
    else:
        form = ReviewForm()
    
    return render(request, 'add_review.html', {'form': form})
    

@login_required
@api_view(["PUT", "PATCH"])
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
    except Exception as e:
        print("Error in update_user", e)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@login_required
@api_view(["DELETE"])
def logout_user(request):
    logout(request)
    return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)


@login_required
@api_view(["GET"])
def book_session(request, tutor_id):
    student = get_object_or_404(Student, user=request.user)
    tutor = get_object_or_404(Tutor, id=tutor_id)
    
    if tutor.available_slots() <= 0:
        return JsonResponse({"error": "No available slots"}, status=400)

    session_time = request.POST.get("session_time")  # Assume session_time is passed in request
    booking = Booking.objects.create(
        tutor=tutor,
        student=student,
        session_time=session_time,
        status="booked",
    )

    # Notify the tutor
    Notification.objects.create(
        user=tutor.user,
        message=f"You have a new booking from {student.user.username}."
    )

    return JsonResponse({"message": "Booking successful", "booking_id": booking.id})


@login_required
@api_view(["GET"])
def view_bookings(request):
    user = request.user
    bookings = None
    if user.is_tutor:
        bookings = Booking.objects.get(tutor=user)
    else:
        bookings = Booking.objects.get(student=user)

    if not bookings:
        return Response({'success': False, 'message': 'Invalid account type'}, status=status.HTTP_400_BAD_REQUEST)

    upcoming = bookings.filter(session_time__gte=now(), status="booked")
    past = bookings.filter(session_time__lt=now())

    return Response({
        "upcoming_sessions": list(upcoming.values()),
        "past_sessions": list(past.values()),
    }, status=status.HTTP_200_OK)


@login_required
@api_view(["GET"])
def notifications(request):
    notifications = Notification.objects.filter(user=request.user, is_read=False)
    return JsonResponse({"notifications": list(notifications.values())})

@login_required
@api_view(['PATCH'])
def mark_notifications_as_read(request):
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return JsonResponse({"message": "Notifications marked as read"})


@login_required
@api_view(["GET"])
def has_booked_tutor(request, tutor_id):
    """Check if the student has booked a specific tutor before."""
    student = request.user.student
    has_booked = student.booking_set.filter(tutor_id=tutor_id).exists()
    return JsonResponse({"has_booked": has_booked})

@login_required
@api_view(["GET"])
def upcoming_sessions(request):
    """Get a list of upcoming bookings for the student."""
    student = request.user.student
    bookings = student.booking_set.filter(session_time__gt=timezone.now()).order_by("session_time")
    data = [{"tutor": b.tutor.user.username, "session_time": b.session_time} for b in bookings]
    return JsonResponse({"upcoming_sessions": data})

@login_required
@api_view(["GET"])
def past_sessions(request):
    """Get a list of past bookings for the student."""
    student = request.user.student
    bookings = student.booking_set.filter(session_time__lt=timezone.now()).order_by("-session_time")
    data = [{"tutor": b.tutor.user.username, "session_time": b.session_time} for b in bookings]
    return JsonResponse({"past_sessions": data})

@login_required
@api_view(["POST"])
def cancel_booking(request, booking_id):
    """Cancel a booking if it's in the future."""
    student = request.user.student
    try:
        booking = student.booking_set.get(id=booking_id)
        if booking.session_time > timezone.now():
            booking.delete()
            return JsonResponse({"message": "Booking canceled successfully."})
        return JsonResponse({"error": "Cannot cancel past bookings."}, status=400)
    except Booking.DoesNotExist:
        return JsonResponse({"error": "Booking not found."}, status=404)

@login_required
@api_view(["GET"])
def total_sessions(request):
    """Get the total number of bookings a student has made."""
    student = request.user.student
    total = student.booking_set.count()
    return JsonResponse({"total_sessions": total})

@login_required
@api_view(["GET"])
def last_booked_tutor(request):
    """Get the most recent tutor the student booked."""
    student = request.user.student
    last_booking = student.booking_set.order_by("-session_time").first()
    if last_booking:
        return JsonResponse({"last_tutor": last_booking.tutor.user.username})
    return JsonResponse({"message": "No bookings found."})
