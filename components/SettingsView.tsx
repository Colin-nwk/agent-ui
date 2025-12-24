
import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Lock, 
  CreditCard, 
  Bell, 
  ChevronRight, 
  Mail, 
  Phone, 
  MapPin, 
  Camera,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Smartphone,
  Moon,
  Sun,
  Edit2,
  MoreVertical,
  Banknote,
  Check
} from 'lucide-react';
import { 
  BottomSheetModal, 
  Input, 
  PrimaryButton, 
  SecondaryButton, 
  FileUpload, 
  Switch, 
  Toast,
  Select,
  DropdownMenu
} from './Shared';
import { useTheme } from '../App';

interface PayoutChannel {
  id: string;
  type: 'Bank Account' | 'Mobile Money';
  provider: string;
  accountName: string;
  accountNumber: string;
  isDefault: boolean;
}

const SettingsView: React.FC = () => {
  // State for different UI flows
  const [activeView, setActiveView] = useState<string | null>(null);
  const [toast, setToast] = useState<{ title: string; message: string; type: any } | null>(null);
  
  const { theme, toggleTheme } = useTheme();

  // Mock User Data
  const [user, setUser] = useState({
    firstName: 'Collins',
    lastName: 'Nwoko',
    email: 'collins.nwoko@ubuxa.com',
    phone: '+234 803 123 4567',
    location: 'Lekki Phase 1, Lagos',
    role: 'Senior Sales Agent'
  });

  // Payout Channels State
  const [payoutChannels, setPayoutChannels] = useState<PayoutChannel[]>([
    { id: '1', type: 'Bank Account', provider: 'Access Bank', accountName: 'Collins Nwoko', accountNumber: '0012345678', isDefault: true },
    { id: '2', type: 'Mobile Money', provider: 'MTN MoMo', accountName: 'Collins MTN', accountNumber: '08031234567', isDefault: false },
  ]);
  const [channelFormView, setChannelFormView] = useState<'LIST' | 'FORM'>('LIST');
  const [currentChannel, setCurrentChannel] = useState<Partial<PayoutChannel>>({});

  const showToast = (title: string, message: string, type: string = 'success') => {
    setToast({ title, message, type });
  };

  const handleSave = (viewName: string) => {
    showToast('Changes Saved', `Your ${viewName} has been successfully updated.`);
    setActiveView(null);
  };

  // --- Payout Channel Handlers ---
  const handleAddChannel = () => {
    setCurrentChannel({ type: 'Bank Account', isDefault: payoutChannels.length === 0 });
    setChannelFormView('FORM');
  };

  const handleEditChannel = (channel: PayoutChannel) => {
    setCurrentChannel({ ...channel });
    setChannelFormView('FORM');
  };

  const handleSaveChannel = () => {
    if (!currentChannel.accountName || !currentChannel.accountNumber || !currentChannel.provider) {
        showToast('Validation Error', 'Please fill in all account details.', 'warning');
        return;
    }

    if (currentChannel.id) {
        // Edit existing
        setPayoutChannels(prev => prev.map(c => c.id === currentChannel.id ? { ...c, ...currentChannel } as PayoutChannel : c));
        showToast('Channel Updated', 'Payment details have been updated.');
    } else {
        // Add new
        const newChannel = { 
            ...currentChannel, 
            id: Math.random().toString(36).substr(2, 9),
            isDefault: payoutChannels.length === 0 || currentChannel.isDefault
        } as PayoutChannel;
        
        if (newChannel.isDefault) {
            setPayoutChannels(prev => prev.map(c => ({ ...c, isDefault: false })).concat(newChannel));
        } else {
            setPayoutChannels(prev => [...prev, newChannel]);
        }
        showToast('Channel Added', 'New payout method added successfully.');
    }
    setChannelFormView('LIST');
  };

  const handleDeleteChannel = (id: string) => {
    const channelToDelete = payoutChannels.find(c => c.id === id);
    if (channelToDelete?.isDefault && payoutChannels.length > 1) {
        showToast('Action Denied', 'Cannot delete the default payout channel. Set another as default first.', 'warning');
        return;
    }
    setPayoutChannels(prev => prev.filter(c => c.id !== id));
    showToast('Channel Deleted', 'Payout method removed.', 'info');
  };

  const handleSetDefault = (id: string) => {
    setPayoutChannels(prev => prev.map(c => ({ ...c, isDefault: c.id === id })));
    showToast('Default Updated', 'Primary payout channel updated.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 lg:pb-0">
      {/* Toast Feedback */}
      {toast && (
        <Toast 
          title={toast.title} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-12">
        <div className="relative group">
          <img 
            src="https://picsum.photos/seed/collins/200/200" 
            className="w-32 h-32 lg:w-40 lg:h-40 rounded-[2.5rem] border-4 border-white dark:border-slate-800 shadow-2xl object-cover transition-transform group-hover:scale-[1.02]" 
            alt="Profile" 
          />
          <button 
            onClick={() => setActiveView('personal')}
            className="absolute -bottom-2 -right-2 bg-slate-900 text-accent p-3 rounded-2xl shadow-xl border-4 border-slate-50 dark:border-slate-900 hover:scale-110 transition-transform flex items-center justify-center"
          >
            <Camera size={20} />
          </button>
        </div>
        <div className="text-center md:text-left pt-2">
          <h2 className="text-4xl font-serif font-bold text-slate-900 dark:text-white">{user.firstName} {user.lastName}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-1">{user.role} • ID: AGT-2024-001</p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
            <div className="inline-flex items-center px-4 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-bold border border-green-100 dark:border-green-900 uppercase tracking-widest">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Active Status
            </div>
            <div className="inline-flex items-center px-4 py-1.5 bg-amber-50 dark:bg-amber-900/30 text-accent dark:text-amber-400 rounded-full text-xs font-bold border border-amber-200 dark:border-amber-900 uppercase tracking-widest">
              Gold Tier
            </div>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Account Settings */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Account Management</h3>
          <SettingItem 
            icon={<User className="text-blue-500" />} 
            label="Personal Information" 
            onClick={() => setActiveView('personal')}
          />
          <SettingItem 
            icon={<Shield className="text-green-500" />} 
            label="Role & Permissions" 
            onClick={() => setActiveView('permissions')}
          />
          <SettingItem 
            icon={<Lock className="text-red-500" />} 
            label="Security & Password" 
            onClick={() => setActiveView('security')}
          />
        </div>

        {/* System Settings */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">System & Preferences</h3>
          
          {/* Mobile/Tablet Theme Toggle - Visible only on mobile/tablet or when sidebar toggle isn't enough */}
          <div className="lg:hidden">
             <div className="p-5 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-accent hover:shadow-xl transition-all">
                <Switch 
                   label={theme === 'dark' ? "Dark Mode" : "Light Mode"} 
                   enabled={theme === 'dark'} 
                   onChange={toggleTheme} 
                />
             </div>
          </div>

          <SettingItem 
            icon={<Bell className="text-accent" />} 
            label="Notifications" 
            onClick={() => setActiveView('notifications')}
          />
          <SettingItem 
            icon={<CreditCard className="text-purple-500" />} 
            label="Payment Methods" 
            onClick={() => { setActiveView('payments'); setChannelFormView('LIST'); }}
          />
          
          {/* Premium Plan Card */}
          <div className="p-6 bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] text-white flex flex-col space-y-4 shadow-xl shadow-slate-200 dark:shadow-slate-900 border border-slate-800 dark:border-slate-800 group hover:border-accent/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5">
                    <Shield size={24} className="text-accent" />
                 </div>
                 <div>
                    <p className="text-sm font-bold">Premium Agent Plan</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Active Subscription</p>
                 </div>
              </div>
              <button 
                onClick={() => setActiveView('plan')}
                className="text-xs font-bold bg-accent text-slate-900 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
              >
                Manage
              </button>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <p className="text-xs text-slate-400">Next billing cycle: <span className="text-white font-medium">April 12, 2024</span></p>
              <p className="text-sm font-bold text-accent">₦15,000/mo</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SHEETS FOR FLOWS --- */}

      {/* 1. Personal Information BottomSheet */}
      <BottomSheetModal
        isOpen={activeView === 'personal'}
        onClose={() => setActiveView(null)}
        title="Identity Settings"
      >
        <div className="space-y-8">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
             <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">Manage your public profile and contact reachability.</p>
          </div>
          <FileUpload label="Profile Photo" description="JPEG or PNG, min 400x400px" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" defaultValue={user.firstName} />
            <Input label="Last Name" defaultValue={user.lastName} />
          </div>
          <Input label="Email Address" type="email" icon={<Mail size={18} />} defaultValue={user.email} />
          <Input label="Phone Number" type="tel" icon={<Phone size={18} />} defaultValue={user.phone} />
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Primary Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
              <textarea 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-accent focus:outline-none min-h-[100px] resize-none"
                defaultValue={user.location}
              />
            </div>
          </div>
          <div className="flex space-x-4 pt-4">
            <SecondaryButton className="flex-1" onClick={() => setActiveView(null)}>Cancel</SecondaryButton>
            <PrimaryButton className="flex-1" onClick={() => handleSave('Profile')}>Update Profile</PrimaryButton>
          </div>
        </div>
      </BottomSheetModal>

      {/* 2. Security & Password BottomSheet */}
      <BottomSheetModal
        isOpen={activeView === 'security'}
        onClose={() => setActiveView(null)}
        title="Security Center"
      >
        <div className="space-y-6">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-start space-x-3">
            <AlertCircle className="text-red-500 mt-0.5" size={18} />
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">Changing your password will sign you out of all other active sessions on multiple devices.</p>
          </div>
          <div className="space-y-4">
            <Input label="Current Password" type="password" icon={<Lock size={18} />} placeholder="••••••••" />
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
            <Input label="New Password" type="password" icon={<Lock size={18} />} placeholder="New password" />
            <Input label="Confirm New Password" type="password" icon={<Lock size={18} />} placeholder="Repeat new password" />
          </div>
          <div className="pt-4 border-t border-slate-50 dark:border-slate-800 space-y-4">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enhanced Protection</h5>
            <Switch label="Two-Factor Authentication (2FA)" enabled={true} />
            <Switch label="Biometric Login (FaceID/Fingerprint)" enabled={false} />
          </div>
          <div className="pt-2">
             <PrimaryButton className="w-full" onClick={() => handleSave('Security Settings')}>Save Security Profile</PrimaryButton>
          </div>
        </div>
      </BottomSheetModal>

      {/* 3. Role & Permissions BottomSheet */}
      <BottomSheetModal
        isOpen={activeView === 'permissions'}
        onClose={() => setActiveView(null)}
        title="Role Access"
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] border border-blue-100 dark:border-blue-900/30">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Shield size={28} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-lg">{user.role}</h4>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">Level 4 Clearance</p>
            </div>
          </div>
          
          <div className="space-y-3">
             <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Capabilities</h5>
             <PermissionCheck label="Register new customers" checked />
             <PermissionCheck label="Approve stock requests (Level 1)" checked />
             <PermissionCheck label="Generate PAYGO tokens" checked />
             <PermissionCheck label="Void transactions (Self-only)" checked />
             <PermissionCheck label="Direct bank settlements" checked={false} />
          </div>
          
          <p className="text-[10px] text-slate-400 text-center italic mt-2">Contact your Regional Manager to request additional permissions.</p>
          
          <div className="pt-2">
             <SecondaryButton className="w-full" onClick={() => setActiveView(null)}>Close View</SecondaryButton>
          </div>
        </div>
      </BottomSheetModal>

      {/* 4. Notifications BottomSheet */}
      <BottomSheetModal
        isOpen={activeView === 'notifications'}
        onClose={() => setActiveView(null)}
        title="Alert Preferences"
      >
        <div className="space-y-8">
           <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Control how and when we reach you with system updates.</p>
           </div>

           <div className="space-y-4">
              <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                 <Smartphone size={16} className="text-accent" />
                 <span>Push Notifications</span>
              </h5>
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                 <Switch label="New Customer Activity" enabled={true} />
                 <Switch label="Stock Replenishment Alerts" enabled={true} />
                 <Switch label="System Downtime Alerts" enabled={false} />
              </div>
           </div>

           <div className="space-y-4">
              <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                 <Mail size={16} className="text-accent" />
                 <span>Email Reports</span>
              </h5>
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                 <Switch label="Weekly Sales Summary" enabled={true} />
                 <Switch label="Commission Statements" enabled={true} />
                 <Switch label="Marketing Newsletters" enabled={false} />
              </div>
           </div>
           
           <PrimaryButton className="w-full" onClick={() => handleSave('Notification Preferences')}>Save Preferences</PrimaryButton>
        </div>
      </BottomSheetModal>

      {/* 5. Payment Methods BottomSheet */}
      <BottomSheetModal
        isOpen={activeView === 'payments'}
        onClose={() => setActiveView(null)}
        title={channelFormView === 'FORM' ? (currentChannel.id ? "Edit Channel" : "Add New Channel") : "Payout Channels"}
      >
        {channelFormView === 'LIST' ? (
            <div className="space-y-6">
                <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed px-1">Manage your linked accounts for commission withdrawals.</p>
                {payoutChannels.map((channel) => (
                    <PaymentCard 
                        key={channel.id}
                        channel={channel}
                        onEdit={() => handleEditChannel(channel)}
                        onDelete={() => handleDeleteChannel(channel.id)}
                        onSetDefault={() => handleSetDefault(channel.id)}
                    />
                ))}
                {payoutChannels.length === 0 && (
                    <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem]">
                        <Banknote size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-bold">No channels added</p>
                    </div>
                )}
                <div 
                    onClick={handleAddChannel}
                    className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer hover:border-accent hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                    <Plus className="text-slate-400" size={32} />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Connect New Wallet</p>
                </div>
            </div>
        ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4">
                <Select 
                    label="Channel Type" 
                    value={currentChannel.type} 
                    onChange={e => setCurrentChannel({...currentChannel, type: e.target.value as any})}
                >
                    <option value="Bank Account">Bank Account</option>
                    <option value="Mobile Money">Mobile Money</option>
                </Select>
                
                <Input 
                    label={currentChannel.type === 'Bank Account' ? "Bank Name" : "Network Provider"} 
                    placeholder={currentChannel.type === 'Bank Account' ? "e.g. GTBank" : "e.g. MTN"}
                    value={currentChannel.provider || ''}
                    onChange={e => setCurrentChannel({...currentChannel, provider: e.target.value})}
                />

                <Input 
                    label="Account Number" 
                    type="number"
                    placeholder="0123456789"
                    value={currentChannel.accountNumber || ''}
                    onChange={e => setCurrentChannel({...currentChannel, accountNumber: e.target.value})}
                />

                <Input 
                    label="Account Name" 
                    placeholder="Name on account"
                    value={currentChannel.accountName || ''}
                    onChange={e => setCurrentChannel({...currentChannel, accountName: e.target.value})}
                />

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Set as Primary Channel</span>
                    <Switch 
                        label="" 
                        enabled={currentChannel.isDefault} 
                        onChange={(val) => setCurrentChannel({...currentChannel, isDefault: val})} 
                    />
                </div>

                <div className="flex space-x-4 pt-4">
                    <SecondaryButton className="flex-1" onClick={() => setChannelFormView('LIST')}>Back</SecondaryButton>
                    <PrimaryButton className="flex-1" onClick={handleSaveChannel}>
                        {currentChannel.id ? 'Save Changes' : 'Add Channel'}
                    </PrimaryButton>
                </div>
            </div>
        )}
      </BottomSheetModal>

      {/* 6. Premium Plan BottomSheet */}
      <BottomSheetModal
        isOpen={activeView === 'plan'}
        onClose={() => setActiveView(null)}
        title="Agent Membership"
      >
        <div className="space-y-6">
          <div className="bg-gold-gradient p-8 rounded-[2.5rem] text-slate-900 shadow-xl shadow-accent/20">
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Current Level</p>
             <h4 className="text-3xl font-serif font-bold">PREMIUM GOLD</h4>
             <p className="text-sm font-medium mt-2">Expiring in 24 days</p>
          </div>
          
          <div className="space-y-4">
             <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Included Features</h5>
             <div className="grid grid-cols-1 gap-2">
                <BenefitRow label="Unlimited customer registrations" />
                <BenefitRow label="Advanced sales analytics & PDF exports" />
                <BenefitRow label="Regional leaderboard access" />
                <BenefitRow label="Priority technical support" />
                <BenefitRow label="Custom agent marketing materials" />
             </div>
          </div>

          <div className="flex justify-between w-full items-center pt-4">
            <button className="text-red-500 text-xs font-bold hover:underline">Cancel Subscription</button>
            <PrimaryButton onClick={() => setActiveView(null)}>Got It</PrimaryButton>
          </div>
        </div>
      </BottomSheetModal>
    </div>
  );
};

const SettingItem: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-accent dark:hover:border-accent hover:shadow-xl hover:-translate-y-1 transition-all group"
  >
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 dark:group-hover:bg-slate-950 group-hover:text-accent transition-colors">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
      </div>
      <span className="font-bold text-slate-900 dark:text-white text-sm">{label}</span>
    </div>
    <ChevronRight size={18} className="text-slate-300 group-hover:text-accent transition-transform group-hover:translate-x-1" />
  </button>
);

