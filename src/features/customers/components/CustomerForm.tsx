import React, { useState, useRef, useEffect } from 'react';
import {
    User, Phone, Mail, MapPin, Upload, X, Loader2, Camera, ChevronRight
} from 'lucide-react';
import {
    PrimaryButton, SecondaryButton, Input, Select, CameraModal, LocationPicker, BottomSheetModal
} from '../../../components/common';
import { Customer, CreateCustomerDto, AddressType, CustomerType } from '../../../types/customer';
import { useToast } from '../../../context';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

interface CustomerFormProps {
    initialData?: Customer;
    onSubmit: (data: CreateCustomerDto, file?: File) => Promise<void>;
    isLoading: boolean;
    submitLabel: string;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
    initialData, onSubmit, isLoading, submitLabel
}) => {
    const { showToast } = useToast();

    // Form State
    const [formData, setFormData] = useState<Partial<CreateCustomerDto>>({
        firstname: '',
        lastname: '',
        phone: '',
        alternatePhone: '',
        email: '',
        location: '',
        longitude: '',
        latitude: '',
        landmark: '',
        addressType: 'HOME',
        type: 'lead',
    });

    // Image State
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize form with data
    useEffect(() => {
        if (initialData) {
            setFormData({
                firstname: initialData.firstname,
                lastname: initialData.lastname,
                phone: initialData.phone,
                alternatePhone: initialData.alternatePhone || '',
                email: initialData.email || '',
                location: initialData.location || '',
                longitude: initialData.longitude || '',
                latitude: initialData.latitude || '',
                landmark: initialData.landmark || '',
                addressType: initialData.addressType,
                type: initialData.type,
            });
            if (initialData.image) {
                setImagePreview(initialData.image);
            }
        }
    }, [initialData]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                showToast('Invalid File', 'Please select a JPG, JPEG, or PNG image', 'error');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                showToast('File Too Large', 'Image must be less than 2MB', 'error');
                return;
            }
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        if (imagePreview && !initialData?.image) { // Only revoke if it's a blob URL
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleCameraCapture = (file: File) => {
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
        setIsCameraOpen(false);
    };

    const handleLocationSelect = (location: { address: string; lat: string; lng: string }) => {
        setFormData(prev => ({
            ...prev,
            location: location.address,
            latitude: location.lat,
            longitude: location.lng,
        }));
        setIsLocationPickerOpen(false);
    };

    const handleSubmit = async () => {
        await onSubmit(formData as CreateCustomerDto, selectedImage || undefined);
    };

    const isFormValid = formData.firstname && formData.lastname && formData.phone && formData.location;

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl mb-2">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {initialData ? 'Update customer details below.' : 'Enter client details to create a new profile in the registry.'}
                </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Customer Photo <span className="text-slate-400 font-normal">(Optional)</span>
                </label>

                {imagePreview ? (
                    <div className="relative inline-block animate-in fade-in zoom-in duration-300">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-24 h-24 rounded-2xl object-cover border-2 border-primary shadow-lg"
                        />
                        <button
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary dark:hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 group"
                        >
                            <Upload size={24} className="text-slate-400 group-hover:text-primary transition-colors" />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Upload Photo</span>
                            <span className="text-[10px] text-slate-400">JPG, PNG (max 2MB)</span>
                        </button>

                        <SecondaryButton
                            icon={<Camera size={18} />}
                            onClick={() => setIsCameraOpen(true)}
                            className="flex-1"
                        >
                            Use Camera
                        </SecondaryButton>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageSelect}
                    className="hidden"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="First Name"
                    placeholder="e.g. John"
                    icon={<User size={18} />}
                    value={formData.firstname}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstname: e.target.value }))}
                />
                <Input
                    label="Last Name"
                    placeholder="e.g. Doe"
                    value={formData.lastname}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastname: e.target.value }))}
                />
            </div>

            <Input
                label="Phone Number"
                placeholder="+234..."
                type="tel"
                icon={<Phone size={18} />}
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
            <Input
                label="Alternate Phone"
                placeholder="+234... (optional)"
                type="tel"
                icon={<Phone size={18} />}
                value={formData.alternatePhone}
                onChange={(e) => setFormData(prev => ({ ...prev, alternatePhone: e.target.value }))}
            />
            <Input
                label="Email Address"
                placeholder="client@email.com"
                type="email"
                icon={<Mail size={18} />}
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />

            {/* Location Picker Trigger */}
            <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Location
                </label>
                <button
                    type="button"
                    onClick={() => setIsLocationPickerOpen(true)}
                    className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:border-primary transition-colors flex items-center gap-3 bg-white dark:bg-slate-800"
                >
                    <MapPin size={18} className="text-slate-400" />
                    {formData.location ? (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-900 dark:text-white truncate">{formData.location}</p>
                            {formData.latitude && formData.longitude && (
                                <p className="text-xs text-slate-400">{formData.latitude}, {formData.longitude}</p>
                            )}
                        </div>
                    ) : (
                        <span className="text-slate-400 text-sm">Click to select location on map</span>
                    )}
                </button>
            </div>

            <Input
                label="Landmark"
                placeholder="Near a notable place (optional)"
                icon={<MapPin size={18} />}
                value={formData.landmark}
                onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
            />

            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Address Type"
                    value={formData.addressType}
                    onChange={(e) => setFormData(prev => ({ ...prev, addressType: e.target.value as AddressType }))}
                >
                    <option value="HOME">Home</option>
                    <option value="WORK">Work</option>
                    <option value="OTHER">Other</option>
                </Select>
                <Select
                    label="Customer Type"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as CustomerType }))}
                >
                    <option value="lead">Lead</option>
                    <option value="purchase">Purchase</option>
                </Select>
            </div>

            <div className="pt-4 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
                <PrimaryButton
                    className="w-full shadow-xl shadow-primary/20"
                    onClick={handleSubmit}
                    disabled={isLoading || !isFormValid}
                >
                    {isLoading ? (
                        <><Loader2 size={18} className="animate-spin mr-2 inline-flex" /> Processing...</>
                    ) : (
                        <>{submitLabel} <ChevronRight size={20} className="ml-1 inline-flex" /></>
                    )}
                </PrimaryButton>
            </div>

            {/* Modals */}
            <CameraModal
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={handleCameraCapture}
            />

            <BottomSheetModal
                isOpen={isLocationPickerOpen}
                onClose={() => setIsLocationPickerOpen(false)}
                title="Select Location"
            >
                <LocationPicker
                    apiKey={GOOGLE_MAPS_API_KEY}
                    value={formData.location ? {
                        address: formData.location,
                        lat: formData.latitude,
                        lng: formData.longitude,
                    } : undefined}
                    onChange={handleLocationSelect}
                    onClose={() => setIsLocationPickerOpen(false)}
                />
            </BottomSheetModal>
        </div>
    );
};
