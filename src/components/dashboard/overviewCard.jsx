import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { TrendingUp, Wallet, Target, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

const StatCard = ({ title, value, subtitle, icon: Icon, trend, isLoading, progressValue, progressColor, linkTo }) => (
  <Link to={linkTo} className="block group">
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden hover:scale-105 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-2xl bg-white/10">
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className={`text-sm font-medium ${trend === "Excedido" ? "text-red-300" : "text-emerald-300"}`}>
              {trend}
            </div>
          )}
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-white/70 text-sm font-medium">{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-24 bg-white/20" />
          ) : (
            <p className="text-3xl font-bold text-white">{value}</p>
          )}
          {subtitle && (
            <p className="text-white/60 text-xs">{subtitle}</p>
          )}
        </div>

        {/* Enhanced Progress Bar without shadows */}
        {progressValue !== undefined && !isLoading && (
          <div className="space-y-3">
            <div className="relative bg-white/20 h-3 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${Math.min(progressValue, 100)}%`,
                  background: `linear-gradient(90deg, ${progressColor}, ${progressColor}dd)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/60">
              <span>0%</span>
              <span className="font-medium" style={{ color: progressColor }}>
                {progressValue.toFixed(1)}%
              </span>
              <span>100%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  </Link>
);

export default function OverviewCards({ 
  totalBudget, 
  totalSpent, 
  totalGoalTarget, 
  totalGoalProgress, 
  isLoading,
  expenses
}) {
  const budgetUsedPercentage = totalBudget > 0 ? (totalSpent / totalBudget * 100) : 0;
  const goalProgressPercentage = totalGoalTarget > 0 ? (totalGoalProgress / totalGoalTarget * 100) : 0;
  const remainingBudget = totalBudget - totalSpent;

  // Vibrant color scheme
  const getProgressColor = (percentage, type) => {
    if (type === 'budget') {
      if (percentage > 90) return '#FF6B6B'; // Bright red
      if (percentage > 80) return '#FFD93D'; // Bright yellow
      return '#4ECDC4'; // Bright teal
    }
    if (type === 'goal') return '#45B7D1'; // Bright blue
    return '#DDA0DD'; // Bright plum
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Presupuesto Total"
        value={`£${totalBudget.toLocaleString()}`}
        subtitle="Este mes"
        icon={Wallet}
        trend={`${budgetUsedPercentage.toFixed(0)}% usado`}
        progressValue={budgetUsedPercentage}
        progressColor={getProgressColor(budgetUsedPercentage, 'budget')}
        isLoading={isLoading}
        linkTo={createPageUrl("Budgets")}
      />
      
      <StatCard
        title="Gastado este Mes"
        value={`£${totalSpent.toLocaleString()}`}
        subtitle={`£${remainingBudget.toLocaleString()} restantes`}
        icon={DollarSign}
        trend={remainingBudget >= 0 ? "En presupuesto" : "Excedido"}
        progressValue={budgetUsedPercentage}
        progressColor={budgetUsedPercentage > 100 ? '#FF6B6B' : '#F39C12'}
        isLoading={isLoading}
        linkTo={createPageUrl("Balance")}
      />
      
      <StatCard
        title="Ahorro en Objetivos"
        value={`£${totalGoalProgress.toLocaleString()}`}
        subtitle={`de £${totalGoalTarget.toLocaleString()}`}
        icon={Target}
        trend={`${goalProgressPercentage.toFixed(0)}% completado`}
        progressValue={goalProgressPercentage}
        progressColor="#45B7D1"
        isLoading={isLoading}
        linkTo={createPageUrl("Goals")}
      />
      
      <StatCard
        title="Gastos Registrados"
        value={expenses.length.toString()}
        subtitle="Total de transacciones"
        icon={TrendingUp}
        trend="+12% vs sem. pasada"
        // progressValue removed
        isLoading={isLoading}
        linkTo={createPageUrl("Balance")}
      />
    </div>
  );
}