import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# DATABASE CONFIGURATION
DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': os.environ.get('MONGO_DB', 'crm_db'),
        'CLIENT': {
            'host': os.environ.get('MONGO_HOST', 'mongodb'),
            'port': int(os.environ.get('MONGO_PORT', '27017')),
        }
    }
}

# INSTALLED APPS
INSTALLED_APPS = [
    # Default Django apps...
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',  # Needed for token authentication
    
    # Your apps
    'customers',
]

# MIDDLEWARE
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be at the top
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS SETTINGS - allow your frontend domain(s)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    # add additional origins as needed
]

# REST FRAMEWORK CONFIGURATION
REST_FRAMEWORK = {
    # Permissions: adjust as needed (AllowAny is for development/testing)
    'DEFAULT_PERMISSION_CLASSES': [
         'rest_framework.permissions.AllowAny',
    ],
    # Authentication: TokenAuthentication is enabled
    'DEFAULT_AUTHENTICATION_CLASSES': [
         'rest_framework.authentication.TokenAuthentication',
    ]
}

# Other settings such as SECRET_KEY, DEBUG, ALLOWED_HOSTS, etc.
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'your-secret-key')
DEBUG = os.environ.get('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = ['*']  # Adjust for production use

# Static files, templates, etc.
STATIC_URL = '/static/'

# ... any additional configuration ...
