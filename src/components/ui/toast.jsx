import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const toastTypes = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-emerald-500/90',
    iconColor: 'text-white'
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-500/90',
    iconColor: 'text-white'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/90',
    iconColor: 'text-white'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-500/90',
    iconColor: 'text-white'
  }
};

function Toast({ notification, onRemove }) {
  const { type = 'info', title, message } = notification;
  const { icon: Icon, bgColor, iconColor } = toastTypes[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`${bgColor} backdrop-blur-xl text-white p-4 rounded-2xl shadow-2xl border border-white/20 max-w-sm w-full`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 ${iconColor} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{title}</p>
          {message && <p className="text-xs text-white/90 mt-1">{message}</p>}
        </div>
        <button
          onClick={() => onRemove(notification.id)}
          className="text-white/70 hover:text-white transition-colors ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export default function ToastContainer() {
  const { notifications, removeNotification } = useApp();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}