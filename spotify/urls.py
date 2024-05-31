from django.urls import path
from .views import *

urlpatterns = [
    path("get-auth-url", AuthURL.as_view(), name="auth-url"),
    path("redirect", spotify_callback, name="spotify-callback"),
    path("is-authenticated", IsAuthenticated.as_view(), name="is-authenticated"),
    path("current-song", CurrentSong.as_view(), name="current-song"),
    path("pause-song", PauseSong.as_view(), name="pause-song"),
    path("play-song", PlaySong.as_view(), name="play-song"),
    path("skip-song", SkipSong.as_view(), name="skip-song"),
]
