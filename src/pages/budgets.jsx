
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import { Budget } from "@/entities/Budget";
import { Button } from "@/components/ui/button";
import { Plus, Wallet } from "lucide-react";
import { getUserEntities } from "../components/utils/SecurityHelper";

import CreateBudgetModal from "../components/budgets/CreateBudgetModal";
import BudgetCard from "../components/budgets/BudgetCard";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const location = useLocation(); // Use location hook

  useEffect(() => {
    loadBudgets();
    
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'create') {
      setShowCreateModal(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.search]); // Add location.search to dependency array

  const loadBudgets = async () => {
    setIsLoading(true);
    try {
      const data = await getUserEntities("budget");
      setBudgets(data);
    } catch (error) {
      console.error("Error al cargar presupuestos:", error);
    }
    setIsLoading(false);
  };

  const handleCreateBudget = async (budgetData) => {
    try {
      await Budget.create(budgetData);
      setShowCreateModal(false);
      loadBudgets();
    } catch (error) {
      console.error("Error al crear presupuesto:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
            Presupuestos Mensuales
          </h1>
          <p className="text-white/80 text-lg">
            Controla tus gastos mensuales por categorías.
          </p>
        </div>
        
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 w-full md:w-auto"
        >
          <Plus className="w-6 h-6 mr-3" />
          Nuevo Presupuesto
        </Button>
      </div>

      {/* Budgets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-3xl p-6 animate-pulse">
              <div className="space-y-4">
                <div className="h-6 w-32 bg-white/20 rounded"></div>
                <div className="h-4 w-24 bg-white/20 rounded"></div>
                <div className="h-2 w-full bg-white/20 rounded"></div>
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-white/20 rounded"></div>
                  <div className="h-4 w-16 bg-white/20 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-white/60" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Crea tu primer presupuesto
          </h3>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Los presupuestos te ayudan a controlar tus gastos mensuales estableciendo límites por categoría.
          </p>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-2xl shadow-lg w-full md:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear Primer Presupuesto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => (
            <BudgetCard 
              key={budget.id} 
              budget={budget}
              onUpdate={loadBudgets}
            />
          ))}
        </div>
      )}

      <CreateBudgetModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBudget}
      />
    </div>
  );
}