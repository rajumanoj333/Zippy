# 🎬 Zippy — Live Demo & Testing Walkthrough Guide

This document provides a step-by-step guide on how to run, test, and demonstrate **Zippy**, the WhatsApp-based AI Assistant powered by Swiggy MCP APIs.

---

## ⚡ Quick Prerequisites & Local Start

### 1. Start FastAPI Backend (Port 8000)
```bash
cd backend
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```
- Verify status endpoint: `http://localhost:8000/api/system/status`

### 2. Start 21st.dev React Frontend (Port 3000)
```bash
cd frontend
npm run dev
```
- Access web application: `http://localhost:3000`

---

## 📱 Demo Scenario 1: Natural Language WhatsApp Chat Sandbox

Open `http://localhost:3000` in your browser. You will see the authentic mobile WhatsApp simulator frame on the left and live agent reasoning logs on the right.

### Try These Prompt Scenarios:

#### Prompt 1: Budget & High-Protein Food Search
```text
Order me a high protein lunch under ₹300 in Indiranagar
```
* **What happens**:
  1. Zippy detects intent `Swiggy Food Search`.
  2. Dispatches `swiggy_search_food` MCP tool with parameters: `{"max_budget": 300, "high_protein": true}`.
  3. Returns curated dish options with restaurant name, ratings, protein count (`45g Protein`), and delivery ETA.

#### Prompt 2: 10-Minute Instamart Grocery Search
```text
Order 2L Amul Taaza milk and 6 eggs from Instamart
```
* **What happens**:
  1. Zippy detects `Instamart Grocery Search`.
  2. Dispatches `swiggy_instamart_search` MCP tool.
  3. Displays grocery items with stock status, unit pricing, and 10-min delivery time.

#### Prompt 3: End-to-End Order Placement & Checkout
```text
Order paneer biryani under ₹300
```
* **What happens**:
  1. Zippy finds Paneer Biryani on Swiggy MCP catalog.
  2. Dispatches `swiggy_build_cart` tool (calculates subtotal, GST taxes, delivery charges, and ₹50 discount).
  3. Dispatches `swiggy_place_order` tool.
  4. Formats confirmation message with Order ID (`SWG-XXXXX`), payment status, delivery partner details, and ETA.

#### Prompt 4: Live Order Tracking
```text
Where is my order?
```
* **What happens**:
  1. Dispatches `swiggy_track_order` MCP tool.
  2. Returns live status (*"Out for Delivery"*), delivery rider name, phone number, and arrival countdown.

---

## 🥗 Demo Scenario 2: Interactive AI Meal Planner

1. Navigate to the **AI Meal Planner** tab in the top navbar.
2. Set your parameters:
   - **Daily Budget**: `₹500`
   - **Target Protein**: `85g`
   - **Diet Preference**: `High Protein`
3. Click **Generate Plan**.
4. Review the day-by-day visual timeline (Breakfast from Instamart, Lunch & Dinner from Swiggy top restaurants).
5. Click **Export & Execute via WhatsApp Agent** to dispatch the complete meal schedule to Zippy on WhatsApp!

---

## ⚙️ Demo Scenario 3: Swiggy MCP Tool Telemetry Sandbox

1. Navigate to **Swiggy MCP Tools** tab.
2. Select any tool: `swiggy_search_food`, `swiggy_instamart_search`, `swiggy_create_meal_plan`, `swiggy_build_cart`, or `swiggy_place_order`.
3. Inspect input JSON parameters and click **Run Tool Call**.
4. View the raw JSON-RPC response payload returned by the Swiggy MCP Server.

---

## 📡 Demo Scenario 4: Terminal & API Endpoint Testing

You can test the backend directly via `curl` terminal commands:

### 1. Test Agent Simulation API
```bash
curl -X POST "http://localhost:8000/api/chat/simulate" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Plan 3 days of healthy meals under ₹500 per day",
    "phone_number": "+91 98765 43210"
  }'
```

### 2. Test Inbound WhatsApp Webhook (Evolution API / Twilio)
```bash
curl -X POST "http://localhost:8000/api/whatsapp/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Order paneer biryani under ₹300",
    "sender": "+91 98765 43210"
  }'
```
