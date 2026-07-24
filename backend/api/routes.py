"""
FastAPI Router Definitions for Zippy Swiggy AI Assistant
"""

from typing import Dict, Any, Optional, List
from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from pydantic import BaseModel
from backend.config import settings
from backend.agent.agent_engine import agent_engine
from backend.mcp.swiggy_mcp_server import swiggy_mcp, IN_MEMORY_ORDERS, IN_MEMORY_CARTS
from backend.mcp.swiggy_catalog import FOOD_RESTAURANTS, INSTAMART_ITEMS
from backend.whatsapp.whatsapp_service import whatsapp_service

router = APIRouter(prefix="/api")

# --- Request / Response Models ---
class ChatSimulationRequest(BaseModel):
    phone_number: Optional[str] = "+91 98765 43210"
    message: str

class MCPExecuteRequest(BaseModel):
    tool_name: str
    arguments: Dict[str, Any] = {}

class MealPlanRequest(BaseModel):
    daily_budget: float = 500
    protein_target_g: float = 75
    dietary_preference: str = "High Protein"
    days: int = 3

class DirectOrderRequest(BaseModel):
    item_id: str
    quantity: int = 1
    delivery_address: Optional[str] = "Flat 302, Indiranagar, Bengaluru"
    payment_method: Optional[str] = "Swiggy UPI"

# --- Endpoints ---

@router.get("/system/status")
async def get_system_status():
    """Returns real-time health and connection status of Zippy backend services."""
    return {
        "status": "online",
        "app_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "openai_configured": bool(settings.OPENAI_API_KEY),
        "openai_model": settings.OPENAI_MODEL,
        "swiggy_mcp": {
            "status": "active",
            "server_name": swiggy_mcp.name,
            "tool_count": len(swiggy_mcp.list_tools())
        },
        "whatsapp_integration": {
            "evolution_api_url": settings.EVOLUTION_API_URL,
            "instance": settings.EVOLUTION_INSTANCE,
            "twilio_configured": bool(settings.TWILIO_ACCOUNT_SID)
        }
    }

@router.post("/chat/simulate")
async def simulate_chat(req: ChatSimulationRequest):
    """
    Simulates sending a WhatsApp message to Zippy AI Agent.
    Runs the agent reasoning, calls Swiggy MCP tools, and returns execution logs + WhatsApp text.
    """
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty")

    result = await agent_engine.process_message(req.phone_number, req.message)
    return result

@router.post("/whatsapp/webhook")
async def whatsapp_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Inbound Webhook for Evolution API & Twilio WhatsApp message events.
    Receives real WhatsApp user text, triggers Zippy AI agent, and sends response back to user's WhatsApp.
    """
    try:
        body = await request.json()
    except Exception:
        body = {}

    # Extract message & sender from Evolution API webhook schema or Twilio
    sender = "+91 98765 43210"
    message_text = ""

    # Evolution API payload parsing
    if "data" in body and "message" in body.get("data", {}):
        msg_data = body["data"]
        sender = msg_data.get("key", {}).get("remoteJid", sender)
        message_text = (
            msg_data.get("message", {}).get("conversation") or
            msg_data.get("message", {}).get("extendedTextMessage", {}).get("text") or ""
        )
    # Generic payload fallback
    elif "message" in body:
        message_text = str(body["message"])
        sender = str(body.get("sender", sender))

    if message_text:
        # Run agent asynchronously
        agent_result = await agent_engine.process_message(sender, message_text)
        response_text = agent_result["whatsapp_response"]
        
        # Dispatch WhatsApp response via Evolution API / Twilio in background
        background_tasks.add_task(
            whatsapp_service.send_whatsapp_message, 
            recipient_phone=sender, 
            text_content=response_text
        )

        return {"status": "processed", "sender": sender, "reply": response_text}

    return {"status": "ignored", "reason": "No valid text content found in webhook body"}

@router.get("/mcp/tools")
async def get_mcp_tools():
    """Lists all available Swiggy Model Context Protocol (MCP) tools and schemas."""
    return {
        "mcp_server": swiggy_mcp.name,
        "version": swiggy_mcp.version,
        "tools": swiggy_mcp.list_tools()
    }

@router.post("/mcp/execute")
async def execute_mcp_tool(req: MCPExecuteRequest):
    """Executes a Swiggy MCP tool directly with raw parameters."""
    result = swiggy_mcp.execute_tool(req.tool_name, req.arguments)
    return {
        "tool_name": req.tool_name,
        "arguments": req.arguments,
        "result": result
    }

@router.get("/food/catalog")
async def get_food_catalog():
    """Returns complete Swiggy restaurants & Instamart catalog data."""
    return {
        "restaurants": FOOD_RESTAURANTS,
        "instamart_items": INSTAMART_ITEMS
    }

@router.post("/meal-plan/generate")
async def generate_meal_plan(req: MealPlanRequest):
    """Generates an AI meal plan based on user macro targets and daily budget."""
    result = swiggy_mcp.execute_tool("swiggy_create_meal_plan", {
        "daily_budget": req.daily_budget,
        "protein_target_g": req.protein_target_g,
        "dietary_preference": req.dietary_preference,
        "days": req.days
    })
    return result

@router.get("/orders")
async def get_orders():
    """Returns all active & completed Swiggy orders."""
    return {
        "active_orders": list(IN_MEMORY_ORDERS.values()),
        "carts": list(IN_MEMORY_CARTS.values())
    }

@router.post("/orders/quick-order")
async def create_quick_order(req: DirectOrderRequest):
    """Directly builds cart and places a Swiggy order for selected dish."""
    cart_res = swiggy_mcp.execute_tool("swiggy_build_cart", {
        "items": [{"item_id": req.item_id, "quantity": req.quantity}],
        "delivery_address": req.delivery_address
    })
    cart_id = cart_res["cart"]["cart_id"]
    order_res = swiggy_mcp.execute_tool("swiggy_place_order", {
        "cart_id": cart_id,
        "payment_method": req.payment_method
    })
    return order_res
