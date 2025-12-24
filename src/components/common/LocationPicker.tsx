import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { MapPin, Navigation, X, Search, Loader2 } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './index';

const libraries: ("places")[] = ["places"];

const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '16px',
};

const defaultCenter = {
    lat: 6.5244,  // Lagos, Nigeria
    lng: 3.3792,
};

interface LocationPickerProps {
    value?: { address: string; lat?: string; lng?: string };
    onChange: (location: { address: string; lat: string; lng: string }) => void;
    onClose?: () => void;
    apiKey: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, onClose, apiKey }) => {
    const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
        value?.lat && value?.lng ? { lat: parseFloat(value.lat), lng: parseFloat(value.lng) } : null
    );
    const [address, setAddress] = useState(value?.address || '');
    const [isLocating, setIsLocating] = useState(false);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries,
    });

    const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMarker({ lat, lng });
            reverseGeocode(lat, lng);
        }
    }, []);

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const geocoder = new google.maps.Geocoder();
            const response = await geocoder.geocode({ location: { lat, lng } });
            if (response.results[0]) {
                setAddress(response.results[0].formatted_address);
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
    };

    const onPlaceSelect = () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setMarker({ lat, lng });
            setAddress(place.formatted_address || place.name || '');
            mapRef.current?.panTo({ lat, lng });
            mapRef.current?.setZoom(16);
        }
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setMarker({ lat, lng });
                reverseGeocode(lat, lng);
                mapRef.current?.panTo({ lat, lng });
                mapRef.current?.setZoom(16);
                setIsLocating(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                setIsLocating(false);
                alert('Unable to get your location. Please enable location access.');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleConfirm = () => {
        if (marker && address) {
            onChange({
                address,
                lat: marker.lat.toString(),
                lng: marker.lng.toString(),
            });
            onClose?.();
        }
    };

    if (loadError) {
        return (
            <div className="p-6 text-center">
                <MapPin size={48} className="mx-auto text-red-400 mb-4" />
                <p className="text-red-500 font-medium">Error loading maps</p>
                <p className="text-slate-500 text-sm mt-1">Please check your API key</p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="p-6 text-center">
                <Loader2 size={32} className="mx-auto animate-spin text-primary mb-4" />
                <p className="text-slate-500">Loading maps...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search Box */}
            <div className="relative">
                <Autocomplete
                    onLoad={(autocomplete) => { autocompleteRef.current = autocomplete; }}
                    onPlaceChanged={onPlaceSelect}
                >
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search for a location..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary"
                        />
                    </div>
                </Autocomplete>
            </div>

            {/* Map */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={marker ? 16 : 12}
                    center={marker || defaultCenter}
                    onClick={onMapClick}
                    onLoad={(map) => { mapRef.current = map; }}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                >
                    {marker && <Marker position={marker} />}
                </GoogleMap>

                {/* Get Current Location Button */}
                <button
                    onClick={getCurrentLocation}
                    disabled={isLocating}
                    className="absolute bottom-4 right-4 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    title="Use my location"
                >
                    {isLocating ? (
                        <Loader2 size={20} className="animate-spin text-primary" />
                    ) : (
                        <Navigation size={20} className="text-primary" />
                    )}
                </button>
            </div>

            {/* Selected Address */}
            {address && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Selected Location</p>
                    <p className="text-sm text-slate-900 dark:text-white">{address}</p>
                    {marker && (
                        <p className="text-xs text-slate-500 mt-1">
                            {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                        </p>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                <PrimaryButton
                    onClick={handleConfirm}
                    disabled={!marker || !address}
                    className="flex-1"
                >
                    <MapPin size={18} className="mr-2 inline-flex" />
                    Confirm Location
                </PrimaryButton>
            </div>
        </div>
    );
};

export default LocationPicker;
