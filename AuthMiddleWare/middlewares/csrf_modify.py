from django.utils.deprecation import MiddlewareMixin

class DisableCSRF(MiddlewareMixin):
    def process_request(self, request):
        setattr(request, '_dont_enforce_csrf_checks', True)



# from django.middleware.csrf import CsrfViewMiddleware

# class CustomCsrfMiddleware(CsrfViewMiddleware):
#     def process_view(self, request, callback, callback_args, callback_kwargs):
#         # Example: Disable CSRF for API endpoints only
#         if request.path.startswith("/api/"):
#             return None  # Skip CSRF check for this request
#         return super().process_view(request, callback, callback_args, callback_kwargs)
