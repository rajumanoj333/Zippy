"""
Zippy Swiggy AI Agent Engine
Supports Google Gemini, OpenAI LLMs, and built-in Smart Intent Dispatcher for Swiggy MCP.
"""

import json
import logging
from typing import Dict, Any, List
from openai import OpenAI

try:
    from backend.config import settings
    from backend.mcp.swiggy_mcp_server import swiggy_mcp
    from backend.whatsapp.whatsapp_service import whatsapp_service
except ImportError:
    from config import settings
    from mcp.swiggy_mcp_server import swiggy_mcp
    from whatsapp.whatsapp_service import whatsapp_service

logger = logging.getLogger("agent_engine")

SYSTEM_PROMPT = """
You are Zippy, an automated WhatsApp AI Assistant integrated with Swiggy MCP (Model Context Protocol).
Your job is to understand user requests in plain conversational language and complete real-world tasks on Swiggy & Swiggy Instamart:
1. Searching for food dishes based on budget, cuisine, high protein, and vegetarian constraints.
2. Searching Instamart for 10-minute grocery items (milk, eggs, bread, snacks).
3. Planning daily or multi-day meals optimized for calories, protein, and daily budget.
4. Building carts, placing orders, and tracking live delivery status.

Always format your response cleanly for WhatsApp with concise, professional text, bold headings (*heading*), bullet points, and clear call-to-action steps. Avoid informal emoji spam.
"""

