from django.apps import AppConfig
import mongoengine

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'



mongoengine.connect(
    db='telecom_crm_db',
    host='localhost',
    port=27017,
    # username='your_username',  # if needed
    # password='your_password',  # if needed
    # authentication_source='admin'  # if using authentication
)
