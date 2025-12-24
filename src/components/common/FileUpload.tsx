import { useState, useRef } from 'react';
import { Upload, X, File } from 'lucide-react';

interface FileUploadProps {
    label: string;
    description?: string;
    accept?: string;
    multiple?: boolean;
    onChange?: (files: File[]) => void;
}

export const FileUpload = ({ label, description, accept, multiple, onChange }: FileUploadProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<{ file: File, url: string }[]>([]);
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
