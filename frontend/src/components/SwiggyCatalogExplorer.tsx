import React, { useState, useEffect } from 'react';
import { Search, Flame, Clock, Star, ShoppingBag, Send, Check } from 'lucide-react';
import { fetchCatalog, Restaurant, InstamartItem, placeQuickOrder } from '../services/api';

interface SwiggyCatalogExplorerProps {
  onTriggerWhatsAppOrder: (promptText: string) => void;
}

export const SwiggyCatalogExplorer: React.FC<SwiggyCatalogExplorerProps> = ({ onTriggerWhatsAppOrder }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [instamartItems, setInstamartItems] = useState<InstamartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [orderedItem, setOrderedItem] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCatalog();
        setRestaurants(data.restaurants || []);
        setInstamartItems(data.instamart_items || []);
      } catch (e) {
        console.error("Catalog fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const allDishes = restaurants.flatMap(r => 
    r.menu.map(item => ({
      ...item,
      restaurant_name: r.name,
      restaurant_rating: r.rating,
      delivery_time_mins: r.delivery_time_mins
    }))
  );

  const filteredDishes = allDishes.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.restaurant_name?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedFilter === 'high-protein') return (d.protein_g || 0) >= 25;
    if (selectedFilter === 'under-250') return d.price <= 250;
    if (selectedFilter === 'veg') return d.veg;
    if (selectedFilter === 'non-veg') return !d.veg;
    return true;
  });

  const filteredInstamart = instamartItems.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuickOrder = async (item: any) => {
    setOrderedItem(item.id);
    onTriggerWhatsAppOrder(`Order ${item.name} from ${item.restaurant_name || 'Instamart'}`);
    try {
      await placeQuickOrder(item.id);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setOrderedItem(null), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      
      {/* Header & Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-white/[0.07] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center space-x-2">
            <span>Swiggy & Instamart Catalog</span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-swiggy-orange/10 text-swiggy-orange border border-swiggy-orange/20 font-semibold font-sans">
              Live Catalog
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Explore authentic Swiggy dishes & Instamart groceries. Click any item to dispatch an automated WhatsApp order.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish or grocery..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-swiggy-orange transition-colors"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'high-protein', label: 'High Protein (>25g)' },
          { id: 'under-250', label: 'Under ₹250' },
          { id: 'veg', label: 'Veg Only' },
          { id: 'non-veg', label: 'Non-Veg' },
          { id: 'instamart', label: 'Instamart 10-Min' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
              selectedFilter === f.id
                ? 'bg-swiggy-orange text-white shadow-sm font-display'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-white/[0.06]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Food Grid */}
      {selectedFilter !== 'instamart' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Swiggy Restaurant Menu ({filteredDishes.length} Items)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                className="group glass-card-interactive rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                    <img
                      src={dish.image_url}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider ${dish.veg ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950/90 text-rose-400 border border-rose-500/30'}`}>
                        {dish.veg ? 'VEG' : 'NON-VEG'}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-white flex items-center space-x-1 border border-white/10">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{dish.delivery_time_mins} mins</span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-display font-bold text-white text-xs line-clamp-1 group-hover:text-swiggy-orange transition-colors">
                          {dish.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                          <span>{dish.restaurant_name}</span>
                          <span>•</span>
                          <span className="flex items-center text-amber-400 font-medium">
                            <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                            {dish.restaurant_rating}
                          </span>
                        </p>
                      </div>
                      <span className="font-display font-bold text-sm text-emerald-400 shrink-0">
                        ₹{dish.price}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>

                    <div className="flex items-center space-x-2 pt-1 text-[10px] text-slate-300">
                      {dish.protein_g && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                          Protein: {dish.protein_g}g
                        </span>
                      )}
                      {dish.calories && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                          {dish.calories} kcal
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 pt-0">
                  <button
                    onClick={() => handleQuickOrder(dish)}
                    disabled={orderedItem === dish.id}
                    className="w-full py-2 rounded-lg bg-swiggy-orange hover:bg-swiggy-hover text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm"
                  >
                    {orderedItem === dish.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Dispatched to Zippy</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        <span>Order via WhatsApp Agent</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instamart Groceries Grid */}
      {(selectedFilter === 'all' || selectedFilter === 'instamart') && (
        <div className="space-y-3 pt-4 border-t border-white/[0.07]">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center space-x-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            <span>Swiggy Instamart 10-Minute Groceries ({filteredInstamart.length} Items)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredInstamart.map((item) => (
              <div
                key={item.id}
                className="glass-card-interactive rounded-xl p-3.5 flex items-center space-x-3"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover bg-slate-900 shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-0.5">
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    10 MINS
                  </span>
                  <h4 className="font-display font-semibold text-white text-xs truncate">{item.name}</h4>
                  <p className="text-[11px] text-slate-400">{item.unit}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-display font-bold text-xs text-emerald-400">₹{item.price}</span>
                    <button
                      onClick={() => handleQuickOrder(item)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-1 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Order</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
