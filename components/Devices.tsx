
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Smartphone, 
  Search, 
  Key, 
  Power, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Cpu, 
  Wifi, 
  MoreVertical,
  Activity,
  History,
  ChevronLeft,
  ChevronRight,
  FileText,
  User,
  ArrowLeft
} from 'lucide-react';
import { BottomSheetModal, PrimaryButton, SecondaryButton, Switch, Toast } from './Shared';

// Mock Data
const INITIAL_DEVICES = [
  { id: '1', sn: 'SP-2024-X91', model: 'Solar Hub Pro v2', status: 'ACTIVE', customer: 'Kathleen Pfeffer', lastToken: '1234-5678-9012', firmware: 'v2.4.1' },
  { id: '2', sn: 'SP-2024-B12', model: 'Inverter Smart 5k', status: 'DISABLED', customer: 'Ericka Considine', lastToken: null, firmware: 'v1.0.5' },
  { id: '3', sn: 'SP-2023-Z05', model: 'Battery Monitor', status: 'ACTIVE', customer: 'Edmond Schulist', lastToken: '4567-8901-2345', firmware: 'v3.0.0' },
  { id: '4', sn: 'SP-2024-K18', model: 'Solar Hub Pro v2', status: 'ACTIVE', customer: 'Unassigned', lastToken: null, firmware: 'v2.4.1' },
  { id: '5', sn: 'SP-2024-L01', model: 'Solar Hub Mini', status: 'ACTIVE', customer: 'John Doe', lastToken: '9988-7766-5544', firmware: 'v1.2.0' },
  { id: '6', sn: 'SP-2024-M22', model: 'Inverter Pro 3k', status: 'DISABLED', customer: 'Jane Smith', lastToken: null, firmware: 'v2.1.0' },
  { id: '7', sn: 'SP-2024-N33', model: 'Battery Rack Monitor', status: 'ACTIVE', customer: 'Bob Johnson', lastToken: '1122-3344-5566', firmware: 'v1.0.1' },
  { id: '8', sn: 'SP-2024-O44', model: 'Solar Hub Pro v2', status: 'ACTIVE', customer: 'Alice Brown', lastToken: '6677-8899-0011', firmware: 'v2.4.2' },
];

const MOCK_LOGS = [
  { id: 1, date: 'Mar 15, 14:30', event: 'Token Generated', user: 'Agent (Self)', detail: 'Token: 1234-5678-9012', type: 'ACTION' },
  { id: 2, date: 'Mar 14, 09:00', event: 'Remote Lock', user: 'System Admin', detail: 'Status set to DISABLED', type: 'ALERT' },
  { id: 3, date: 'Mar 10, 11:20', event: 'Firmware Update', user: 'System', detail: 'v2.4.0 -> v2.4.1', type: 'INFO' },
  { id: 4, date: 'Feb 28, 16:45', event: 'Payment Received', user: 'System', detail: 'Auto-unlock triggered', type: 'SUCCESS' },
];

const ITEMS_PER_PAGE = 6;

