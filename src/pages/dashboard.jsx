
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../components/contexts/AppContext";
import { Budget } from "@/entities/Budget";
import { Goal } from "@/entities/Goal";
import { Expense } from "@/entities/Expense";
import { getUserEntities } from "../components/utils/SecurityHelper";
import { checkBudgetAlerts } from "../components/utils/BudgetHelper";
import { 
  AlertTriangle 
} from "lucide-react";

import OverviewCards from "../components/dashboard/OverviewCards";
import BudgetProgress from "../components/dashboard/BudgetProgress";
import GoalProgress from "../components/dashboard/GoalProgress";
import RecentActivity from "../components/dashboard/RecentActivity";
import CollaborationInvite from "../components/dashboard/CollaborationInvite"; // Changed import

export default function Dashboard() {
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (!user.has_completed_onboarding) {
        navigate('/UserGuide');
      } else {
        loadDashboardData();
      }
    }
  }, [user, navigate]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [budgetData, goalData, expenseData] = await Promise.all([
        getUserEntities("budget"),
        getUserEntities("goal"),
        getUserEntities("expense")
      ]);
      
      setBudgets(budgetData);
      setGoals(goalData);
      setExpenses(expenseData);
      
      // Check for alerts
      const allAlerts = [];
      for (const budget of budgetData) {
        const budgetAlerts = await checkBudgetAlerts(budget);
        allAlerts.push(...budgetAlerts);
      }
      setAlerts(allAlerts);
      
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
    }
    setIsLoading(false);
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.total_amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.current_spent, 0);
  const totalGoalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
  const totalGoalProgress = goals.reduce((sum, goal) => sum + goal.current_amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
          Tu salud financiera empieza aquí
        </h1>
        <p className="text-white/80 text-lg">
          Tu dinero, tus metas y tu equipo - todo en un lugar.
        </p>
      </div>

      {/* Minimalist Alerts */}
      {alerts.length > 0 && (
        <div className="bg-yellow-500/20 border border-yellow-400/30 text-yellow-200 text-sm rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="flex-grow">
            <span className="font-bold">Alerta:</span> {alerts[0].message}
            {alerts.length > 1 && <span className="text-yellow-300/80 ml-2">(y {alerts.length - 1} más)</span>}
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <OverviewCards 
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        totalGoalTarget={totalGoalTarget}
        totalGoalProgress={totalGoalProgress}
        budgets={budgets}
        goals={goals}
        expenses={expenses}
        isLoading={isLoading}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Budget & Goals */}
        <div className="lg:col-span-2 space-y-8">
          <BudgetProgress budgets={budgets} isLoading={isLoading} />
          <GoalProgress goals={goals} isLoading={isLoading} />
        </div>

        {/* Right Column - Activities & Collaboration */}
        <div className="space-y-8">
          <CollaborationInvite /> {/* Replaced QuickActions */}
          <RecentActivity expenses={expenses} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}