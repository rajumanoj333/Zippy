"""
Swiggy Mock Database Catalog
Contains authentic food dishes from popular restaurants and Instamart groceries.
"""

FOOD_RESTAURANTS = [
    {
        "id": "rest_1",
        "name": "Meghana Foods",
        "rating": 4.6,
        "ratings_count": "10K+",
        "delivery_time_mins": 25,
        "price_for_two": 500,
        "cuisines": ["Biryani", "Andhra", "South Indian"],
        "locality": "Indiranagar",
        "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
        "menu": [
            {
                "id": "item_101",
                "name": "Special Chicken Biryani",
                "price": 340,
                "rating": 4.7,
                "category": "Biryani",
                "veg": False,
                "description": "Signature spicy Andhra style chicken biryani served with raita & mirchi ka salan.",
                "calories": 680,
                "protein_g": 42,
                "carbs_g": 70,
                "fat_g": 22,
                "tags": ["Bestseller", "High Protein", "Spicy"],
                "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80"
            },
            {
                "id": "item_102",
                "name": "Paneer Biryani",
                "price": 290,
                "rating": 4.5,
                "category": "Biryani",
                "veg": True,
                "description": "Marinated paneer cubes layered with fragrant basmati rice and slow cooked with aromatic spices.",
                "calories": 590,
                "protein_g": 26,
                "carbs_g": 68,
                "fat_g": 24,
                "tags": ["Veg Bestseller"],
                "image_url": "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=600&auto=format&fit=crop&q=80"
            },
            {
                "id": "item_103",
                "name": "Chicken 65",
                "price": 280,
                "rating": 4.6,
                "category": "Starters",
                "veg": False,
                "description": "Deep-fried spicy chicken bites tossed with curry leaves and green chillies.",
                "calories": 420,
                "protein_g": 35,
                "carbs_g": 12,
                "fat_g": 26,
                "tags": ["Starter", "High Protein"],
                "image_url": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80"
            }
        ]
    },
    {
        "id": "rest_2",
        "name": "Cult Fit Kitchen (EatFit)",
        "rating": 4.5,
        "ratings_count": "5K+",
        "delivery_time_mins": 20,
        "price_for_two": 400,
        "cuisines": ["Healthy Food", "North Indian", "Salads", "Bowls"],
        "locality": "Koramangala",
        "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
        "menu": [
            {
                "id": "item_201",
                "name": "High Protein Teriyaki Chicken Bowl",
                "price": 279,
                "rating": 4.8,
                "category": "Healthy Bowls",
                "veg": False,
                "description": "Grilled chicken breast in light teriyaki sauce served over brown rice, broccoli, edamame & sesame seeds.",
                "calories": 450,
                "protein_g": 45,
                "carbs_g": 42,
                "fat_g": 10,
                "tags": ["Fit Choice", "High Protein", "Low Fat"],
                "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"
            },
            {
                "id": "item_202",
                "name": "Paneer Tikka Protein Thali",
                "price": 259,
                "rating": 4.6,
                "category": "Thalis",
                "veg": True,
                "description": "Char-grilled paneer tikka, low-oil dal makhani, multigrain rotis, brown rice & fresh cucumber salad.",
                "calories": 520,
                "protein_g": 28,
                "carbs_g": 58,
                "fat_g": 18,
                "tags": ["Veg Fit", "Balanced"],
                "image_url": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80"
            },
            {
                "id": "item_203",
                "name": "Avocado & Quinoa Power Salad",
                "price": 299,
                "rating": 4.4,
                "category": "Salads",
                "veg": True,
                "description": "Fresh Hass avocado, organic quinoa, cherry tomatoes, baby spinach with lemon vinaigrette.",
                "calories": 380,
                "protein_g": 14,
                "carbs_g": 35,
                "fat_g": 22,
                "tags": ["Keto Friendly", "Superfood"],
                "image_url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80"
            }
        ]
    },
    {
        "id": "rest_3",
        "name": "Truffles Gourmet",
        "rating": 4.7,
        "ratings_count": "15K+",
        "delivery_time_mins": 30,
        "price_for_two": 600,
        "cuisines": ["American", "Burgers", "Pastas", "Desserts"],
        "locality": "St. Marks Road",
        "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
        "menu": [
            {
                "id": "item_301",
                "name": "All-Star Cheese Burger",
                "price": 240,
                "rating": 4.8,
                "category": "Burgers",
                "veg": False,
                "description": "Juicy chicken patty topped with melted cheddar, caramelized onions and special house burger sauce.",
                "calories": 650,
                "protein_g": 32,
                "carbs_g": 52,
                "fat_g": 34,
                "tags": ["Top Rated", "Bestseller"],
                "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80"
            },
            {
                "id": "item_302",
                "name": "Creamy Alfredo Penne (Veg)",
                "price": 270,
                "rating": 4.6,
                "category": "Pastas",
                "veg": True,
                "description": "Penne pasta tossed in garlic parmesan white sauce with roasted bell peppers and zucchini.",
                "calories": 580,
                "protein_g": 16,
                "carbs_g": 65,
                "fat_g": 28,
                "tags": ["Comfort Food"],
                "image_url": "https://images.unsplash.com/photo-1621996346565-e3d5d6281270?w=600&auto=format&fit=crop&q=80"
            }
        ]
    },
    {
        "id": "rest_4",
        "name": "Corner House Ice Creams",
        "rating": 4.9,
        "ratings_count": "20K+",
        "delivery_time_mins": 15,
        "price_for_two": 300,
        "cuisines": ["Desserts", "Ice Cream", "Shakes"],
        "locality": "Indiranagar",
        "image_url": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80",
        "menu": [
            {
                "id": "item_401",
                "name": "Death By Chocolate (DBC)",
                "price": 260,
                "rating": 4.9,
                "category": "Sundaes",
                "veg": True,
                "description": "Legendary chocolate cake, vanilla ice cream, hot fudge sauce, cherries and roasted peanuts.",
                "calories": 720,
                "protein_g": 10,
                "carbs_g": 95,
                "fat_g": 36,
                "tags": ["Iconic", "Sweet Tooth"],
                "image_url": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80"
            }
        ]
    }
]

