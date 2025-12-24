
import React, { useMemo } from 'react';
import { DataTable, DropdownMenu } from './Shared';
import { ColumnDef } from '@tanstack/react-table';
import { Smartphone, Key, History, RefreshCw, SmartphoneIcon, Hash } from 'lucide-react';

const MOCK_DEVICES = [
  { id: '1', sn: 'SP-2024-X91', model: 'Solar Hub Pro v2', status: 'AVAILABLE', tokenable: true, customer: '-' },
  { id: '2', sn: 'SP-2024-B12', model: 'Inverter Smart 5k', status: 'USED', tokenable: true, customer: 'Kathleen P.' },
  { id: '3', sn: 'SP-2023-Z05', model: 'Battery Monitor', status: 'RESERVED', tokenable: false, customer: 'Ericka C.' },
  { id: '4', sn: 'SP-2024-K18', model: 'Solar Hub Pro v2', status: 'AVAILABLE', tokenable: true, customer: '-' },
  { id: '5', sn: 'SP-2024-L99', model: 'Inverter Smart 5k', status: 'RESERVED', tokenable: true, customer: 'John S.' },
];

const DevicesList: React.FC = () => {
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'sn',
      header: 'Serial Number',
      cell: info => <span className="font-bold text-slate-900 dark:text-white">{String(info.getValue())}</span>,
    },
    {
      accessorKey: 'model',
      header: 'Hardware Model',
      cell: info => (
        <div className="flex items-center space-x-2">
          <SmartphoneIcon size={14} className="text-slate-400" />
          <span>{String(info.getValue())}</span>
        </div>
      ),
    },
    {
      accessorKey: 'customer',
      header: 'Assigned Client',
      cell: info => <span className="text-slate-600 dark:text-slate-300 italic">{String(info.getValue())}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Operational Status',
      cell: info => {
        const status = String(info.getValue());
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            status === 'AVAILABLE' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 
            status === 'USED' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
          }`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'tokenable',
      header: 'Features',
      cell: info => info.getValue() ? <span className="px-1.5 py-0.5 bg-gold/10 text-gold border border-gold/20 text-[8px] font-bold uppercase rounded">PAYGO-Enabled</span> : <span className="text-[8px] font-bold text-slate-300 dark:text-slate-600 uppercase">Standard</span>,
    },
    {
      id: 'actions',
      header: 'Hardware Control',
      cell: (info) => (
        <DropdownMenu 
          trigger={<button className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg bg-slate-50 dark:bg-slate-800 font-bold text-xs">Manage</button>}
          items={[
            { label: 'Generate Token', icon: <Key size={14} />, onClick: () => {} },
            { label: 'View Audit Logs', icon: <History size={14} />, onClick: () => {} },
            { label: 'Force Sync', icon: <RefreshCw size={14} />, onClick: () => {} },
          ]}
        />
      ),
    }
  ], []);

  return (
    <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Hardware Index</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Audit all serialized devices and check token compatibility.</p>
        </div>
      </div>

      <DataTable 
        data={MOCK_DEVICES} 
        columns={columns} 
        searchPlaceholder="Search by SN or Model..."
      />
    </div>
  );
};

export default DevicesList;
