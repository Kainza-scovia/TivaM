'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Navigation2, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface UnifiedMapScreenProps {
  latitude: number;
  longitude: number;
  placeName: string;
  onNavigate: (screen: string) => void;
}

export function UnifiedMapScreen({
  latitude,
  longitude,
  placeName,
  onNavigate,
}: UnifiedMapScreenProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; time: number } | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Get user's current location
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          setUserLocation([lat, lng]);
        },
        (error) => {
          console.error('[v0] Geolocation error:', error);
          // Default to Maputo if geolocation fails
          setUserLocation([-23.8632, 35.3185]);
        }
      );
    } else {
      // Default to Maputo if geolocation not available
      setUserLocation([-23.8632, 35.3185]);
    }
  }, []);

  // Initialize map with routing
  useEffect(() => {
    if (typeof window === 'undefined' || !userLocation) return;

    const timer = setTimeout(() => {
      if (!mapContainer.current) {
        console.error('[v0] Map container not found');
        return;
      }

      const initMap = async () => {
        try {
          const L = (await import('leaflet')).default;
          await import('leaflet/dist/leaflet.css');

          if (map.current) {
            map.current.remove();
          }

          // Initialize map centered on destination
          const centerLat = (latitude + userLocation[0]) / 2;
          const centerLng = (longitude + userLocation[1]) / 2;
          map.current = L.map(mapContainer.current!).setView([centerLat, centerLng], 14);

          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(map.current);

          // Add user location marker
          const userMarker = L.marker(userLocation, {
            title: 'Your Location',
          }).addTo(map.current);
          userMarker.bindPopup('<div class="p-2 font-sans"><h3 class="font-bold text-sm">Your Location</h3></div>');

          // Add destination marker
          const destMarker = L.marker([latitude, longitude], {
            title: placeName,
          }).addTo(map.current);
          destMarker.bindPopup(
            `<div class="p-2 font-sans"><h3 class="font-bold text-sm">${placeName}</h3><p class="text-xs text-gray-600">${latitude.toFixed(4)}, ${longitude.toFixed(4)}</p></div>`
          );

          // Calculate approximate walking distance (simple Haversine formula)
          const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
            const R = 6371; // Earth's radius in km
            const dLat = ((lat2 - lat1) * Math.PI) / 180;
            const dLon = ((lon2 - lon1) * Math.PI) / 180;
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
          };

          // Draw a line between user location and destination
          const polyline = L.polyline(
            [
              [userLocation[0], userLocation[1]],
              [latitude, longitude],
            ],
            {
              color: '#3b82f6',
              weight: 4,
              opacity: 0.7,
              dashArray: '5, 5',
            }
          ).addTo(map.current);

          // Calculate distance and estimate walking time
          const distanceKm = haversine(userLocation[0], userLocation[1], latitude, longitude);
          // Assume average walking speed of 4 km/h
          const timeMinutes = Math.ceil((distanceKm / 4) * 60);

          setRouteInfo({
            distance: parseFloat(distanceKm.toFixed(2)),
            time: timeMinutes,
          });
          setIsLoadingRoute(false);
        } catch (error) {
          console.error('[v0] Error initializing map:', error);
          setIsLoadingRoute(false);
        }
      };

      initMap();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, placeName, userLocation]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-20">
        <button
          onClick={() => onNavigate('home')}
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
        <div className="w-9" />
      </div>

      {/* Map Container */}
      <div
        ref={mapContainer}
        className="flex-1 relative overflow-hidden bg-secondary/10"
        style={{ zIndex: 10 }}
      />

      {/* Route Information Footer */}
      <div className="p-4 border-t border-border bg-background z-20">
        {isLoadingRoute ? (
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Loader className="w-4 h-4 animate-spin" />
            Calculating walking route...
          </div>
        ) : routeInfo ? (
          <Card className="p-3 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Walking Route</p>
                <div className="flex gap-4 text-xs text-foreground">
                  <span className="font-medium">
                    Distance: {routeInfo.distance} km
                  </span>
                  <span className="font-medium">
                    Time: {routeInfo.time} min
                  </span>
                </div>
              </div>
              <Navigation2 className="w-5 h-5 text-primary" />
            </div>
          </Card>
        ) : (
          <p className="text-xs text-muted-foreground text-center">
            Map powered by OpenStreetMap with walking routes
          </p>
        )}
      </div>
    </div>
  );
}