const PermissionCheck: React.FC<{ label: string, checked?: boolean }> = ({ label, checked }) => (
  <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
     <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
     {checked ? <CheckCircle2 size={18} className="text-green-500" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700" />}
  </div>
);

const BenefitRow: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300">
     <div className="w-5 h-5 bg-amber-500/20 rounded-full flex items-center justify-center">
        <CheckCircle2 size={12} className="text-accent" />
     </div>
     <span>{label}</span>
  </div>
);

interface PaymentCardProps { 
    channel: PayoutChannel;
    onEdit: () => void;
    onDelete: () => void;
    onSetDefault: () => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ channel, onEdit, onDelete, onSetDefault }) => (
  <div className={`p-6 bg-white dark:bg-slate-900 border rounded-[2.5rem] shadow-sm relative group transition-all ${channel.isDefault ? 'border-accent dark:border-accent' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}>
    <div className="flex justify-between items-start mb-4">
       <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
              <span>{channel.type}</span>
              <span className="text-slate-300">•</span>
              <span>{channel.provider}</span>
          </p>
          <h4 className="font-bold text-slate-900 dark:text-white mt-1">{channel.accountName}</h4>
       </div>
       <DropdownMenu 
          trigger={
            <button className="p-2 text-slate-300 hover:text-slate-600 dark:hover:text-white transition-colors bg-slate-50 dark:bg-slate-800 rounded-xl">
                <MoreVertical size={16} />
            </button>
          }
          items={[
            { label: 'Edit Details', icon: <Edit2 size={14} />, onClick: onEdit },
            { label: 'Set as Default', icon: <CheckCircle2 size={14} />, onClick: onSetDefault },
            { label: 'Remove', icon: <Trash2 size={14} />, onClick: onDelete, variant: 'danger' },
          ]}
       />
    </div>
    <p className="text-sm font-mono text-slate-500 tracking-wider">{channel.accountNumber}</p>
    {channel.isDefault && (
      <div className="absolute bottom-6 right-6 px-3 py-1 bg-accent/10 text-accent rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center space-x-1 border border-accent/20">
         <Check size={10} strokeWidth={4} />
         <span>Default</span>
      </div>
    )}
  </div>
);

export default SettingsView;
