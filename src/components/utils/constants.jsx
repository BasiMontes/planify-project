// App Constants
export const APP_CONFIG = {
  PAGINATION_SIZE: 20,
  MAX_RETRIES: 3,
  DEBOUNCE_DELAY: 300
};

// UI Text Constants
export const UI_TEXT = {
  BUTTONS: {
    CREATE: 'Crear',
    UPDATE: 'Actualizar', 
    CANCEL: 'Cancelar',
    DELETE: 'Eliminar',
    SAVE: 'Guardar',
    EXPORT: 'Exportar',
    INVITE: 'Invitar',
    LOGIN: 'Iniciar Sesión',
    LOGOUT: 'Cerrar Sesión'
  },
  MESSAGES: {
    SUCCESS: {
      BUDGET_CREATED: 'Presupuesto creado exitosamente',
      BUDGET_UPDATED: 'Presupuesto actualizado exitosamente',
      BUDGET_DELETED: 'Presupuesto eliminado exitosamente',
      GOAL_CREATED: 'Objetivo creado exitosamente',
      GOAL_UPDATED: 'Objetivo actualizado exitosamente',
      GOAL_DELETED: 'Objetivo eliminado exitosamente',
      EXPENSE_CREATED: 'Gasto registrado exitosamente',
      EXPENSE_UPDATED: 'Gasto actualizado exitosamente',
      INCOME_CREATED: 'Ingreso registrado exitosamente',
      COLLABORATION_SENT: 'Invitación enviada exitosamente',
      EXPORT_SUCCESS: 'Datos exportados exitosamente'
    },
    ERROR: {
      GENERIC: 'Ha ocurrido un error. Inténtalo de nuevo.',
      PERMISSION_DENIED: 'No tienes permisos para realizar esta acción',
      NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
      VALIDATION_ERROR: 'Por favor, completa todos los campos requeridos'
    },
    CONFIRM: {
      DELETE_BUDGET: '¿Estás seguro de eliminar este presupuesto?',
      DELETE_GOAL: '¿Estás seguro de eliminar este objetivo?',
      DELETE_ACCOUNT: '¿Estás seguro de eliminar tu cuenta? Esta acción es irreversible.'
    }
  }
};

// Expense Categories with Colors
export const EXPENSE_CATEGORIES = [
  { name: "Vivienda", color: "#3B82F6", icon: "🏠" },
  { name: "Comida", color: "#10B981", icon: "🍽️" },
  { name: "Transporte", color: "#F59E0B", icon: "🚗" },
  { name: "Ocio", color: "#EF4444", icon: "🎮" },
  { name: "Salud", color: "#8B5CF6", icon: "💊" },
  { name: "Compras", color: "#EC4899", icon: "🛍️" },
  { name: "Servicios", color: "#06B6D4", icon: "⚡" },
  { name: "Ahorros", color: "#84CC16", icon: "💰" },
  { name: "Otros", color: "#6B7280", icon: "📦" }
];

// Income Categories
export const INCOME_CATEGORIES = [
  { value: "salary", label: "Salario 💼", color: "#10B981" },
  { value: "freelance", label: "Freelance 💻", color: "#3B82F6" },
  { value: "investment", label: "Inversiones 📈", color: "#8B5CF6" },
  { value: "bonus", label: "Bonus 🎁", color: "#F59E0B" },
  { value: "other", label: "Otros 💡", color: "#6B7280" }
];

// Goal Categories
export const GOAL_CATEGORIES = [
  { value: "vacation", label: "Vacaciones ✈️", color: "#06B6D4" },
  { value: "emergency", label: "Fondo de Emergencia 🛡️", color: "#EF4444" },
  { value: "purchase", label: "Compra importante 💻", color: "#8B5CF6" },
  { value: "investment", label: "Inversión 📈", color: "#10B981" },
  { value: "other", label: "Otro 💡", color: "#6B7280" }
];

// Color Palettes
export const COLORS = {
  PROGRESS: {
    SAFE: '#10B981',      // Emerald 
    WARNING: '#F59E0B',   // Amber
    DANGER: '#EF4444',    // Red
    INFO: '#3B82F6',      // Blue
    SUCCESS: '#84CC16'    // Lime
  },
  GLASS: {
    CARD: 'rgba(255, 255, 255, 0.15)',
    NAV: 'rgba(255, 255, 255, 0.08)',
    BORDER: 'rgba(255, 255, 255, 0.2)'
  }
};

// Achievements
export const ACHIEVEMENTS = [
  { 
    id: 'first_budget', 
    name: "Primer Presupuesto", 
    icon: "🏆", 
    description: "Has creado tu primer presupuesto",
    condition: (stats) => stats.totalBudgets > 0 
  },
  { 
    id: 'saver', 
    name: "Ahorrista", 
    icon: "💎", 
    description: "Has definido tu primer objetivo de ahorro",
    condition: (stats) => stats.totalGoals > 0 
  },
  { 
    id: 'organized', 
    name: "Organizador", 
    icon: "📊", 
    description: "Has registrado más de 10 gastos",
    condition: (stats) => stats.totalExpenses > 10 
  },
  { 
    id: 'goal_achiever', 
    name: "Meta Cumplida", 
    icon: "🎯", 
    description: "Has completado tu primer objetivo",
    condition: (stats) => stats.goalsCompleted > 0 
  }
];

// Validation Rules
export const VALIDATION = {
  BUDGET: {
    NAME: { minLength: 1, maxLength: 100 },
    AMOUNT: { min: 0.01, max: 1000000 }
  },
  GOAL: {
    TITLE: { minLength: 1, maxLength: 100 },
    AMOUNT: { min: 0.01, max: 10000000 }
  },
  EXPENSE: {
    TITLE: { minLength: 1, maxLength: 100 },
    AMOUNT: { min: 0.01, max: 100000 }
  }
};