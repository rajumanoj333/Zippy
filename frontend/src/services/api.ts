export interface SystemStatus {
  status: string;
  app_name: string;
  version: string;
  openai_configured: boolean;
  openai_model: string;
  swiggy_mcp: {
    status: string;
    server_name: string;
    tool_count: number;
  };
  whatsapp_integration: {
    evolution_api_url: string;
    instance: string;
    twilio_configured: boolean;
  };
}

export interface ExecutionLog {
  step: string;
  title: string;
  detail: string;
}

export interface ChatSimulationResponse {
  user_message: string;
  whatsapp_response: string;
  execution_logs: ExecutionLog[];
  mcp_calls: any[];
}

export interface Dish {
  id: string;
  name: string;
  price: number;
  rating: number;
  category: string;
  veg: boolean;
  description: string;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  tags?: string[];
  image_url: string;
  restaurant_id?: string;
  restaurant_name?: string;
  restaurant_rating?: number;
  delivery_time_mins?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  ratings_count: string;
  delivery_time_mins: number;
  price_for_two: number;
  cuisines: string[];
  locality: string;
  image_url: string;
  menu: Dish[];
}

export interface InstamartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  rating: number;
  in_stock: boolean;
  delivery_mins: number;
  calories_per_unit?: number;
  protein_g?: number;
  image_url: string;
}

export interface MealPlanDay {
  day: number;
  meals: {
    breakfast: any;
    lunch: any;
    dinner: any;
  };
  daily_stats: {
    total_cost: number;
    total_protein_g: number;
    total_calories: number;
    within_budget: boolean;
  };
}

export const API_BASE = '/api';

export async function fetchSystemStatus(): Promise<SystemStatus> {
  const res = await fetch(`${API_BASE}/system/status`);
  if (!res.ok) throw new Error('Failed to fetch status');
  return res.json();
}

export async function simulateChat(message: string, phone = "+91 98765 43210"): Promise<ChatSimulationResponse> {
  const res = await fetch(`${API_BASE}/chat/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, phone_number: phone })
  });
  if (!res.ok) throw new Error('Failed to simulate chat');
  return res.json();
}

export async function fetchCatalog(): Promise<{ restaurants: Restaurant[]; instamart_items: InstamartItem[] }> {
  const res = await fetch(`${API_BASE}/food/catalog`);
  if (!res.ok) throw new Error('Failed to fetch catalog');
  return res.json();
}

export async function generateMealPlan(budget = 500, protein = 75, pref = "High Protein", days = 3): Promise<any> {
  const res = await fetch(`${API_BASE}/meal-plan/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ daily_budget: budget, protein_target_g: protein, dietary_preference: pref, days })
  });
  if (!res.ok) throw new Error('Failed to generate meal plan');
  return res.json();
}

export async function fetchMCPTools(): Promise<any> {
  const res = await fetch(`${API_BASE}/mcp/tools`);
  if (!res.ok) throw new Error('Failed to fetch MCP tools');
  return res.json();
}

export async function executeMCPTool(toolName: string, args: any): Promise<any> {
  const res = await fetch(`${API_BASE}/mcp/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool_name: toolName, arguments: args })
  });
  if (!res.ok) throw new Error('Failed to execute MCP tool');
  return res.json();
}

export async function fetchOrders(): Promise<any> {
  const res = await fetch(`${API_BASE}/orders`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function placeQuickOrder(itemId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/orders/quick-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item_id: itemId, quantity: 1 })
  });
  if (!res.ok) throw new Error('Failed to place quick order');
  return res.json();
}
