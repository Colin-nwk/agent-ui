import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { MapPin, Locate, Loader2, RotateCcw } from 'lucide-react';
import { PrimaryButton } from './index';

const libraries: ("places" | "marker")[] = ["places", "marker"];

const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '16px',
};

const defaultCenter = {
    lat: 9.0765,  // Abuja, Nigeria
    lng: 7.3986,
};

interface LocationPickerProps {
    value?: { address: string; lat?: string; lng?: string };
    onChange: (location: { address: string; lat: string; lng: string }) => void;
    onClose?: () => void;
    apiKey: string;
}

const LocationPickerV2: React.FC<LocationPickerProps> = ({ value, onChange, onClose, apiKey }) => {
    const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(
        value?.lat && value?.lng ? { lat: parseFloat(value.lat), lng: parseFloat(value.lng) } : null
    );
    // State for the map center - defaults to Abuja, but will try to update to user location
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
        value?.lat && value?.lng ? { lat: parseFloat(value.lat), lng: parseFloat(value.lng) } : defaultCenter
    );
    const [address, setAddress] = useState(value?.address || '');
    const [isLocating, setIsLocating] = useState(false);

    // Store reference to the autocomplete element to clear it
    const autocompleteInstanceRef = useRef<any>(null);
    const placeAutocompleteRef = useRef<HTMLInputElement>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries,
    });

    // Try to get user location on mount if no value is provided
    useEffect(() => {
        if (!value?.lat && !value?.lng && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setMapCenter(userPos);
                },
                (error) => {
                    console.log("Could not get user location for default center", error);
                },
                { enableHighAccuracy: false, timeout: 5000 }
            );
        }
    }, []); // Run once on mount

    // Handle Place Autocomplete
    useEffect(() => {
        if (isLoaded && placeAutocompleteRef.current) {
            // Check if element already exists to prevent duplication
            if (placeAutocompleteRef.current.firstChild) {
                return;
            }

            // @ts-ignore - PlaceAutocompleteElement is not yet in @types/google.maps
            const autocomplete = new google.maps.places.PlaceAutocompleteElement();
            autocompleteInstanceRef.current = autocomplete;
            placeAutocompleteRef.current.appendChild(autocomplete);

            const listener = autocomplete.addEventListener('gmp-placeselect', async ({ place }: any) => {
                if (!place) return;
                try {
                    await place.fetchFields({ fields: ['location', 'formattedAddress', 'displayName'] });

                    if (place.location) {
                        const lat = place.location.lat();
                        const lng = place.location.lng();
                        const newPos = { lat, lng };

                        setMarkerPos(newPos);
                        setMapCenter(newPos);
                        setAddress(place.formattedAddress || place.displayName || '');

                        if (mapRef.current) {
                            mapRef.current.panTo(newPos);
                            mapRef.current.setZoom(16);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching place details:", error);
                }
            });

            return () => {
                // Cleanup handled by React unmount largely, but good to remove listener if we could
                // In this pattern, we just let the ref unmount.
                if (placeAutocompleteRef.current && autocomplete) {
                    try {
                        placeAutocompleteRef.current.removeChild(autocomplete);
                    } catch (e) {
                        // ignore
                    }
                }
            };
        }
    }, [isLoaded]);

    // Handle Advanced Marker
    useEffect(() => {
        if (mapRef.current) {
            if (markerPos) {
                if (!markerRef.current) {
                    try {
                        // Create new marker
                        markerRef.current = new google.maps.marker.AdvancedMarkerElement({
                            map: mapRef.current,
                            position: markerPos,
                        });
                    } catch (e) {
                        console.error("Error creating AdvancedMarkerElement", e);
                    }
                } else {
                    // Update existing marker
                    markerRef.current.position = markerPos;
                    markerRef.current.map = mapRef.current;
                }
            } else {
                // Remove marker if no position
                if (markerRef.current) {
                    markerRef.current.map = null;
                }
            }
        }

    }, [markerPos, isLoaded]);


    const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMarkerPos({ lat, lng });
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
                const newPos = { lat, lng };
                setMarkerPos(newPos);
                setMapCenter(newPos);
                reverseGeocode(lat, lng);
                mapRef.current?.panTo(newPos);
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

    const handleReset = () => {
        setMarkerPos(null);
        setAddress('');
        setMapCenter(defaultCenter); // Reset to Abuja
        if (mapRef.current) {
            mapRef.current.setZoom(12);
            mapRef.current.panTo(defaultCenter);
        }
        // Clear the autocomplete input
        if (autocompleteInstanceRef.current) {
            autocompleteInstanceRef.current.value = null;
        }
    };

    const handleConfirm = () => {
        if (markerPos && address) {
            onChange({
                address,
                lat: markerPos.lat.toString(),
                lng: markerPos.lng.toString(),
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
            {/* Inject CSS for PlaceAutocompleteElement to support Dark Mode */}
            <style>{`
                gmp-place-autocomplete-element {
                    --gmp-place-autocomplete-header-background: #ffffff;
                    --gmp-place-autocomplete-item-text-color: #1e293b; 
                }
                .dark gmp-place-autocomplete-element {
                    --gmp-place-autocomplete-header-background: #1e293b; /* slate-800 */
                    --gmp-place-autocomplete-item-text-color: #f8fafc; /* slate-50 */
                    --gmp-place-autocomplete-item-background: #1e293b;
                    --gmp-place-autocomplete-background: #1e293b;
                    --gmp-text-color: #f8fafc;
                }
            `}</style>

            {/* Search Box Container */}
            <div className={`relative ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                {/* PlaceAutocompleteElement will be appended here */}
                <div ref={placeAutocompleteRef} className="w-full [&>gmp-place-autocomplete-element]:w-full" />
            </div>

            {/* Map */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={markerPos ? 16 : 12}
                    center={mapCenter}
                    onClick={onMapClick}
                    onLoad={(map) => { mapRef.current = map; }}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: true,
                        fullscreenControl: true,
                        mapId: "DEMO_MAP_ID"
                    }}
                >
                    {/* Marker component removed, handled via useEffect and AdvancedMarkerElement */}
                </GoogleMap>

                {/* Get Current Location Button - LEFT */}
                <button
                    onClick={getCurrentLocation}
                    disabled={isLocating}
                    className="absolute bottom-4 left-4 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    title="Use my location"
                >
                    {isLocating ? (
                        <Loader2 size={20} className="animate-spin text-primary" />
                    ) : (
                        <Locate size={20} className="text-primary" />
                    )}
                </button>

                {/* Reset Button - RIGHT */}
                <button
                    onClick={handleReset}
                    className="absolute bottom-4 right-4 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    title="Reset Map"
                >
                    <RotateCcw size={20} className="text-slate-600 dark:text-slate-300" />
                </button>
            </div>

            {/* Selected Address */}
            {address && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Selected Location</p>
                    <p className="text-sm text-slate-900 dark:text-white">{address}</p>
                    {markerPos && (
                        <p className="text-xs text-slate-500 mt-1">
                            {markerPos.lat.toFixed(6)}, {markerPos.lng.toFixed(6)}
                        </p>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                <PrimaryButton
                    onClick={handleConfirm}
                    disabled={!markerPos || !address}
                    className="flex-1"
                >
                    <MapPin size={18} className="mr-2 inline-flex" />
                    Confirm Location
                </PrimaryButton>
            </div>
        </div>
    );
};

export default LocationPickerV2;
