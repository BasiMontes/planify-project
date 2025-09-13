import React, { useState, useEffect } from 'react';
import { Expense } from "@/entities/Expense";
import { Budget } from "@/entities/Budget";
import { Goal } from "@/entities/Goal";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Users, Trash2 } from 'lucide-react';
import { createNotification } from "../utils/notificationHelper.jsx";

const expenseCategories = [
  "Vivienda", "Comida", "Transporte", "Ocio", "Salud", 
  "Compras", "Servicios", "Ahorros", "Otros"
];

export default function CreateExpenseModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
    budget_id: "",
    goal_id: "",
    is_shared: false,
  });
  const [collaborators, setCollaborators] = useState([]);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadRelatedData();
      User.me().then(setUser);
      // Reset form on open
      setFormData({
        title: "", amount: "", category: "", date: new Date().toISOString().split('T')[0],
        description: "", budget_id: "", goal_id: "", is_shared: false,
      });
      setCollaborators([]);
    }
  }, [isOpen]);

  const loadRelatedData = async () => {
    setIsLoading(true);
    try {
      const [budgetData, goalData] = await Promise.all([
        Budget.list(),
        Goal.list()
      ]);
      setBudgets(budgetData);
      setGoals(goalData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
    setIsLoading(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAddCollaborator = () => {
    if (collaboratorEmail && !collaborators.includes(collaboratorEmail)) {
      setCollaborators([...collaborators, collaboratorEmail]);
      setCollaboratorEmail("");
    }
  };

  const handleRemoveCollaborator = (emailToRemove) => {
    setCollaborators(collaborators.filter(email => email !== emailToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    let shared_with_data = [];

    if (formData.is_shared && collaborators.length > 0) {
      const totalPeople = collaborators.length + 1;
      const splitAmount = amount / totalPeople;
      shared_with_data = collaborators.map(email => ({ email, amount: splitAmount }));
      
      // Notify collaborators
      for (const collaborator of collaborators) {
        await createNotification(
          collaborator,
          "Gasto Compartido",
          `${user?.full_name} te ha añadido a un gasto de £${amount.toFixed(2)} (${formData.title}). Tu parte es £${splitAmount.toFixed(2)}.`,
          "new_expense"
        );
      }
    }

    const processedData = {
      ...formData,
      amount,
      shared_with: shared_with_data,
    };
    
    onSubmit(processedData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-hidden rounded-3xl glass-card-purple border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Añadir Nuevo Gasto</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white/80 text-sm font-medium">Concepto</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={(e) => handleChange('title', e.target.value)} 
              className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-white/50 focus:ring-white/20 mt-1" 
              placeholder="Ej: Cena con amigos" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white/80 text-sm font-medium">Importe (£)</Label>
              <Input 
                id="amount" 
                type="number" 
                min="0" 
                step="0.01" 
                value={formData.amount} 
                onChange={(e) => handleChange('amount', e.target.value)} 
                className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-white/50 focus:ring-white/20 mt-1" 
                placeholder="25.50" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-white/80 text-sm font-medium">Fecha</Label>
              <Input 
                id="date" 
                type="date" 
                value={formData.date} 
                onChange={(e) => handleChange('date', e.target.value)} 
                className="bg-white/10 border-white/30 text-white focus:border-white/50 focus:ring-white/20 mt-1" 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-white/80 text-sm font-medium">Categoría</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger className="bg-white/10 border-white/30 text-white focus:border-white/50 focus:ring-white/20 mt-1">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl">
                {expenseCategories.map(category => (
                  <SelectItem 
                    key={category} 
                    value={category} 
                    className="text-gray-800 hover:bg-white/50 focus:bg-white/50 rounded-xl mx-1"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
             <div className="space-y-2">
                <Label htmlFor="budget" className="text-white/80 text-sm font-medium">Presupuesto (Opcional)</Label>
                <Select value={formData.budget_id} onValueChange={(value) => handleChange('budget_id', value)}>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white focus:border-white/50 focus:ring-white/20 mt-1">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl">
                    {budgets.map(budget => (
                      <SelectItem 
                        key={budget.id} 
                        value={budget.id} 
                        className="text-gray-800 hover:bg-white/50 focus:bg-white/50 rounded-xl mx-1"
                      >
                        {budget.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label htmlFor="goal" className="text-white/80 text-sm font-medium">Objetivo (Opcional)</Label>
                <Select value={formData.goal_id} onValueChange={(value) => handleChange('goal_id', value)}>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white focus:border-white/50 focus:ring-white/20 mt-1">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl">
                    {goals.map(goal => (
                      <SelectItem 
                        key={goal.id} 
                        value={goal.id} 
                        className="text-gray-800 hover:bg-white/50 focus:bg-white/50 rounded-xl mx-1"
                      >
                        {goal.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
              <Label htmlFor="shared" className="flex items-center gap-3 text-white">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Gasto Compartido</span>
              </Label>
              <Switch 
                id="shared" 
                checked={formData.is_shared}
                onCheckedChange={(checked) => handleChange('is_shared', checked)}
                className="data-[state=checked]:bg-emerald-500" 
              />
            </div>

            {formData.is_shared && (
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex gap-2">
                  <Input 
                    type="email" 
                    placeholder="Email del colaborador" 
                    value={collaboratorEmail}
                    onChange={(e) => setCollaboratorEmail(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder-white/50"
                  />
                  <Button type="button" onClick={handleAddCollaborator} className="bg-white/20 text-white hover:bg-white/30">
                    <Plus className="w-4 h-4"/>
                  </Button>
                </div>
                <div className="space-y-2">
                  {collaborators.map(email => (
                    <div key={email} className="flex items-center justify-between bg-white/10 p-2 rounded-lg text-sm">
                      <span className="text-white/80">{email}</span>
                      <Button type="button" size="icon" variant="ghost" onClick={() => handleRemoveCollaborator(email)} className="h-6 w-6 text-red-400 hover:bg-red-500/20 hover:text-red-300">
                        <Trash2 className="w-4 h-4"/>
                      </Button>
                    </div>
                  ))}
                  {collaborators.length > 0 && (
                    <p className="text-xs text-white/60 text-center pt-2">El gasto se dividirá en partes iguales entre {collaborators.length + 1} personas.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white/80 text-sm font-medium">Descripción (Opcional)</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => handleChange('description', e.target.value)} 
              className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-white/50 focus:ring-white/20 resize-none mt-1" 
              placeholder="Añade una nota..." 
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button 
              type="button" 
              onClick={onClose} 
              className="bg-white/10 border border-white/30 text-white hover:bg-white/20 rounded-xl px-6 py-2"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl px-6 py-2 shadow-lg"
            >
              Añadir Gasto
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}