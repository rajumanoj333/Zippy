import React, { useState, useEffect } from 'react';
import { MapPin, Bike, CheckCircle2, Clock, Phone, User, ShoppingBag, ShieldCheck } from 'lucide-react';
import { fetchOrders } from '../services/api';

export const LiveOrderTracker: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await fetchOrders();
        setOrders(res.active_orders || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const latestOrder = orders.length > 0 ? orders[orders.length - 1] : null;

  const steps = [
    { label: 'Order Placed', time: '12 mins ago', completed: true },
    { label: 'Kitchen Preparing', time: '8 mins ago', completed: true },
    { label: 'Rider Picked Up', time: '3 mins ago', completed: true },
    { label: 'Out for Delivery', time: 'Live', active: true },
    { label: 'Delivered', time: 'ETA 8 mins', completed: false }
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold mb-2">
            <Bike className="w-3.5 h-3.5" />
            <span>Swiggy Live Delivery</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Active Order Tracking
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time status updates synced with WhatsApp Agent notifications.
          </p>
        </div>
      </div>

      {latestOrder ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Order Details & Stepper (7 cols) */}
          <div className="md:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-swiggy-orange uppercase">
                  Order ID: {latestOrder.order_id}
                </span>
                <h3 className="font-extrabold text-lg text-white">
                  {latestOrder.restaurant_name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Est. Arrival</span>
                <span className="text-lg font-extrabold text-emerald-400 flex items-center space-x-1">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{latestOrder.eta_minutes} Mins</span>
                </span>
              </div>
            </div>

            {/* Status Stepper */}
            <div className="space-y-4 py-2">
              {steps.map((s, idx) => (
                <div key={idx} className="flex items-start space-x-3 relative">
                  {idx !== steps.length - 1 && (
                    <div className={`absolute left-3 top-6 bottom-0 w-0.5 ${s.completed ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                  )}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                    s.active
                      ? 'bg-swiggy-orange text-white ring-4 ring-swiggy-orange/30 animate-pulse'
                      : s.completed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    {s.completed ? <CheckCircle2 className="w-4 h-4" /> : (idx + 1)}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${s.active ? 'text-swiggy-orange' : s.completed ? 'text-white' : 'text-slate-500'}`}>
                      {s.label}
                    </h4>
                    <p className="text-[10px] text-slate-400">{s.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Rider Information */}
            {latestOrder.delivery_partner && (
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">{latestOrder.delivery_partner.name}</h4>
                    <p className="text-[11px] text-slate-400">Swiggy Valued Delivery Executive ({latestOrder.delivery_partner.rating}⭐)</p>
                  </div>
                </div>

                <a
                  href={`tel:${latestOrder.delivery_partner.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Rider</span>
                </a>
              </div>
            )}

          </div>

          {/* Delivery Map & Items Summary (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Visual Simulated Delivery Map */}
            <div className="glass-panel rounded-3xl p-4 border border-slate-800 space-y-3 relative overflow-hidden">
              <div className="h-48 rounded-2xl bg-slate-950 relative overflow-hidden flex items-center justify-center border border-slate-800">
                {/* Simulated Radar Map Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
                
                {/* Restaurant Dot */}
                <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
                  <div className="w-4 h-4 bg-swiggy-orange rounded-full animate-ping absolute opacity-75" />
                  <div className="w-4 h-4 bg-swiggy-orange rounded-full flex items-center justify-center text-[8px] text-white font-bold">R</div>
                  <span className="text-[9px] font-bold text-white bg-slate-900/90 px-1.5 py-0.5 rounded mt-1">Kitchen</span>
                </div>

                {/* Animated Rider Dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/50 animate-bounce">
                    <Bike className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 bg-slate-900/90 px-1.5 py-0.5 rounded mt-1">On the way</span>
                </div>

                {/* Customer Home Dot */}
                <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center">
                  <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">H</div>
                  <span className="text-[9px] font-bold text-white bg-slate-900/90 px-1.5 py-0.5 rounded mt-1">Home</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 text-center flex items-center justify-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-swiggy-orange" />
                <span>Delivery Address: {latestOrder.delivery_address}</span>
              </p>
            </div>

            {/* Items Summary */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center space-x-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-swiggy-orange" />
                <span>Ordered Dishes ({latestOrder.items.length})</span>
              </h4>

              <div className="space-y-2 text-xs">
                {latestOrder.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-slate-800/60 text-slate-200">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2 text-sm font-extrabold text-white">
                  <span>Total Amount Paid</span>
                  <span className="text-emerald-400">₹{latestOrder.total_amount}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-3 border border-slate-800">
          <Bike className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-bold text-white text-base">No active orders right now</h3>
          <p className="text-xs text-slate-400">
            Use the WhatsApp simulator or Food Catalog to place an order!
          </p>
        </div>
      )}

    </div>
  );
};
