
import React, { useMemo } from 'react';
import { DataTable, DropdownMenu, PrimaryButton } from './Shared';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, ShieldAlert, UserPlus, Mail, Phone, MapPin } from 'lucide-react';

const MOCK_CUSTOMERS = [
  { id: '1', name: 'Kathleen Pfeffer', email: 'angela98@gmail.com', phone: '+234 801 234 5678', location: 'Manteside, Lagos', status: 'ACTIVE' },
  { id: '2', name: 'Ericka Considine', email: 'carlo34@yahoo.com', phone: '+234 702 345 6789', location: 'South Elisa, Abuja', status: 'ACTIVE' },
  { id: '3', name: 'Edmond Schulist', email: 'jude_armstrong@hotmail.com', phone: '+234 903 456 7890', location: 'West Valley, Ibadan', status: 'ACTIVE' },
  { id: '4', name: 'Brionna O\'Keefe', email: 'elnora@hotmail.com', phone: '+234 814 567 8901', location: 'Lake Kiera, Kano', status: 'BARRED' },
  { id: '5', name: 'John Smith', email: 'jsmith@gmail.com', phone: '+234 802 111 2222', location: 'Lekki, Lagos', status: 'ACTIVE' },
  { id: '6', name: 'Jane Doe', email: 'janedoe@yahoo.com', phone: '+234 701 333 4444', location: 'Wuse 2, Abuja', status: 'ACTIVE' },
];

const CustomersList: React.FC = () => {
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Customer',
      cell: info => (
        <div className="flex items-center space-x-3">
          <img src={`https://picsum.photos/seed/${info.row.original.id}/40/40`} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700" alt="" />
          <span className="font-bold text-slate-900 dark:text-white">{String(info.getValue())}</span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email Address',
    },
    {
      accessorKey: 'phone',
      header: 'Contact',
    },
    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const status = String(info.getValue());
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            status === 'ACTIVE' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          }`}>
            {status}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <DropdownMenu 
          trigger={<button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors bg-slate-50 dark:bg-slate-800">Manage</button>}
          items={[
            { label: 'View Profile', icon: <Eye size={16} />, onClick: () => {} },
            { label: 'Edit', icon: <Edit size={16} />, onClick: () => {} },
            { label: 'Bar Access', icon: <ShieldAlert size={16} />, onClick: () => {}, variant: 'danger' },
          ]}
        />
      ),
    }
  ], []);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Customer Registry</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">A full directory of all registered customers.</p>
        </div>
        <PrimaryButton icon={<UserPlus size={20} />}>
          Register New
        </PrimaryButton>
      </div>

      <DataTable 
        data={MOCK_CUSTOMERS} 
        columns={columns} 
        searchPlaceholder="Filter customers by any field..."
      />
    </div>
  );
};

export default CustomersList;
