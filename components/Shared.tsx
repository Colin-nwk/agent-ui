
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  ChevronDown, 
  Check, 
  Upload, 
  Search, 
  Info,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  MapPin,
  CheckCircle2,
  Camera,
  RefreshCw,
  Trash2,
  File,
  Image as ImageIcon
} from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';

// --- BUTTONS ---
export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: React.ReactNode }> = ({ children, className, icon, ...props }) => (
  <button 
    className={`bg-ubuxa-gradient text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base ${className}`}
    {...props}
  >
    {icon && <span className="flex-shrink-0">{icon}</span>}
    <span>{children}</span>
  </button>
);

export const SecondaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: React.ReactNode }> = ({ children, className, icon, ...props }) => (
  <button 
    className={`bg-slate-900 dark:bg-slate-800 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-700 shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base ${className}`}
    {...props}
  >
    {icon && <span className="flex-shrink-0">{icon}</span>}
    <span>{children}</span>
  </button>
);

// --- SIDE DRAWER ---
interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  children, 
  footer,
  maxWidth = 'max-w-lg'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-[100] transition-visibility duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
      <div 
        className={`absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div className={`absolute top-0 right-0 h-full w-full ${maxWidth} bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 transform flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-6 sm:p-10 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight uppercase italic">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          {subtitle && <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">{subtitle}</p>}
        </div>
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 no-scrollbar text-slate-900 dark:text-slate-100">
          {children}
        </div>
        {footer && (
          <div className="p-6 sm:p-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 shadow-inner flex flex-col sm:flex-row gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// --- BOTTOM SHEET MODAL ---
interface BottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const BottomSheetModal: React.FC<BottomSheetModalProps> = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-[200] flex justify-center items-end sm:items-center transition-visibility duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
      <div 
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />
      <div 
        className={`relative w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${isOpen ? 'translate-y-0' : 'translate-y-full sm:translate-y-10 sm:opacity-0 sm:scale-95'}`}
        style={{ maxHeight: '85vh' }}
      >
        <div className="flex flex-col h-full max-h-[85vh]">
          {/* Swipe Handle for Mobile */}
          <div className="w-full flex justify-center pt-4 pb-2 sm:hidden cursor-pointer" onClick={onClose}>
             <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>
          
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title || 'Details'}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
              <X size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto no-scrollbar">
             {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- STAT CARD ---
export const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, trend?: string, positive?: boolean }> = ({ title, value, icon, trend, positive }) => (
  <div className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 group hover:border-primary hover:shadow-lg transition-all active:scale-[0.98]">
    <div className="flex justify-between items-start mb-4 sm:mb-6">
      <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800 rounded-xl sm:rounded-2xl group-hover:bg-ubuxa-gradient group-hover:text-white transition-all duration-500 shadow-sm shrink-0">
        {icon}
      </div>
      <button className="text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
        <MoreVertical size={18} />
      </button>
    </div>
    <div className="min-w-0">
      <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest truncate">{title}</p>
      <div className="flex items-baseline space-x-2 mt-1.5 flex-wrap">
        <h3 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight italic truncate">{value}</h3>
        {trend && (
          <span className={`text-[10px] font-black flex items-center px-1.5 py-0.5 rounded-lg shrink-0 ${positive ? 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400' : 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400'}`}>
            {positive ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
            {trend}
          </span>
        )}
      </div>
    </div>
  </div>
);

// --- INPUTS ---
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string, icon?: React.ReactNode }> = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    {label && <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>}
    <div className="relative group">
      {icon && <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">{icon}</div>}
      <input
        {...props}
        className={`w-full ${icon ? 'pl-11 sm:pl-14' : 'px-5 sm:px-6'} pr-5 sm:px-6 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-[1.25rem] text-sm sm:text-base text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm group-hover:border-blue-300 ${props.className}`}
      />
    </div>
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, children, ...props }) => (
  <div className="space-y-2">
    {label && <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>}
    <div className="relative group">
      <select
        {...props}
        className={`w-full px-5 sm:px-6 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-[1.25rem] text-sm sm:text-base text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary focus:outline-none appearance-none transition-all cursor-pointer shadow-sm group-hover:border-blue-300 ${props.className}`}
      >
        {children}
      </select>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary transition-colors">
        <ChevronDown size={18} />
      </div>
    </div>
  </div>
);

