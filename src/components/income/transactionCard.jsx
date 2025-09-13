
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Repeat } from 'lucide-react';

const categoryColors = {
  "Vivienda": "bg-blue-500/20 text-blue-300",
  "Comida": "bg-emerald-500/20 text-emerald-300",
  "Transporte": "bg-amber-500/20 text-amber-300",
  "Ocio": "bg-red-500/20 text-red-300",
  "Salud": "bg-purple-500/20 text-purple-300",
  "Compras": "bg-pink-500/20 text-pink-300",
  "Salario": "bg-emerald-500/20 text-emerald-300",
  "Freelance": "bg-blue-500/20 text-blue-300",
  "Inversiones": "bg-yellow-500/20 text-yellow-300",
};

export default function TransactionCard({ transaction }) {
  const isIncome = transaction.type === 'income';
  
  return (
    <div className="glass-card rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="text-center w-12 flex-shrink-0">
          <p className="text-sm text-white/70">{format(new Date(transaction.date), 'MMM', { locale: es })}</p>
          <p className="text-xl font-bold text-white">{format(new Date(transaction.date), 'dd')}</p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-white truncate mb-1">{transaction.title}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`border-none text-xs ${categoryColors[transaction.category] || 'bg-gray-500/20 text-gray-300'}`}>
              {transaction.category}
            </Badge>
            {transaction.is_recurring && (
              <Badge variant="outline" className="border-purple-400/50 bg-purple-500/20 text-purple-300 text-xs">
                <Repeat className="w-3 h-3 mr-1" />
                {transaction.frequency}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="text-right pl-4">
        <p className={`text-lg font-bold ${isIncome ? 'text-emerald-300' : 'text-red-300'}`}>
          {isIncome ? '+' : '-'}£{Math.abs(transaction.amount).toLocaleString()}
        </p>
        <p className="text-xs text-white/60">{isIncome ? 'Ingreso' : 'Gasto'}</p>
      </div>
    </div>
  );
}
