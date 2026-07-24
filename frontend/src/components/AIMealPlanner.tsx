import React, { useState } from 'react';
import { Calendar, DollarSign, Dumbbell, Sparkles, CheckCircle2, ArrowRight, Send, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import { generateMealPlan, MealPlanDay } from '../services/api';

interface AIMealPlannerProps {
  onSendToWhatsApp: (text: string) => void;
}

export const AIMealPlanner: React.FC<AIMealPlannerProps> = ({ onSendToWhatsApp }) => {
  const [budget, setBudget] = useState<number>(500);
  const [protein, setProtein] = useState<number>(80);
  const [preference, setPreference] = useState<string>('High Protein');
  const [daysCount, setDaysCount] = useState<number>(3);
  const [loading, setLoading] = useState(false);
  const [planDays, setPlanDays] = useState<MealPlanDay[]>([]);
  const [selectedDayTab, setSelectedDayTab] = useState<number>(1);

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const res = await generateMealPlan(budget, protein, preference, daysCount);
      setPlanDays(res.plan || []);
      setSelectedDayTab(1);
    } catch (e) {
      console.error("Meal plan generation error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Generate initial plan on load if empty
  React.useEffect(() => {
    handleGeneratePlan();
  }, []);

  const currentDayData = planDays.find(d => d.day === selectedDayTab) || planDays[0];

  const handleExportToWhatsApp = () => {
    if (!planDays.length) return;
    const text = `Plan ${daysCount} days of ${preference} meals under ₹${budget} per day with ${protein}g protein target`;
    onSendToWhatsApp(text);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      
      {/* Top Banner / Generator Wizard Panel */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-[#131926] via-[#161d2d] to-[#0d131f]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-swiggy-orange/15 text-swiggy-orange border border-swiggy-orange/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Meal Planner Wizard</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Automated Swiggy Meal Planning
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Define your daily budget, fitness goals, and preferences. Zippy AI automatically selects dishes across Swiggy restaurants and Instamart to construct complete meal schedules.
            </p>
          </div>

          {/* Form Controls */}
          <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
            
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Daily Budget (₹)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-swiggy-orange"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Target Protein (g)
              </label>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none focus:border-swiggy-orange"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Diet Preference
              </label>
              <select
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-swiggy-orange"
              >
                <option value="High Protein">High Protein</option>
                <option value="Veg High Protein">Pure Veg</option>
                <option value="Keto & Low Carb">Keto / Low Carb</option>
                <option value="Balanced Budget">Balanced</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-end">
              <button
                onClick={handleGeneratePlan}
                disabled={loading}
                className="w-full py-2 px-4 bg-swiggy-orange hover:bg-swiggy-hover text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 shadow-md shadow-orange-500/20"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Planning...' : 'Generate'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Days Tabs Header */}
      {planDays.length > 0 && (
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            {planDays.map((d) => (
              <button
                key={d.day}
                onClick={() => setSelectedDayTab(d.day)}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
                  selectedDayTab === d.day
                    ? 'bg-swiggy-orange text-white shadow-lg shadow-swiggy-orange/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                DAY {d.day} PLAN
              </button>
            ))}
          </div>

          <button
            onClick={handleExportToWhatsApp}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Export & Execute via WhatsApp Agent</span>
          </button>
        </div>
      )}

      {/* Selected Day Meal Schedule Grid */}
      {currentDayData && (
        <div className="space-y-6">
          
          {/* Day Statistics Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold">Total Day Cost</p>
                <p className="text-xl font-extrabold text-white mt-0.5">
                  ₹{currentDayData.daily_stats.total_cost} <span className="text-xs font-normal text-slate-400">/ ₹{budget}</span>
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${currentDayData.daily_stats.within_budget ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400'}`}>
                {currentDayData.daily_stats.within_budget ? 'Within Budget' : 'Over Budget'}
              </span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold">Total Protein Delivered</p>
                <p className="text-xl font-extrabold text-emerald-400 mt-0.5">
                  {currentDayData.daily_stats.total_protein_g}g <span className="text-xs font-normal text-slate-400">/ {protein}g target</span>
                </p>
              </div>
              <Dumbbell className="w-6 h-6 text-emerald-400 opacity-80" />
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold">Estimated Calories</p>
                <p className="text-xl font-extrabold text-amber-400 mt-0.5">
                  {currentDayData.daily_stats.total_calories} <span className="text-xs font-normal text-slate-400">kcal</span>
                </p>
              </div>
              <Sparkles className="w-6 h-6 text-amber-400 opacity-80" />
            </div>

          </div>

          {/* Meals Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Breakfast */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                  <span>🌅 Breakfast</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-800 rounded text-slate-300">
                  {currentDayData.meals.breakfast.source}
                </span>
              </div>
              <h4 className="font-bold text-white text-base">
                {currentDayData.meals.breakfast.name}
              </h4>
              <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-800">
                <span className="font-extrabold text-emerald-400">₹{currentDayData.meals.breakfast.price}</span>
                <span className="font-semibold text-slate-400">💪 {currentDayData.meals.breakfast.protein_g}g Protein</span>
              </div>
            </div>

            {/* Lunch */}
            <div className="glass-panel p-5 rounded-2xl border border-swiggy-orange/30 bg-swiggy-orange/5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-swiggy-orange uppercase tracking-wider flex items-center space-x-1">
                  <span>☀️ Lunch</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-swiggy-orange/20 text-swiggy-orange rounded">
                  {currentDayData.meals.lunch.restaurant}
                </span>
              </div>
              <h4 className="font-bold text-white text-base">
                {currentDayData.meals.lunch.name}
              </h4>
              <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-800">
                <span className="font-extrabold text-emerald-400">₹{currentDayData.meals.lunch.price}</span>
                <span className="font-semibold text-slate-400">💪 {currentDayData.meals.lunch.protein_g}g Protein</span>
              </div>
            </div>

            {/* Dinner */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1">
                  <span>🌙 Dinner</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-800 rounded text-slate-300">
                  {currentDayData.meals.dinner.restaurant}
                </span>
              </div>
              <h4 className="font-bold text-white text-base">
                {currentDayData.meals.dinner.name}
              </h4>
              <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-800">
                <span className="font-extrabold text-emerald-400">₹{currentDayData.meals.dinner.price}</span>
                <span className="font-semibold text-slate-400">💪 {currentDayData.meals.dinner.protein_g}g Protein</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