class ZippyAIAgent:
    def __init__(self):
        self.gemini_key = settings.GEMINI_API_KEY
        self.openai_key = settings.OPENAI_API_KEY
        self.openai_client = OpenAI(api_key=self.openai_key) if self.openai_key else None

    async def process_message(self, user_phone: str, message_text: str) -> Dict[str, Any]:
        logs: List[Dict[str, Any]] = []

        logs.append({
            "step": "RECEIVE_MESSAGE",
            "title": "Received WhatsApp Request",
            "detail": f"Sender: {user_phone} | Message: \"{message_text}\""
        })

        if self.gemini_key:
            try:
                from google import genai
                client = genai.Client(api_key=self.gemini_key)
                logs.append({
                    "step": "AI_REASONING",
                    "title": "Gemini AI Reasoning",
                    "detail": f"Model: {settings.GEMINI_MODEL}"
                })
                prompt = f"{SYSTEM_PROMPT}\nUser request: {message_text}"
                response = client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=prompt,
                )
                
                if response and response.text:
                    return await self._run_smart_fallback_agent(user_phone, message_text, logs, ai_summary=response.text)
            except Exception as e:
                logger.warning(f"Gemini API execution note: {e}")

        if self.openai_client:
            try:
                return await self._run_openai_agent(message_text, logs)
            except Exception as e:
                logger.warning(f"OpenAI Execution note: {e}")

        return await self._run_smart_fallback_agent(user_phone, message_text, logs)

    async def _run_openai_agent(self, text: str, logs: List[Dict[str, Any]]) -> Dict[str, Any]:
        tools = swiggy_mcp.list_tools()
        openai_tools = [
            {
                "type": "function",
                "function": {
                    "name": tool["name"],
                    "description": tool["description"],
                    "parameters": tool["parameters"]
                }
            } for tool in tools
        ]

        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": text}
        ]

        response = self.openai_client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            tools=openai_tools,
            tool_choice="auto"
        )

        response_message = response.choices[0].message

        if response_message.tool_calls:
            messages.append(response_message)
            tool_results_summary = []

            for tool_call in response_message.tool_calls:
                fn_name = tool_call.function.name
                fn_args = json.loads(tool_call.function.arguments)

                logs.append({
                    "step": "MCP_TOOL_EXECUTE",
                    "title": f"Invoking Swiggy MCP Tool: {fn_name}",
                    "detail": f"Arguments: {json.dumps(fn_args, indent=2)}"
                })

                mcp_result = swiggy_mcp.execute_tool(fn_name, fn_args)

                logs.append({
                    "step": "MCP_TOOL_RESULT",
                    "title": f"MCP Tool Output ({fn_name})",
                    "detail": json.dumps(mcp_result, indent=2)
                })

                messages.append({
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "name": fn_name,
                    "content": json.dumps(mcp_result)
                })

                tool_results_summary.append({"tool": fn_name, "result": mcp_result})

            second_response = self.openai_client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=messages
            )

            final_text = second_response.choices[0].message.content or ""
            return {
                "user_message": text,
                "whatsapp_response": final_text,
                "execution_logs": logs,
                "mcp_calls": tool_results_summary
            }
        else:
            final_text = response_message.content or "How can I assist you with Swiggy food or groceries today?"
            return {
                "user_message": text,
                "whatsapp_response": final_text,
                "execution_logs": logs,
                "mcp_calls": []
            }

    async def _run_smart_fallback_agent(
        self, 
        user_phone: str, 
        text: str, 
        logs: List[Dict[str, Any]], 
        ai_summary: str = None
    ) -> Dict[str, Any]:
        lower_text = text.lower()
        mcp_calls = []

        if any(w in lower_text for w in ["track", "where is my order", "status", "order status"]):
            logs.append({
                "step": "INTENT_DETECTED",
                "title": "Detected Intent: Order Tracking",
                "detail": "Executing swiggy_track_order"
            })
            res = swiggy_mcp.execute_tool("swiggy_track_order", {})
            mcp_calls.append({"tool": "swiggy_track_order", "result": res})
            
            order = res.get("order", {})
            if order:
                reply = (
                    f"*SWIGGY LIVE ORDER TRACKING ({order['order_id']})*\n"
                    f"━━━━━━━━━━━━━━━━━━━━━━\n"
                    f"• Status: {order['status']}\n"
                    f"• Restaurant: {order['restaurant_name']}\n"
                    f"• Delivery Partner: {order['delivery_partner']['name']} ({order['delivery_partner']['rating']} ★)\n"
                    f"• Estimated Delivery: In {order['eta_minutes']} mins\n"
                    f"• Address: {order['delivery_address']}"
                )
            else:
                reply = "No active orders found right now."

        elif any(w in lower_text for w in ["plan", "meal plan", "diet", "weekly", "days", "protein plan"]):
            logs.append({
                "step": "INTENT_DETECTED",
                "title": "Detected Intent: AI Meal Planner",
                "detail": "Executing swiggy_create_meal_plan tool"
            })
            budget = 500
            for token in lower_text.split():
                if token.isdigit() and int(token) >= 100:
                    budget = int(token)
                    break
                elif token.startswith("₹") and token[1:].isdigit():
                    budget = int(token[1:])
                    break

            is_veg = "veg" in lower_text and "non" not in lower_text
            pref = "Veg High Protein" if is_veg else "High Protein"
            
            res = swiggy_mcp.execute_tool("swiggy_create_meal_plan", {
                "daily_budget": budget,
                "protein_target_g": 85,
                "dietary_preference": pref,
                "days": 3 if "3" in lower_text else 1
            })
            mcp_calls.append({"tool": "swiggy_create_meal_plan", "result": res})
            reply = whatsapp_service.format_meal_plan_response(res)

        elif any(w in lower_text for w in ["instamart", "grocery", "milk", "eggs", "bread", "avocado", "oats", "whey"]):
            logs.append({
                "step": "INTENT_DETECTED",
                "title": "Detected Intent: Instamart Grocery Search",
                "detail": "Executing swiggy_instamart_search tool"
            })
            query = "milk"
            for kw in ["milk", "eggs", "bread", "avocado", "oats", "whey"]:
                if kw in lower_text:
                    query = kw
                    break

            res = swiggy_mcp.execute_tool("swiggy_instamart_search", {"query": query})
            mcp_calls.append({"tool": "swiggy_instamart_search", "result": res})
            
            items = res.get("items", [])
            if items:
                reply = "*SWIGGY INSTAMART (10-MIN DELIVERY)*\n"
                reply += "━━━━━━━━━━━━━━━━━━━━━━\n\n"
                for idx, it in enumerate(items[:4], 1):
                    reply += f"*{idx}. {it['name']}*\n"
                    reply += f"   Price: ₹{it['price']} • Unit: {it['unit']} • Rating: {it['rating']} ★\n"
                    reply += f"   Delivery: {it['delivery_mins']} mins\n\n"
                reply += "━━━━━━━━━━━━━━━━━━━━━━\n"
                reply += "Reply with *'Order #1'* to checkout immediately."
            else:
                reply = "No Instamart items found matching your search query."

        elif any(w in lower_text for w in ["order #", "order 1", "order 2", "checkout", "place order", "buy now", "confirm"]):
            logs.append({
                "step": "INTENT_DETECTED",
                "title": "Detected Intent: Cart Creation & Order Placement",
                "detail": "Executing swiggy_build_cart followed by swiggy_place_order"
            })
            item_id = "item_101"
            if "biryani" in lower_text or "paneer" in lower_text:
                item_id = "item_102" if "paneer" in lower_text else "item_101"
            elif "bowl" in lower_text or "teriyaki" in lower_text:
                item_id = "item_201"
            elif "milk" in lower_text or "insta" in lower_text:
                item_id = "insta_101"

            cart_res = swiggy_mcp.execute_tool("swiggy_build_cart", {
                "items": [{"item_id": item_id, "quantity": 1}],
                "delivery_address": settings.DEFAULT_LOCATION
            })
            mcp_calls.append({"tool": "swiggy_build_cart", "result": cart_res})
            
            cart_id = cart_res["cart"]["cart_id"]
            order_res = swiggy_mcp.execute_tool("swiggy_place_order", {
                "cart_id": cart_id,
                "payment_method": "Swiggy UPI"
            })
            mcp_calls.append({"tool": "swiggy_place_order", "result": order_res})

            ord_info = order_res["order"]
            reply = (
                f"*SWIGGY ORDER CONFIRMED ({ord_info['order_id']})*\n"
                f"━━━━━━━━━━━━━━━━━━━━━━\n"
                f"• Item: {ord_info['items'][0]['name']} (x{ord_info['items'][0]['quantity']})\n"
                f"• Restaurant: {ord_info['restaurant_name']}\n"
                f"• Total Paid: ₹{ord_info['total_amount']}\n"
                f"• Delivery Address: {ord_info['delivery_address']}\n"
                f"• ETA: {ord_info['eta_minutes']} mins\n"
                f"• Executive: {ord_info['delivery_partner']['name']} ({ord_info['delivery_partner']['phone']})\n\n"
                f"Reply *'Track order'* for live updates."
            )

        else:
            logs.append({
                "step": "INTENT_DETECTED",
                "title": "Detected Intent: Swiggy Food Search",
                "detail": "Executing swiggy_search_food tool"
            })
            high_prot = any(w in lower_text for w in ["protein", "gym", "fit", "healthy", "workout"])
            is_veg = "veg" in lower_text and "non" not in lower_text
            
            max_b = None
            for tok in lower_text.split():
                if tok.isdigit() and int(tok) <= 2000:
                    max_b = int(tok)
                elif tok.startswith("₹") and tok[1:].isdigit():
                    max_b = int(tok[1:])

            res = swiggy_mcp.execute_tool("swiggy_search_food", {
                "query": "biryani" if "biryani" in lower_text else ("bowl" if high_prot else ""),
                "max_budget": max_b,
                "high_protein": high_prot,
                "is_veg": is_veg
            })
            mcp_calls.append({"tool": "swiggy_search_food", "result": res})
            reply = whatsapp_service.format_food_recommendations(res.get("dishes", []))

        logs.append({
            "step": "RESPONSE_GENERATED",
            "title": "WhatsApp Message Formatted",
            "detail": f"Generated response ({len(reply)} chars)"
        })

        return {
            "user_message": text,
            "whatsapp_response": reply,
            "execution_logs": logs,
            "mcp_calls": mcp_calls
        }

agent_engine = ZippyAIAgent()
