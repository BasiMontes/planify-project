import React, { useState, useEffect, useCallback } from "react";
import { Expense } from "@/entities/Expense";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Receipt, Search, Filter } from "lucide-react";
import { getUserEntities } from "../components/utils/SecurityHelper";
import { updateBudgetFromExpense } from "../components/utils/BudgetHelper";

import CreateExpenseModal from "../components/expenses/CreateExpenseModal";
import ExpenseCard from "../components/expenses/ExpenseCard";
import ExpenseFilters from "../components/expenses/ExpenseFilters";
import ExpenseStats from "../components/expenses/ExpenseStats";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateRange, setDateRange] = useState("this_month");

  const filterExpenses = useCallback(() => {
    let filtered = [...expenses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(expense => 
        expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }

    // Date range filter
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    if (dateRange === "this_month") {
      filtered = filtered.filter(expense => new Date(expense.date) >= startOfMonth);
    } else if (dateRange === "this_week") {
      filtered = filtered.filter(expense => new Date(expense.date) >= startOfWeek);
    }

    setFilteredExpenses(filtered);
  }, [expenses, searchTerm, selectedCategory, dateRange]);

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [filterExpenses]);

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const data = await getUserEntities("expense");
      setExpenses(data);
    } catch (error) {
      console.error("Error al cargar gastos:", error);
    }
    setIsLoading(false);
  };

  const handleCreateExpense = async (expenseData) => {
    try {
      const newExpense = await Expense.create(expenseData);
      
      // Update related budgets
      await updateBudgetFromExpense(newExpense);
      
      setShowCreateModal(false);
      loadExpenses();
    } catch (error) {
      console.error("Error al crear gasto:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">Registro de Gastos</h1>
          <p className="text-white/80">Todos tus movimientos en un solo lugar.</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Añadir Gasto
        </Button>
      </div>

      <ExpenseStats expenses={filteredExpenses} />

      {/* Search and Filters */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <Input
              placeholder="Buscar gastos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/10 border-white/30 text-white pl-10"
            />
          </div>
          <ExpenseFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </div>
      </div>

      {/* Expenses List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-4 animate-pulse flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-white/20 rounded"></div>
                  <div className="h-3 w-20 bg-white/20 rounded"></div>
                </div>
              </div>
              <div className="h-6 w-16 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Receipt className="w-10 h-10 text-white/60" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            {expenses.length === 0 ? "Registra tu primer gasto" : "No se encontraron gastos"}
          </h3>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            {expenses.length === 0 
              ? "Añade un gasto para empezar a ver cómo se mueve tu dinero y si estás cumpliendo tus presupuestos."
              : "Prueba a cambiar los filtros o buscar algo diferente."
            }
          </p>
          {expenses.length === 0 && (
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-2xl shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Añadir Primer Gasto
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExpenses.map((expense) => (
            <ExpenseCard 
              key={expense.id} 
              expense={expense}
              onUpdate={loadExpenses}
            />
          ))}
        </div>
      )}

      <CreateExpenseModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateExpense}
      />
    </div>
  );
}