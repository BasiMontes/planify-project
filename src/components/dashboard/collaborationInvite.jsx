import React, { useState, useEffect } from 'react';
import { Collaboration } from '@/entities/Collaboration';
import { Budget } from '@/entities/Budget';
import { Goal } from '@/entities/Goal';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus } from 'lucide-react';
import { createNotification } from '../utils/NotificationHelper';

export default function CollaborationInvite() {
  const [entities, setEntities] = useState({ budgets: [], goals: [] });
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [inviteData, setInviteData] = useState({
    entity_type: '',
    entity_id: '',
    collaborator_email: '',
    permission_level: 'view'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      const [budgets, goals] = await Promise.all([
        Budget.filter({ created_by: currentUser.email }),
        Goal.filter({ created_by: currentUser.email }),
      ]);
      setUser(currentUser);
      setEntities({ budgets, goals });
    } catch (error) {
      console.error('Error cargando datos para invitación:', error);
    }
    setIsLoading(false);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteData.entity_type || !inviteData.entity_id || !inviteData.collaborator_email) {
      alert("Por favor, completa todos los campos para enviar la invitación.");
      return;
    }
    try {
      await Collaboration.create({
        ...inviteData,
        owner_email: user.email,
        invited_date: new Date().toISOString().split('T')[0]
      });
      
      const entityName = inviteData.entity_type === 'budget' 
        ? entities.budgets.find(b => b.id === inviteData.entity_id)?.name
        : entities.goals.find(g => g.id === inviteData.entity_id)?.title;
        
      await createNotification(
        inviteData.collaborator_email,
        "Invitación de Colaboración",
        `${user.full_name} te ha invitado a colaborar en '${entityName}'.`,
        "invite"
      );
      
      alert(`Invitación enviada a ${inviteData.collaborator_email}`);
      setInviteData({ entity_type: '', entity_id: '', collaborator_email: '', permission_level: 'view' });
    } catch (error) {
      console.error('Error enviando invitación:', error);
      alert('Hubo un error al enviar la invitación.');
    }
  };

  if (isLoading) {
    return <div className="glass-card rounded-3xl p-6 h-64 animate-pulse"></div>;
  }

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-white/10">
          <Users className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">Invitar a Equipo</h2>
      </div>

      <form onSubmit={handleInvite} className="space-y-4">
        <Select value={inviteData.entity_type} onValueChange={(value) => setInviteData(prev => ({ ...prev, entity_type: value, entity_id: '' }))}>
          <SelectTrigger className="bg-white/10 border-white/30 text-white">
            <SelectValue placeholder="Seleccionar Presupuesto u Objetivo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="budget">Presupuesto</SelectItem>
            <SelectItem value="goal">Objetivo</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={inviteData.entity_id} onValueChange={(value) => setInviteData(prev => ({ ...prev, entity_id: value }))}>
          <SelectTrigger className="bg-white/10 border-white/30 text-white">
            <SelectValue placeholder="Seleccionar elemento..." />
          </SelectTrigger>
          <SelectContent>
            {inviteData.entity_type === 'budget' && entities.budgets.map(budget => (
              <SelectItem key={budget.id} value={budget.id}>{budget.name}</SelectItem>
            ))}
            {inviteData.entity_type === 'goal' && entities.goals.map(goal => (
              <SelectItem key={goal.id} value={goal.id}>{goal.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Input 
          type="email" 
          value={inviteData.collaborator_email}
          onChange={(e) => setInviteData(prev => ({ ...prev, collaborator_email: e.target.value }))}
          className="bg-white/10 border-white/30 text-white placeholder-white/50"
          placeholder="Email del colaborador"
          required
        />
        
        <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Enviar Invitación
        </Button>
      </form>
    </div>
  );
}