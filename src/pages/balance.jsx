import React, { useState, useEffect, useCallback } from "react";
import { Income } from "@/entities/Income";
import { Expense } from "@/entities/Expense";
import { getUserEntities } from "../components/utils/SecurityHelper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Download, Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { updateBudgetFromExpense } from "../components/utils/BudgetHelper";
import { useApp } from "../components/contexts/AppContext";
import { UI_TEXT } from "../components/utils/constants";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import CreateIncomeModal from "../components/income/CreateIncomeModal";
import CreateExpenseModal from "../components/expenses/CreateExpenseModal";
import BalanceStats from "../components/balance/BalanceStats";
import TransactionCard from "../components/balance/TransactionCard";
import TransactionFilters from "../components/balance/TransactionFilters";
import { useDebounce } from "../components/hooks/useDebounce";

const TRANSACTIONS_PER_PAGE = 15;

export default function Balance() {
  const { addNotification } = useApp();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all");
  const [filters, setFilters] = useState({});
  const debouncedFilters = useDebounce(filters, 300);
  const [visibleCount, setVisibleCount] = useState(TRANSACTIONS_PER_PAGE);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [incomeData, expenseData] = await Promise.all([
        getUserEntities("income"),
        getUserEntities("expense"),
      ]);
      const combined = [
        ...incomeData.map((item) => ({ ...item, type: "income" })),
        ...expenseData.map((item) => ({ ...item, type: "expense" })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(combined);
      setFilteredTransactions(combined);
    } catch (error) {
      console.error("Error al cargar datos de balance:", error);
      addNotification({
        type: 'error',
        title: 'Error de Carga',
        message: 'No se pudieron cargar las transacciones. Inténtalo de nuevo.'
      });
    }
    setIsLoading(false);
  }, [addNotification]);
  
  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    let results = transactions;
    if (transactionTypeFilter !== "all") {
      results = results.filter(t => t.type === transactionTypeFilter);
    }
    
    if (debouncedFilters.searchTerm) {
      results = results.filter(t => 
        t.title.toLowerCase().includes(debouncedFilters.searchTerm.toLowerCase()) ||
        (t.category && t.category.toLowerCase().includes(debouncedFilters.searchTerm.toLowerCase()))
      );
    }
    if (debouncedFilters.date?.from) {
      results = results.filter(t => new Date(t.date) >= debouncedFilters.date.from);
    }
    if (debouncedFilters.date?.to) {
      results = results.filter(t => new Date(t.date) <= debouncedFilters.date.to);
    }
    if (debouncedFilters.minAmount) {
      results = results.filter(t => t.amount >= parseFloat(debouncedFilters.minAmount));
    }
    if (debouncedFilters.maxAmount) {
      results = results.filter(t => t.amount <= parseFloat(debouncedFilters.maxAmount));
    }
    if (debouncedFilters.categories?.length > 0) {
      results = results.filter(t => debouncedFilters.categories.includes(t.category));
    }

    setFilteredTransactions(results);
    setVisibleCount(TRANSACTIONS_PER_PAGE); // Reset pagination on filter change
  }, [debouncedFilters, transactionTypeFilter, transactions]);


  const handleCreateIncome = useCallback(async (incomeData) => {
    // ... validation logic can be added here
    try {
      await Income.create(incomeData);
      setShowIncomeModal(false);
      addNotification({ type: 'success', title: UI_TEXT.MESSAGES.SUCCESS.INCOME_CREATED });
      loadData();
    } catch (error) {
      addNotification({ type: 'error', title: 'Error', message: 'No se pudo crear el ingreso.' });
    }
  }, [addNotification, loadData]);

  const handleCreateExpense = useCallback(async (expenseData) => {
    // ... validation logic can be added here
    try {
      const newExpense = await Expense.create(expenseData);
      await updateBudgetFromExpense(newExpense);
      setShowExpenseModal(false);
      addNotification({ type: 'success', title: UI_TEXT.MESSAGES.SUCCESS.EXPENSE_CREATED });
      loadData();
    } catch (error) {
      addNotification({ type: 'error', title: 'Error', message: 'No se pudo crear el gasto.' });
    }
  }, [addNotification, loadData]);
  
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      addNotification({ type: 'info', title: 'Sin datos', message: 'No hay transacciones para exportar.' });
      return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Tipo,Concepto,Monto,Moneda,Categoria,Fecha\n";
    
    filteredTransactions.forEach(t => {
      const row = [
        t.type === 'income' ? 'Ingreso' : 'Gasto',
        `"${t.title.replace(/"/g, '""')}"`,
        t.amount,
        t.currency || 'GBP',
        t.category || '',
        t.date
      ].join(",");
      csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "balance_planify.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification({ type: 'success', title: 'Exportado', message: 'Tu archivo CSV se ha descargado.' });
  };

  const currentTransactions = filteredTransactions.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">Balance General</h1>
        <p className="text-white/80">Todos tus ingresos y gastos en un solo lugar.</p>
      </header>
      
      <div className="grid grid-cols-2 gap-3">
         <Button 
          onClick={() => setShowIncomeModal(true)}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-xl shadow-lg w-full"
        >
          <Plus className="w-4 h-4 mr-2" /> Ingreso
        </Button>
        <Button 
          onClick={() => setShowExpenseModal(true)}
          className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-3 rounded-xl shadow-lg w-full"
        >
          <Plus className="w-4 h-4 mr-2" /> Gasto
        </Button>
      </div>
      
      <BalanceStats incomes={transactions.filter(t=>t.type==='income')} expenses={transactions.filter(t=>t.type==='expense')} />

      <main className="glass-card rounded-3xl p-4 sm:p-6 space-y-4">
        <div className="w-full bg-white/10 rounded-xl p-1">
          <div className="grid grid-cols-3 gap-1 w-full">
            <Button onClick={() => setTransactionTypeFilter("all")} size="sm" className={`w-full rounded-lg ${transactionTypeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-transparent text-white/70 hover:bg-white/10'}`}>Todos</Button>
            <Button onClick={() => setTransactionTypeFilter("income")} size="sm" className={`w-full rounded-lg ${transactionTypeFilter === 'income' ? 'bg-white/20 text-white' : 'bg-transparent text-white/70 hover:bg-white/10'}`}>Ingresos</Button>
            <Button onClick={() => setTransactionTypeFilter("expense")} size="sm" className={`w-full rounded-lg ${transactionTypeFilter === 'expense' ? 'bg-white/20 text-white' : 'bg-transparent text-white/70 hover:bg-white/10'}`}>Gastos</Button>
          </div>
        </div>

        <TransactionFilters onFilterChange={setFilters} onExport={handleExportCSV} />
        
        {isLoading ? (
          <div className="space-y-4 pt-4">
            {[...Array(5)].map((_, j) => (
              <Skeleton key={j} className="h-20 w-full rounded-xl bg-white/10" />
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center justify-center h-full">
            <Search className="w-12 h-12 text-white/30 mb-4" />
            <h3 className="text-xl font-bold text-white/90">No se encontraron transacciones</h3>
            <p className="text-white/60">Intenta ajustar tus filtros o agrega un nuevo movimiento.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentTransactions.map((transaction) => (
              <TransactionCard key={`${transaction.type}-${transaction.id}`} transaction={transaction} />
            ))}
          </div>
        )}

        {visibleCount < filteredTransactions.length && !isLoading && (
          <div className="pt-4 flex justify-center">
            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => setVisibleCount(prev => prev + TRANSACTIONS_PER_PAGE)}
            >
              Cargar más
            </Button>
          </div>
        )}
      </main>

      <CreateIncomeModal isOpen={showIncomeModal} onClose={() => setShowIncomeModal(false)} onSubmit={handleCreateIncome} />
      <CreateExpenseModal isOpen={showExpenseModal} onClose={() => setShowExpenseModal(false)} onSubmit={handleCreateExpense} />
    </div>
  );
}