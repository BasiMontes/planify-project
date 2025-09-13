import { Expense } from "@/entities/Expense";
import { Budget } from "@/entities/Budget";

export const updateBudgetFromExpense = async (expense) => {
  // Find budget for the same month
  const expenseMonth = expense.date.slice(0, 7); // YYYY-MM format
  const budgets = await Budget.filter({ 
    month: expenseMonth,
    created_by: expense.created_by 
  });
  
  for (const budget of budgets) {
    // Update total spent
    const monthlyExpenses = await Expense.filter({
      created_by: expense.created_by
    });
    
    // Filter expenses for this month
    const currentMonthExpenses = monthlyExpenses.filter(exp => 
      exp.date.startsWith(expenseMonth)
    );
    
    const totalSpent = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Update category spending
    const updatedCategories = budget.categories?.map(category => {
      const categoryExpenses = currentMonthExpenses.filter(exp => 
        exp.category === category.name
      );
      const categorySpent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      return {
        ...category,
        spent: categorySpent
      };
    }) || [];
    
    // Update budget
    await Budget.update(budget.id, {
      current_spent: totalSpent,
      categories: updatedCategories
    });
  }
};

export const checkBudgetAlerts = async (budget) => {
  const alerts = [];
  
  // Check total budget
  const percentage = budget.total_amount > 0 ? (budget.current_spent / budget.total_amount) * 100 : 0;
  
  if (percentage >= 90) {
    alerts.push({
      type: "budget_exceeded",
      message: `Has superado el 90% de tu presupuesto "${budget.name}"`
    });
  } else if (percentage >= 80) {
    alerts.push({
      type: "budget_warning", 
      message: `Estás cerca del límite en "${budget.name}" (${percentage.toFixed(1)}% usado)`
    });
  }
  
  // Check categories
  budget.categories?.forEach(category => {
    if (category.limit > 0) {
      const catPercentage = (category.spent / category.limit) * 100;
      if (catPercentage >= 90) {
        alerts.push({
          type: "category_exceeded",
          message: `Límite superado en "${category.name}": £${category.spent}/£${category.limit}`
        });
      }
    }
  });
  
  return alerts;
};