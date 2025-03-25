from django.urls import path
from .views import (
    signup_user,
    login_user,
    home_page,
    update_user,
    logout_user,
    delete_user,
    tutor_list,
    add_tutor,
    add_review,
    book_session,
    view_bookings,
    notifications,
    mark_notifications_as_read,
    has_booked_tutor,
    upcoming_sessions,
    past_sessions,
    cancel_booking,
    total_sessions,
    last_booked_tutor,
)


urlpatterns = [
    path("homepage/", home_page, name="homepage"),
    path("accounts/signup/", signup_user, name="signup_user"),
    path("accounts/login/", login_user, name="login_user"),
    path("accounts/update/", update_user, name="update_user"),
    path("accounts/logout/", logout_user, name="logout_user"),
    path("accounts/delete/", delete_user, name="delete_user"),
    path("tutors/", tutor_list, name="tutor_list"),
    path("tutors/add/", add_tutor, name="add_tutor"),
    path("reviews/add/", add_review, name="add_reviews"),
    path('bookings/add/<int:tutor_id>/', book_session, name='book_session'),
    path('bookings/', view_bookings, name='view_bookings'),
    path('notifications/', notifications, name='notifications'),
    path('notifications/read/', mark_notifications_as_read, name='mark_notifications_as_read'),
    path("students/has-booked-tutor/<int:tutor_id>/", has_booked_tutor, name="has_booked_tutor"),
    path("students/upcoming-sessions/", upcoming_sessions, name="upcoming_sessions"),
    path("students/past-sessions/", past_sessions, name="past_sessions"),
    path("students/cancel-booking/<int:booking_id>/", cancel_booking, name="cancel_booking"),
    path("students/total-sessions/", total_sessions, name="total_sessions"),
    path("students/last-booked-tutor/", last_booked_tutor, name="last_booked_tutor"),
]

 