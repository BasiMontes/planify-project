import { Notification } from "@/entities/Notification";
import { User } from "@/entities/User";

export const createNotification = async (userEmail, title, message, type = "alert", link = null) => {
  return await Notification.create({
    user_email: userEmail,
    title,
    message, 
    type,
    link,
    is_read: false
  });
};

export const notifyBudgetAlert = async (userEmail, budgetName, percentage) => {
  return await createNotification(
    userEmail,
    "⚠️ Alerta de Presupuesto",
    `Has gastado el ${percentage}% de tu presupuesto "${budgetName}". ¡Ten cuidado!`,
    "alert",
    "/budgets"
  );
};

export const notifyGoalProgress = async (userEmail, goalTitle, percentage) => {
  return await createNotification(
    userEmail,
    "🎯 Progreso en Objetivo",
    `¡Genial! Has alcanzado el ${percentage}% de tu objetivo "${goalTitle}"`,
    "goal_update",
    "/goals"
  );
};

export const notifyCollaboratorExpense = async (collaboratorEmail, expenseTitle, amount, paidBy) => {
  return await createNotification(
    collaboratorEmail,
    "💸 Nuevo Gasto Compartido",
    `${paidBy} ha añadido un gasto: "${expenseTitle}" por £${amount}`,
    "new_expense",
    "/expenses"
  );
};

export const notifyInvitation = async (inviteeEmail, inviterName, entityType, entityName) => {
  const typeNames = {
    budget: "presupuesto",
    goal: "objetivo", 
    expense: "gasto"
  };
  
  return await createNotification(
    inviteeEmail,
    "🤝 Nueva Invitación",
    `${inviterName} te ha invitado a colaborar en el ${typeNames[entityType]} "${entityName}"`,
    "invite",
    "/collaborate"
  );
};
