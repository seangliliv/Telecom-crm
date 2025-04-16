from django.urls import path
from . import views

urlpatterns = [
    path("customers/all/", views.list_customers, name="list_customers"),
    path("customers/<str:customer_id>/", views.get_customer, name="get_customer"),
    path("customers/", views.create_customer, name="create_customer"),
    path("customers/update/<str:customer_id>/", views.update_customer, name="update_customer"),
    path("customers/delete/<str:customer_id>/", views.delete_customer, name="delete_customer"),
]