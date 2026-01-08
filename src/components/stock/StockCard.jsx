import React from 'react';
import { Package, TrendingDown, AlertCircle } from 'lucide-react';
import { getStockStatus } from '../../utils/calculations';

const StockCard = ({ item, quantity }) => {
  const status = getStockStatus(quantity);
  
  const getIcon = () => {
    if (quantity === 0) return AlertCircle;
    if (quantity < 50) return TrendingDown;
    return Package;
  };

  const Icon = getIcon();

  const getStyles = () => {
    if (quantity === 0) return { card: "bg-red-50 border-red-200", text: "text-red-700", badge: "bg-red-600" };
    if (quantity < 50) return { card: "bg-amber-50 border-amber-200", text: "text-amber-700", badge: "bg-amber-600" };
    return { card: "bg-green-50 border-green-200", text: "text-green-700", badge: "bg-green-600" };
  };

  const s = getStyles();

  return (
    <div className={`rounded-xl border-2 px-4 py-3 transition-all shadow-sm hover:shadow-md ${s.card} flex items-center justify-between h-24`}>
      <div className="flex-1 min-w-0 pr-2">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">{item.unit}</p>
        <h3 className="text-sm font-bold text-gray-900 truncate mb-1" title={item.name}>
          {item.name}
        </h3>
        <div className={`inline-block px-2 py-0.5 rounded text-[9px] font-black text-white uppercase ${s.badge}`}>
          {status.label}
        </div>
      </div>
      
      <div className="flex flex-col items-end justify-center">
        <Icon className={`${s.text} opacity-20 mb-1`} size={16} />
        <span className={`text-3xl font-black leading-none ${s.text}`}>{quantity}</span>
      </div>
    </div>
  );
};

export default StockCard;