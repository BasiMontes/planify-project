
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import { Goal } from "@/entities/Goal";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { getUserEntities } from "../components/utils/SecurityHelper"; // Import getUserEntities

import GoalCard from "../components/goals/GoalCard";
import CreateGoalModal from "../components/goals/CreateGoalModal";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const location = useLocation(); // Use location hook

  useEffect(() => {
    loadGoals();
    
    // Check for 'action=create' in URL parameters
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'create') {
      setShowCreateModal(true);
      // Clean up URL to prevent modal from reopening on refresh/subsequent visits
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.search]); // Re-run effect if URL search params change

  const loadGoals = async () => {
    setIsLoading(true);
    try {
      const data = await Goal.list("-deadline");
      setGoals(data);
    } catch (error) {
      console.error("Error al cargar objetivos:", error);
    }
    setIsLoading(false);
  };

  const handleCreateGoal = async (goalData) => {
    try {
      await Goal.create(goalData);
      setShowCreateModal(false);
      loadGoals();
    } catch (error) {
      console.error("Error al crear objetivo:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">Objetivos de Ahorro</h1>
          <p className="text-white/80">Define y alcanza tus metas financieras.</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-2xl shadow-lg w-full md:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Crear Objetivo
        </Button>
      </div>

      {/* Goals Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-3xl p-6 animate-pulse">
              <div className="h-6 bg-white/20 rounded mb-4 w-3/4"></div>
              <div className="h-4 bg-white/20 rounded mb-6 w-1/2"></div>
              <div className="h-3 bg-white/20 rounded-full"></div>
            </div>
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-white/60" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Define tu primer objetivo</h3>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            ¿Un viaje, un nuevo gadget, o un fondo de emergencia? Empieza a ahorrar para lo que más te importa.
          </p>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl shadow-lg w-full md:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear Mi Primer Objetivo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onUpdate={loadGoals}
            />
          ))}
        </div>
      )}

      {/* Create Goal Modal */}
      <CreateGoalModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateGoal}
      />
    </div>
  );
}