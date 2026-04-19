'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewScreenProps {
  placeId: number;
  placeName: string;
  latitude: number;
  longitude: number;
  onNavigate: (screen: string) => void;
}

export function MapViewScreen({
  placeId,
  placeName,
  latitude,
  longitude,
  onNavigate,
}: MapViewScreenProps) {
  const { t } = useLanguage();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([latitude, longitude], 16);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Add marker for the location
    const marker = L.marker([latitude, longitude]).addTo(map.current);
    marker.bindPopup(`
      <div class="p-2 font-sans">
        <h3 class="font-bold text-sm mb-1">${placeName}</h3>
        <p class="text-xs text-muted-foreground">${latitude.toFixed(4)}, ${longitude.toFixed(4)}</p>
      </div>
    `);
    marker.openPopup();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, placeName]);

  // Generate OpenStreetMap directions URL
  const directionsUrl = `https://www.openstreetmap.org/directions?engine=osrm_car&route=${latitude},${longitude}`;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-20">
        <button
          onClick={() => onNavigate('downloads')}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 text-center px-4">
          <h2 className="font-bold text-foreground text-lg">{placeName}</h2>
          <p className="text-xs text-muted-foreground">
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
        </div>
        <button
          onClick={() => {
            window.open(directionsUrl, '_blank');
          }}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          title="Open directions"
        >
          <Navigation className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainer}
        className="flex-1 relative overflow-hidden bg-secondary/10"
        style={{ zIndex: 10 }}
      />

      {/* Footer with Info */}
      <div className="p-4 border-t border-border bg-background z-20">
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            {t('offline-location') || 'View this location on the map'}
          </p>
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => {
              if (map.current) {
                map.current.setView([latitude, longitude], 16);
              }
            }}
          >
            <Navigation className="w-4 h-4 mr-2" />
            {t('center-map') || 'Center Map'}
          </Button>
        </div>
      </div>
    </div>
  );
}
