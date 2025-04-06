# Database configuration
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
INSTALLED_APPS = [
    ...
    'rest_framework',
    'customers',
]

# Add REST Framework settings if desired
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ]
}