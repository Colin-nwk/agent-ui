
import React, { useState } from 'react';
import { MapPin, CheckCircle2, Clock, Navigation, Camera, ChevronRight, AlertTriangle } from 'lucide-react';
import { PrimaryButton, SecondaryButton, SideDrawer, Tabs, Input, Toast } from './Shared';

const MOCK_TASKS = [
  { id: '1', customer: 'David Okon', address: 'Plot 4, Admiralty Way, Lekki', type: 'Installation', status: 'PENDING', date: 'Today, 2:00 PM' },
  { id: '2', customer: 'Sarah Cole', address: '12 Benson St, Surulere', type: 'Maintenance', status: 'COMPLETED', date: 'Yesterday' },
  { id: '3', customer: 'Emmanuel Raji', address: 'KM 45, Epe Expressway', type: 'Survey', status: 'PENDING', date: 'Tomorrow, 10:00 AM' },
];

const Installer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCoords, setManualCoords] = useState({ lat: '', lng: '' });
  const [toast, setToast] = useState<{ title: string; message: string; type: any } | null>(null);

  const handleCaptureGPS = () => {
      setIsCapturing(true);
      if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  setCoordinates({
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                  });
                  setIsCapturing(false);
                  setToast({ title: 'Location Captured', message: 'GPS coordinates securely logged.', type: 'success' });
              },
              (error) => {
                  console.error(error);
                  setIsCapturing(false);
                  setToast({ title: 'GPS Failed', message: 'Could not access location. Try manual entry.', type: 'warning' });
                  setShowManualInput(true);
              },
              { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
      } else {
          setIsCapturing(false);
          setShowManualInput(true);
          setToast({ title: 'Not Supported', message: 'GPS not supported on this device.', type: 'error' });
      }
  };

  const handleManualSubmit = () => {
      if(manualCoords.lat && manualCoords.lng) {
          setCoordinates({ lat: parseFloat(manualCoords.lat), lng: parseFloat(manualCoords.lng) });
          setShowManualInput(false);
          setToast({ title: 'Manual Entry', message: 'Coordinates saved manually.', type: 'info' });
      }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {toast && <Toast title={toast.title} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Installer Tasks</h1>
      </div>

      <Tabs 
        tabs={[{id: 'pending', label: 'Pending Tasks'}, {id: 'completed', label: 'History'}]} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      <div className="space-y-4">
         {MOCK_TASKS.filter(t => activeTab === 'pending' ? t.status === 'PENDING' : t.status === 'COMPLETED').map(task => (
            <div 
              key={task.id} 
              onClick={() => { setSelectedTask(task); setCoordinates(null); setShowManualInput(false); }}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-transform cursor-pointer hover:border-primary"
            >
               <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                     task.type === 'Installation' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  }`}>
                     {task.type}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{task.date}</span>
               </div>
               <h3 className="font-bold text-slate-900 dark:text-white text-lg">{task.customer}</h3>
               <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-1">
                  <MapPin size={14} className="mr-1" />
                  <span className="truncate">{task.address}</span>
               </div>
            </div>
         ))}
      </div>

      {/* Task Details Drawer */}
      <SideDrawer
         isOpen={!!selectedTask}
         onClose={() => setSelectedTask(null)}
         title="Task Details"
         subtitle="Complete installation steps"
         footer={
            <PrimaryButton className="w-full">Mark as Completed</PrimaryButton>
         }
      >
         {selectedTask && (
            <div className="space-y-6">
               <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Customer Info</p>
                  <p className="font-bold text-slate-900 dark:text-white text-lg">{selectedTask.customer}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{selectedTask.address}</p>
               </div>

               <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 dark:text-white">Required Actions</h4>
                  
                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 space-y-3">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg"><Navigation size={20} /></div>
                            <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white">Capture Coordinates</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Geo-tag location</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleCaptureGPS} 
                            disabled={isCapturing || !!coordinates}
                            className={`text-xs font-bold px-3 py-2 rounded-lg transition-all ${
                                coordinates 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-slate-900 dark:bg-slate-800 text-white'
                            }`}
                        >
                            {isCapturing ? 'Locating...' : coordinates ? 'Captured' : 'Capture'}
                        </button>
                     </div>
                     
                     {coordinates && (
                         <div className="text-xs font-mono bg-slate-50 dark:bg-slate-800 p-2 rounded text-center text-slate-600 dark:text-slate-400">
                             LAT: {coordinates.lat.toFixed(6)}, LNG: {coordinates.lng.toFixed(6)}
                         </div>
                     )}

                     {showManualInput && !coordinates && (
                         <div className="pt-2 animate-in fade-in space-y-2">
                             <div className="flex gap-2">
                                 <Input placeholder="Latitude" value={manualCoords.lat} onChange={e => setManualCoords({...manualCoords, lat: e.target.value})} type="number" />
                                 <Input placeholder="Longitude" value={manualCoords.lng} onChange={e => setManualCoords({...manualCoords, lng: e.target.value})} type="number" />
                             </div>
                             <SecondaryButton onClick={handleManualSubmit} className="w-full py-2 text-xs">Save Coordinates</SecondaryButton>
                         </div>
                     )}
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900">
                     <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg"><Camera size={20} /></div>
                        <div>
                           <p className="font-bold text-sm text-slate-900 dark:text-white">Upload Evidence</p>
                           <p className="text-xs text-slate-500 dark:text-slate-400">Photo of setup</p>
                        </div>
                     </div>
                     <button className="text-xs font-bold border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg">Upload</button>
                  </div>
               </div>
            </div>
         )}
      </SideDrawer>
    </div>
  );
};

export default Installer;
