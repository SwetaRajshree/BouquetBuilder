from pymongo import MongoClient
from app.config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client["ecommerce"]

# Dummy fallback data
products_data = [
    {"name": "Nike Shoes", "price": 1800},
    {"name": "Adidas Shoes", "price": 2200},
    {"name": "Puma Sneakers", "price": 1500}
]

def get_products(query: str):
    # Later: replace with Mongo search
    return [p for p in products_data if p["price"] < 2000]

def get_order(user_id: str):
    return {"status": "Out for delivery 🚚"}