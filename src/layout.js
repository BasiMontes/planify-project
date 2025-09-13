import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, 
  Wallet, 
  Target, 
  TrendingUp, 
  User, 
  Bell,
  BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AppProvider } from "@/components/contexts/AppContext";
import ToastContainer from "@/components/ui/Toast";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Presupuestos", 
    url: createPageUrl("Budgets"),
    icon: Wallet,
  },
  {
    title: "Objetivos",
    url: createPageUrl("Goals"), 
    icon: Target,
  },
  {
    title: "Balance",
    url: createPageUrl("Balance"),
    icon: TrendingUp,
  },
  {
    title: "Perfil", 
    url: createPageUrl("Profile"),
    icon: User,
  },
];

function LayoutContent({ children, currentPageName }) {
  const location = useLocation();

  const getPageTitle = () => {
    const item = navigationItems.find(navItem => navItem.url === location.pathname);
    if (item) return item.title;
    if (currentPageName === 'Dashboard') return 'Home';
    if (currentPageName === 'Budgets') return 'Presupuestos';
    if (currentPageName === 'Goals') return 'Objetivos';
    if (currentPageName === 'Balance') return 'Balance';
    if (currentPageName === 'Notifications') return 'Notificaciones';
    if (currentPageName === 'UserGuide') return 'Guía de Usuario';
    return 'Planify';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      <style jsx>{`
        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .glass-card-purple {
          background: rgba(109, 40, 217, 0.1);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .glass-nav {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        /* Accessibility improvements */
        .focus-visible:focus {
          outline: 2px solid #3B82F6;
          outline-offset: 2px;
        }
        
        /* Better contrast for text */
        .text-accessible {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-15 animate-pulse delay-500"></div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-6 top-6 bottom-6 w-64 glass-nav rounded-3xl flex-col z-30">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Planify</h1>
              <p className="text-white/70 text-sm">Presupuesto Colaborativo</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 focus-visible:focus ${
                  isActive
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to={createPageUrl("UserGuide")} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 focus-visible:focus">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Guía de Uso</span>
          </Link>
          <Link to={createPageUrl("Notifications")} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 focus-visible:focus">
            <Bell className="w-5 h-5" />
            <span className="font-medium">Notificaciones</span>
            <Badge className="ml-auto bg-red-500/80 text-white border-red-400/30">3</Badge>
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 glass-nav border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white text-accessible">{getPageTitle()}</h1>
            <Link to={createPageUrl("Notifications")} className="focus-visible:focus">
              <div className="relative p-2">
                <Bell className="w-6 h-6 text-white" />
                <span className="absolute top-1 right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
            </Link>
        </div>
      </header>

      {/* Mobile Bottom Navbar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-white/20 p-2">
        <div className="flex justify-around items-center">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`flex flex-col items-center justify-center gap-1 p-1 rounded-lg transition-all duration-300 flex-1 h-16 focus-visible:focus ${
                  isActive ? 'bg-white/20' : ''
                }`}
              >
                <item.icon className={`w-5 h-5 mb-0.5 transition-colors ${isActive ? 'text-white' : 'text-white/70'}`} />
                <span className={`text-[10px] text-center transition-colors text-accessible ${isActive ? 'text-white font-semibold' : 'text-white/70'}`}>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen pt-24 lg:pt-6 pb-24 lg:pb-6 px-4 sm:px-6">
        {children}
      </main>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <AppProvider>
      <LayoutContent children={children} currentPageName={currentPageName} />
    </AppProvider>
  );
}