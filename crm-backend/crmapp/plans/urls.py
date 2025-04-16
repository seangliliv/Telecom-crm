from django.urls import path
from .views import *

urlpatterns = [
    path("plans/all/", list_plans, name="list_plans"),
    path("plans/<str:plan_id>/", get_plan, name="get_plan"),
    path("plans/", create_plan, name="create_plan"),
    path("plans/update/<str:plan_id>/", update_plan, name="update_plan"),
    path("plans/delete/<str:plan_id>/", delete_plan, name="delete_plan"),
]
