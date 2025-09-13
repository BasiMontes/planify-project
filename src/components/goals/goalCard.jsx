import React, { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { Target, Calendar, Users, Trophy, Edit2, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Goal } from "@/entities/Goal";
import { secureEntityOperation } from "../utils/SecurityHelper";

import EditGoalModal from "./EditGoalModal";

const categoryIcons = {
  vacation: "🏖️",
  emergency: "🚨",
  purchase: "🛒",
  investment: "📈",
  other: "🎯"
};

export default function GoalCard({ goal, onUpdate }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const percentage = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
  const daysLeft = differenceInDays(new Date(goal.deadline), new Date());
  const isCompleted = percentage >= 100;
  const isUrgent = daysLeft <= 30 && daysLeft > 0;
  const isOverdue = daysLeft < 0;

  const getProgressColor = () => {
    if (isCompleted) return '#2ED573';
    if (percentage > 75) return '#FFA502';
    if (percentage > 50) return '#45B7D1';
    return '#A29BFE';
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleUpdateGoal = async (updatedData) => {
    setIsUpdating(true);
    try {
      await secureEntityOperation("goal", goal.id, async () => {
        return Goal.update(goal.id, updatedData);
      });
      setShowEditModal(false);
      onUpdate();
    } catch (error) {
      console.error("Error al actualizar objetivo:", error);
      alert("No tienes permisos para editar este objetivo");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="glass-card rounded-3xl p-6 flex flex-col justify-between hover:scale-105 transition-all duration-300 group">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{categoryIcons[goal.category]}</div>
              <div>
                <h3 className="text-lg font-bold text-white">{goal.title}</h3>
                <p className="text-white/60 text-sm">£{goal.current_amount.toLocaleString()} / £{goal.target_amount.toLocaleString()}</p>
              </div>
            </div>
            {(!goal._isShared || goal._permission === 'admin' || goal._permission === 'edit') && (
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

          {/* Improved Progress Bar */}
          <div className="space-y-3 mb-4">
            <div className="relative bg-white/20 h-3 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: getProgressColor()
                }}
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: getProgressColor() }} className="font-medium">
                {percentage.toFixed(1)}% completado
              </span>
              
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span className={`text-xs ${
                  isOverdue ? 'text-red-300' : 
                  isUrgent ? 'text-yellow-300' : 
                  'text-white/60'
                }`}>
                  {isOverdue ? 'Vencido' : 
                   daysLeft === 0 ? 'Vence hoy' :
                   `${daysLeft} días restantes`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            {goal._isShared && (
              <Badge variant="outline" className="border-purple-400/50 bg-purple-500/20 text-purple-300">
                <Users className="w-3 h-3 mr-1" />
                Compartido
              </Badge>
            )}
            
            {isCompleted && (
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                <Trophy className="w-3 h-3 mr-1" />
                Completado
              </Badge>
            )}
            
            {isUrgent && !isCompleted && (
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Urgente
              </Badge>
            )}
          </div>
        </div>
      </div>

      <EditGoalModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateGoal}
        goal={goal}
      />
    </>
  );
}