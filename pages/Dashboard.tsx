import React, { useMemo } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Transaction, Settings } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  settings: Settings;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const stats = useMemo(() => {
    const totalIn = transactions.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.amount, 0);
    const totalOut = transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.amount, 0);
    return {
      in: totalIn,
      out: totalOut,
      balance: totalIn - totalOut
    };
  }, [transactions]);

  const pieData = useMemo(() => {
    const categories: { [key: string]: number } = {};
    transactions.filter(t => t.type === 'OUT').forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const barData = useMemo(() => {
    // Group by last 7 days
    const days: { [key: string]: { in: number, out: number } } = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const ds = d.toLocaleDateString(undefined, { weekday: 'short' });
      days[ds] = { in: 0, out: 0 };
    }

    transactions.forEach(t => {
      const ds = new Date(t.date).toLocaleDateString(undefined, { weekday: 'short' });
      if (days[ds]) {
        if (t.type === 'IN') days[ds].in += t.amount;
        else days[ds].out += t.amount;
      }
    });

    return Object.entries(days).map(([name, vals]) => ({ name, ...vals }));
  }, [transactions]);

  const COLORS = ['#2563eb', '#06b6d4', '#8b5cf6', '#f43f5e', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out">
      <header className="space-y-2">
        <h1 className="text-5xl font-black tracking-tight">Mmamotse Overview</h1>
        <p className="opacity-50 font-bold uppercase tracking-widest text-sm">Financial Health Dashboard</p>
      </header>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="bg-gradient-to-br from-blue-600/20 to-transparent border-blue-500/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30">
              <Wallet className="text-white" size={24} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest opacity-50">Total Balance</p>
          </div>
          <p className="text-4xl font-black">{CURRENCY_SYMBOL} {stats.balance.toLocaleString()}</p>
        </GlassCard>

        <GlassCard className="bg-gradient-to-br from-emerald-600/20 to-transparent border-emerald-500/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/30">
              <ArrowUpCircle className="text-white" size={24} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest opacity-50">Money In</p>
          </div>
          <p className="text-4xl font-black">{CURRENCY_SYMBOL} {stats.in.toLocaleString()}</p>
        </GlassCard>

        <GlassCard className="bg-gradient-to-br from-rose-600/20 to-transparent border-rose-500/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-rose-600 rounded-2xl shadow-lg shadow-rose-500/30">
              <ArrowDownCircle className="text-white" size={24} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest opacity-50">Money Out</p>
          </div>
          <p className="text-4xl font-black">{CURRENCY_SYMBOL} {stats.out.toLocaleString()}</p>
        </GlassCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard>
          <h2 className="text-xl font-black mb-6 uppercase tracking-wider opacity-70">Expense Distribution</h2>
          <div className="h-80 w-full transform-gpu">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  animationDuration={800} 
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    borderRadius: '1rem', 
                    border: 'none',
                    color: '#fff',
                    fontWeight: 'bold'
                  }} 
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-xl font-black mb-6 uppercase tracking-wider opacity-70">Weekly Cash Flow</h2>
          <div className="h-80 w-full transform-gpu">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <YAxis hide />
                <Tooltip 
                   cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                   contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    borderRadius: '1rem', 
                    border: 'none',
                    color: '#fff',
                    fontWeight: 'bold'
                  }} 
                />
                <Bar dataKey="in" fill="#10b981" radius={[4, 4, 0, 0]} name="In" animationDuration={800} />
                <Bar dataKey="out" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Out" animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;