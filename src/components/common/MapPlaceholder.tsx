import { MapPin } from 'lucide-react';

interface MapPlaceholderProps {
    address: string;
}

export const MapPlaceholder = ({ address }: MapPlaceholderProps) => (
    <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl relative overflow-hidden group">
        <div className="absolute inset-0 opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700" style={{ backgroundImage: 'linear-gradient(#f1f5f9 2px, transparent 2px), linear-gradient(90deg, #f1f5f9 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundColor: '#e2e8f0' }}></div>
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
