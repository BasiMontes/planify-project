import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, Plus, Calendar, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, differenceInDays } from "date-fns";

export default function GoalProgress({ goals, isLoading }) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-7 w-32 bg-white/20" />
          <Skeleton className="h-10 w-24 bg-white/20" />
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-32 bg-white/20" />
                <Skeleton className="h-5 w-16 bg-white/20" />
              </div>
              <Skeleton className="h-2 w-full bg-white/20" />
              <Skeleton className="h-4 w-24 bg-white/20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/10">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Objetivos de Ahorro</h2>
        </div>
        <Link to={createPageUrl("Goals?action=create")}>
          <Button size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white/30 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Objetivo
          </Button>
        </Link>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-white/60" />
          </div>
          <p className="text-white/70 mb-4">No tienes objetivos de ahorro</p>
          <Link to={createPageUrl("Goals")}>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
              Define Tu Primer Objetivo
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {goals.map((goal) => {
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
            
            return (
              <div key={goal.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{goal.title}</span>
                    {isCompleted && <Trophy className="w-4 h-4 text-yellow-400" />}
                  </div>
                  <span className="text-white/70 text-sm">
                    £{goal.current_amount.toLocaleString()} / £{goal.target_amount.toLocaleString()}
                  </span>
                </div>
                
                <div className="relative bg-white/20 h-3 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: getProgressColor()
                    }}
                  />
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span style={{ color: getProgressColor() }} className="font-medium">
                    {percentage.toFixed(1)}% completado
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-white/60" />
                    <span className={`${
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
            );
          })}
          
          {goals.length > 2 && (
            <Link to={createPageUrl("Goals")} className="block text-center">
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                Ver todos los objetivos ({goals.length})
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}