
import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  Layers,
  ShoppingBag,
  Edit,
  Trash2,
  MoreVertical,
  Eye
} from 'lucide-react';
import { 
  SideDrawer, 
  PrimaryButton, 
  Input, 
  MultiSelect, 
  StatCard, 
  DataTable, 
  DropdownMenu,
  Toast 
} from './Shared';
import { ColumnDef } from '@tanstack/react-table';

const MOCK_PACKAGES = [
  { 
    id: 'P1', 
    name: 'Starter Home Bundle', 
    items: ['2x 450W Panel', '1x Solar Hub', '1x 100Ah Battery'], 
    price: 450000, 
    popular: true, 
    conversions: 24,
    category: 'Residential'
  },
  { 
    id: 'P2', 
    name: 'Elite Power System', 
    items: ['4x 450W Panel', '1x Solar Hub Pro', '2x 220Ah Battery', '1x 3kVA Inverter'], 
    price: 1250000, 
    popular: false, 
    conversions: 8,
    category: 'Commercial'
  },
  { 
    id: 'P3', 
    name: 'Eco-Mini Pack', 
    items: ['1x 200W Panel', '1x Mini Hub', '1x 50Ah Battery'], 
    price: 185000, 
    popular: true, 
    conversions: 45,
    category: 'Basic'
  },
  { 
    id: 'P4', 
    name: 'Battery Backup Pro', 
    items: ['2x 220Ah Luminous Battery', '1x 5kVA Felicity Inverter'], 
    price: 980000, 
    popular: false, 
    conversions: 12,
    category: 'Add-on'
  },
  { 
    id: 'P5', 
    name: 'Office Energy Plus', 
    items: ['6x 450W Panel', '1x 5kVA Inverter', '4x 200Ah Battery'], 
    price: 1850000, 
    popular: false, 
    conversions: 5,
    category: 'Commercial'
  },
];

const INVENTORY_OPTIONS = [
  'Canadian Solar 450W Panel',
  'Solar Hub Pro v2',
  'Luminous 220Ah Battery',
  'Felicity 5kVA Inverter',
  'Solar Cable 4mm',
  'Charge Controller 60A'
];

const Packages: React.FC = () => {
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [toast, setToast] = useState<{ title: string; message: string; type: any } | null>(null);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Bundle Name',
      cell: info => <span className="font-bold text-slate-900 dark:text-white">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: info => (
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
          {info.getValue() as string}
        </span>
      ),
    },
    {
        accessorKey: 'items',
        header: 'Components',
        cell: info => {
            const items = info.getValue() as string[];
            return (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[200px] block" title={items.join(', ')}>
                    {items.length} Units: {items[0]}...
                </span>
            )
        }
    },
    {
      accessorKey: 'price',
      header: 'Value',
      cell: info => <span className="font-bold text-ubuxa-blue">₦{(info.getValue() as number).toLocaleString()}</span>,
    },
    {
      accessorKey: 'conversions',
      header: 'Sales',
      cell: info => <span className="font-mono text-xs font-bold">{info.getValue() as number}</span>,
    },
    {
      accessorKey: 'popular',
      header: 'Status',
      cell: info => info.getValue() ? (
        <span className="flex items-center space-x-1 text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full w-fit">
            <TrendingUp size={12} />
            <span>Trending</span>
        </span>
      ) : <span className="text-[10px] font-bold text-slate-400 px-2">Standard</span>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <DropdownMenu 
          trigger={<button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"><MoreVertical size={16} /></button>}
          items={[
            { label: 'View Details', icon: <Eye size={14} />, onClick: () => {} },
            { label: 'Edit Bundle', icon: <Edit size={14} />, onClick: () => {} },
            { label: 'Archive', icon: <Trash2 size={14} />, onClick: () => {}, variant: 'danger' },
          ]}
        />
      ),
    }
  ], []);

  const handleSave = () => {
      setIsAddDrawerOpen(false);
      setToast({ title: 'Bundle Created', message: 'New system package has been successfully defined.', type: 'success' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 lg:pb-12">
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
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">System Packages</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Manage standard equipment configurations and pricing</p>
        </div>
        <PrimaryButton onClick={() => setIsAddDrawerOpen(true)} icon={<Plus size={22} strokeWidth={3} />}>
          New Bundle Definition
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          title="Market Leader" 
          value="Eco-Mini Pack" 
          icon={<TrendingUp className="text-ubuxa-blue" size={24} />} 
          trend="45 Deals" 
          positive 
        />
        <StatCard 
          title="Avg. Transaction" 
          value="₦716,250" 
          icon={<ShoppingBag className="text-ubuxa-blue" size={24} />} 
        />
        <StatCard 
          title="Active Configs" 
          value="12 Bundles" 
          icon={<Layers className="text-blue-600" size={24} />} 
        />
      </div>

      <DataTable 
        data={MOCK_PACKAGES} 
        columns={columns} 
        searchPlaceholder="Search bundles by name or component..." 
      />

      <SideDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title="Package Builder"
        subtitle="Initialize a serialized equipment bundle for deployment."
        maxWidth="max-w-xl"
        footer={
          <PrimaryButton className="w-full py-5 text-lg" onClick={handleSave}>
            Initialize Bundle
          </PrimaryButton>
        }
      >
        <div className="space-y-10">
          <Input label="System Profile Name" placeholder="e.g. Platinum Solar Series" icon={<Box size={22} />} />
          
          <div className="space-y-4">
             <MultiSelect 
               label="Hardware Stack" 
               options={INVENTORY_OPTIONS} 
               selected={selectedItems} 
               onChange={setSelectedItems} 
             />
             <p className="text-[10px] text-slate-400 italic px-2 font-medium">Bundles should include at least one core Hub and one storage unit for PAYGO eligibility.</p>
          </div>

          <Input label="Set Retail Value (₦)" type="number" placeholder="0.00" icon={<ShoppingBag size={22} />} />

          <div className="p-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] shadow-sm">
             <div className="flex items-center space-x-4 mb-6 text-slate-900 dark:text-white">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm"><TrendingUp size={20} className="text-ubuxa-blue" /></div>
                <h5 className="font-bold text-sm uppercase tracking-widest">Visibility Controls</h5>
             </div>
             <div className="space-y-6">
               <div className="flex items-center justify-between">
                 <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Highlight as Trending</span>
                 <input type="checkbox" className="w-6 h-6 rounded-lg accent-ubuxa-blue border-slate-300 cursor-pointer" />
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Enable Finance Protocol</span>
                 <input type="checkbox" defaultChecked className="w-6 h-6 rounded-lg accent-ubuxa-blue border-slate-300 cursor-pointer" />
               </div>
             </div>
          </div>
        </div>
      </SideDrawer>
    </div>
  );
};

export default Packages;
