# from django.utils.deprecation import MiddlewareMixin
# from django.http import JsonResponse
# from Account.Models.user import CustomUser
# from ..redis_session import RedisSession
# from django.conf import settings


# redisSession = RedisSession()


# class AccountMiddleware(MiddlewareMixin):
#     exempted_paths = [
#         "/api/v1/account/login/",
#         "/api/v1/account/signup/",
#     ]

#     def is_exempted(self, path):
#         return any(path.startswith(exempted) for exempted in self.exempted_paths)

#     def extract_session_token(self, request):
#         session_token = request.cookies.get("session_token")
#         if not session_token:
#             return False
#         user_details = redisSession.check_session(session_token)

#         if not user_details:
#             return False
#         return user_details

#     def process_request(self, request):
#         if self.is_exempted(request.path):
#             return None  # Allow the request to proceed
        
#         user_details = self.extract_session_token(request)

#         if not user_details:
#             return JsonResponse({"message": "Please login"}, status=401)
        
#         request.renew = user_details.get("renew")

#         if request.renew:
#             request.session_token = user_details.get("session_token")
#             request.refresh_token = user_details.get("refresh_token")
        
#         user = CustomUser.get_user_by_id(user_details.get("user_details").get("id"))
#         request.user = user

#         return None
    
#     def process_response(self, request, response):
#         if request.renew:
#             response.set_cookie("session_token", request.session_token)
#             response.set_cookie("refresh_token", request.refresh_token)

#         return response
    

