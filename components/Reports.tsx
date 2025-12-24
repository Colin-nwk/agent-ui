
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { 
  Download, 
  Calendar, 
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Target,
  Users,
  Box,
  ArrowUpRight,
  FileText,
  Share2,
  Printer,
  FileType,
  CheckCircle2
} from 'lucide-react';
import { BottomSheetModal, PrimaryButton, SecondaryButton, Input, Select, Toast } from './Shared';

const barData = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 52 },
  { name: 'Mar', value: 38 },
  { name: 'Apr', value: 65 },
  { name: 'May', value: 48 },
  { name: 'Jun', value: 59 },
];

const trendData = [
  { name: 'Week 1', revenue: 1200000 },
  { name: 'Week 2', revenue: 1800000 },
  { name: 'Week 3', revenue: 1600000 },
  { name: 'Week 4', revenue: 2400000 },
  { name: 'Week 5', revenue: 2100000 },
  { name: 'Week 6', revenue: 3200000 },
];

const MOCK_RECENT_REPORTS = [
    { id: 'RPT-2024-001', title: 'Q1 Sales Performance', type: 'Sales', date: 'Mar 31, 2024', size: '2.4 MB' },
    { id: 'RPT-2024-002', title: 'Inventory Audit Log', type: 'Inventory', date: 'Mar 28, 2024', size: '1.1 MB' },
    { id: 'RPT-2024-003', title: 'Agent Commission Slip', type: 'Financial', date: 'Mar 15, 2024', size: '0.8 MB' },
];

// Updated Colors: Primary (Teal), Secondary (Teal Light), Accent (Amber)
const COLORS = ['#0F766E', '#14B8A6', '#F59E0B', '#0F766E', '#14B8A6', '#F59E0B'];

