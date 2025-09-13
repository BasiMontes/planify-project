import React, { useState, useEffect } from "react";
import { Notification } from "@/entities/Notification";
import { Bell, Check, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      // Assuming we'll fetch notifications for the current user
      // const user = await User.me();
      // const data = await Notification.filter({ user_email: user.email }, "-created_date");
      const data = await Notification.list("-created_date"); // For now, list all
      setNotifications(data);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    }
    setIsLoading(false);
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="text-yellow-400" />;
      case 'goal_update': return <Check className="text-emerald-400" />;
      case 'new_expense': return <Bell className="text-blue-400" />;
      default: return <Bell className="text-white/70" />;
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Notificaciones</h1>
        <p className="text-white/80">Mantente al día con la actividad de tu equipo.</p>
      </div>

      <div className="glass-card rounded-3xl p-4 md:p-6 space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-white/20"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-3 bg-white/20 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 mx-auto text-white/50 mb-4" />
            <h3 className="text-xl font-bold text-white">Todo en calma</h3>
            <p className="text-white/70">No tienes notificaciones nuevas.</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-4 rounded-2xl transition-colors ${
                notif.is_read ? 'hover:bg-white/5' : 'bg-white/10 hover:bg-white/15'
              }`}
            >
              <div className="mt-1">
                {getIconForType(notif.type)}
              </div>
              <div className="flex-1">
                <p className={`font-bold text-white ${notif.is_read ? 'opacity-70' : ''}`}>{notif.title}</p>
                <p className="text-white/80 text-sm">{notif.message}</p>
                <p className="text-white/60 text-xs mt-1">
                  {formatDistanceToNow(new Date(notif.created_date), { addSuffix: true, locale: es })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}