// --- TABS ---
export const Tabs: React.FC<{ tabs: { id: string; label: string, icon?: React.ReactNode }[], activeTab: string, onChange: (id: string) => void }> = ({ tabs, activeTab, onChange }) => (
  <div className="flex space-x-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner overflow-x-auto no-scrollbar">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
          activeTab === tab.id 
          ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm border border-slate-100 dark:border-slate-600' 
          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
      >
        {tab.icon && <span className={activeTab === tab.id ? 'text-primary dark:text-white' : ''}>{tab.icon}</span>}
        <span>{tab.label}</span>
      </button>
    ))}
  </div>
);

// --- DATA TABLE ---
interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  searchPlaceholder?: string;
}

export function DataTable<TData>({ data, columns, searchPlaceholder = "Search records..." }: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {searchPlaceholder && (
          <div className="relative flex-1 max-w-sm group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm group-hover:border-blue-300"
              placeholder={searchPlaceholder}
            />
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-slate-900 dark:bg-slate-950 text-white">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th 
                        key={header.id} 
                        className="px-6 sm:px-8 py-4 sm:py-6 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] cursor-pointer select-none group"
                        onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        <span className="text-slate-400">
                            {{
                                asc: <ChevronDown size={14} className="rotate-180 transition-transform" />,
                                desc: <ChevronDown size={14} className="transition-transform" />,
                            }[header.column.getIsSorted() as string] ?? <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group active:bg-blue-50/50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-8 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                       <Search size={40} className="text-slate-200 dark:text-slate-700 mb-4" />
                       <p className="text-base font-bold text-slate-900 dark:text-white">No matching records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Simple Pagination */}
        <div className="px-6 sm:px-8 py-4 sm:py-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
             <span>Page</span>
             <span className="text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">{table.getState().pagination.pageIndex + 1}</span>
             <span>of</span>
             <span className="text-slate-900 dark:text-white">{table.getPageCount()}</span>
           </div>
           <div className="flex items-center space-x-2">
             <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white active:scale-90 disabled:opacity-20 transition-all shadow-sm"><ChevronLeft size={16} /></button>
             <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white active:scale-90 disabled:opacity-20 transition-all shadow-sm"><ChevronRight size={16} /></button>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- FILE UPLOAD ---
export const FileUpload: React.FC<{ 
  label: string, 
  description?: string, 
  accept?: string, 
  multiple?: boolean,
  onChange?: (files: File[]) => void 
}> = ({ label, description, accept, multiple, onChange }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{file: File, url: string}[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
      
      setFiles(updatedFiles);
      
      const newPreviews = updatedFiles.map(file => ({
        file,
        url: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
      }));
      setPreviews(newPreviews);
      
      if (onChange) onChange(updatedFiles);
    }
  };

  const removeFile = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setPreviews(previews.filter((_, i) => i !== index));
    if (onChange) onChange(updatedFiles);
    
    // Reset input so same file can be selected again if needed
    if (inputRef.current) inputRef.current.value = '';
  };

  const triggerInput = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>}
      <div 
        onClick={triggerInput}
        className={`border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all bg-slate-50 dark:bg-slate-800 shadow-sm group relative overflow-hidden ${files.length > 0 ? 'min-h-[160px]' : 'min-h-[200px]'}`}
      >
         <input 
            type="file" 
            className="hidden" 
            ref={inputRef}
            accept={accept} 
            multiple={multiple}
            onChange={handleFileChange} 
         />

         {files.length === 0 ? (
           <>
             <Upload className="text-slate-400 mb-3 group-hover:text-primary transition-colors" size={28} />
             <p className="text-base font-bold text-slate-900 dark:text-white">Drop files or tap</p>
             {description && <p className="text-xs text-slate-500 font-medium px-4 mt-1">{description}</p>}
           </>
         ) : (
           <div className="w-full">
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
               {previews.map((preview, idx) => (
                 <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 group/item shadow-sm">
                    {preview.url ? (
                      <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2">
                        <File className="text-slate-400 mb-1" size={24} />
                        <span className="text-[9px] text-slate-500 font-bold truncate w-full text-center">{preview.file.name}</span>
                      </div>
                    )}
                    <button 
                      onClick={(e) => removeFile(e, idx)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity hover:scale-110"
                    >
                      <X size={12} />
                    </button>
                 </div>
               ))}
               {(multiple || files.length === 0) && (
                 <div className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors">
                    <Upload size={20} />
                 </div>
               )}
             </div>
             {!multiple && files.length === 1 && (
               <p className="text-xs text-slate-400 mt-4 font-bold uppercase tracking-widest">Click to Replace</p>
             )}
           </div>
         )}
      </div>
    </div>
  );
};

