# ⚡ Zippy — WhatsApp-Based AI Assistant for Automated Swiggy & Instamart Ordering

> **Transforming simple WhatsApp text messages into real-world Swiggy food & grocery orders in seconds.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React 18](https://img.shields.io/badge/React-18.2.0-61DAFB.svg?style=flat&logo=react)](https://reactjs.org)
[![Swiggy MCP](https://img.shields.io/badge/Swiggy-MCP--Protocol-FF6600.svg?style=flat)](https://swiggy.com)
[![WhatsApp Evolution API](https://img.shields.io/badge/WhatsApp-Evolution--API-25D366.svg?style=flat&logo=whatsapp)](https://github.com/EvolutionAPI/evolution-api)

---

## 🎯 What Problem Are We Solving?

### The Friction in Traditional Food & Grocery Ordering
Today, when a customer wants to order food or groceries, they face significant friction:
1. **Decision Fatigue & Endless Scrolling**: Spending **20 to 30 minutes** browsing hundreds of restaurants and grocery categories.
2. **Manual Rating & Review Comparison**: Reading customer reviews across multiple places trying to judge quality and portion size.
3. **Discount & Coupon Hunting**: Manually trying 5-10 coupon codes to figure out which one provides the best price reduction.
4. **Macro & Budget Friction**: Fitness-conscious users have to manually calculate calories, protein, and costs for every single dish.

### 💡 The Zippy Solution: "Message-to-Action"
**Zippy** eliminates all this friction by acting as a personalized AI Concierge on WhatsApp. Instead of opening apps and clicking dozens of buttons, the customer simply sends a single natural text message:

> *"Order me a high-protein lunch under ₹300 in Indiranagar"*

Zippy's AI agent instantly interprets intent, checks real-time Swiggy catalog ratings, computes optimal protein/calorie values, automatically applies discounts, builds the cart, and executes the order end-to-end.

---

## 🤝 Win-Win Value Proposition

| For Customers 🙋‍♂️ | For Merchants & Swiggy 🚀 |
| :--- | :--- |
| **Saves 25+ Minutes**: Zero app switching or manual searching. | **Higher Order Conversion**: Removes drop-offs during long searches. |
| **Instant Personalization**: Matches exact budget, dietary preferences, and macro targets. | **Automated Meal Planning**: Increases multi-item basket sizes. |
| **Auto-Best Price**: Automatically calculates taxes, delivery fees, and top coupon discounts. | **Zero Friction Channel**: Customers order directly inside WhatsApp where they spend most of their time. |

---

## 🛠️ Tech Stack

### Backend Infrastructure
- **Framework**: Python 3.12, FastAPI, Uvicorn
- **AI Agent Engine**: OpenAI (GPT-4o-mini) & Google Gemini (2.5-Flash) Tool Calling Integration
- **MCP Server**: Swiggy Model Context Protocol (MCP) Standard Implementation
- **WhatsApp Integration**: Evolution API (Open-source WhatsApp Engine) & Twilio Webhook Router
- **Data Validation**: Pydantic v2, HTTPX

### Frontend Application (21st.dev UI)
- **Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, Custom Dark Glassmorphic Design System (`#0B0F17`, Swiggy Orange `#FF6600`, Glowing Emerald `#10B981`)
- **Icons**: Lucide React

---

## 📐 Architecture & Low-Level Design (LLD)

### 1. High-Level System Architecture

```mermaid
graph TD
    User([📱 Customer on WhatsApp]) -->|Text Message| WhatsAppProvider[WhatsApp Provider / Evolution API]
    WhatsAppProvider -->|HTTP POST Webhook| FastAPI[⚡ FastAPI Backend Router]
    
    subgraph Zippy Core Engine
        FastAPI -->|Extract Intent| AIAgent[🤖 Zippy AI Agent Engine]
        AIAgent -->|OpenAI / Gemini LLM| Reasoning[🧠 Intent Reasoning & Parameter Extraction]
        Reasoning -->|JSON-RPC Call| MCPServer[🔌 Swiggy MCP Server]
    end

    subgraph Swiggy MCP Tool Registry
        MCPServer --> Tool1[swiggy_search_food]
        MCPServer --> Tool2[swiggy_instamart_search]
        MCPServer --> Tool3[swiggy_create_meal_plan]
        MCPServer --> Tool4[swiggy_build_cart]
        MCPServer --> Tool5[swiggy_place_order]
        MCPServer --> Tool6[swiggy_track_order]
    end

    Tool1 & Tool2 & Tool3 & Tool4 & Tool5 & Tool6 --> Database[( Swiggy Food & Instamart Catalog)]
    
    AIAgent -->|Formatted Message| WhatsAppProvider
    FastAPI -->|Live Telemetry SSE| WebDashboard[🖥️ 21st.dev UI Dashboard]
```

---

### 2. Low-Level Execution Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant WhatsApp as Evolution API
    participant Backend as FastAPI Server
    participant Agent as Zippy AI Agent
    participant MCP as Swiggy MCP Server
    participant SwiggyDB as Swiggy Catalog DB

    Customer->>WhatsApp: "Order high-protein lunch under ₹300"
    WhatsApp->>Backend: POST /api/whatsapp/webhook
    Backend->>Agent: process_message(sender, text)
    
    Note over Agent: 1. Intent Detection: Food Search<br/>2. Extract Parameters: max_budget=300, high_protein=true
    
    Agent->>MCP: execute_tool("swiggy_search_food", {max_budget: 300, high_protein: true})
    MCP->>SwiggyDB: Query restaurants & dishes matching criteria
    SwiggyDB-->>MCP: Returns High-Protein Teriyaki Chicken Bowl (₹279, 45g Protein)
    MCP-->>Agent: JSON Result Payload
    
    Agent->>MCP: execute_tool("swiggy_build_cart", {items: [{id: "item_201", qty: 1}]})
    MCP-->>Agent: Cart Generated (Total: ₹279 + ₹14 Tax - ₹50 Coupon = ₹243)
    
    Agent->>MCP: execute_tool("swiggy_place_order", {cart_id: "CART-89210"})
    MCP-->>Agent: Order Placed (SWG-89210)
    
    Agent->>Backend: Format WhatsApp Text with Emojis & Order Summary
    Backend->>WhatsApp: Send Response Text
    WhatsApp->>Customer: 🚀 Order Confirmed! SWG-89210 (ETA 20 mins)
```

---

## 🎬 How to Run a Demo

For complete step-by-step instructions on running the Web UI sandbox and testing prompt scenarios, see our dedicated demo guide:

📖 **[Read the Demo Guide (DEMO.md)](file:///workspaces/Zippy/DEMO.md)**

---

## 📂 Repository Structure

```text
Zippy/
├── backend/
│   ├── agent/
│   │   └── agent_engine.py       # AI Agent & Intent Parser
│   ├── mcp/
│   │   ├── swiggy_mcp_server.py  # Swiggy MCP Tool Execution Server
│   │   └── swiggy_catalog.py     # Authentic Swiggy & Instamart Data
│   ├── whatsapp/
│   │   └── whatsapp_service.py   # Evolution API & Twilio Client
│   ├── api/
│   │   └── routes.py             # FastAPI Endpoints
│   ├── config.py                 # Configuration Settings
│   └── main.py                   # FastAPI Application Entrypoint
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── WhatsAppSimulator.tsx
│   │   │   ├── SwiggyCatalogExplorer.tsx
│   │   │   ├── AIMealPlanner.tsx
│   │   │   ├── MCPTelemetryInspector.tsx
│   │   │   ├── LiveOrderTracker.tsx
│   │   │   └── ConfigModal.tsx
│   │   ├── services/
│   │   │   └── api.ts            # API Client
│   │   ├── App.tsx
│   │   └── index.css             # 21st.dev Glassmorphism Styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── .env.example
├── DEMO.md                        # Walkthrough & Testing Scenarios
└── README.md                      # Project Documentation
```

---

## ⚡ Quick Start

1. **Start Backend**:
   ```bash
   cd backend && python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
   ```

2. **Start Frontend**:
   ```bash
   cd frontend && npm run dev
   ```

3. **Open Application**: Navigate to `http://localhost:3000`
