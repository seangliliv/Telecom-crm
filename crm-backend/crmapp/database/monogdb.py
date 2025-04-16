from pymongo import MongoClient
import certifi

client = MongoClient(
    "mongodb+srv://admin:Z6iFrQvNOQXmSLOM@cluster0.gd0pxmr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
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

