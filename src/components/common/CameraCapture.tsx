import { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';

interface CameraCaptureProps {
    label?: string;
    onCapture?: (image: string) => void;
}

export const CameraCapture = ({ label, onCapture }: CameraCaptureProps) => {
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
        } catch {
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
