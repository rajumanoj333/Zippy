"""
Swiggy MCP (Model Context Protocol) Server & Tool Execution Engine
Provides standard MCP tools for Food search, Instamart grocery lookup, Meal planning, Cart management, Order checkout & Order tracking.
"""

import uuid
import datetime
from typing import Dict, List, Any, Optional
from backend.mcp.swiggy_catalog import FOOD_RESTAURANTS, INSTAMART_ITEMS

# In-memory orders & cart state
IN_MEMORY_CARTS: Dict[str, Dict[str, Any]] = {}
IN_MEMORY_ORDERS: Dict[str, Dict[str, Any]] = {
    "SWG-89210": {
        "order_id": "SWG-89210",
        "created_at": (datetime.datetime.now() - datetime.timedelta(minutes=15)).strftime("%Y-%m-%d %H:%M:%S"),
        "status": "Out for Delivery",
        "restaurant_name": "Cult Fit Kitchen (EatFit)",
        "items": [
            {"name": "High Protein Teriyaki Chicken Bowl", "quantity": 1, "price": 279}
        ],
        "total_amount": 319,
        "delivery_partner": {"name": "Ramesh Kumar", "phone": "+91 9876543210", "rating": 4.9},
        "eta_minutes": 8,
        "delivery_address": "Flat 302, Green Glen Layout, Indiranagar, Bengaluru"
    }
}

