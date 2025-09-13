import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

const categoryColors = {
  "Food & Dining": "bg-emerald-500/20 text-emerald-300",
  "Transportation": "bg-amber-500/20 text-amber-300",
  "Entertainment": "bg-red-500/20 text-red-300",
  "Shopping": "bg-pink-500/20 text-pink-300",
  "Housing": "bg-blue-500/20 text-blue-300",
};

export default function ExpenseCard({ expense }) {
  const isShared = expense.shared_with && expense.shared_with.length > 0;
  
  return (
    <div className="glass-card rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-4">
        <div className="text-center w-12">
          <p className="text-sm text-white/70">{format(new Date(expense.date), 'MMM', { locale: es })}</p>
          <p className="text-xl font-bold text-white">{format(new Date(expense.date), 'dd')}</p>
        </div>
        <div>
          <p className="font-bold text-white">{expense.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={`border-none text-xs ${categoryColors[expense.category] || 'bg-gray-500/20 text-gray-300'}`}>
              {expense.category}
            </Badge>
            {isShared && (
              <Badge variant="outline" className="border-purple-400/50 bg-purple-500/20 text-purple-300 text-xs">
                <Users className="w-3 h-3 mr-1" />
                Compartido
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-white">-£{expense.amount.toLocaleString()}</p>
        <p className="text-xs text-white/60">Pagado por {expense.paid_by.split('@')[0]}</p>
      </div>
    </div>
  );
}