// --- MODAL ---
export const Modal: React.FC<{ 
  isOpen: boolean, 
  onClose: () => void, 
  title: string, 
  children: React.ReactNode, 
  footer?: React.ReactNode,
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full',
  type?: 'default' | 'success' | 'danger' | 'warning' | 'info',
  subtitle?: string
}> = ({ 
  isOpen, onClose, title, children, footer, size = 'md', type = 'default', subtitle 
}) => {
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] h-[90vh]'
  };

  const typeHeaderColors = {
    default: 'bg-slate-900 dark:bg-slate-950',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-orange-500',
    info: 'bg-primary'
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 max-h-[90vh]`}>
        <div className={`${typeHeaderColors[type]} p-6 sm:p-10 text-white shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-8">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight truncate">{title}</h3>
              {subtitle && <p className="text-white/70 text-xs sm:text-sm mt-1 sm:mt-2 font-medium line-clamp-2">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0">
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="p-6 sm:p-10 overflow-y-auto no-scrollbar text-slate-600 dark:text-slate-300">{children}</div>
        {footer && <div className="p-6 sm:p-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0">{footer}</div>}
      </div>
    </div>
  );
};

// --- CHECKBOX ---
export const Checkbox: React.FC<{ label: string, checked?: boolean, onChange?: (val: boolean) => void }> = ({ label, checked, onChange }) => (
  <label className="flex items-center space-x-3 cursor-pointer group">
    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${checked ? 'bg-primary border-primary shadow-md' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 group-hover:border-blue-400'}`}>
      {checked && <Check size={14} className="text-white" strokeWidth={4} />}
      <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange?.(e.target.checked)} />
    </div>
    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 select-none truncate">{label}</span>
  </label>
);

