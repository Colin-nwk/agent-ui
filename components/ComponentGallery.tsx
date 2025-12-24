
import React, { useState, useMemo } from 'react';
import { 
  Palette, 
  Layout, 
  Search, 
  TrendingUp,
  Package,
  Map as MapIcon,
  Layers,
  Settings2,
  Plus,
  ArrowRight,
  User,
  LogOut,
  Bell,
  Trash2,
  Eye,
  Settings,
  MoreVertical,
  MousePointerClick,
  Table as TableIcon,
  Calendar as CalendarIcon,
  Clock,
  Square,
  Mail,
  Lock,
  Phone,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ArrowUp
} from 'lucide-react';
import { 
  SideDrawer, 
  PrimaryButton, 
  SecondaryButton, 
  StatCard, 
  Input, 
  Select,
  Checkbox,
  Switch, 
  FileUpload, 
  GoogleMapPlaceholder,
  Tabs,
  Accordion,
  MultiSelect,
  DropdownMenu,
  Toast,
  DataTable,
  Modal,
  BottomSheetModal,
  SignaturePad,
  CameraCapture
} from './Shared';
import { ColumnDef } from '@tanstack/react-table';

// Color Swatch Sub-component
const ColorSwatch: React.FC<{ name: string, hex: string, cssClass: string }> = ({ name, hex, cssClass }) => (
  <div className="space-y-2 group">
    <div className={`h-16 rounded-2xl border border-slate-200 dark:border-slate-800 ${cssClass} shadow-sm group-hover:scale-105 transition-transform duration-300`} />
    <div>
      <p className="text-[10px] font-bold text-slate-900 dark:text-white">{name}</p>
      <p className="text-[10px] font-mono text-slate-400 uppercase">{hex}</p>
    </div>
  </div>
);

interface DemoData {
  id: string;
  name: string;
  category: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  date: string;
}

