
import React, { useState, useEffect, useCallback } from 'react';
import { Collaboration } from '@/entities/Collaboration';
import { Budget } from '@/entities/Budget';
import { Goal } from '@/entities/Goal';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Check, 
  X, 
  Mail, 
  Shield, 
  Eye, 
  Edit, 
  Crown,
  Trash2
} from 'lucide-react';
import { createNotification } from '../utils/notificationHelper';
import { useApp } from '../contexts/AppContext';
import { UI_TEXT } from '../utils/constants';

export default function CollaborationManager() {
  const { user, addNotification } = useApp();
  const [collaborations, setCollaborations] = useState([]);
  const [myCollaborations, setMyCollaborations] = useState([]);
  const [entities, setEntities] = useState({ budgets: [], goals: [] });
  const [isLoading, setIsLoading] = useState(true);
  
  // Invite form state
  const [inviteData, setInviteData] = useState({
    entity_type: '',
    entity_id: '',
    collaborator_email: '',
    permission_level: 'view'
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [budgets, goals, sentCollabs, receivedCollabs] = await Promise.all([
        Budget.filter({ created_by: user.email }),
        Goal.filter({ created_by: user.email }),
        Collaboration.filter({ owner_email: user.email }),
        Collaboration.filter({ collaborator_email: user.email })
      ]);
      
      setEntities({ budgets, goals });
      setCollaborations(sentCollabs);
      setMyCollaborations(receivedCollabs);
    } catch (error) {
      console.error('Error cargando colaboraciones:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron cargar las colaboraciones'
      });
    }
    setIsLoading(false);
  }, [user, addNotification]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  const handleInvite = useCallback(async (e) => {
    e.preventDefault();
    if (!inviteData.entity_type || !inviteData.entity_id || !inviteData.collaborator_email) {
      addNotification({
        type: 'error',
        title: 'Error de validación',
        message: UI_TEXT.MESSAGES.ERROR.VALIDATION_ERROR
      });
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
      
      addNotification({
        type: 'success',
        title: UI_TEXT.MESSAGES.SUCCESS.COLLABORATION_SENT,
        message: `Invitación enviada a ${inviteData.collaborator_email}`
      });
      
      setInviteData({ entity_type: '', entity_id: '', collaborator_email: '', permission_level: 'view' });
      loadData();
    } catch (error) {
      console.error('Error enviando invitación:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo enviar la invitación'
      });
    }
  }, [inviteData, user, entities, addNotification, loadData]);

  const handleResponse = useCallback(async (collaborationId, status) => {
    try {
      await Collaboration.update(collaborationId, { status });
      addNotification({
        type: 'success',
        title: 'Invitación actualizada',
        message: status === 'accepted' ? 'Has aceptado la invitación' : 'Has rechazado la invitación'
      });
      loadData();
    } catch (error) {
      console.error('Error respondiendo invitación:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo responder a la invitación'
      });
    }
  }, [addNotification, loadData]);

  const handleDeleteCollaboration = useCallback(async (collaborationId) => {
    if (window.confirm("¿Estás seguro de que quieres revocar el acceso a este colaborador?")) {
      try {
        await Collaboration.delete(collaborationId);
        addNotification({
          type: 'success',
          title: 'Colaboración eliminada',
          message: 'Se ha revocado el acceso del colaborador'
        });
        loadData();
      } catch (error) {
        console.error('Error eliminando colaboración:', error);
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'No se pudo eliminar la colaboración'
        });
      }
    }
  }, [addNotification, loadData]);

  const getPermissionIcon = (level) => {
    switch (level) {
      case 'view': return <Eye className="w-4 h-4" />;
      case 'edit': return <Edit className="w-4 h-4" />;
      case 'admin': return <Crown className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getPermissionColor = (level) => {
    switch (level) {
      case 'view': return 'bg-blue-500/20 text-blue-300';
      case 'edit': return 'bg-green-500/20 text-green-300';
      case 'admin': return 'bg-purple-500/20 text-purple-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-6">
        <div className="space-y-4">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
          <div className="space-y-2">
            {[1,2,3].map(i => (
              <div key={i} className="h-12 bg-white/20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Invite New Collaborator - REMOVED PULSE ANIMATION */}
      <div className="glass-card rounded-3xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Invitar Colaborador
        </h3>
        
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white/80">Tipo</Label>
              <Select value={inviteData.entity_type} onValueChange={(value) => setInviteData(prev => ({ ...prev, entity_type: value, entity_id: '' }))}>
                <SelectTrigger className="bg-white/10 border-white/30 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Presupuesto</SelectItem>
                  <SelectItem value="goal">Objetivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-white/80">Elemento</Label>
              <Select value={inviteData.entity_id} onValueChange={(value) => setInviteData(prev => ({ ...prev, entity_id: value }))}>
                <SelectTrigger className="bg-white/10 border-white/30 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2">
                  <SelectValue placeholder="Seleccionar elemento" />
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
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white/80">Email del Colaborador</Label>
              <Input 
                type="email" 
                value={inviteData.collaborator_email}
                onChange={(e) => setInviteData(prev => ({ ...prev, collaborator_email: e.target.value }))}
                className="bg-white/10 border-white/30 text-white placeholder-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>
            
            <div>
              <Label className="text-white/80">Permisos</Label>
              <Select value={inviteData.permission_level} onValueChange={(value) => setInviteData(prev => ({ ...prev, permission_level: value }))}>
                <SelectTrigger className="bg-white/10 border-white/30 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">Ver solamente</SelectItem>
                  <SelectItem value="edit">Ver y editar</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            {UI_TEXT.BUTTONS.INVITE} Colaborador
          </Button>
        </form>
      </div>

      {/* Pending Invitations Received */}
      {myCollaborations.filter(c => c.status === 'pending').length > 0 && (
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Invitaciones Recibidas
          </h3>
          
          <div className="space-y-3">
            {myCollaborations.filter(c => c.status === 'pending').map((collab) => (
              <div key={collab.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/10 rounded-xl gap-4">
                <div className="flex-1">
                  <p className="text-white font-medium">{collab.owner_email}</p>
                  <p className="text-white/60 text-sm">
                    Te invitó a colaborar en un {collab.entity_type === 'budget' ? 'presupuesto' : 'objetivo'}
                  </p>
                  <Badge className={`mt-1 ${getPermissionColor(collab.permission_level)}`}>
                    {getPermissionIcon(collab.permission_level)}
                    <span className="ml-1 capitalize">{collab.permission_level}</span>
                  </Badge>
                </div>
                <div className="flex gap-2 self-end sm:self-center">
                  <Button size="icon" onClick={() => handleResponse(collab.id, 'accepted')} className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 h-10 w-10">
                    <Check className="w-5 h-5" />
                  </Button>
                  <Button size="icon" onClick={() => handleResponse(collab.id, 'rejected')} className="bg-red-500/20 text-red-300 hover:bg-red-500/30 h-10 w-10">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Collaborations */}
      <div className="glass-card rounded-3xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Colaboraciones Activas</h3>
        
        {collaborations.filter(c => c.status === 'accepted').length === 0 ? (
          <p className="text-white/60 text-center py-8">No has invitado a nadie a colaborar todavía.</p>
        ) : (
          <div className="space-y-3">
            {collaborations.filter(c => c.status === 'accepted').map((collab) => (
              <div key={collab.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/10 rounded-xl gap-4">
                <div className="flex-1">
                  <p className="text-white font-medium">{collab.collaborator_email}</p>
                  <p className="text-white/60 text-sm">
                    Colaborando en {collab.entity_type === 'budget' ? 'presupuesto' : 'objetivo'}
                  </p>
                  <Badge className={`mt-1 ${getPermissionColor(collab.permission_level)}`}>
                    {getPermissionIcon(collab.permission_level)}
                    <span className="ml-1 capitalize">{collab.permission_level}</span>
                  </Badge>
                </div>
                <Button 
                  size="icon" 
                  variant="outline"
                  onClick={() => handleDeleteCollaboration(collab.id)}
                  className="text-red-300 border-red-400/30 hover:bg-red-500/20 hover:text-red-200 self-end sm:self-center h-10 w-10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}