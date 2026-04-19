'use client';

import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  MapPin,
  Download,
  Zap,
  AlertCircle,
  Plus,
  Minus,
  Navigation2,
  VerifiedIcon,
} from 'lucide-react';

interface OfflineMapScreenProps {
  onNavigate: (screen: string) => void;
}

interface TourismLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  image: string;
  verified: boolean;
}

export function OfflineMapScreen({ onNavigate }: OfflineMapScreenProps) {
  const { t } = useLanguage();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  const locations: TourismLocation[] = [
    {
      id: 1,
      name: 'FEIMA',
      latitude: -23.8645,
      longitude: 35.3521,
      image: '/images/carousel-1.jpg',
      verified: true,
    },
    {
      id: 2,
      name: 'Mercado do Peixe',
      latitude: -23.8632,
      longitude: 35.3286,
      image: '/images/carousel-3.jpg',
      verified: true,
    },
    {
      id: 3,
      name: 'Xipamanine Market',
      latitude: -23.8540,
      longitude: 35.3245,
      image: '/images/carousel-2.jpg',
      verified: true,
    },
    {
      id: 4,
      name: 'Mafalala',
      latitude: -23.8720,
      longitude: 35.3165,
      image: '/images/carousel-4.jpg',
      verified: true,
    },
  ];

  useEffect(() => {
    if (!mapContainer.current || typeof window === 'undefined') return;

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');

        if (map.current) {
          map.current.remove();
        }

        // Initialize map centered on Maputo
        map.current = L.map(mapContainer.current).setView([-23.8632, 35.3185], 14);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map.current);

        // Add markers for each tourism location
        locations.forEach((location) => {
          const marker = L.marker([location.latitude, location.longitude]).addTo(map.current!);

          // Create custom popup content
          const popupContent = `
            <div class="w-48 font-sans">
              <img src="${location.image}" alt="${location.name}" class="w-full h-32 object-cover rounded-md mb-2"/>
              <h3 class="font-bold text-sm mb-1">${location.name}</h3>
              <p class="text-xs text-gray-600 mb-2">${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}</p>
              <button onclick="window.dispatchEvent(new CustomEvent('viewDetails', {detail: {placeId: ${location.id}}}))" class="w-full px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </div>
          `;

          marker.bindPopup(popupContent);
        });

        // Handle custom events
        const handleViewDetails = (event: any) => {
          onNavigate(`detail-${event.detail.placeId}`);
        };

        window.addEventListener('viewDetails', handleViewDetails);

        return () => {
          window.removeEventListener('viewDetails', handleViewDetails);
        };
      } catch (error) {
        console.error('[v0] Error initializing offline map:', error);
      }
    };

    initMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [onNavigate]);

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/5 px-4 py-4 border-b border-border sticky top-0 z-10">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('home')}
              className="p-0 h-auto w-auto"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground flex-1">
              Maputo Map
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            {locations.length} tourism locations
          </p>
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainer}
        className="flex-1 relative overflow-hidden bg-secondary/10"
        style={{ zIndex: 5 }}
      />

      {/* Info footer */}
      <div className="p-4 border-t border-border bg-background">
        <p className="text-xs text-muted-foreground text-center">
          Click on markers to view place details and navigate
        </p>
      </div>
    </div>
  );
}
