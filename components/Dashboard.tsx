
import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Wallet, 
  Package, 
  ShoppingCart,
  ArrowRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard, PrimaryButton } from './Shared';
import { Link } from 'react-router-dom';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const Dashboard: React.FC = () => {
  // Simulating data state to demonstrate empty state logic
  const hasData = true; // Set to false to see onboarding state

  if (!hasData) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2">
                  <TrendingUp size={40} className="text-slate-400" />
              </div>
              <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome to Ubuxa Agent</h2>
                  <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-2">Your dashboard is empty. Start by registering your first customer or creating a sale.</p>
              </div>
              <div className="space-y-3 w-full max-w-xs">
                  <Link to="/customers">
                    <PrimaryButton className="w-full flex justify-between">
                        <span>Add Customer</span>
                        <ArrowRight size={18} />
                    </PrimaryButton>
                  </Link>
                  <Link to="/sales">
                    <button className="w-full py-4 text-slate-600 dark:text-slate-300 font-bold bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        Go to Sales
                    </button>
                  </Link>
              </div>
          </div>
      )
  }

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        <StatCard 
          title="Total Sales (Monthly)" 
          value="₦2.25M" 
          icon={<TrendingUp className="text-primary" size={20} />} 
          trend="+12.5%" 
          positive 
        />
        <StatCard 
          title="New Customers" 
          value="156" 
          icon={<Users className="text-primary" size={20} />} 
          trend="+4.3%" 
          positive 
        />
        <StatCard 
          title="Inventory Value" 
          value="₦5.75M" 
          icon={<Package className="text-indigo-600" size={20} />} 
          trend="-2.1%" 
          positive={false} 
        />
        <StatCard 
          title="Commissions" 
          value="₦124k" 
          icon={<Wallet className="text-green-600" size={20} />} 
          trend="+5.2%" 
          positive 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-10">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Weekly Performance</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Revenue trends across major hubs</p>
            </div>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white rounded-xl px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer hover:border-primary">
              <option className="text-slate-900 dark:text-white">Last 7 Days</option>
              <option className="text-slate-900 dark:text-white">Last 30 Days</option>
            </select>
          </div>
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F766E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0F766E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
                    fontWeight: 700,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    color: '#0f172a'
                  }}
                />
                <Area type="monotone" dataKey="sales" stroke="#0F766E" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" dot={{ r: 3, fill: '#0F766E', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Recent Sales</h2>
            <button className="text-primary text-xs sm:text-sm font-bold hover:underline px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors">View All</button>
          </div>
          <div className="space-y-6 sm:space-y-8 flex-1">
            <ActivityItem 
              title="Solar Panel 450W" 
              subtitle="To John Doe • ₦150,000" 
              time="2h ago" 
              status="SUCCESS"
            />
            <ActivityItem 
              title="Battery Pack 220Ah" 
              subtitle="To Mary Jane • ₦280,000" 
              time="5h ago" 
              status="PENDING"
            />
            <ActivityItem 
              title="Inverter 5kVA Pro" 
              subtitle="To Collins N. • ₦450,000" 
              time="Yesterday" 
              status="SUCCESS"
            />
          </div>
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl sm:rounded-[2rem] border border-slate-100 dark:border-slate-700 border-dashed text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Performance Insight</p>
            <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mt-2">You are 12% ahead of your weekly quota!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityItem: React.FC<{ title: string, subtitle: string, time: string, status: 'SUCCESS' | 'PENDING' }> = ({ title, subtitle, time, status }) => (
  <div className="flex items-center space-x-4 sm:space-x-5 group cursor-pointer active:bg-slate-50 dark:active:bg-slate-800 rounded-xl transition-all">
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shrink-0 ${status === 'SUCCESS' ? 'bg-blue-50 dark:bg-blue-900/30 text-primary' : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600'} group-hover:scale-110 shadow-sm`}>
      <ShoppingCart size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-none group-hover:text-primary transition-colors truncate">{title}</h4>
      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium truncate">{subtitle}</p>
    </div>
    <div className="text-right shrink-0">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{time}</p>
      <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg mt-1 inline-block ${status === 'SUCCESS' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
        {status}
      </span>
    </div>
  </div>
);

export default Dashboard;
