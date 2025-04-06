import pymongo
import os

client = pymongo.MongoClient(host=os.environ.get('MONGO_HOST', 'mongodb'), port=int(os.environ.get('MONGO_PORT', '27017')))
db = client[os.environ.get('MONGO_DB', 'crm_db')]
services_collection = db['services']