const ComponentGallery: React.FC = () => {
  const [isDemoDrawerOpen, setIsDemoDrawerOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [openAccordion, setOpenAccordion] = useState<string | null>('q1');
  const [multiSelected, setMultiSelected] = useState<string[]>(['Hardware', 'Sales']);
  const [notification, setNotification] = useState<{ title: string, message: string, type: any } | null>(null);
  
  // Interactive states for inputs
  const [isChecked, setIsChecked] = useState(true);
  const [isSwitched, setIsSwitched] = useState(false);

  // Modal State
  const [activeModal, setActiveModal] = useState<{ 
    isOpen: boolean, 
    size: 'sm' | 'md' | 'lg' | 'xl' | 'full', 
    type: 'default' | 'success' | 'danger' | 'warning' 
  }>({
    isOpen: false,
    size: 'md',
    type: 'default'
  });

  const openModal = (size: any, type: any) => {
    setActiveModal({ isOpen: true, size, type });
  };

  const demoTabs = [
    { id: 'profile', label: 'User Profile', icon: <User size={14} /> },
    { id: 'settings', label: 'Preferences', icon: <Settings size={14} /> },
    { id: 'security', label: 'Security', icon: <Layers size={14} /> }
  ];

  const multiOptions = ['Hardware', 'Sales', 'Inventory', 'Agents', 'Management', 'Reports', 'Customer Support'];

  // --- DATA TABLE DEMO ---
  const demoTableData = useMemo<DemoData[]>(() => [
    { id: '1', name: 'Premium Solar Kit', category: 'Hardware', amount: 450000, status: 'COMPLETED', date: '2024-03-15' },
    { id: '2', name: 'Maintenance Service', category: 'Support', amount: 25000, status: 'PENDING', date: '2024-03-14' },
    { id: '3', name: 'Battery Replacement', category: 'Hardware', amount: 180000, status: 'COMPLETED', date: '2024-03-12' },
    { id: '4', name: 'Consultation Fee', category: 'Service', amount: 15000, status: 'CANCELLED', date: '2024-03-10' },
  ], []);

  const demoColumns = useMemo<ColumnDef<DemoData>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Product/Service',
      cell: info => <span className="font-bold text-slate-900 dark:text-white">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: info => <span className="text-accent font-bold">₦{(info.getValue() as number).toLocaleString()}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const status = info.getValue() as string;
        return (
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
            status === 'COMPLETED' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 
            status === 'PENDING' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
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
          trigger={<button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400"><MoreVertical size={16} /></button>}
          items={[
            { label: 'View Details', icon: <Eye size={14} />, onClick: () => {} },
            { label: 'Delete Record', icon: <Trash2 size={14} />, onClick: () => {}, variant: 'danger' },
          ]}
        />
      ),
    }
  ], []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">UI Library</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 uppercase text-[10px] font-bold tracking-[0.2em]">UBUXA Design System v1.4</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
           <span className="px-3 py-1.5 bg-white dark:bg-slate-900 shadow-sm rounded-xl text-xs font-bold text-slate-900 dark:text-white">Component Guide</span>
           <span className="px-3 py-1.5 text-xs font-bold text-slate-400">Documentation</span>
        </div>
      </header>

      {/* Notifications Demo */}
      {notification && (
        <Toast 
          title={notification.title} 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* 1. Colors & Palette */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-slate-400">
          <Palette size={20} />
          <h3 className="text-xs font-bold uppercase tracking-widest">Brand Palette</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
          <ColorSwatch name="Slate 900" hex="#0f172a" cssClass="bg-slate-900" />
          <ColorSwatch name="Primary Teal" hex="#0F766E" cssClass="bg-primary" />
          <ColorSwatch name="Secondary Teal" hex="#14B8A6" cssClass="bg-secondary" />
          <ColorSwatch name="Accent Amber" hex="#F59E0B" cssClass="bg-accent" />
          <ColorSwatch name="Success Green" hex="#16A34A" cssClass="bg-success" />
          <ColorSwatch name="Danger Red" hex="#DC2626" cssClass="bg-danger" />
        </div>
      </section>

      {/* 2. Modals & Dialogs */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-slate-400">
          <Square size={20} />
          <h3 className="text-xs font-bold uppercase tracking-widest">Modals & Popups</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Visual Contexts</p>
              <div className="flex flex-wrap gap-3">
                <PrimaryButton onClick={() => openModal('md', 'default')}>Standard</PrimaryButton>
                <PrimaryButton className="!bg-green-600 !shadow-green-200 dark:!shadow-none" onClick={() => openModal('md', 'success')}>Success</PrimaryButton>
                <PrimaryButton className="!bg-red-600 !shadow-red-200 dark:!shadow-none" onClick={() => openModal('md', 'danger')}>Danger</PrimaryButton>
                <PrimaryButton className="!bg-amber-500 !shadow-amber-200 dark:!shadow-none" onClick={() => openModal('md', 'warning')}>Warning</PrimaryButton>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Overlay Types</p>
              <div className="flex flex-wrap gap-3">
                <SecondaryButton onClick={() => openModal('sm', 'default')}>Small</SecondaryButton>
                <SecondaryButton onClick={() => openModal('lg', 'default')}>Large</SecondaryButton>
                <SecondaryButton onClick={() => setIsBottomSheetOpen(true)}>Bottom Sheet</SecondaryButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Buttons & Interaction */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-slate-400">
          <MousePointerClick size={20} />
          <h3 className="text-xs font-bold uppercase tracking-widest">Action Components</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Button Variants</p>
              <div className="flex flex-wrap gap-4">
                <PrimaryButton>Primary Action</PrimaryButton>
                <SecondaryButton>Secondary Action</SecondaryButton>
                <PrimaryButton disabled>Disabled Button</PrimaryButton>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Icon Buttons</p>
              <div className="flex flex-wrap gap-4">
                <button className="w-12 h-12 bg-slate-900 dark:bg-slate-800 text-accent rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Plus size={24} />
                </button>
                <button className="w-12 h-12 bg-ubuxa-gradient text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <CheckCircle2 size={24} />
                </button>
                <button className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 rounded-2xl flex items-center justify-center shadow-sm hover:border-accent hover:text-accent transition-all">
                  <Settings size={20} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-50 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Feedback Triggers</p>
            <div className="flex flex-wrap gap-4">
               <SecondaryButton icon={<Info size={18} />} onClick={() => setNotification({ title: 'System Info', message: 'The database is syncing with the cloud.', type: 'info' })}>Info Toast</SecondaryButton>
               <SecondaryButton icon={<CheckCircle2 size={18} />} onClick={() => setNotification({ title: 'Success', message: 'Transaction record was updated.', type: 'success' })}>Success Toast</SecondaryButton>
               <SecondaryButton icon={<AlertTriangle size={18} />} onClick={() => setNotification({ title: 'Warning', message: 'Your stock levels are running low.', type: 'warning' })}>Warning Toast</SecondaryButton>
               <SecondaryButton icon={<Trash2 size={18} />} onClick={() => setNotification({ title: 'Error', message: 'Failed to authenticate agent.', type: 'error' })}>Error Toast</SecondaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Form Controls & Inputs */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-slate-400">
          <Settings2 size={20} />
          <h3 className="text-xs font-bold uppercase tracking-widest">Form Elements</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-12">
          {/* Text Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Input label="Search Input" placeholder="Type to search..." icon={<Search size={18} />} />
            <Input label="Email Address" type="email" placeholder="agent@ubuxa.com" icon={<Mail size={18} />} />
            <Input label="Password" type="password" placeholder="••••••••" icon={<Lock size={18} />} />
            <Input label="Phone Number" type="tel" placeholder="+234 ..." icon={<Phone size={18} />} />
            <Input label="Number Input" type="number" placeholder="0.00" icon={<TrendingUp size={18} />} />
            <Select label="Status Select">
               <option>Active</option>
               <option>Pending</option>
               <option>Suspended</option>
            </Select>
          </div>

          {/* Date & Time Restoration */}
          <div className="pt-8 border-t border-slate-50 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Input label="Date" type="date" icon={<CalendarIcon size={18} />} defaultValue="2024-03-15" />
            <Input label="Time" type="time" icon={<Clock size={18} />} defaultValue="14:30" />
            <Input label="Date & Time" type="datetime-local" icon={<CalendarIcon size={18} />} defaultValue="2024-03-15T14:30" />
          </div>

          {/* Selection Restoration */}
          <div className="pt-8 border-t border-slate-50 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-12">
             <div className="space-y-6">
               <MultiSelect 
                 label="Multi-Selection (Tags)" 
                 options={multiOptions} 
                 selected={multiSelected} 
                 onChange={setMultiSelected} 
               />
               <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 space-y-4">
                 <Checkbox label="Remember this device for 30 days" checked={isChecked} onChange={setIsChecked} />
                 <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
                 <Switch label="Enable Real-time Tracking" enabled={isSwitched} onChange={setIsSwitched} />
                 <Switch label="Push Notifications" enabled={true} />
               </div>
             </div>
             
             {/* File Upload Restoration with Preview */}
             <div className="space-y-4">
                <FileUpload 
                  label="Asset Upload (Image/PDF)" 
                  description="Supports PNG, JPG, and PDF up to 10MB" 
                  accept="image/*,application/pdf"
                />
             </div>
          </div>
        </div>
      </section>

      {/* 5. Data Visualization & Hierarchy */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-slate-400">
          <TableIcon size={20} />
          <h3 className="text-xs font-bold uppercase tracking-widest">Data & Hierarchy</h3>
        </div>
        
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-2 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
             <div className="p-8 pb-4">
                <h4 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Responsive Data Table</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-bold">Integrated with TanStack Table</p>
             </div>
             <div className="p-2">
                <DataTable data={demoTableData} columns={demoColumns} searchPlaceholder="Search products..." />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Navigation Tabs</p>
              <Tabs tabs={demoTabs} activeTab={activeTab} onChange={setActiveTab} />
              <div className="p-12 bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] text-center text-white border-4 border-accent/20">
                 <p className="text-sm opacity-60">Displaying content for</p>
                 <h5 className="text-2xl font-serif font-bold mt-1 text-accent">{activeTab.toUpperCase()}</h5>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Information Accordion</p>
              <div className="space-y-3">
                 <Accordion title="Privacy Policy Update" isOpen={openAccordion === 'q1'} onToggle={() => setOpenAccordion(openAccordion === 'q1' ? null : 'q1')}>
                   Our privacy policy has been updated to include better encryption for your personal biometric data during registration.
                 </Accordion>
                 <Accordion title="Commission Structure" isOpen={openAccordion === 'q2'} onToggle={() => setOpenAccordion(openAccordion === 'q2' ? null : 'q2')}>
                   Agents receive 5% on all outright sales and a recurring 2% on financed plans that stay active for over 6 months.
                 </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Maps & Geospatial Restoration */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-slate-400">
          <MapIcon size={20} />
          <h3 className="text-xs font-bold uppercase tracking-widest">Geospatial Tools</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
           <GoogleMapPlaceholder address="KM 22, Lekki-Epe Expressway, Ajah, Lagos" />
           <div className="mt-6 flex items-center space-x-3">
              <div className="p-3 bg-accent/10 rounded-2xl">
                 <MapIcon className="text-accent" size={20} />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium italic">Integrated mapping interface used for customer coordinate verification during installation audits.</p>
           </div>
        </div>
      </section>

      {/* 7. Input Capture */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-slate-400">
          <Upload size={20} />
          <h3 className="text-xs font-bold uppercase tracking-widest">Media & Input Capture</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-8">
           <FileUpload label="File Uploader" description="Drag & drop document here" />
           <SignaturePad label="Digital Signature" />
           <div className="lg:col-span-2">
              <CameraCapture label="Evidence Capture" />
           </div>
        </div>
      </section>

      {/* Shared Overlay Demos */}
      <Modal 
        isOpen={activeModal.isOpen} 
        onClose={() => setActiveModal({ ...activeModal, isOpen: false })} 
        title={`${activeModal.size.toUpperCase()} Modal`}
        size={activeModal.size}
        type={activeModal.type}
        subtitle="Universal dialogue component with semantic visual states."
        footer={
          <>
            <SecondaryButton onClick={() => setActiveModal({ ...activeModal, isOpen: false })}>Dismiss</SecondaryButton>
            <PrimaryButton onClick={() => setActiveModal({ ...activeModal, isOpen: false })}>Action</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            This component provides a focused workspace for critical tasks. It uses a high-blur backdrop to separate 
            the foreground action from the background system state.
          </p>
          <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-900 dark:text-white mb-2">Technical Specs:</p>
            <ul className="text-[11px] space-y-1 text-slate-500 dark:text-slate-400 list-disc pl-4">
              <li>Responsive sizing from 320px to full viewport</li>
              <li>ARIA-compliant accessibility attributes</li>
              <li>Hardware-accelerated CSS transitions</li>
            </ul>
          </div>
        </div>
      </Modal>

      <SideDrawer 
        isOpen={isDemoDrawerOpen} 
        onClose={() => setIsDemoDrawerOpen(false)} 
        title="Auditing Drawer" 
        subtitle="Used for long forms and secondary system logs."
        footer={<PrimaryButton onClick={() => setIsDemoDrawerOpen(false)} className="w-full py-4">Save Audit</PrimaryButton>}
      >
        <div className="space-y-6">
           <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 flex items-center space-x-4">
              <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-accent shadow-sm">
                <Layers size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Drawer Workflow</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Ideal for data entry that requires reference to the main view.</p>
              </div>
           </div>
           <Input label="Verification Code" placeholder="X-000-000" />
           <FileUpload label="Attach Evidence" />
        </div>
      </SideDrawer>

      <BottomSheetModal
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title="Quick Actions"
      >
        <div className="space-y-4">
           <p className="text-sm text-slate-600 dark:text-slate-300">
             This bottom sheet is optimized for mobile interactions, allowing for quick tasks without losing context of the background screen.
           </p>
           <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                 <ArrowUp size={24} className="text-accent" />
                 <span className="text-xs font-bold text-slate-900 dark:text-white">Upload</span>
              </button>
              <button className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                 <Settings size={24} className="text-slate-400" />
                 <span className="text-xs font-bold text-slate-900 dark:text-white">Configure</span>
              </button>
           </div>
           <PrimaryButton className="w-full" onClick={() => setIsBottomSheetOpen(false)}>Done</PrimaryButton>
        </div>
      </BottomSheetModal>
      
      {/* Floating Action Demo */}
      <div className="fixed bottom-24 right-8 z-[80] hidden lg:block">
        <button 
          onClick={() => setIsDemoDrawerOpen(true)}
          className="w-16 h-16 bg-slate-900 dark:bg-slate-800 text-accent rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group relative"
        >
          <Layers size={28} />
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900 dark:bg-slate-800 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
             Try Side Drawer
             <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45"></div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ComponentGallery;
