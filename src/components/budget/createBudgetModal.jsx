
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

const predefinedCategories = [
  { name: "Vivienda", color: "#3B82F6" },
  { name: "Comida", color: "#10B981" },
  { name: "Transporte", color: "#F59E0B" },
  { name: "Ocio", color: "#EF4444" },
  { name: "Salud", color: "#8B5CF6" },
  { name: "Compras", color: "#EC4899" },
  { name: "Servicios", color: "#06B6D4" },
  { name: "Ahorros", color: "#84CC16" }
];

export default function CreateBudgetModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    total_amount: "",
    month: new Date().toISOString().slice(0, 7),
    categories: []
  });

  const addCategory = (predefined = null) => {
    const newCategory = predefined ? { ...predefined, limit: "", spent: 0 } : { name: "", limit: "", spent: 0, color: "#6366F1" };
    if (!formData.categories.find(c => c.name === newCategory.name)) {
      setFormData(prev => ({ ...prev, categories: [...prev.categories, newCategory] }));
    }
  };

  const updateCategory = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => i === index ? { ...cat, [field]: value } : cat)
    }));
  };

  const removeCategory = (index) => {
    setFormData(prev => ({ ...prev, categories: prev.categories.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      total_amount: parseFloat(formData.total_amount),
      categories: formData.categories.map(cat => ({ ...cat, limit: parseFloat(cat.limit) || 0 }))
    };
    onSubmit(processedData);
    setFormData({ name: "", total_amount: "", month: new Date().toISOString().slice(0, 7), categories: [] });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl glass-card-purple border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Crear Nuevo Presupuesto</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-white/80 text-sm font-medium">Nombre del Presupuesto</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                className="bg-white/10 border-white/30 text-white placeholder-white/50 mt-2 focus:border-white/50 focus:ring-white/20"
                placeholder="ej. Presupuesto Familiar"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="total_amount" className="text-white/80 text-sm font-medium">Presupuesto Total (£)</Label>
              <Input
                id="total_amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.total_amount}
                onChange={(e) => setFormData(prev => ({...prev, total_amount: e.target.value}))}
                className="bg-white/10 border-white/30 text-white placeholder-white/50 mt-2 focus:border-white/50 focus:ring-white/20"
                placeholder="2000"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="month" className="text-white/80 text-sm font-medium">Mes del Presupuesto</Label>
            <Input
              id="month"
              type="month"
              value={formData.month}
              onChange={(e) => setFormData(prev => ({...prev, month: e.target.value}))}
              className="bg-white/10 border-white/30 text-white mt-2 focus:border-white/50 focus:ring-white/20"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-white/80 text-lg font-semibold">Categorías</Label>
              <Button 
                type="button" 
                size="sm" 
                onClick={() => addCategory()} 
                className="bg-white/20 text-white hover:bg-white/30 border border-white/30 rounded-xl px-4 py-2"
              >
                <Plus className="w-4 h-4 mr-2" /> 
                Personalizada
              </Button>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <p className="text-white/70 text-sm mb-3">Sugerencias:</p>
              <div className="flex flex-wrap gap-2">
                {predefinedCategories.map((cat) => (
                  <Button 
                    key={cat.name} 
                    type="button" 
                    size="sm" 
                    onClick={() => addCategory(cat)} 
                    className="bg-white/10 border border-white/30 text-white hover:bg-white/20 text-xs rounded-xl px-3 py-1.5"
                  >
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: cat.color }}></div>
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>

            {formData.categories.map((category, index) => (
              <div key={index} className="bg-white/5 p-4 rounded-2xl border border-white/20 flex flex-col sm:flex-row sm:items-end gap-3">
                <div className="flex-1">
                  <Label className="text-white/80 text-sm">Nombre de Categoría</Label>
                  <Input 
                    value={category.name} 
                    onChange={(e) => updateCategory(index, 'name', e.target.value)} 
                    className="bg-white/10 border-white/30 text-white placeholder-white/50 mt-1 focus:border-white/50 focus:ring-white/20" 
                    placeholder="Nombre" 
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-white/80 text-sm">Límite (£)</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={category.limit} 
                    onChange={(e) => updateCategory(index, 'limit', e.target.value)} 
                    className="bg-white/10 border-white/30 text-white placeholder-white/50 mt-1 focus:border-white/50 focus:ring-white/20" 
                    placeholder="500" 
                  />
                </div>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => removeCategory(index)} 
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 self-end rounded-xl"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
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
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl px-6 py-2 shadow-lg"
            >
              Crear Presupuesto
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}