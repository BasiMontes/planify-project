import React from "react";
import { format } from "date-fns";
import { Receipt, TrendingDown, TrendingUp, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function RecentActivity({ expenses, isLoading }) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-6 w-6 bg-white/20 rounded" />
          <Skeleton className="h-7 w-32 bg-white/20" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 bg-white/20 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24 bg-white/20" />
                <Skeleton className="h-3 w-16 bg-white/20" />
              </div>
              <Skeleton className="h-4 w-12 bg-white/20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-white/10">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Receipt className="w-6 h-6 text-white/60" />
          </div>
          <p className="text-white/70 text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {expenses.slice(0, 5).map((expense) => (
            <div key={expense.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors duration-200">
              <div className="p-2 rounded-xl bg-white/10">
                <Receipt className="w-4 h-4 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{expense.title}</p>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <span>{expense.category}</span>
                  <span>•</span>
                  <span>{format(new Date(expense.date), 'MMM d')}</span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-white font-medium">£{expense.amount.toLocaleString()}</p>
                <Badge 
                  variant="outline" 
                  className={`text-xs border-white/20 ${
                    expense.status === 'paid' ? 'bg-emerald-500/20 text-emerald-300' : 
                    expense.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 
                    'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {expense.status}
                </Badge>
              </div>
            </div>
          ))}
          
          {expenses.length > 5 && (
            <div className="text-center pt-2">
              <p className="text-white/60 text-sm">
                +{expenses.length - 5} more activities
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}