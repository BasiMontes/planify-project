import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Search, SlidersHorizontal, X, Calendar as CalendarIcon, Download } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/constants';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const allCategories = [...new Set([...EXPENSE_CATEGORIES.map(c => c.name), ...Object.values(INCOME_CATEGORIES).map(c => c.label.split(" ")[0])])].sort();

export default function TransactionFilters({ onFilterChange, onExport }) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState(undefined);
  const [dateTo, setDateTo] = useState(undefined);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  React.useEffect(() => {
    onFilterChange({ 
      searchTerm,
      date: { from: dateFrom, to: dateTo },
      minAmount, 
      maxAmount, 
      categories: selectedCategories 
    });
  }, [searchTerm, dateFrom, dateTo, minAmount, maxAmount, selectedCategories, onFilterChange]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const resetFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setMinAmount('');
    setMaxAmount('');
    setSelectedCategories([]);
    setIsPopoverOpen(false);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (dateFrom || dateTo) count++;
    if (minAmount || maxAmount) count++;
    if (selectedCategories.length > 0) count++;
    return count;
  }, [dateFrom, dateTo, minAmount, maxAmount, selectedCategories]);

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence>
        {isSearchVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input 
              type="search"
              aria-label="Buscar transacciones"
              placeholder="Buscar por concepto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border-white/30 text-white/90 placeholder-white/50 pl-10 focus:border-white/50 focus:ring-white/20 h-10"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setIsSearchVisible(!isSearchVisible)}
          className="bg-transparent text-white/80 border-white/30 hover:bg-white/10 hover:text-white h-10 w-10"
          aria-label="Buscar"
        >
          <Search className="w-4 h-4" />
        </Button>

        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="bg-transparent text-white/80 border-white/30 hover:bg-white/10 hover:text-white relative h-10 w-10" aria-label="Filtros">
              <SlidersHorizontal className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center" aria-label={`${activeFilterCount} filtros activos`}>
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 glass-card-purple border-white/20 text-white p-0">
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium leading-none">Filtros Avanzados</h4>
                <Button type="button" variant="ghost" size="sm" onClick={resetFilters} className="text-white/70 hover:text-white hover:bg-white/10">
                  <X className="w-4 h-4 mr-1"/>
                  Limpiar
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-from">Fecha desde</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-from"
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal bg-white/10 border-white/30 hover:bg-white/20"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP", { locale: es }) : <span>Fecha inicio</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 glass-card-purple border-white/20" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-to">Fecha hasta</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-to"
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal bg-white/10 border-white/30 hover:bg-white/20"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP", { locale: es }) : <span>Fecha fin</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 glass-card-purple border-white/20" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="min-amount">Monto Mín.</Label>
                  <Input id="min-amount" type="number" placeholder="0" value={minAmount} onChange={e => setMinAmount(e.target.value)} className="bg-white/5 border-white/20"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-amount">Monto Máx.</Label>
                  <Input id="max-amount" type="number" placeholder="1000" value={maxAmount} onChange={e => setMaxAmount(e.target.value)} className="bg-white/5 border-white/20"/>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Categorías</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-white/5 rounded-md">
                  {allCategories.map(cat => (
                    <Button 
                      key={cat}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCategoryToggle(cat)}
                      className={`text-xs rounded-full h-auto py-1 px-3
                        ${selectedCategories.includes(cat) 
                          ? 'bg-emerald-500/80 border-emerald-400/30 text-white'
                          : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                        }`}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 bg-black/10 border-t border-white/10">
              <Button onClick={() => setIsPopoverOpen(false)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">Aplicar Filtros</Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex-grow"></div> {/* Spacer */}

        <Button 
          variant="outline" 
          onClick={onExport}
          className="bg-transparent text-white/80 border-white/30 hover:bg-white/10 hover:text-white h-10"
        >
          <Download className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Exportar</span>
        </Button>
      </div>
    </div>
  );
}