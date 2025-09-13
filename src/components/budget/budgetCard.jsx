import React, { useState } from "react";
import { Calendar, Users, AlertTriangle, CheckCircle, Edit2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Budget } from "@/entities/Budget";
import { secureEntityOperation } from "../utils/SecurityHelper";

import EditBudgetModal from "./EditBudgetModal";

export default function BudgetCard({ budget, onUpdate }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const percentage = budget.total_amount > 0 ? (budget.current_spent / budget.total_amount) * 100 : 0;
  const remaining = budget.total_amount - budget.current_spent;
  const isOverBudget = percentage > 100;
  const isNearLimit = percentage > 80 && !isOverBudget;

  const getProgressColor = () => {
    if (isOverBudget) return '#FF4757';
    if (isNearLimit) return '#FFA502';
    return '#2ED573';
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleUpdateBudget = async (updatedData) => {
    setIsUpdating(true);
    try {
      await secureEntityOperation("budget", budget.id, async () => {
        return Budget.update(budget.id, updatedData);
      });
      setShowEditModal(false);
      onUpdate();
    } catch (error) {
      console.error("Error al actualizar presupuesto:", error);
      alert("No tienes permisos para editar este presupuesto");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="glass-card rounded-3xl p-6 hover:scale-105 transition-all duration-300 group">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{budget.name}</h3>
            <p className="text-white/60 text-sm">{budget.month}</p>
          </div>
          {(!budget._isShared || budget._permission === 'admin' || budget._permission === 'edit') && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              disabled={isUpdating}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-white/80">Gastado</span>
            <span className="text-white font-semibold">
              £{budget.current_spent.toLocaleString()} / £{budget.total_amount.toLocaleString()}
            </span>
          </div>
          
          {/* Improved Progress Bar */}
          <div className="space-y-2">
            <div className="relative bg-white/20 h-3 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: getProgressColor()
                }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: getProgressColor() }} className="font-medium">
                {percentage.toFixed(1)}% usado
              </span>
              <span className="text-white/60">
                £{remaining.toLocaleString()} restantes
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {budget._isShared && (
              <Badge variant="outline" className="border-purple-400/50 bg-purple-500/20 text-purple-300">
                <Users className="w-3 h-3 mr-1" />
                Compartido
              </Badge>
            )}
            
            {isOverBudget ? (
              <Badge className="bg-red-500/20 text-red-300 border-red-400/30">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Excedido
              </Badge>
            ) : isNearLimit ? (
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Cerca del límite
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                En control
              </Badge>
            )}
          </div>
        </div>
      </div>

      <EditBudgetModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateBudget}
        budget={budget}
      />
    </>
  );
}