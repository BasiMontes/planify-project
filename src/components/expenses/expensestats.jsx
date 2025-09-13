import React from 'react';
import { TrendingUp, TrendingDown, Calendar, PieChart } from 'lucide-react';

export default function ExpenseStats({ expenses }) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
  
  const thisMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
  const lastMonthExpenses = expenses.filter(e => e.date.startsWith(lastMonth));
  
  const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const monthlyChange = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100) : 0;
  
  const topCategory = thisMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
  
  const topCategoryName = Object.keys(topCategory).reduce((a, b) => 
    topCategory[a] > topCategory[b] ? a : b, Object.keys(topCategory)[0]
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="glass-card rounded-2xl p-4 text-center">
        <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <p className="text-lg font-bold text-white">£{thisMonthTotal.toFixed(0)}</p>
        <p className="text-white/70 text-xs">Este Mes</p>
      </div>

      <div className="glass-card rounded-2xl p-4 text-center">
        <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center ${
          monthlyChange >= 0 ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
        }`}>
          {monthlyChange >= 0 ? (
            <TrendingUp className="w-5 h-5 text-white" />
          ) : (
            <TrendingDown className="w-5 h-5 text-white" />
          )}
        </div>
        <p className={`text-lg font-bold ${monthlyChange >= 0 ? 'text-red-300' : 'text-emerald-300'}`}>
          {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(1)}%
        </p>
        <p className="text-white/70 text-xs">vs Mes Anterior</p>
      </div>

      <div className="glass-card rounded-2xl p-4 text-center">
        <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
          <PieChart className="w-5 h-5 text-white" />
        </div>
        <p className="text-lg font-bold text-white">{thisMonthExpenses.length}</p>
        <p className="text-white/70 text-xs">Gastos Registrados</p>
      </div>

      <div className="glass-card rounded-2xl p-4 text-center">
        <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-sm">#1</span>
        </div>
        <p className="text-sm font-bold text-white truncate">{topCategoryName || 'N/A'}</p>
        <p className="text-white/70 text-xs">Top Categoría</p>
      </div>
    </div>
  );
}