const Reports: React.FC = () => {
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [toast, setToast] = useState<{ title: string; message: string; type: any } | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '', period: 'Last 30 Days' });

  const handleApplyFilter = () => {
    setShowDateFilter(false);
    setToast({ title: 'Filter Applied', message: `Showing data for ${dateRange.period}`, type: 'success' });
  };

  const handleExport = () => {
    setShowExport(false);
    setToast({ title: 'Export Started', message: 'Your report is being generated.', type: 'info' });
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-top-4 duration-500 pb-20 lg:pb-0">
      {toast && (
        <Toast 
          title={toast.title} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">System Intelligence</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Audit sales performance and hub efficiency trends</p>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setShowDateFilter(true)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-4 rounded-2xl font-bold flex items-center space-x-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
            <Calendar size={20} />
            <span>{dateRange.period || 'Select Period'}</span>
          </button>
          <button onClick={() => setShowExport(true)} className="bg-slate-900 dark:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 shadow-xl shadow-slate-200 dark:shadow-slate-900 hover:bg-slate-800 dark:hover:bg-slate-700 transition-all active:scale-95">
            <Download size={20} />
            <span>Export Audit</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Performance Trend */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="flex justify-between items-start mb-10">
             <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Revenue Stream</h3>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">LTM Growth Protocol</p>
             </div>
             <div className="bg-blue-50 dark:bg-blue-900/30 text-ubuxa-blue px-4 py-1.5 rounded-xl text-xs font-black uppercase flex items-center">
                <TrendingUp size={14} className="mr-2" />
                +24% Growth
             </div>
          </div>
          <div className="h-80 flex-1">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F766E" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0F766E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontWeight: 700, backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#0f172a' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0F766E" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Distribution */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="flex justify-between items-start mb-10">
             <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Sales Density</h3>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">Regional Unit Distribution</p>
             </div>
             <Box size={24} className="text-slate-300 dark:text-slate-600" />
          </div>
          <div className="h-80 flex-1">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#0f172a' }} />
                  <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={40}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <ReportMetric 
          title="Conversion Efficiency" 
          value="75.5%" 
          subtitle="Identity to transaction ratio" 
          icon={<Target size={24} />} 
          color="bg-ubuxa-blue" 
         />
         <ReportMetric 
          title="Unit LTV" 
          value="₦420,000" 
          subtitle="Average lifetime unit value" 
          icon={<ArrowUpRight size={24} />} 
          color="bg-slate-900 dark:bg-slate-800" 
         />
         <ReportMetric 
          title="Network Tier" 
          value="#3 / 15" 
          subtitle="Regional agent hierarchy" 
          icon={<Users size={24} />} 
          color="bg-ubuxa-blue" 
         />
      </div>

      {/* Recent Reports List */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Generated Reports</h3>
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden">
            {MOCK_RECENT_REPORTS.map((report, i) => (
                <div key={report.id} onClick={() => setSelectedReport(report)} className={`p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${i !== MOCK_RECENT_REPORTS.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-ubuxa-blue rounded-2xl flex items-center justify-center">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-base">{report.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{report.date} • {report.size}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400">{report.type}</span>
                        <ChevronRight size={20} className="text-slate-300" />
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* --- Bottom Sheets --- */}
      
      {/* Date Filter Sheet */}
      <BottomSheetModal isOpen={showDateFilter} onClose={() => setShowDateFilter(false)} title="Filter Period">
         <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
                {['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month'].map(p => (
                    <button 
                        key={p} 
                        onClick={() => setDateRange({...dateRange, period: p})}
                        className={`py-3 rounded-xl text-xs font-bold transition-all ${dateRange.period === p ? 'bg-ubuxa-blue text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        {p}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input label="Start Date" type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} />
                <Input label="End Date" type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} />
            </div>
            <PrimaryButton className="w-full" onClick={handleApplyFilter}>Apply Filters</PrimaryButton>
         </div>
      </BottomSheetModal>

      {/* Export Sheet */}
      <BottomSheetModal isOpen={showExport} onClose={() => setShowExport(false)} title="Export Data">
         <div className="space-y-6">
            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">File Format</label>
                <div className="grid grid-cols-3 gap-4">
                    <button className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent hover:border-ubuxa-blue flex flex-col items-center justify-center space-y-2 transition-all group">
                        <FileText size={24} className="text-slate-400 group-hover:text-ubuxa-blue" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">PDF</span>
                    </button>
                    <button className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent hover:border-ubuxa-blue flex flex-col items-center justify-center space-y-2 transition-all group">
                        <FileType size={24} className="text-slate-400 group-hover:text-green-500" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Excel</span>
                    </button>
                    <button className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent hover:border-ubuxa-blue flex flex-col items-center justify-center space-y-2 transition-all group">
                        <FileType size={24} className="text-slate-400 group-hover:text-orange-500" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">CSV</span>
                    </button>
                </div>
            </div>
            <Select label="Data Scope">
                <option>Executive Summary</option>
                <option>Detailed Transaction Log</option>
                <option>Inventory Movement</option>
                <option>Customer Acquisition</option>
            </Select>
            <div className="pt-2">
                <PrimaryButton className="w-full" icon={<Download size={20} />} onClick={handleExport}>Download Report</PrimaryButton>
            </div>
         </div>
      </BottomSheetModal>

      {/* Report Details Sheet */}
      <BottomSheetModal isOpen={!!selectedReport} onClose={() => setSelectedReport(null)} title="Report Details">
         {selectedReport && (
             <div className="space-y-8">
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl flex items-start space-x-4">
                    <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-ubuxa-blue shadow-sm shrink-0">
                        <FileText size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedReport.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Generated on {selectedReport.date}</p>
                        <div className="flex items-center space-x-2 mt-3">
                            <span className="text-[10px] font-black uppercase bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md">{selectedReport.type}</span>
                            <span className="text-[10px] font-black uppercase bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">{selectedReport.size}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Share2 size={20} className="text-slate-900 dark:text-white" />
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Share</span>
                    </button>
                    <button className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Printer size={20} className="text-slate-900 dark:text-white" />
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Print</span>
                    </button>
                </div>

                <PrimaryButton className="w-full" icon={<Download size={20} />}>Download File</PrimaryButton>
             </div>
         )}
      </BottomSheetModal>
    </div>
  );
};

const ReportMetric: React.FC<{ title: string, value: string, subtitle: string, icon: React.ReactNode, color: string }> = ({ title, value, subtitle, icon, color }) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-ubuxa-blue transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
    <div className="flex items-center space-x-6">
      <div className={`w-16 h-16 ${color} rounded-[1.5rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white italic tracking-tight mt-1">{value}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{subtitle}</p>
      </div>
    </div>
    <div className="hidden sm:block">
       <button className="w-10 h-10 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-500 rounded-xl flex items-center justify-center group-hover:bg-ubuxa-blue group-hover:text-white transition-all">
          <ChevronRight size={24} />
       </button>
    </div>
  </div>
);

export default Reports;
