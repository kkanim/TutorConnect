from django.urls import path
from .views import signup_user, login_user, update_user, logout_user
from .views import tutor_list, add_tutor, add_review

urlpatterns = [
    path("account/signup/", signup_user, name="signup_user"),  # POST and GET
    path("account/login/", login_user, name="login_user"),  # POST
    path("account/update/", update_user, name="update_user"),  # PUT or PATCH
    path("account/logout/", logout_user, name="logout_user"),  # POST
    path("tutor/", tutor_list, name="tutor_list"),
    path("tutors/add/", add_tutor, name="add_tutor"),
    path("reviews/add/", add_review, name="add_reviews"),
]
 