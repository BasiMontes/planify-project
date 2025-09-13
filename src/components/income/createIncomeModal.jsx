import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, TrendingUp } from 'lucide-react';

const incomeCategories = [
  "Salario", "Freelance", "Inversiones", "Bonus", "Alquiler", "Venta", "Otros"
];

const frequencies = [
  { value: "weekly", label: "Semanal" },
  { value: "monthly", label: "Mensual" },
  { value: "yearly", label: "Anual" }
];

export default function CreateIncomeModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
    is_recurring: false,
    frequency: "monthly"
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };
    onSubmit(processedData);
    setFormData({
      title: "", amount: "", category: "", date: new Date().toISOString().split('T')[0],
      description: "", is_recurring: false, frequency: "monthly"
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-hidden rounded-3xl glass-card-purple border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Añadir Nuevo Ingreso</h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white/80 text-sm font-medium">Concepto</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={(e) => handleChange('title', e.target.value)} 
              className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-white/50 focus:ring-white/20" 
              placeholder="Ej: Salario enero" 
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
                className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-white/50 focus:ring-white/20" 
                placeholder="2500.00" 
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
                className="bg-white/10 border-white/30 text-white focus:border-white/50 focus:ring-white/20" 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-white/80 text-sm font-medium">Categoría</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger className="bg-white/10 border-white/30 text-white focus:border-white/50 focus:ring-white/20">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl">
                {incomeCategories.map(category => (
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

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
            <Label htmlFor="recurring" className="flex items-center gap-3 text-white">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Ingreso Recurrente</span>
            </Label>
            <Switch 
              id="recurring" 
              checked={formData.is_recurring}
              onCheckedChange={(checked) => handleChange('is_recurring', checked)}
              className="data-[state=checked]:bg-emerald-500" 
            />
          </div>

          {formData.is_recurring && (
            <div className="space-y-2">
              <Label htmlFor="frequency" className="text-white/80 text-sm font-medium">Frecuencia</Label>
              <Select value={formData.frequency} onValueChange={(value) => handleChange('frequency', value)}>
                <SelectTrigger className="bg-white/10 border-white/30 text-white focus:border-white/50 focus:ring-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl">
                  {frequencies.map(freq => (
                    <SelectItem 
                      key={freq.value} 
                      value={freq.value} 
                      className="text-gray-800 hover:bg-white/50 focus:bg-white/50 rounded-xl mx-1"
                    >
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white/80 text-sm font-medium">Descripción (Opcional)</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => handleChange('description', e.target.value)} 
              className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-white/50 focus:ring-white/20 resize-none" 
              placeholder="Añade una nota..." 
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
            <Button 
              type="button" 
              onClick={onClose} 
              className="bg-white/10 border border-white/30 text-white hover:bg-white/20 rounded-xl px-6 py-2"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl px-6 py-2 shadow-lg"
            >
              Añadir Ingreso
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}