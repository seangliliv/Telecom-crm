import pymongo
import os

client = pymongo.MongoClient(host=os.environ.get('MONGO_HOST', 'mongodb'), port=int(os.environ.get('MONGO_PORT', '27017')))
db = client[os.environ.get('MONGO_DB', 'crm_db')]
communications_collection = db['communications']
users_collection = db['users']
customers_collection = db['customers']
customerservices_collection = db['customerservices']