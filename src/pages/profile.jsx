import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Budget } from "@/entities/Budget";
import { Goal } from "@/entities/Goal";
import { Expense } from "@/entities/Expense";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogOut,
  Bell,
  Palette,
  Shield,
  TrendingUp,
  Target,
  Wallet,
  Calendar,
  Award,
  PieChart,
  Users,
  Trash2,
  AlertTriangle,
  BookOpen
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/components/contexts/AppContext";
import { ACHIEVEMENTS, UI_TEXT } from "@/components/utils/constants";

import CollaborationManager from "../components/profile/CollaborationManager";

export default function Profile() {
  const { user, addNotification } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBudgets: 0,
    totalGoals: 0,
    totalExpenses: 0,
    monthlySpent: 0,
    savedThisMonth: 0,
    goalsCompleted: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [budgets, goals, expenses] = await Promise.all([
        Budget.list(),
        Goal.list(),
        Expense.list()
      ]);

      const currentMonth = new Date().toISOString().slice(0, 7);
      const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
      const monthlySpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
      const completedGoals = goals.filter(g => g.is_completed || (g.current_amount >= g.target_amount)).length;

      setStats({
        totalBudgets: budgets.length,
        totalGoals: goals.length,
        totalExpenses: expenses.length,
        monthlySpent,
        savedThisMonth: 320,
        goalsCompleted: completedGoals
      });
    } catch (error) {
      console.error("Error al cargar datos del perfil:", error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron cargar los datos del perfil'
      });
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = useCallback(async () => {
    try {
      await User.logout();
      addNotification({
        type: 'success',
        title: 'Sesión cerrada',
        message: 'Has cerrado sesión exitosamente'
      });
      window.location.href = '/';
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo cerrar la sesión'
      });
    }
  }, [addNotification]);

  const handleDeleteAccount = useCallback(async () => {
    if (window.confirm(UI_TEXT.MESSAGES.CONFIRM.DELETE_ACCOUNT)) {
      try {
        await User.delete(user.id);
        addNotification({
          type: 'success',
          title: 'Cuenta eliminada',
          message: 'Tu cuenta ha sido eliminada exitosamente'
        });
        await User.logout();
        window.location.href = '/';
      } catch (error) {
        console.error("Error al eliminar la cuenta:", error);
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'No se pudo eliminar la cuenta. Contacta a soporte.'
        });
      }
    }
  }, [user, addNotification]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-24 w-24 rounded-full bg-white/20" />
          <Skeleton className="h-7 w-48 bg-white/20 rounded" />
          <Skeleton className="h-5 w-64 bg-white/20 rounded" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <Skeleton key={i} className="h-28 glass-card rounded-2xl bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  const unlockedAchievements = ACHIEVEMENTS.filter(achievement =>
    achievement.condition(stats)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* User Header */}
      <div className="flex flex-col items-center text-center text-white space-y-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-3xl font-bold shadow-2xl">
          {user?.full_name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold drop-shadow-lg">{user?.full_name}</h1>
          <p className="text-white/70 text-sm">{user?.email}</p>
          <Badge className="mt-2 bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
            Usuario Activo
          </Badge>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10 rounded-2xl p-1">
          <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">
            Resumen
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="rounded-xl data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">
            Colaboración
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">
            Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-8">
          {/* Statistics Grid - Fixed Icons with Consistent Backgrounds */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to={createPageUrl("Budgets")} className="block group focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 rounded-2xl">
              <div className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 h-28">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-2">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <p className="text-lg font-bold text-white">{stats.totalBudgets}</p>
                <p className="text-white/70 text-xs text-center">Presupuestos</p>
              </div>
            </Link>

            <Link to={createPageUrl("Goals")} className="block group focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 rounded-2xl">
              <div className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 h-28">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mb-2">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <p className="text-lg font-bold text-white">{stats.totalGoals}</p>
                <p className="text-white/70 text-xs text-center">Objetivos</p>
              </div>
            </Link>

            <Link to={createPageUrl("Balance")} className="block group focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 rounded-2xl">
              <div className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 h-28">
                <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center mb-2">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <p className="text-lg font-bold text-white">{stats.totalExpenses}</p>
                <p className="text-white/70 text-xs text-center">Gastos</p>
              </div>
            </Link>

            <div className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 h-28">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-lg font-bold text-white">£{stats.monthlySpent.toFixed(0)}</p>
              <p className="text-white/70 text-xs text-center">Gastado</p>
            </div>

            <div className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 h-28">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mb-2">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <p className="text-lg font-bold text-white">£{stats.savedThisMonth}</p>
              <p className="text-white/70 text-xs text-center">Ahorrado</p>
            </div>

            <div className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 h-28">
              <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center mb-2">
                <Award className="w-5 h-5 text-white" />
              </div>
              <p className="text-lg font-bold text-white">{stats.goalsCompleted}</p>
              <p className="text-white/70 text-xs text-center">Cumplidos</p>
            </div>
          </div>

          {/* Achievements */}
          <div className="glass-card rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Logros Desbloqueados ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ACHIEVEMENTS.map((achievement) => {
                const isUnlocked = achievement.condition(stats);
                return (
                  <div
                    key={achievement.id}
                    className={`text-center p-3 rounded-xl border transition-all duration-300 ${
                      isUnlocked
                        ? 'border-yellow-400/50 bg-yellow-500/20'
                        : 'border-white/20 bg-white/5 opacity-50'
                    }`}
                    title={achievement.description}
                  >
                    <div className="text-xl mb-1">{achievement.icon}</div>
                    <p className={`text-xs font-medium ${isUnlocked ? 'text-yellow-200' : 'text-white/60'}`}>
                      {achievement.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="collaboration" className="mt-8">
          <CollaborationManager />
        </TabsContent>

        <TabsContent value="settings" className="mt-8 space-y-6">
          {/* Settings */}
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white mb-3">Configuración</h2>

            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex items-center gap-3 text-white cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="text-sm">Notificaciones Push</span>
              </Label>
              <Switch id="notifications" className="data-[state=checked]:bg-emerald-500" />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="theme" className="flex items-center gap-3 text-white cursor-pointer">
                <Palette className="w-4 h-4" />
                <span className="text-sm">Modo Oscuro</span>
              </Label>
              <Switch id="theme" checked={true} disabled className="data-[state=checked]:bg-emerald-500" />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="security" className="flex items-center gap-3 text-white cursor-pointer">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Autenticación de 2 Factores</span>
              </Label>
              <Switch id="security" className="data-[state=checked]:bg-emerald-500" />
            </div>
          </div>

          {/* Guide Button */}
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl('UserGuide'))}
            className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-2xl py-4 text-base"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Ver Guía de Usuario
          </Button>

          {/* Logout Button */}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full bg-transparent border-white/30 text-white hover:bg-white/10 rounded-2xl py-4 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {UI_TEXT.BUTTONS.LOGOUT}
          </Button>

          {/* Danger Zone */}
          <div className="glass-card rounded-3xl p-6 border-l-4 border-red-500">
            <h3 className="text-lg font-bold text-red-300 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Zona de Peligro
            </h3>
            <p className="text-white/70 text-sm mb-4">
              Esta acción es irreversible. Por favor, ten mucho cuidado.
            </p>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="w-full bg-red-500/80 hover:bg-red-500 text-white rounded-xl py-3 text-base shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 focus-visible:outline-offset-2"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar mi Cuenta
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}