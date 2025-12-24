import { useState, useRef } from 'react';
import { Trash2 } from 'lucide-react';

interface SignaturePadProps {
    label?: string;
    onChange?: (signature: string | null) => void;
}

export const SignaturePad = ({ label, onChange }: SignaturePadProps) => {
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
        ctx.strokeStyle = '#0F766E';
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