const Devices: React.FC = () => {
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Selection & Modal State
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'CONTROL' | 'LOGS'>('CONTROL');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<{ title: string; message: string; type: any } | null>(null);

  // Filter Logic
  const filteredDevices = useMemo(() => {
    return devices.filter(device => 
      device.sn.toLowerCase().includes(searchQuery.toLowerCase()) || 
      device.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.model.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [devices, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredDevices.length / ITEMS_PER_PAGE);
  const paginatedDevices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDevices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDevices, currentPage]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleOpenDevice = (device: any) => {
    setSelectedDevice(device);
    setGeneratedToken(null);
    setViewMode('CONTROL');
  };

  const handleGenerateToken = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const newToken = Array(3).fill(0).map(() => Math.floor(1000 + Math.random() * 9000)).join('-');
      setGeneratedToken(newToken);
      setIsGenerating(false);
      setToast({ title: 'Token Generated', message: `Access code created for ${selectedDevice.sn}`, type: 'success' });
    }, 1500);
  };

  const toggleDeviceStatus = () => {
    const newStatus = selectedDevice.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    
    // Update local state
    const updatedDevices = devices.map(d => 
      d.id === selectedDevice.id ? { ...d, status: newStatus } : d
    );
    setDevices(updatedDevices);
    setSelectedDevice({ ...selectedDevice, status: newStatus });
    
    setToast({ 
      title: newStatus === 'ACTIVE' ? 'Device Enabled' : 'Device Disabled', 
      message: `Operational status updated successfully.`, 
      type: newStatus === 'ACTIVE' ? 'success' : 'warning' 
    });
  };

  const copyToken = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      setToast({ title: 'Copied', message: 'Token copied to clipboard', type: 'info' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 lg:pb-0">
      {toast && (
        <Toast 
          title={toast.title} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Device Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor hardware status and generate PAYGO tokens</p>
        </div>
        <div className="relative group w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search Serial, Client..." 
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedDevices.map(device => (
          <div 
            key={device.id}
            onClick={() => handleOpenDevice(device)}
            className={`p-5 rounded-[1.5rem] border transition-all cursor-pointer group active:scale-[0.98] relative overflow-hidden ${
              device.status === 'ACTIVE' 
                ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-primary dark:hover:border-primary' 
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-90'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                device.status === 'ACTIVE' ? 'bg-blue-50 dark:bg-blue-900/20 text-primary' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}>
                <Smartphone size={24} />
              </div>
              <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 ${
                device.status === 'ACTIVE' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              }`}>
                {device.status === 'ACTIVE' ? <Activity size={12} /> : <Power size={12} />}
                <span>{device.status}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{device.sn}</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{device.model}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                <Wifi size={14} />
                <span>{device.status === 'ACTIVE' ? 'Online' : 'Offline'}</span>
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-300">{device.customer}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-6 py-4 sm:px-10 sm:py-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[3rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <span className="text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex space-x-2 sm:space-x-3">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary active:scale-90 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary active:scale-90 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Device Management Bottom Sheet */}
      <BottomSheetModal
        isOpen={!!selectedDevice}
        onClose={() => setSelectedDevice(null)}
        title={viewMode === 'CONTROL' ? 'Device Control' : 'Activity History'}
      >
        {selectedDevice && (
          <div className="space-y-6">
            
            {/* Control View */}
            {viewMode === 'CONTROL' && (
              <div className="space-y-8 animate-in slide-in-from-left-4">
                {/* Header Info */}
                <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                   <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm text-primary">
                      <Cpu size={32} />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedDevice.sn}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{selectedDevice.model}</p>
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">{selectedDevice.firmware}</p>
                   </div>
                </div>

                {/* Token Generation Section */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Access Token</h4>
                      {selectedDevice.status === 'DISABLED' && <span className="text-[10px] text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">Device Disabled</span>}
                   </div>
                   
                   {generatedToken ? (
                     <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-2xl text-center space-y-3 relative group animate-in zoom-in-95">
                        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Active Token Code</p>
                        <div className="text-3xl font-mono font-bold text-white tracking-widest">{generatedToken}</div>
                        <button 
                          onClick={copyToken}
                          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
                        >
                          <Copy size={20} />
                        </button>
                        <div className="flex justify-center pt-2">
                           <span className="text-[10px] text-green-400 bg-green-900/30 px-2 py-1 rounded border border-green-900/50">Valid for 30 Days</span>
                        </div>
                     </div>
                   ) : (
                     <div className="bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
                        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400">
                           <Key size={20} />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-900 dark:text-white">No Active Token</p>
                           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Generate a new PAYGO code to unlock this device.</p>
                        </div>
                     </div>
                   )}

                   <PrimaryButton 
                     disabled={isGenerating || selectedDevice.status === 'DISABLED'} 
                     onClick={handleGenerateToken} 
                     className="w-full py-4 text-base"
                     icon={isGenerating ? <Activity className="animate-spin" /> : <Key />}
                   >
                     {isGenerating ? 'Generating...' : generatedToken ? 'Generate New Token' : 'Generate Token'}
                   </PrimaryButton>
                </div>

                {/* Config & Actions */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                   <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Configuration</h4>
                   
                   <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl">
                      <div className="flex items-center space-x-3">
                         <div className={`p-2 rounded-lg ${selectedDevice.status === 'ACTIVE' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
                            <Power size={20} />
                         </div>
                         <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white">Device Status</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{selectedDevice.status}</p>
                         </div>
                      </div>
                      <Switch 
                        label="" 
                        enabled={selectedDevice.status === 'ACTIVE'} 
                        onChange={toggleDeviceStatus} 
                      />
                   </div>

                   <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl">
                      <div className="flex items-center space-x-3">
                         <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                            <History size={20} />
                         </div>
                         <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white">Usage Logs</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">View History</p>
                         </div>
                      </div>
                      <SecondaryButton className="px-4 py-2 text-xs" onClick={() => setViewMode('LOGS')}>View</SecondaryButton>
                   </div>
                </div>
              </div>
            )}

            {/* Logs View */}
            {viewMode === 'LOGS' && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                 <button 
                   onClick={() => setViewMode('CONTROL')} 
                   className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-bold text-sm mb-4 transition-colors"
                 >
                    <ArrowLeft size={16} />
                    <span>Back to Controls</span>
                 </button>

                 <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl mb-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                       This log shows the last 30 days of activity for device <span className="font-bold text-slate-900 dark:text-white">{selectedDevice.sn}</span>.
                    </p>
                 </div>

                 <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-8">
                    {MOCK_LOGS.map((log) => (
                       <div key={log.id} className="relative">
                          <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                             log.type === 'ACTION' ? 'bg-blue-500' : 
                             log.type === 'ALERT' ? 'bg-red-500' :
                             log.type === 'SUCCESS' ? 'bg-green-500' : 'bg-slate-400'
                          }`}></div>
                          
                          <div className="flex flex-col space-y-1">
                             <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{log.date}</span>
                                <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">{log.user}</span>
                             </div>
                             <h5 className="text-sm font-bold text-slate-900 dark:text-white">{log.event}</h5>
                             <p className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-white dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800 inline-block w-fit">
                                {log.detail}
                             </p>
                          </div>
                       </div>
                    ))}
                 </div>
                 
                 <div className="pt-4 text-center">
                    <button className="text-xs font-bold text-primary hover:underline">Load Older Logs</button>
                 </div>
              </div>
            )}
          </div>
        )}
      </BottomSheetModal>
    </div>
  );
};

export default Devices;
