'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { AuthNav } from '@/components/AuthNav';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight, MapPin, VerifiedIcon } from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [carouselIndex, setCarouselIndex] = useState(0);

  const carouselSlides = [
    {
      image: '/images/carousel-1.jpg',
      title: t('carousel-title-1') || 'Discover Hidden Gems of Maputo',
      subtitle: t('carousel-subtitle-1') || 'Explore authentic experiences',
    },
    {
      image: '/images/carousel-2.jpg',
      title: t('carousel-title-2') || 'Authentic Markets & Local Culture',
      subtitle: t('carousel-subtitle-2') || 'Meet local artisans and vendors',
    },
    {
      image: '/images/carousel-3.jpg',
      title: t('carousel-title-3') || 'Taste the Flavors of Mozambique',
      subtitle: t('carousel-subtitle-3') || 'Fresh seafood and local cuisine',
    },
    {
      image: '/images/carousel-4.jpg',
      title: t('carousel-title-4') || 'Explore Beautiful Coastal Views',
      subtitle: t('carousel-subtitle-4') || 'Pristine beaches and sunsets',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  const categories = [
    { id: 'food', label: t('food'), icon: '🍽️' },
    { id: 'crafts', label: t('crafts'), icon: '🪘' },
    { id: 'markets', label: t('markets'), icon: '🛍️' },
    { id: 'culture', label: t('culture'), icon: '🎨' },
  ];

  const featuredGems = [
    {
      id: 1,
      name: 'FEIMA',
      subtitle: 'Craft, Flowers & Food',
      location: 'Av. Marginal',
      category: 'markets',
      verified: true,
      image: '/images/feima.jpg',
      description: 'Fresh local cuisine',
    },
    {
      id: 2,
      name: 'Mercado do Peixe',
      subtitle: 'Fish Market',
      location: 'Marginal',
      category: 'food',
      verified: true,
      image: '/images/mercado-peixe.jpg',
      description: 'Grilled seafood',
    },
    {
      id: 3,
      name: 'Xipamanine Market',
      subtitle: 'Local Market',
      location: 'Xipamanine',
      category: 'markets',
      verified: true,
      image: '/images/xipamanine.jpg',
      description: 'Authentic local experience',
    },
    {
      id: 4,
      name: 'Mafalala Walking Tour',
      subtitle: 'Arts & Culture',
      location: 'Mafalala',
      category: 'culture',
      verified: true,
      image: '/images/mafalala.jpg',
      description: 'Community murals and history',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/5 px-4 py-4 border-b border-border">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold text-xl text-primary">TivaM</div>
            <AuthNav />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('discover-title')}</h1>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-4 py-6 space-y-6">
        {/* Image Carousel */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-lg h-48">
          {/* Carousel slides */}
          <div className="relative w-full h-full overflow-hidden">
            {carouselSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  idx === carouselIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                
                {/* Text content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                  <h3 className="text-white font-bold text-lg text-balance mb-1">
                    {slide.title}
                  </h3>
                  <p className="text-white/90 text-xs">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {carouselSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === carouselIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Category filters */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">{t('food')}, {t('crafts')}, {t('markets')}, {t('culture')}</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
                className="whitespace-nowrap"
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Hidden Gems */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            {t('hidden-gems')}
            <span className="text-xl">💎</span>
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scroll-smooth">
            {featuredGems.map((gem) => (
              <div
                key={gem.id}
                onClick={() => onNavigate(`detail-${gem.id}`)}
                className="flex-shrink-0 w-56 cursor-pointer group"
              >
                <Card className="h-full overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col bg-card">
                  {/* Image Container with Overlay */}
                  <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                    {gem.id === 1 && (
                      <img src="/images/feima.jpg" alt={gem.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    )}
                    {gem.id === 2 && (
                      <img src="/images/mercado-peixe.jpg" alt={gem.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    )}
                    {gem.id === 3 && (
                      <img src="/images/xipamanine.jpg" alt={gem.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    )}
                    {gem.id === 4 && (
                      <img src="/images/mafalala.jpg" alt={gem.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    )}
                    {![1, 2, 3, 4].includes(gem.id) && (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📍</div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Verification Badge - Top Right */}
                    {gem.verified && (
                      <div className="absolute top-3 right-3 bg-accent text-accent-foreground rounded-full p-2 shadow-lg">
                        <VerifiedIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Content Container */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="mb-2">
                        <h3 className="font-bold text-foreground text-sm line-clamp-1">{gem.name}</h3>
                        <p className="text-xs text-primary font-medium">{gem.subtitle}</p>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{gem.description}</p>
                    </div>
                    
                    {/* Location Footer */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(`detail-${gem.id}`);
                      }}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground pt-3 border-t border-border/50 hover:text-primary transition-colors w-full"
                    >
                      <MapPin className="w-3 h-3 flex-shrink-0 text-primary" />
                      <span className="line-clamp-1">{gem.location}</span>
                    </button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Digital Ambassador CTA */}
        <div className="mt-8 mb-6">
          <Card 
            onClick={() => onNavigate('vendor')}
            className="relative overflow-hidden cursor-pointer bg-gradient-to-br from-accent/5 via-secondary/30 to-accent/10 border-2 border-accent/30 hover:border-accent/60 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 p-6"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/20 rounded-full blur-2xl -ml-8 -mb-8" />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {t('vendor-cta-title')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('vendor-cta-subtitle')}
                  </p>
                </div>
                <div className="text-2xl flex-shrink-0">🌟</div>
              </div>

              <p className="text-sm text-foreground mb-4 leading-relaxed">
                {t('vendor-cta-description')}
              </p>

              {/* Benefits preview */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {t('vendor-verified-badge')}
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {t('vendor-customer-access')}
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {t('vendor-whatsapp')}
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {t('vendor-support')}
                </div>
              </div>

              {/* CTA Button */}
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold flex items-center justify-center gap-2 group">
                {t('vendor-join')}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
