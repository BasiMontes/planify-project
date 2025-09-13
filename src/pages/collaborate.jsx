import React, { useState, useEffect } from "react";
import { Collaboration } from "@/entities/Collaboration";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Check, X, Mail, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Collaborate() {
  const [invitations, setInvitations] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCollaborations();
  }, []);

  const loadCollaborations = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      
      // Load received invitations
      const received = await Collaboration.filter({
        collaborator_email: user.email,
        status: "pending"
      });
      
      // Load sent invitations
      const sent = await Collaboration.filter({
        owner_email: user.email
      });
      
      setInvitations(received);
      setSentInvitations(sent);
    } catch (error) {
      console.error("Error loading collaborations:", error);
    }
    setIsLoading(false);
  };

  const handleInvitationResponse = async (invitationId, status) => {
    try {
      await Collaboration.update(invitationId, { status });
      loadCollaborations();
    } catch (error) {
      console.error("Error responding to invitation:", error);
    }
  };

  const getEntityTypeLabel = (type) => {
    const labels = {
      budget: "presupuesto",
      goal: "objetivo",
      expense: "gasto"
    };
    return labels[type] || type;
  };

  const getPermissionLabel = (level) => {
    const labels = {
      view: "Solo Ver",
      edit: "Editar",
      admin: "Administrar"
    };
    return labels[level] || level;
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
      accepted: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
      rejected: "bg-red-500/20 text-red-300 border-red-400/30"
    };
    
    const labels = {
      pending: "Pendiente",
      accepted: "Aceptado",
      rejected: "Rechazado"
    };
    
    return (
      <Badge className={styles[status]}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Colaboraciones</h1>
        <p className="text-white/80">Gestiona tus invitaciones y colaboraciones.</p>
      </div>

      {/* Received Invitations */}
      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Invitaciones Recibidas ({invitations.length})
        </h2>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-white/20 rounded"></div>
                    <div className="h-3 w-24 bg-white/20 rounded"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-20 h-8 bg-white/20 rounded"></div>
                  <div className="w-20 h-8 bg-white/20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 mx-auto text-white/50 mb-4" />
            <p className="text-white/70">No tienes invitaciones pendientes.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.map(invitation => (
              <div key={invitation.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      Invitación para colaborar en un {getEntityTypeLabel(invitation.entity_type)}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-white/60 mt-1">
                      <span>De: {invitation.owner_email}</span>
                      <span>•</span>
                      <span>Permisos: {getPermissionLabel(invitation.permission_level)}</span>
                      <span>•</span>
                      <span>{format(new Date(invitation.created_date), 'PPP', { locale: es })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    onClick={() => handleInvitationResponse(invitation.id, "accepted")}
                    className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Aceptar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleInvitationResponse(invitation.id, "rejected")}
                    className="border-red-400/50 text-red-300 hover:bg-red-500/20"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Rechazar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sent Invitations */}
      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Invitaciones Enviadas ({sentInvitations.length})
        </h2>

        {sentInvitations.length === 0 ? (
          <div className="text-center py-12">
            <UserPlus className="w-12 h-12 mx-auto text-white/50 mb-4" />
            <p className="text-white/70">No has enviado invitaciones aún.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sentInvitations.map(invitation => (
              <div key={invitation.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {getEntityTypeLabel(invitation.entity_type)} compartido con {invitation.collaborator_email}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-white/60 mt-1">
                      <span>Permisos: {getPermissionLabel(invitation.permission_level)}</span>
                      <span>•</span>
                      <span>{format(new Date(invitation.created_date), 'PPP', { locale: es })}</span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(invitation.status)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}