// --- SWITCH ---
export const Switch: React.FC<{ label: string, enabled?: boolean, onChange?: (val: boolean) => void }> = ({ label, enabled, onChange }) => (
  <div className="flex items-center justify-between py-1 gap-4">
    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{label}</span>
    <button 
      type="button"
      onClick={() => onChange?.(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${enabled ? 'bg-ubuxa-gradient shadow-sm' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

// --- TOAST ---
export const Toast: React.FC<{ title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error', onClose: () => void }> = ({ title, message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    info: <Info className="text-primary" />,
    success: <Check className="text-green-500" />,
    warning: <AlertTriangle className="text-orange-500" />,
    error: <X className="text-red-500" />
  };

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-8 z-[9999] sm:w-full sm:max-w-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-[2rem] shadow-2xl p-4 sm:p-6 flex items-start space-x-4 animate-in slide-in-from-top-4 sm:slide-in-from-right-6 border-l-4 border-l-primary">
      <div className="p-2 sm:p-3 bg-slate-50 dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm shrink-0">
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-[15px] truncate">{title}</h4>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed font-medium line-clamp-2">{message}</p>
      </div>
      <button onClick={onClose} className="p-1.5 text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg shrink-0">
        <X size={16} />
      </button>
    </div>
  );
};

// --- DROPDOWN MENU ---
export const DropdownMenu: React.FC<{
  trigger: React.ReactNode,
  items: { label: string, icon?: React.ReactNode, onClick: () => void, variant?: 'default' | 'danger' }[]
}> = ({ trigger, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { item.onClick(); setIsOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm font-bold flex items-center space-x-2 transition-colors ${
                item.variant === 'danger' ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- MULTI SELECT ---
export const MultiSelect: React.FC<{
  label: string,
  options: string[],
  selected: string[],
  onChange: (selected: string[]) => void
}> = ({ label, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      {label && <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>}
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-5 py-3 min-h-[56px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-[1.25rem] cursor-pointer hover:border-blue-300 transition-all flex flex-wrap gap-2 items-center"
        >
          {selected.length === 0 && <span className="text-slate-400 font-bold text-sm">Select options...</span>}
          {selected.map(s => (
            <span key={s} className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center">
              {s}
              <X size={12} className="ml-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleOption(s); }} />
            </span>
          ))}
          <div className="ml-auto text-slate-400"><ChevronDown size={18} /></div>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xl z-50 max-h-60 overflow-y-auto no-scrollbar p-2">
            {options.map(option => (
              <div
                key={option}
                onClick={() => toggleOption(option)}
                className={`px-4 py-3 rounded-lg text-sm font-bold cursor-pointer flex items-center justify-between transition-colors ${
                  selected.includes(option) ? 'bg-blue-50 dark:bg-blue-900/30 text-primary' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{option}</span>
                {selected.includes(option) && <Check size={16} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- ACCORDION ---
export const Accordion: React.FC<{
  title: string,
  children: React.ReactNode,
  isOpen: boolean,
  onToggle: () => void
}> = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm transition-all hover:border-primary/50">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-colors"
      >
        <span className="font-bold text-slate-900 dark:text-white text-sm">{title}</span>
        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- GOOGLE MAP PLACEHOLDER ---
export const GoogleMapPlaceholder: React.FC<{ address: string }> = ({ address }) => (
  <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl relative overflow-hidden group">
    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-122.4241,37.78,14.25,0,0/600x600?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbTV6b3ZwbmowMDFqMmxxNnd5eW5kZ3I0In0.A-B-C')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700" style={{ backgroundImage: 'linear-gradient(#f1f5f9 2px, transparent 2px), linear-gradient(90deg, #f1f5f9 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundColor: '#e2e8f0' }}></div>
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
       <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-xl animate-bounce">
          <MapPin className="text-red-500" size={24} fill="currentColor" />
       </div>
       <div className="mt-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-white/20">
          <p className="text-xs font-bold text-slate-900 dark:text-white">{address}</p>
       </div>
    </div>
  </div>
);

// --- SIGNATURE PAD ---
export const SignaturePad: React.FC<{ label?: string, onChange?: (signature: string | null) => void }> = ({ label, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.strokeStyle = '#0F766E'; // primary color
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    if (isEmpty) setIsEmpty(false);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (onChange && canvasRef.current && !isEmpty) {
      onChange(canvasRef.current.toDataURL());
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top
    };
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setIsEmpty(true);
      if (onChange) onChange(null);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>}
      <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="w-full h-48 cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {isEmpty && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-300 dark:text-slate-600">
            <span className="text-sm font-bold">Sign Here</span>
          </div>
        )}
        <button 
          onClick={clear} 
          className="absolute top-2 right-2 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 hover:text-red-500 transition-colors"
          type="button"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

// --- CAMERA CAPTURE ---
export const CameraCapture: React.FC<{ label?: string, onCapture?: (image: string) => void }> = ({ label, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch (err) {
      setError('Camera access denied or unavailable.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL('image/jpeg');
        setCapturedImage(image);
        stopCamera();
        if (onCapture) onCapture(image);
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-2">
      {label && <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>}
      <div className="relative rounded-3xl overflow-hidden bg-black aspect-video flex items-center justify-center">
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        ) : stream ? (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-6">
            <Camera size={48} className="mx-auto text-slate-700 mb-2" />
            <p className="text-slate-500 text-sm font-medium">{error || 'Camera is inactive'}</p>
          </div>
        )}
        
        {/* Controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
          {!stream && !capturedImage && (
            <button onClick={startCamera} className="bg-slate-800 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-slate-700 transition-colors">
              Start Camera
            </button>
          )}
          {stream && (
            <>
              <button onClick={stopCamera} className="bg-red-500/80 text-white p-3 rounded-full hover:bg-red-600 transition-colors">
                <X size={20} />
              </button>
              <button onClick={capture} className="bg-white text-primary p-4 rounded-full shadow-lg hover:scale-105 transition-transform">
                <div className="w-12 h-12 rounded-full border-4 border-primary/30 flex items-center justify-center">
                   <div className="w-10 h-10 bg-primary rounded-full"></div>
                </div>
              </button>
            </>
          )}
          {capturedImage && (
            <button onClick={retake} className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold text-sm shadow-lg flex items-center space-x-2">
              <RefreshCw size={16} />
              <span>Retake</span>
            </button>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
