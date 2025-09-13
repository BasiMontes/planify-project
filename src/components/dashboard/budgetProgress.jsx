
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, AlertTriangle, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BudgetProgress({ budgets, isLoading }) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-7 w-32 bg-white/20" />
          <Skeleton className="h-10 w-24 bg-white/20" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24 bg-white/20" />
                <Skeleton className="h-5 w-16 bg-white/20" />
              </div>
              <Skeleton className="h-2 w-full bg-white/20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/10">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Presupuestos Activos</h2>
        </div>
        
        <Link to={createPageUrl("Budgets?action=create")}>
          <Button size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white/30 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Presupuesto
          </Button>
        </Link>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white/60" />
          </div>
          <p className="text-white/70 mb-4">Aún no has creado presupuestos</p>
          <Link to={createPageUrl("Budgets?action=create")}>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              Crea Tu Primer Presupuesto
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {budgets.slice(0, 3).map((budget) => {
            const percentage = budget.total_amount > 0 ? (budget.current_spent / budget.total_amount) * 100 : 0;
            const isOverBudget = percentage > 100;
            const isNearLimit = percentage > 80 && percentage <= 100;
            
            const getProgressColor = () => {
              if (isOverBudget) return '#FF4757';
              if (isNearLimit) return '#FFA502';
              return '#2ED573';
            };
            
            return (
              <div key={budget.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{budget.name}</span>
                    {isOverBudget && <AlertTriangle className="w-4 h-4 text-red-400" />}
                    {percentage <= 80 && !isOverBudget && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <span className="text-white/70 text-sm">
                    £{budget.current_spent.toLocaleString()} / £{budget.total_amount.toLocaleString()}
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
                
                <div className="flex justify-between text-xs">
                  <span style={{ color: getProgressColor() }} className="font-medium">
                    {percentage.toFixed(1)}% usado
                  </span>
                  <span className="text-white/60">
                    £{(budget.total_amount - budget.current_spent).toLocaleString()} restantes
                  </span>
                </div>
              </div>
            );
          })}
          
          {budgets.length > 3 && (
            <Link to={createPageUrl("Budgets")} className="block text-center pt-2">
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                Ver todos los presupuestos ({budgets.length})
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}