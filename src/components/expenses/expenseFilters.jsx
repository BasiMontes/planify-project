import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

const categories = [
  "Food & Dining", "Transportation", "Entertainment", "Shopping", 
  "Housing", "Utilities", "Healthcare", "Other"
];

export default function ExpenseFilters({ 
  selectedCategory, 
  setSelectedCategory, 
  dateRange, 
  setDateRange 
}) {
  return (
    <div className="flex gap-3">
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-40 bg-white/10 border-white/30 text-white">
          <Filter className="w-4 h-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="glass-card border-white/20 text-white">
          <SelectItem value="all">Todas las categorías</SelectItem>
          {categories.map(cat => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={dateRange} onValueChange={setDateRange}>
        <SelectTrigger className="w-32 bg-white/10 border-white/30 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="glass-card border-white/20 text-white">
          <SelectItem value="all">Todo el tiempo</SelectItem>
          <SelectItem value="this_week">Esta semana</SelectItem>
          <SelectItem value="this_month">Este mes</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}