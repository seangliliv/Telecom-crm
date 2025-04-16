from pymongo import MongoClient
import certifi

client = MongoClient(
    "mongodb+srv://seangliliv12:XI6QsucFv0whXMTG@cluster0.nwhsmxs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    tlsCAFile=certifi.where()
)   
db = client["crm-project"]

user_collection = db["users"]
customer_collection = db["customers"]
plan_collection = db['plans']
subscription_collection = db["subscription"]
invoice_collection = db['invoices']
# statuses_collection = db['statues']
# ticket_collection = db['tickets']
payment_method_collection = db["payment_methods"]
transaction_collection = db['transactions']
# Support management
ticket_collection = db['support_tickets']

# Network management
network_status_collection = db['network_status']

# System management
system_settings_collection = db['system_settings']
audit_log_collection = db['audit_logs']

