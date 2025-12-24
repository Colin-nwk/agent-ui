import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
    theme: string;
    onToggleTheme: () => void;
}

export const Header = ({ theme, onToggleTheme }: HeaderProps) => {
    return (
        <header className="hidden lg:flex justify-end items-center p-4 bg-transparent">
            <button
                onClick={onToggleTheme}
                className="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700 hover:text-primary dark:hover:text-primary transition-colors"
                title="Toggle Theme"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </header>
    );
};
