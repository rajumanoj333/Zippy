"""
WhatsApp Service Integration Module
Supports Evolution API (Open-source WhatsApp API), Twilio API, and Local Simulator Webhooks.
"""

import logging
import httpx
from typing import Dict, Any, Optional
from backend.config import settings

logger = logging.getLogger("whatsapp_service")

class WhatsAppService:
    def __init__(self):
        self.evolution_url = settings.EVOLUTION_API_URL
        self.evolution_key = settings.EVOLUTION_API_KEY
        self.instance = settings.EVOLUTION_INSTANCE

    async def send_whatsapp_message(
        self, 
        recipient_phone: str, 
        text_content: str, 
        media_url: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Sends a WhatsApp message via Evolution API (or falls back gracefully to logged output if offline).
        """
        logger.info(f"[WhatsApp Send] To: {recipient_phone} | Msg: {text_content[:60]}...")
        
        # Clean phone number format
        phone = recipient_phone.replace("whatsapp:", "").replace("+", "").replace(" ", "")

        # Try Evolution API
        try:
            url = f"{self.evolution_url}/message/sendText/{self.instance}"
            headers = {
                "apikey": self.evolution_key,
                "Content-Type": "application/json"
            }
            payload = {
                "number": phone,
                "options": {
                    "delay": 1200,
                    "presence": "composing"
                },
                "textMessage": {
                    "text": text_content
                }
            }

            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(url, json=payload, headers=headers)
                if res.status_code in [200, 201]:
                    return {"status": "sent", "provider": "evolution_api", "response": res.json()}
        except Exception as e:
            logger.warning(f"Evolution API send notification offline or skipped: {e}")

        # Try Twilio API if configured
        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
            try:
                url = f"https://api.twilio.com/2010-04-01/Accounts/{settings.TWILIO_ACCOUNT_SID}/Messages.json"
                data = {
                    "From": settings.TWILIO_PHONE_NUMBER,
                    "To": f"whatsapp:+{phone}",
                    "Body": text_content
                }
                if media_url:
                    data["MediaUrl"] = media_url

                async with httpx.AsyncClient(timeout=5.0) as client:
                    res = await client.post(
                        url, 
                        data=data, 
                        auth=(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
                    )
                    if res.status_code in [200, 201]:
                        return {"status": "sent", "provider": "twilio", "response": res.json()}
            except Exception as e:
                logger.warning(f"Twilio send failed: {e}")

        # Default fallback (Local simulator mock delivery)
        return {
            "status": "delivered_simulator",
            "recipient": recipient_phone,
            "text": text_content,
            "media_url": media_url
        }

    def format_food_recommendations(self, dishes: list) -> str:
        """Formats Swiggy search results into a clean WhatsApp text layout."""
        if not dishes:
            return "❌ *No matching dishes found on Swiggy within your parameters.* Try adjusting budget or cuisine preference!"

        msg = "🚀 *Swiggy AI Agent Recommendations*\n\n"
        for idx, item in enumerate(dishes[:4], 1):
            veg_badge = "🟢 Veg" if item.get("veg") else "🔴 Non-Veg"
            protein_tag = f" (💪 {item['protein_g']}g Protein)" if item.get("protein_g") else ""
            msg += f"*{idx}. {item['name']}*\n"
            msg += f"   📍 {item['restaurant_name']} ({item['restaurant_rating']}⭐)\n"
            msg += f"   💰 ₹{item['price']} | {veg_badge}{protein_tag}\n"
            msg += f"   ⏱️ Delivery in {item['delivery_time_mins']} mins\n\n"

        msg += "💡 *Reply with:* 'Order #1' or 'Add #1 to cart' to proceed!"
        return msg

    def format_meal_plan_response(self, plan_data: dict) -> str:
        """Formats an AI generated meal plan for WhatsApp."""
        days = plan_data.get("plan", [])
        summary = plan_data.get("summary", "Swiggy AI Meal Plan")
        budget = plan_data.get("daily_budget", 500)

        msg = f"🥗 *{summary}*\n"
        msg += f"🎯 *Target Budget:* ₹{budget}/day\n"
        msg += "━━━━━━━━━━━━━━━━━━━\n\n"

        for day in days:
            meals = day.get("meals", {})
            stats = day.get("daily_stats", {})
            msg += f"📅 *DAY {day['day']} MEAL PLAN*\n"
            msg += f"🌅 *Breakfast:* {meals['breakfast']['name']} (₹{meals['breakfast']['price']} - {meals['breakfast']['protein_g']}g Protein)\n"
            msg += f"☀️ *Lunch:* {meals['lunch']['name']} from {meals['lunch']['restaurant']} (₹{meals['lunch']['price']} - {meals['lunch']['protein_g']}g Protein)\n"
            msg += f"🌙 *Dinner:* {meals['dinner']['name']} from {meals['dinner']['restaurant']} (₹{meals['dinner']['price']} - {meals['dinner']['protein_g']}g Protein)\n"
            msg += f"📊 *Total:* ₹{stats['total_cost']} | {stats['total_protein_g']}g Protein | {stats['total_calories']} kcal\n\n"

        msg += "⚡ *Reply:* 'Order Day 1' to place Day 1 meals immediately on Swiggy!"
        return msg

whatsapp_service = WhatsAppService()
