'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, Trash2, MapPin } from 'lucide-react';

interface DownloadedPlace {
  placeId: number;
  placeName: string;
  description: string;
  location: string;
  image: string;
  latitude: number;
  longitude: number;
  downloadedAt: number;
}

interface DownloadsScreenProps {
  onNavigate: (screen: string) => void;
}

export function DownloadsScreen({ onNavigate }: DownloadsScreenProps) {
  const { t } = useLanguage();
  const [downloads, setDownloads] = useState<DownloadedPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDownloads = () => {
      try {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('downloadedPlaces');
          const places = stored ? JSON.parse(stored) : [];
          setDownloads(places);
        }
      } catch (error) {
        console.error('[v0] Error loading downloads:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDownloads();
  }, []);

  const handleDeleteDownload = (placeId: number) => {
    try {
      const stored = localStorage.getItem('downloadedPlaces');
      const places = stored ? JSON.parse(stored) : [];
      const updated = places.filter((p: DownloadedPlace) => p.placeId !== placeId);
      localStorage.setItem('downloadedPlaces', JSON.stringify(updated));
      setDownloads(updated);
    } catch (error) {
      console.error('[v0] Error deleting download:', error);
    }
  };

  const handleUseMap = (placeId: number) => {
    // Find the place to get name, latitude and longitude
    const place = downloads.find((p) => p.placeId === placeId);
    if (place) {
      const encodedName = encodeURIComponent(place.placeName);
      onNavigate(`map-view-${placeId}_${place.latitude}_${place.longitude}_${encodedName}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-20">
        <div className="max-w-sm mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg text-foreground">{t('downloads') || 'Downloads'}</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-sm mx-auto px-4 py-6 space-y-4">
        {/* Downloads List */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              {t('loading') || 'Loading...'}
            </p>
          </div>
        ) : downloads.length === 0 ? (
          <Card className="p-6 text-center border-dashed">
            <div className="text-4xl mb-2">🗺️</div>
            <h3 className="font-semibold text-foreground mb-1">
              {t('no-downloads') || 'No Downloads Yet'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('download-maps-offline') || 'Download maps from place details to use offline'}
            </p>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => onNavigate('discover')}
            >
              <Download className="w-4 h-4 mr-2" />
              {t('download-maps') || 'Download Maps'}
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {downloads.map((place) => (
              <Card
                key={place.placeId}
                className="p-4 border-border hover:shadow-md transition-all overflow-hidden"
              >
                <div className="flex gap-3 mb-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/20">
                    <img
                      src={place.image}
                      alt={place.placeName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-sm mb-1">
                      {place.placeName}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{place.location}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {place.description}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
                    onClick={() => handleUseMap(place.placeId)}
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    {t('view-location') || 'View Location'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDownload(place.placeId)}
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
