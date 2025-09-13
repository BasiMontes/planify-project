import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

const categories = [
  { value: "vacation", label: "Vacaciones ✈️" },
  { value: "emergency", label: "Fondo de Emergencia 🛡️" },
  { value: "purchase", label: "Compra importante 💻" },
  { value: "investment", label: "Inversión 📈" },
  { value: "other", label: "Otro 💡" }
];

export default function EditGoalModal({ isOpen, onClose, onSubmit, goal }) {
  const [formData, setFormData] = useState({
    title: "",
    target_amount: "",
    current_amount: "",
    deadline: "",
    category: "other",
    description: "",
  });

  useEffect(() => {
    if (goal && isOpen) {
      setFormData({
        title: goal.title || "",
        target_amount: goal.target_amount || "",
        current_amount: goal.current_amount || 0,
        deadline: goal.deadline || "",
        category: goal.category || "other",
        description: goal.description || "",
      });
    }
  }, [goal, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      target_amount: parseFloat(formData.target_amount),
      current_amount: parseFloat(formData.current_amount),
    };
    onSubmit(processedData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden rounded-3xl glass-card-purple border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">Editar Objetivo</h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-grow">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white/80 text-sm font-medium">Nombre del Objetivo</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={(e) => handleChange('title', e.target.value)} 
              className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-white/50 focus:ring-white/20" 
              placeholder="Ej: Viaje a Japón" 
              required 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_amount" className="text-white/80 text-sm font-medium">Cantidad Objetivo (£)</Label>
              <Input 
                id="target_amount" 
                type="number" 
                min="0" 
                step="0.01" 
                value={formData.target_amount} 
                onChange={(e) => handleChange('target_amount', e.target.value)} 
                className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-white/50 focus:ring-white/20" 
                placeholder="3000" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_amount" className="text-white/80 text-sm font-medium">Cantidad Actual (£)</Label>
              <Input 
                id="current_amount" 
                type="number" 
                min="0" 
                step="0.01" 
                value={formData.current_amount} 
                onChange={(e) => handleChange('current_amount', e.target.value)} 
                className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-white/50 focus:ring-white/20" 
                placeholder="500" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-white/80 text-sm font-medium">Fecha Límite</Label>
            <Input 
              id="deadline" 
              type="date" 
              value={formData.deadline} 
              onChange={(e) => handleChange('deadline', e.target.value)} 
              className="bg-white/10 border-white/30 text-white focus:border-white/50 focus:ring-white/20" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-white/80 text-sm font-medium">Categoría</Label>
            <div className="relative">
              <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger className="bg-white/10 border-white/30 text-white focus:border-white/50 focus:ring-white/20">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl">
                  {categories.map(cat => (
                    <SelectItem 
                      key={cat.value} 
                      value={cat.value} 
                      className="text-gray-800 hover:bg-white/50 focus:bg-white/50 rounded-xl mx-1"
                    >
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white/80 text-sm font-medium">Descripción (Opcional)</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => handleChange('description', e.target.value)} 
              className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-white/50 focus:ring-white/20 resize-none" 
              placeholder="Añade más detalles sobre tu objetivo..." 
              rows={3}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 flex justify-end gap-3 border-t border-white/10 flex-shrink-0">
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
            Actualizar
          </Button>
        </div>
      </div>
    </div>
  );
}