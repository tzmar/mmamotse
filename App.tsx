import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, ReceiptText, PiggyBank, BadgeDollarSign, Settings as SettingsIcon } from 'lucide-react';
import { Branding } from './components/Branding';
import { OfflineIndicator } from './components/OfflineIndicator';
import { View, Transaction, SavingsGoal, Settings, ForexRates } from './types';
import { STORAGE_KEYS, DEFAULT_IN_CATEGORIES, DEFAULT_OUT_CATEGORIES } from './constants';
import { ThemeSwitcher } from './components/ThemeSwitcher';

// Pages
import Dashboard from './pages/Dashboard';
import TransactionDesk from './pages/TransactionDesk';
import Savings from './pages/Savings';
import Forex from './pages/Forex';
import SettingsPage from './pages/Settings';

const App: React.FC = () => {
  // Persist Current View
  const [currentView, setCurrentView] = useState<View>(() => {
    const saved = localStorage.getItem('pula_view');
    return (saved as View) || 'dashboard';
  });
  
  // Persisted States
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : {
      inCategories: DEFAULT_IN_CATEGORIES,
      outCategories: DEFAULT_OUT_CATEGORIES,
      limits: {}
    };
  });

  const [forex, setForex] = useState<ForexRates>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOREX);
    return saved ? JSON.parse(saved) : { 'ZAR': 1.35, 'USD': 0.075 };
  });

  // Swipe Navigation Logic
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const navOrder: View[] = ['dashboard', 'transactions', 'savings', 'forex', 'settings'];

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = navOrder.indexOf(currentView);
      
      // Swipe Left -> Go Next
      if (isLeftSwipe && currentIndex < navOrder.length - 1) {
         setCurrentView(navOrder[currentIndex + 1]);
         window.scrollTo(0, 0); // Reset scroll on view change
      }
      
      // Swipe Right -> Go Previous
      if (isRightSwipe && currentIndex > 0) {
         setCurrentView(navOrder[currentIndex - 1]);
         window.scrollTo(0, 0); // Reset scroll on view change
      }
    }
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('pula_view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOREX, JSON.stringify(forex));
  }, [forex]);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Money', icon: ReceiptText },
    { id: 'savings', label: 'Goals', icon: PiggyBank },
    { id: 'forex', label: 'Forex', icon: BadgeDollarSign },
    { id: 'settings', label: 'Config', icon: SettingsIcon },
  ];

  return (
    <div 
      className="min-h-screen pb-24 md:pb-0 md:pl-72 flex flex-col"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <OfflineIndicator />

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-72 glass flex-col p-6 z-40">
        <Branding />
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold ${
                currentView === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 translate-x-2' 
                  : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-60 hover:opacity-100'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
        <footer className="mt-auto pt-6 border-t border-black/5 dark:border-white/10 flex flex-col items-center gap-4">
          <ThemeSwitcher />
          <p className="text-[10px] font-bold opacity-30 text-center tracking-widest uppercase">PulaPocket v1.0</p>
        </footer>
      </aside>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-20 glass rounded-full flex items-center justify-around px-4 z-40 shadow-2xl border border-black/5 dark:border-white/20 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as View)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              currentView === item.id ? 'text-blue-500 scale-110' : 'opacity-40'
            }`}
          >
            <item.icon size={24} />
            <span className="text-[10px] font-black uppercase">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {currentView === 'dashboard' && (
          <Dashboard 
            transactions={transactions} 
            settings={settings}
          />
        )}
        {currentView === 'transactions' && (
          <TransactionDesk 
            transactions={transactions} 
            setTransactions={setTransactions} 
            settings={settings}
          />
        )}
        {currentView === 'savings' && (
          <Savings 
            goals={goals} 
            setGoals={setGoals} 
          />
        )}
        {currentView === 'forex' && (
          <Forex 
            forex={forex} 
            setForex={setForex} 
          />
        )}
        {currentView === 'settings' && (
          <SettingsPage 
            settings={settings} 
            setSettings={setSettings} 
          />
        )}
      </main>
      
      {/* Mobile Footer Branding */}
      <div className="md:hidden p-8 flex justify-center opacity-30">
        <Branding size="lg" />
      </div>
    </div>
  );
};

export default App;