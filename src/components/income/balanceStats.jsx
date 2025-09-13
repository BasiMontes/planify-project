import React from 'react';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';

export default function BalanceStats({ expenses, incomes }) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const thisMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
  const thisMonthIncomes = incomes.filter(i => i.date.startsWith(currentMonth));
  
  const totalExpenses = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncomes = thisMonthIncomes.reduce((sum, i) => sum + i.amount, 0);
  const netBalance = totalIncomes - totalExpenses;
  const savings = netBalance > 0 ? netBalance : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="glass-card rounded-2xl p-4 text-center">
        <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <p className="text-lg font-bold text-emerald-300">£{totalIncomes.toFixed(0)}</p>
        <p className="text-white/70 text-xs">Ingresos este Mes</p>
      </div>

      <div className="glass-card rounded-2xl p-4 text-center">
        <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
          <TrendingDown className="w-5 h-5 text-white" />
        </div>
        <p className="text-lg font-bold text-red-300">£{totalExpenses.toFixed(0)}</p>
        <p className="text-white/70 text-xs">Gastos este Mes</p>
      </div>

      <div className="glass-card rounded-2xl p-4 text-center">
        <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center ${
          netBalance >= 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
        }`}>
          <DollarSign className="w-5 h-5 text-white" />
        </div>
        <p className={`text-lg font-bold ${netBalance >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
          £{netBalance.toFixed(0)}
        </p>
        <p className="text-white/70 text-xs">Balance Neto</p>
      </div>

      <div className="glass-card rounded-2xl p-4 text-center">
        <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <p className="text-lg font-bold text-purple-300">£{savings.toFixed(0)}</p>
        <p className="text-white/70 text-xs">Ahorrado este Mes</p>
      </div>
    </div>
  );
}