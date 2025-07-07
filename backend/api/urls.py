# api/urls.py
from django.urls import path
from .views import NoteListCreate, NoteDelete, RegisterUserView

urlpatterns = [
    path("notes/", NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", NoteDelete.as_view(), name="delete-note"),
    path("user/register/", RegisterUserView.as_view(), name="register"),  # ✅ This is correct
]
