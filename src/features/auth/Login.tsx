
import React, { useState } from 'react';
import { Smartphone, Lock, ChevronRight, Moon, Sun } from 'lucide-react';
import { useTheme, useAuth } from '../../context';
import { PrimaryButton, SecondaryButton } from '../../components/common';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { theme, toggleTheme } = useTheme();
  const { login, requestOtp, isLoading } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestOtp(phone);
      setStep('otp');
    } catch (error) {
      console.error('Failed to request OTP', error);
      // Ideally show toast error here
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ phone, otp });
      onLogin(); // Redirect happens via parent re-render or this callback
    } catch (error) {
      console.error('Login failed', error);
      // Ideally show toast error here
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans transition-colors duration-500 relative">
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md z-10 border border-white/10"
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="max-w-sm w-full bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 border border-white/10 dark:border-slate-800">
        <div className="bg-ubuxa-gradient p-4 sm:p-14 text-center text-white relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-icon-DNZnSknUp8lLLR2MbsmC5X4Nf2rXnN.png" alt="UBUXA" className="h-16 sm:h-20 mx-auto mb-4 object-contain drop-shadow-lg" />
          <p className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] opacity-90">Secure Agent Access</p>
        </div>

        <div className="p-4 sm:p-10 bg-white dark:bg-slate-900 transition-colors">
          {step === 'phone' ? (
            <form onSubmit={handleRequestOtp} className="space-y-6 sm:space-y-8">
              {/* <div className="text-center mb-4 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Identity Entry</h2>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 font-medium">Log in to your agent workstation</p>
              </div> */}

              <div className="relative group">
                <Smartphone className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ubuxa-blue transition-colors" size={20} />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  className="w-full pl-12 sm:pl-14 pr-6 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-[1.25rem] text-sm sm:text-base text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-ubuxa-blue focus:outline-none transition-all shadow-sm group-hover:border-ubuxa-blue"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <SecondaryButton
                type="submit"
                disabled={isLoading}
                className="w-full"
                icon={!isLoading ? <ChevronRight size={20} /> : undefined}
              >
                {isLoading ? "Synchronizing..." : "Request Token"}
              </SecondaryButton>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 sm:space-y-6">
              <div className="text-center">
                {/* <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Verify Protocol</h2> */}
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Code sent to <span className="text-slate-900 dark:text-white font-bold">{phone}</span></p>
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ubuxa-blue transition-colors" size={20} />
                <input
                  type="text"
                  required
                  placeholder="000000"
                  className="w-full pl-12 sm:pl-14 pr-6 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-[1.25rem] text-slate-900 dark:text-white focus:ring-2 focus:ring-ubuxa-blue focus:outline-none transition-all tracking-[0.4em] sm:tracking-[0.6em] text-center text-xl sm:text-2xl font-black placeholder:tracking-normal placeholder:font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm group-hover:border-ubuxa-blue"
                  value={otp}
                  maxLength={6}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <PrimaryButton
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Authenticating..." : "Authorize Login"}
              </PrimaryButton>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-widest hover:text-ubuxa-blue transition-colors"
              >
                Cancel and Restart
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="absolute bottom-6 sm:bottom-10 text-slate-600 dark:text-slate-500 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-40 text-center px-4">
        UBUXA Corporate Ecosystem
      </div>
    </div>
  );
};

export default Login;
