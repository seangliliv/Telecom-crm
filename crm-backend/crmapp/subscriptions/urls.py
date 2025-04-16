from django.urls import path
from .views import *

urlpatterns = [
    path("sub/all/", list_subscriptions, name="list_subscriptions"),
    path("sub/<str:subscription_id>/", get_subscription, name="get_subscription"),
    path("sub/", create_subscription, name="create_subscription"),
    path("sub/update/<str:subscription_id>/", update_subscription, name="update_subscription"),
    path("sub/delete/<str:subscription_id>/", delete_subscription, name="delete_subscription"),
]
