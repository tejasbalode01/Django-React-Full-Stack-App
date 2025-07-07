from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT Authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Browsable API login/logout
    path('api-auth/', include('rest_framework.urls')),

    # App routes including /api/user/register/
    path("api/", include("api.urls")),  # ✅ Correctly pulls in register, notes, delete
]