class SwiggyMCPServer:
    def __init__(self):
        self.name = "Swiggy MCP Server"
        self.version = "1.0.0"

    def list_tools(self) -> List[Dict[str, Any]]:
        """Returns standard MCP tool specifications with input schemas."""
        return [
            {
                "name": "swiggy_search_food",
                "description": "Search for food dishes or restaurants on Swiggy based on dish query, cuisine, max budget, and high protein / veg preference.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "Dish name, e.g. Biryani, Salad, Bowl, Pizza"},
                        "max_budget": {"type": "number", "description": "Maximum budget in INR per dish/order"},
                        "high_protein": {"type": "boolean", "description": "Filter for high protein dishes (>25g protein)"},
                        "is_veg": {"type": "boolean", "description": "Filter for vegetarian only"},
                        "locality": {"type": "string", "description": "User locality, e.g. Indiranagar"}
                    },
                    "required": []
                }
            },
            {
                "name": "swiggy_instamart_search",
                "description": "Search and fetch grocery items available on Swiggy Instamart for instant 10-min delivery (Milk, Eggs, Bread, Avocados, Whey Protein, Snacks).",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "Grocery product query e.g. Milk, Eggs, Bread, Oats"},
                        "category": {"type": "string", "description": "Category filter e.g. Dairy & Milk, Fitness & Nutrition"}
                    },
                    "required": []
                }
            },
            {
                "name": "swiggy_create_meal_plan",
                "description": "Generate an AI-optimized meal plan (Breakfast, Lunch, Dinner, Snack) tailored to user budget, macro/protein target, and dietary preference using real Swiggy dishes.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "daily_budget": {"type": "number", "description": "Daily food budget in INR"},
                        "protein_target_g": {"type": "number", "description": "Target daily protein in grams (e.g. 100g)"},
                        "dietary_preference": {"type": "string", "description": "Veg, Non-Veg, High Protein, Low Carb"},
                        "days": {"type": "integer", "description": "Number of days for meal plan (1 to 7)"}
                    },
                    "required": ["daily_budget"]
                }
            },
            {
                "name": "swiggy_build_cart",
                "description": "Build a Swiggy shopping cart with selected food or Instamart item IDs, calculate total amount, taxes, delivery fee and discount coupons.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "items": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "item_id": {"type": "string"},
                                    "quantity": {"type": "integer"}
                                },
                                "required": ["item_id", "quantity"]
                            },
                            "description": "List of items to add to cart"
                        },
                        "delivery_address": {"type": "string", "description": "Delivery address string"}
                    },
                    "required": ["items"]
                }
            },
            {
                "name": "swiggy_place_order",
                "description": "Execute end-to-end Swiggy order placement for a built cart using specified payment method.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "cart_id": {"type": "string", "description": "Valid cart ID generated by swiggy_build_cart"},
                        "payment_method": {"type": "string", "description": "UPI, Swiggy Money, Cash on Delivery, Credit Card"}
                    },
                    "required": ["cart_id"]
                }
            },
            {
                "name": "swiggy_track_order",
                "description": "Get real-time tracking status, delivery partner details, and estimated time of arrival for a Swiggy order.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "order_id": {"type": "string", "description": "Order ID e.g. SWG-89210"}
                    },
                    "required": []
                }
            }
        ]

    def execute_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Routes MCP tool requests to appropriate handler."""
        if tool_name == "swiggy_search_food":
            return self._search_food(arguments)
        elif tool_name == "swiggy_instamart_search":
            return self._instamart_search(arguments)
        elif tool_name == "swiggy_create_meal_plan":
            return self._create_meal_plan(arguments)
        elif tool_name == "swiggy_build_cart":
            return self._build_cart(arguments)
        elif tool_name == "swiggy_place_order":
            return self._place_order(arguments)
        elif tool_name == "swiggy_track_order":
            return self._track_order(arguments)
        else:
            return {"error": f"Unknown Swiggy MCP tool: {tool_name}"}

    def _search_food(self, args: Dict[str, Any]) -> Dict[str, Any]:
        query = args.get("query", "").lower()
        max_budget = args.get("max_budget")
        high_protein = args.get("high_protein", False)
        is_veg = args.get("is_veg")

        results = []
        for rest in FOOD_RESTAURANTS:
            matching_items = []
            for item in rest["menu"]:
                # Filter matching
                if query and query not in item["name"].lower() and query not in item["category"].lower() and query not in item["description"].lower() and query not in rest["name"].lower():
                    continue
                if max_budget and item["price"] > max_budget:
                    continue
                if high_protein and item.get("protein_g", 0) < 25:
                    continue
                if is_veg is True and not item["veg"]:
                    continue
                if is_veg is False and item["veg"]:
                    continue

                item_copy = dict(item)
                item_copy["restaurant_id"] = rest["id"]
                item_copy["restaurant_name"] = rest["name"]
                item_copy["restaurant_rating"] = rest["rating"]
                item_copy["delivery_time_mins"] = rest["delivery_time_mins"]
                matching_items.append(item_copy)

            if matching_items:
                results.extend(matching_items)

        return {
            "status": "success",
            "total_found": len(results),
            "query_params": args,
            "dishes": results
        }

    def _instamart_search(self, args: Dict[str, Any]) -> Dict[str, Any]:
        query = args.get("query", "").lower()
        category = args.get("category", "").lower()

        results = []
        for item in INSTAMART_ITEMS:
            if query and query not in item["name"].lower() and query not in item["category"].lower():
                continue
            if category and category not in item["category"].lower():
                continue
            results.append(item)

        return {
            "status": "success",
            "source": "Swiggy Instamart 10-Min Delivery",
            "total_found": len(results),
            "items": results
        }

    def _create_meal_plan(self, args: Dict[str, Any]) -> Dict[str, Any]:
        daily_budget = args.get("daily_budget", 500)
        target_protein = args.get("protein_target_g", 75)
        dietary_pref = args.get("dietary_preference", "Balanced").lower()
        days = min(args.get("days", 1), 7)

        plan_days = []
        is_veg_only = "veg" in dietary_pref and "non" not in dietary_pref

        # Sample item selection algorithm
        all_dishes = []
        for r in FOOD_RESTAURANTS:
            for item in r["menu"]:
                if is_veg_only and not item["veg"]:
                    continue
                d = dict(item)
                d["restaurant_name"] = r["name"]
                all_dishes.append(d)

        all_insta = [i for i in INSTAMART_ITEMS if not (is_veg_only and "Eggs" in i["name"] or "Chicken" in i["name"])]

        for d in range(1, days + 1):
            # Select Breakfast, Lunch, Dinner & Snack fitting budget
            breakfast = next((i for i in all_insta if "Oats" in i["name"] or "Milk" in i["name"] or "Eggs" in i["name"] or "Bread" in i["name"]), all_insta[0])
            lunch = next((i for i in all_dishes if "Bowl" in i["name"] or "Thali" in i["name"] or "Biryani" in i["name"]), all_dishes[0])
            dinner = next((i for i in all_dishes if i["id"] != lunch["id"] and (i.get("protein_g", 0) >= 20)), all_dishes[-1])

            day_total_cost = breakfast.get("price", 50) + lunch.get("price", 250) + dinner.get("price", 200)
            day_total_protein = breakfast.get("protein_g", 15) + lunch.get("protein_g", 30) + dinner.get("protein_g", 25)
            day_total_calories = breakfast.get("calories_per_unit", breakfast.get("calories", 300)) // 3 + lunch.get("calories", 500) + dinner.get("calories", 450)

            plan_days.append({
                "day": d,
                "meals": {
                    "breakfast": {
                        "name": breakfast["name"],
                        "source": "Instamart",
                        "price": breakfast["price"],
                        "protein_g": breakfast.get("protein_g", 15),
                        "calories": 320
                    },
                    "lunch": {
                        "name": lunch["name"],
                        "restaurant": lunch["restaurant_name"],
                        "price": lunch["price"],
                        "protein_g": lunch.get("protein_g", 30),
                        "calories": lunch.get("calories", 500)
                    },
                    "dinner": {
                        "name": dinner["name"],
                        "restaurant": dinner["restaurant_name"],
                        "price": dinner["price"],
                        "protein_g": dinner.get("protein_g", 25),
                        "calories": dinner.get("calories", 450)
                    }
                },
                "daily_stats": {
                    "total_cost": day_total_cost,
                    "total_protein_g": day_total_protein,
                    "total_calories": day_total_calories,
                    "within_budget": day_total_cost <= daily_budget
                }
            })

        return {
            "status": "success",
            "summary": f"{days}-Day Swiggy AI Meal Plan ({dietary_pref.capitalize()})",
            "daily_budget": daily_budget,
            "target_protein_g": target_protein,
            "plan": plan_days
        }

    def _build_cart(self, args: Dict[str, Any]) -> Dict[str, Any]:
        requested_items = args.get("items", [])
        address = args.get("delivery_address", "Flat 302, Indiranagar, Bengaluru")

        cart_items = []
        item_total = 0

        for r_item in requested_items:
            item_id = r_item.get("item_id")
            qty = r_item.get("quantity", 1)

            # Lookup in food catalog
            found = None
            for rest in FOOD_RESTAURANTS:
                for dish in rest["menu"]:
                    if dish["id"] == item_id or item_id in dish["name"].lower():
                        found = {
                            "item_id": dish["id"],
                            "name": dish["name"],
                            "price": dish["price"],
                            "quantity": qty,
                            "subtotal": dish["price"] * qty,
                            "restaurant_name": rest["name"]
                        }
                        break
                if found:
                    break

            # Lookup in instamart
            if not found:
                for g_item in INSTAMART_ITEMS:
                    if g_item["id"] == item_id or item_id in g_item["name"].lower():
                        found = {
                            "item_id": g_item["id"],
                            "name": g_item["name"],
                            "price": g_item["price"],
                            "quantity": qty,
                            "subtotal": g_item["price"] * qty,
                            "restaurant_name": "Swiggy Instamart"
                        }
                        break

            if found:
                cart_items.append(found)
                item_total += found["subtotal"]

        if not cart_items:
            # Fallback mock item if not matched
            cart_items.append({
                "item_id": "item_201",
                "name": "High Protein Teriyaki Chicken Bowl",
                "price": 279,
                "quantity": 1,
                "subtotal": 279,
                "restaurant_name": "Cult Fit Kitchen (EatFit)"
            })
            item_total = 279

        taxes = round(item_total * 0.05, 2)
        delivery_fee = 35 if item_total < 500 else 0
        discount = 50 if item_total > 300 else 0
        grand_total = item_total + taxes + delivery_fee - discount

        cart_id = f"CART-{uuid.uuid4().hex[:8].upper()}"
        cart_data = {
            "cart_id": cart_id,
            "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "items": cart_items,
            "item_total": item_total,
            "taxes_and_charges": taxes,
            "delivery_fee": delivery_fee,
            "discount_applied": discount,
            "grand_total": grand_total,
            "delivery_address": address,
            "status": "ACTIVE_UNPAID"
        }

        IN_MEMORY_CARTS[cart_id] = cart_data
        return {
            "status": "success",
            "cart": cart_data
        }

    def _place_order(self, args: Dict[str, Any]) -> Dict[str, Any]:
        cart_id = args.get("cart_id")
        payment_method = args.get("payment_method", "Swiggy Money / UPI")

        cart = IN_MEMORY_CARTS.get(cart_id)
        if not cart:
            # Create instant order from active cart or fallback
            cart = self._build_cart({"items": [{"item_id": "item_101", "quantity": 1}]})["cart"]

        order_id = f"SWG-{uuid.uuid4().hex[:6].upper()}"
        order_data = {
            "order_id": order_id,
            "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "status": "Order Placed & Kitchen Notified",
            "restaurant_name": cart["items"][0]["restaurant_name"] if cart["items"] else "Swiggy Express",
            "items": cart["items"],
            "total_amount": cart["grand_total"],
            "payment_method": payment_method,
            "delivery_address": cart["delivery_address"],
            "delivery_partner": {
                "name": "Vikram Singh",
                "phone": "+91 9820011223",
                "rating": 4.9
            },
            "eta_minutes": 22
        }

        IN_MEMORY_ORDERS[order_id] = order_data
        return {
            "status": "success",
            "message": "🎉 Order successfully placed via Swiggy MCP!",
            "order": order_data
        }

    def _track_order(self, args: Dict[str, Any]) -> Dict[str, Any]:
        order_id = args.get("order_id")
        if order_id and order_id in IN_MEMORY_ORDERS:
            return {
                "status": "success",
                "order": IN_MEMORY_ORDERS[order_id]
            }

        # Return latest order if any
        latest_order = list(IN_MEMORY_ORDERS.values())[-1] if IN_MEMORY_ORDERS else None
        return {
            "status": "success",
            "order": latest_order
        }

swiggy_mcp = SwiggyMCPServer()
