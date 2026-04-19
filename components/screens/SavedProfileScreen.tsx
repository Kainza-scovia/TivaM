'use client';

import { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Heart, MapPin, Trash2 } from 'lucide-react';

interface SavedPlace {
  id: number;
  name: string;
  subtitle: string;
  location: string;
  description: string;
  image: string;
}

interface SavedProfileScreenProps {
  onNavigate: (screen: string) => void;
  savedPlaceIds?: number[];
  onUnsavePlace?: (placeId: number) => void;
}

export function SavedProfileScreen({ onNavigate, savedPlaceIds = [], onUnsavePlace }: SavedProfileScreenProps) {
  const { t } = useLanguage();

  // All available places
  const allPlaces: Record<number, SavedPlace> = {
    1: {
      id: 1,
      name: 'FEIMA',
      subtitle: 'Main Market',
      location: 'Av. Marginal, Maputo',
      description: 'Experience the heart of Maputo with vibrant local markets',
      image: '/images/carousel-1.jpg',
    },
    2: {
      id: 2,
      name: 'Mercado do Peixe',
      subtitle: 'Fish Market',
      location: 'Centro, Maputo',
      description: 'Fresh seafood and authentic local cuisine',
      image: '/images/carousel-3.jpg',
    },
    3: {
      id: 3,
      name: 'Xipamanine Market',
      subtitle: 'Traditional Market',
      location: 'Xipamanine, Maputo',
      description: 'Authentic African crafts and textiles',
      image: '/images/carousel-2.jpg',
    },
    4: {
      id: 4,
      name: 'Mafalala',
      subtitle: 'Historic District',
      location: 'Mafalala, Maputo',
      description: 'Historic colonial architecture and cultural heritage',
      image: '/images/carousel-4.jpg',
    },
  };

  // Filter to only show saved places
  const savedPlaces = savedPlaceIds
    .map((id) => allPlaces[id])
    .filter((place) => place !== undefined);

  const handleUnsavePlace = (placeId: number) => {
    if (onUnsavePlace) {
      onUnsavePlace(placeId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
        <div className="max-w-sm mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="p-0 h-auto w-auto"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg text-foreground">Saved Places</h1>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-4 py-6 space-y-4">
        {savedPlaces.length === 0 ? (
          <Card className="p-8 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h2 className="font-bold text-foreground mb-2">No Saved Places Yet</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Explore places and save your favorites to see them here
            </p>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => onNavigate('discover')}
            >
              Explore Places
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {savedPlaces.map((place) => (
              <Card
                key={place.id}
                className="p-4 border-border hover:shadow-md transition-all overflow-hidden group"
              >
                <div className="flex gap-3">
                  <div
                    className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/20 cursor-pointer"
                    onClick={() => onNavigate(`detail-${place.id}`)}
                  >
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => onNavigate(`detail-${place.id}`)}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="font-bold text-sm text-foreground">{place.name}</h3>
                          <p className="text-xs text-primary font-medium">{place.subtitle}</p>
                        </div>
                        <Heart className="w-4 h-4 fill-primary text-primary flex-shrink-0" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{place.description}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{place.location}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnsavePlace(place.id);
                      }}
                      className="mt-3 flex items-center gap-2 text-xs text-destructive hover:text-destructive/80 transition-colors self-start"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {t('remove') || 'Remove'}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