INSTAMART_ITEMS = [
    {
        "id": "insta_101",
        "name": "Amul Taaza Toned Milk 1L",
        "category": "Dairy & Milk",
        "price": 54,
        "unit": "1 Litre",
        "rating": 4.9,
        "in_stock": True,
        "delivery_mins": 10,
        "calories_per_unit": 580,
        "protein_g": 32,
        "image_url": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80"
    },
    {
        "id": "insta_102",
        "name": "Farm Fresh Brown Eggs (Pack of 6)",
        "category": "Eggs & Meat",
        "price": 75,
        "unit": "6 Pieces",
        "rating": 4.8,
        "in_stock": True,
        "delivery_mins": 10,
        "calories_per_unit": 420,
        "protein_g": 36,
        "image_url": "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=600&auto=format&fit=crop&q=80"
    },
    {
        "id": "insta_103",
        "name": "Modern 100% Whole Wheat Bread 400g",
        "category": "Bakery",
        "price": 45,
        "unit": "400g",
        "rating": 4.6,
        "in_stock": True,
        "delivery_mins": 10,
        "calories_per_unit": 900,
        "protein_g": 34,
        "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80"
    },
    {
        "id": "insta_104",
        "name": "Fresh Organic Avocados (2 Pcs)",
        "category": "Fruits & Vegetables",
        "price": 199,
        "unit": "2 Pieces (approx 350g)",
        "rating": 4.7,
        "in_stock": True,
        "delivery_mins": 10,
        "calories_per_unit": 320,
        "protein_g": 4,
        "image_url": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80"
    },
    {
        "id": "insta_105",
        "name": "Quaker Rolled Oats 1kg",
        "category": "Cereals & Breakfast",
        "price": 185,
        "unit": "1 kg",
        "rating": 4.8,
        "in_stock": True,
        "delivery_mins": 10,
        "calories_per_unit": 3890,
        "protein_g": 130,
        "image_url": "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&auto=format&fit=crop&q=80"
    },
    {
        "id": "insta_106",
        "name": "Optimum Nutrition (ON) Gold Standard Whey 1lb",
        "category": "Fitness & Nutrition",
        "price": 1899,
        "unit": "454g Chocolate",
        "rating": 4.9,
        "in_stock": True,
        "delivery_mins": 10,
        "calories_per_unit": 1800,
        "protein_g": 360,
        "image_url": "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&auto=format&fit=crop&q=80"
    }
]
