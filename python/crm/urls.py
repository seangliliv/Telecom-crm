"""crm URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import path, include
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('crm_api.urls')),
    path('api/', include('customers.urls')),
    path('api/', include('categories.urls')),
    path('api/', include('plans.urls')),
    path('api/', include('subscriptions.urls')),
    path('api/', include('invoices.urls')),
    path('api/', include('issues.urls')),
    path('api/', include('campaigns.urls')),
    path('api/', include('leads.urls')),
    path('api/', include('services.urls')),
    path('api/', include('customerservices.urls')),
    path('api/', include('users.urls')),
    path('api/', include('roles.urls')),
    path('api/', include('communications.urls')),
    path('api/', include('issuecomments.urls')),
    path('api/', include('campaignactivities.urls')),
]
