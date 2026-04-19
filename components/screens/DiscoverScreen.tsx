'use client';

import { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, VerifiedIcon, MapPin, DollarSign } from 'lucide-react';

interface DiscoverScreenProps {
  onNavigate: (screen: string) => void;
}

export function DiscoverScreen({ onNavigate }: DiscoverScreenProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = ['all', 'food', 'crafts', 'markets', 'history'];

  const places = [
    {
      id: 1,
      name: 'FEIMA Food Stalls',
      location: 'Av. Marginal',
      category: 'food',
      verified: true,
      price: '$$',
      description: 'Fresh local cuisine',
      image: '/images/feima.jpg',
    },
    {
      id: 2,
      name: 'Mercado do Peixe',
      location: 'Marginal',
      category: 'food',
      verified: true,
      price: '$',
      description: 'Grilled seafood',
      image: '/images/mercado-peixe.jpg',
    },
    {
      id: 3,
      name: 'Xipamanine Market',
      location: 'Xipamanine',
      category: 'markets',
      verified: true,
      price: '$',
      description: 'Authentic local market',
      image: '/images/xipamanine.jpg',
    },
    {
      id: 4,
      name: 'Estrela Market',
      location: 'Downtown',
      category: 'crafts',
      verified: true,
      price: '$$',
      description: 'Crafts & textiles',
      image: '/images/estrela.jpg',
    },
    {
      id: 5,
      name: 'Mafalala Arts',
      location: 'Mafalala',
      category: 'culture',
      verified: true,
      price: 'Free',
      description: 'Community murals',
      image: '/images/mafalala.jpg',
    },
    {
      id: 6,
      name: 'Tunduru Garden Cafe',
      location: 'Central',
      category: 'food',
      verified: true,
      price: '$$',
      description: 'Hidden garden spot',
      image: '/images/tunduru.jpg',
    },
  ];

  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || place.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/5 px-4 py-4 border-b border-border sticky top-0 z-10">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('home')}
              className="p-0 h-auto w-auto"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground flex-1">{t('discover')}</h1>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Input
              type="text"
              placeholder={t('search-places')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-2 bg-card border-border"
            />
          </div>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-4 py-4">
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-4">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className="whitespace-nowrap capitalize"
            >
              {filter === 'all' ? t('all') : filter}
            </Button>
          ))}
        </div>

        {/* Places grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredPlaces.map((place) => (
            <Card
              key={place.id}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigate(`detail-${place.id}`)}
            >
              {/* Image placeholder */}
              <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
                {place.id === 1 && (
                  <img src="/images/feima.jpg" alt={place.name} className="w-full h-full object-cover" />
                )}
                {place.id === 2 && (
                  <img src="/images/mercado-peixe.jpg" alt={place.name} className="w-full h-full object-cover" />
                )}
                {place.id === 3 && (
                  <img src="/images/xipamanine.jpg" alt={place.name} className="w-full h-full object-cover" />
                )}
                {place.id === 4 && (
                  <img src="/images/estrela.jpg" alt={place.name} className="w-full h-full object-cover" />
                )}
                {place.id === 5 && (
                  <img src="/images/mafalala.jpg" alt={place.name} className="w-full h-full object-cover" />
                )}
                {place.id === 6 && (
                  <img src="/images/tunduru.jpg" alt={place.name} className="w-full h-full object-cover" />
                )}
                {![1, 2, 3, 4, 5, 6].includes(place.id) && (
                  <span className="text-4xl">📍</span>
                )}
                {place.verified && (
                  <div className="absolute top-2 right-2 bg-accent rounded-full p-1">
                    <VerifiedIcon className="w-3 h-3 text-accent-foreground" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="font-bold text-sm text-foreground mb-1 line-clamp-2">
                  {place.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                  {place.description}
                </p>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {place.location}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                    {place.price}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No places found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
