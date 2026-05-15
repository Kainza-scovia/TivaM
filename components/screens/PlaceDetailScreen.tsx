'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useAuth } from '@/app/context/AuthContext';
import { LoginModal } from '@/components/LoginModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  Heart,
  VerifiedIcon,
  MapPin,
  Clock,
  DollarSign,
  MessageCircle,
  ChevronRight,
  Star,
  Send,
  MessageSquare,
  X,
  ChevronLeft,
  Download,
} from 'lucide-react';

interface PlaceDetailScreenProps {
  placeId: number;
  onNavigate: (screen: string) => void;
  isSaved?: boolean;
  onSavePlace?: (placeId: number) => void;
}

export function PlaceDetailScreen({ placeId, onNavigate, isSaved: initialIsSaved = false, onSavePlace }: PlaceDetailScreenProps) {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Place coordinates for map navigation
  const placeCoordinates: Record<number, { lat: number; lng: number }> = {
    1: { lat: -23.8645, lng: 35.3521 }, // FEIMA
    2: { lat: -23.8632, lng: 35.3286 }, // Mercado do Peixe
    3: { lat: -23.8540, lng: 35.3245 }, // Xipamanine Market
    4: { lat: -23.8720, lng: 35.3165 }, // Mafalala
  };
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [expandedPhoto, setExpandedPhoto] = useState<{ vendorId: number; photoIndex: number } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [apiVendors, setApiVendors] = useState<any[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [isDownloadingMap, setIsDownloadingMap] = useState(false);
  const [isMapDownloaded, setIsMapDownloaded] = useState(false);

  // Close LoginModal when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && showLoginModal) {
      setShowLoginModal(false);
    }
  }, [isAuthenticated, showLoginModal]);

  // Check if this place is already downloaded
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const downloaded = localStorage.getItem('downloadedPlaces');
        const downloadedPlaces = downloaded ? JSON.parse(downloaded) : [];
        setIsMapDownloaded(downloadedPlaces.some((p: any) => p.placeId === placeId));
      } catch (e) {
        console.error('[v0] Error checking downloads:', e);
      }
    }
  }, [placeId]);

  // Fetch vendors from API based on place category
  useEffect(() => {
    const fetchVendors = async () => {
      setLoadingVendors(true);
      try {
        // Map placeId to place name
        const placeCategoryMap: Record<number, string> = {
          1: 'FEIMA',
          2: 'Mercado do Peixe',
          3: 'Xipamanine Market',
          4: 'Mafalala',
        };

        const category = placeCategoryMap[placeId];
        if (!category) {
          setLoadingVendors(false);
          return;
        }

        const response = await fetch(`/api/vendors?category=${encodeURIComponent(category)}`);
        if (response.ok) {
          const data = await response.json();
          console.log('[v0] Fetched vendors from API:', data.vendors);
          setApiVendors(data.vendors || []);
        }
      } catch (error) {
        console.error('[v0] Error fetching vendors:', error);
      } finally {
        setLoadingVendors(false);
      }
    };

    fetchVendors();
  }, [placeId]);

  // Sample place details with vendors
  const placeDetails: Record<number, any> = {
    1: {
      name: 'FEIMA',
      subtitle: 'Craft, Flowers & Food',
      fullDescription:
        'Vibrant market showcasing local crafts, fresh flowers, and traditional Mozambican cuisine. A favorite among locals and tourists seeking authentic experiences.',
      location: 'Av. Marginal',
      hours: '8am - 6pm',
      price: '$$',
      category: '#Market #LocalFood #Crafts',
      verified: true,
      tips: [
        'Visit early morning for the freshest flowers and produce',
        'Haggling is common - negotiate politely for better prices',
        'Try the local pita bread - best from 10am onwards',
      ],
      nearby: [
        { id: 2, name: 'Mercado do Peixe', distance: '0.5km', image: '/images/mercado-peixe.jpg' },
        { id: 3, name: 'Xipamanine Market', distance: '1.2km', image: '/images/xipamanine.jpg' },
      ],
      vendors: [
        {
          id: 1,
          name: 'Rosa\'s Flower Shop',
          description: 'Fresh tropical flowers and bouquets',
          whatsapp: '+258.84.111.1111',
          rating: 4.8,
          reviews: 24,
          photos: ['/images/feima.jpg', '/images/mercado-peixe.jpg', '/images/xipamanine.jpg'],
        },
        {
          id: 2,
          name: 'João Crafts',
          description: 'Handmade traditional crafts and souvenirs',
          whatsapp: '+258.84.222.2222',
          rating: 4.6,
          reviews: 18,
          photos: ['/images/mafalala.jpg', '/images/feima.jpg', '/images/xipamanine.jpg'],
        },
      ],
      reviews: [
        {
          id: 1,
          author: 'Sarah M.',
          rating: 5,
          text: 'Amazing market experience! The flowers are incredibly fresh and the vendors are friendly.',
          timestamp: '2 days ago',
        },
        {
          id: 2,
          author: 'Lucas T.',
          rating: 4,
          text: 'Great place to find local crafts. A bit crowded on weekends but worth the visit.',
          timestamp: '1 week ago',
        },
      ],
    },
    2: {
      name: 'Mercado do Peixe',
      subtitle: 'Fish Market',
      fullDescription:
        'Traditional fish market with freshly caught seafood grilled to perfection. Experience authentic Mozambican coastal cuisine in a lively atmosphere.',
      location: 'Av. Marginal',
      hours: '6am - 4pm',
      price: '$',
      category: '#Market #Seafood #LocalCuisine',
      verified: true,
      tips: [
        'Arrive before 9am for the best selection',
        'Grilling happens live - watch your meal being prepared',
        'Bring cash - most vendors don\'t accept cards',
      ],
      nearby: [
        { id: 1, name: 'FEIMA', distance: '0.5km', image: '/images/feima.jpg' },
        { id: 5, name: 'Tunduru Garden Cafe', distance: '1.5km', image: '/images/tunduru.jpg' },
      ],
      vendors: [
        {
          id: 3,
          name: 'Bairro Seafood Grill',
          description: 'Fresh grilled fish and seafood specialties',
          whatsapp: '+258.84.333.3333',
          rating: 4.9,
          reviews: 42,
          photos: ['/images/mercado-peixe.jpg', '/images/feima.jpg', '/images/xipamanine.jpg'],
        },
        {
          id: 4,
          name: 'Ocean Fresh Catch',
          description: 'Daily fresh fish and traditional preparations',
          whatsapp: '+258.84.444.4444',
          rating: 4.7,
          reviews: 31,
          photos: ['/images/mafalala.jpg', '/images/mercado-peixe.jpg', '/images/feima.jpg'],
        },
      ],
      reviews: [
        {
          id: 3,
          author: 'Emma K.',
          rating: 5,
          text: 'The freshest seafood I\'ve ever had! Grilled right in front of you. Local favorite.',
          timestamp: '3 days ago',
        },
        {
          id: 4,
          author: 'Ahmed H.',
          rating: 5,
          text: 'Authentic experience. Come hungry and bring cash. Absolutely fantastic.',
          timestamp: '1 week ago',
        },
      ],
    },
    3: {
      name: 'Xipamanine Market',
      subtitle: 'Local Market',
      fullDescription:
        'Authentic local market offering everything from fresh produce to handmade textiles. Immerse yourself in daily Maputo life and discover unique souvenirs.',
      location: 'Xipamanine',
      hours: '7am - 5pm',
      price: '$',
      category: '#Market #LocalExperience #Crafts',
      verified: true,
      tips: [
        'Wear comfortable shoes - the market is spread across multiple blocks',
        'Keep valuables secure in busy areas',
        'Learn basic Portuguese phrases - helpful when bargaining',
      ],
      nearby: [
        { id: 1, name: 'FEIMA', distance: '1.2km', image: '/images/feima.jpg' },
        { id: 4, name: 'Estrela Market', distance: '0.8km', image: '/images/estrela.jpg' },
      ],
      vendors: [
        {
          id: 5,
          name: 'Maria\'s Textiles',
          description: 'Traditional fabrics and handwoven textiles',
          whatsapp: '+258.84.555.5555',
          rating: 4.8,
          reviews: 35,
          photos: ['/images/xipamanine.jpg', '/images/mafalala.jpg', '/images/feima.jpg'],
        },
      ],
      reviews: [
        {
          id: 5,
          author: 'Nina P.',
          rating: 4,
          text: 'Authentic local market atmosphere. Great for souvenirs and cultural immersion.',
          timestamp: '5 days ago',
        },
      ],
    },
    4: {
      name: 'Mafalala Walking Tour',
      subtitle: 'Arts & Culture',
      fullDescription:
        'Guided walking tour through the historic Mafalala neighborhood, exploring community murals, street art, and learning about local history and culture.',
      location: 'Mafalala',
      hours: '9am - 4pm',
      price: 'Free',
      category: '#Culture #Art #History',
      verified: true,
      tips: [
        'Book in advance with local guides for best experience',
        'Bring water and sun protection',
        'Engage with local artists - they love sharing their stories',
      ],
      nearby: [
        { id: 4, name: 'Mafalala Arts', distance: '0km', image: '/images/mafalala.jpg' },
        { id: 1, name: 'Central Markets', distance: '2km', image: '/images/feima.jpg' },
      ],
      vendors: [
        {
          id: 6,
          name: 'Mafalala Culture Tours',
          description: 'Guided cultural tours and art experiences',
          whatsapp: '+258.84.666.6666',
          rating: 4.9,
          reviews: 56,
          photos: ['/images/mafalala.jpg', '/images/xipamanine.jpg', '/images/feima.jpg'],
        },
      ],
      reviews: [
        {
          id: 6,
          author: 'David S.',
          rating: 5,
          text: 'Incredible cultural experience. The guides are knowledgeable and passionate.',
          timestamp: '4 days ago',
        },
        {
          id: 7,
          author: 'Lisa M.',
          rating: 5,
          text: 'Best way to understand Maputo\'s history and art scene. Highly recommended!',
          timestamp: '1 week ago',
        },
      ],
    },
  };

  const place = placeDetails[placeId] || placeDetails[1];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero image carousel */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden group">
        {placeId === 1 && (
          <img src="/images/feima.jpg" alt={place.name} className="w-full h-full object-cover" />
        )}
        {placeId === 2 && (
          <img src="/images/mercado-peixe.jpg" alt={place.name} className="w-full h-full object-cover" />
        )}
        {placeId === 3 && (
          <img src="/images/xipamanine.jpg" alt={place.name} className="w-full h-full object-cover" />
        )}
        {placeId === 4 && (
          <img src="/images/mafalala.jpg" alt={place.name} className="w-full h-full object-cover" />
        )}
        {!placeId || (placeId !== 1 && placeId !== 2 && placeId !== 3 && placeId !== 4) && (
          <span className="text-7xl">📍</span>
        )}

        {/* Header overlay */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('discover')}
            className="bg-white/80 hover:bg-white shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (!isAuthenticated) {
                setShowLoginModal(true);
                return;
              }
              setIsSaved(!isSaved);
              if (onSavePlace) {
                onSavePlace(placeId);
              }
            }}
            className="bg-white/80 hover:bg-white shadow-sm"
          >
            <Heart
              className={`w-5 h-5 ${isSaved ? 'fill-primary text-primary' : 'text-foreground'}`}
            />
          </Button>
        </div>


      </div>

      <div className="max-w-sm md:max-w-4xl lg:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        {/* Place header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">{place.name}</h1>
              <p className="text-sm md:text-base text-muted-foreground">{place.subtitle}</p>
            </div>
            {place.verified && (
              <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-full flex-shrink-0 text-xs md:text-sm">
                <VerifiedIcon className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="font-semibold text-accent">
                  {t('ministry-verified')}
                </span>
              </div>
            )}
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">{place.category}</p>
        </div>

        {/* Quick info */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
          <Card className="p-3 text-center">
            <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="text-xs font-semibold text-foreground">{place.hours}</p>
          </Card>
          <Card className="p-3 text-center">
            <DollarSign className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="text-xs font-semibold text-foreground">{place.price}</p>
          </Card>
          <Card 
            onClick={() => {
              const coords = placeCoordinates[placeId];
              if (coords) {
                const encodedName = encodeURIComponent(place.name);
                onNavigate(`map-view-${placeId}_${coords.lat}_${coords.lng}_${encodedName}`);
              }
            }}
            className="p-3 text-center cursor-pointer hover:shadow-md hover:border-primary/50 transition-all"
          >
            <MapPin className="w-4 h-4 mx-auto mb-1 text-primary hover:text-primary/80" />
            <p className="text-xs font-semibold text-foreground text-pretty">{place.location}</p>
          </Card>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-foreground leading-relaxed">{place.fullDescription}</p>
        </div>

        {/* Offline Map Download */}
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex gap-3 flex-1">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-0.5">
                    {t('offline-map') || 'Download Map'}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {t('offline-map-priority') || 'Use this location offline when traveling'}
                  </p>
                </div>
              </div>
            </div>
            <Button
              className={`w-full text-sm ${
                isMapDownloaded
                  ? 'bg-success/20 text-success hover:bg-success/30'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              }`}
              onClick={() => {
                if (isMapDownloaded) return;
                if (!isAuthenticated) {
                  setShowLoginModal(true);
                  return;
                }

                setIsDownloadingMap(true);
                try {
                  // Real-world coordinates for each place
                  const mapCoordinates: Record<number, { lat: number; lng: number }> = {
                    1: { lat: -23.8645, lng: 35.3521 }, // FEIMA
                    2: { lat: -23.8632, lng: 35.3286 }, // Mercado do Peixe
                    3: { lat: -23.8540, lng: 35.3245 }, // Xipamanine
                    4: { lat: -23.8720, lng: 35.3165 }, // Mafalala
                  };

                  const coords = mapCoordinates[placeId] || { lat: -23.86, lng: 35.35 };

                  // Get current downloads
                  const downloaded = localStorage.getItem('downloadedPlaces');
                  const downloadedPlaces = downloaded ? JSON.parse(downloaded) : [];

                  // Check if already downloaded
                  if (downloadedPlaces.some((p: any) => p.placeId === placeId)) {
                    setIsMapDownloaded(true);
                    setIsDownloadingMap(false);
                    return;
                  }

                  // Create new download entry
                  const newDownload = {
                    placeId,
                    placeName: place.name,
                    description: place.fullDescription,
                    location: place.location,
                    image: place.category === 'FEIMA' ? '/images/carousel-1.jpg' : place.category === 'Mercado do Peixe' ? '/images/carousel-3.jpg' : '/images/carousel-2.jpg',
                    latitude: coords.lat,
                    longitude: coords.lng,
                    downloadedAt: Date.now(),
                  };

                  // Save to localStorage
                  downloadedPlaces.push(newDownload);
                  localStorage.setItem('downloadedPlaces', JSON.stringify(downloadedPlaces));
                  setIsMapDownloaded(true);
                  console.log('[v0] Map downloaded:', newDownload.placeId);
                } catch (error) {
                  console.error('[v0] Error downloading map:', error);
                } finally {
                  setIsDownloadingMap(false);
                }
              }}
              disabled={isMapDownloaded}
            >
              {isMapDownloaded ? (
                <>
                  ✓ {t('downloaded') || 'Downloaded'}
                </>
              ) : isDownloadingMap ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  {t('uploading') || 'Downloading...'}
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  {t('offline-map') || 'Download Map'}
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              {t('free-support') || 'No internet required • Saved to your device'}
            </p>
          </div>
        </Card>

        {/* Vendors Section */}
        <div>
          <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            <span>👥</span>
            {t('vendors')}
          </h3>
          {loadingVendors && (
            <p className="text-sm text-muted-foreground mb-4">Loading vendors...</p>
          )}
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scroll-smooth">
            {(apiVendors.length > 0 ? apiVendors : place.vendors) && (apiVendors.length > 0 ? apiVendors : place.vendors).map((vendor: any, idx: number) => (
              <div key={vendor.id || idx} className="flex-shrink-0 w-80">
                <Card className="p-4 border-border hover:shadow-md transition-shadow h-full">
                <div className="flex gap-3 mb-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex-shrink-0 overflow-hidden">
                    {vendor.photos && vendor.photos.length > 0 ? (
                      <img src={vendor.photos[0]} alt={vendor.name || vendor.business_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🏪</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-sm">{vendor.name || vendor.business_name}</h4>
                    <p className="text-xs text-muted-foreground mb-1">{vendor.description}</p>
                    {(vendor.rating || vendor.review_count) && (
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(vendor.rating || 0) ? 'fill-primary text-primary' : 'text-border'}`}
                          />
                        ))}
                      </div>
                      <span className="text-muted-foreground">{vendor.rating || 0} ({vendor.reviews || vendor.review_count || 0})</span>
                    </div>
                    )}
                  </div>
                </div>

                {/* Vendor photos */}
                {vendor.photos && vendor.photos.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">{t('photos')}</p>
                    <div className="flex gap-2">
                      {vendor.photos.slice(0, 3).map((photo: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setExpandedPhoto({ vendorId: vendor.id, photoIndex: i })}
                          className="w-14 h-14 rounded-md overflow-hidden border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group flex-shrink-0"
                        >
                          <img src={photo} alt={`${vendor.name || vendor.business_name} ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* WhatsApp button for vendor */}
                <Button
                  className="w-full bg-success hover:bg-success/90 text-success-foreground text-sm py-2"
                  onClick={() => {
                    if (!isAuthenticated) {
                      setShowLoginModal(true);
                      return;
                    }
                    const vendorName = vendor.name || vendor.business_name;
                    const whatsappNumber = (vendor.whatsapp || vendor.whatsapp_number || '').replace(/[^\d+]/g, '');
                    const message = `Hi ${vendorName}, I'm interested in your offerings at ${place.name}.`;
                    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-1.5" />
                  {t('contact-vendor')}
                </Button>
              </Card>
            </div>
            ))}
          </div>
        </div>

        {/* Expanded Photo Modal */}
        {expandedPhoto && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-sm">
              <Card className="overflow-hidden">
                {/* Close button */}
                <button
                  onClick={() => setExpandedPhoto(null)}
                  className="absolute top-3 right-3 z-10 bg-background/90 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>

                {/* Expanded photo */}
                <div className="relative aspect-square w-full overflow-hidden bg-background">
                  {place.vendors && place.vendors[expandedPhoto.vendorId - 1] && (
                    <img
                      src={place.vendors[expandedPhoto.vendorId - 1].photos[expandedPhoto.photoIndex]}
                      alt="Vendor product"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Navigation and info */}
                <div className="p-4 space-y-3">
                  {place.vendors && place.vendors[expandedPhoto.vendorId - 1] && (
                    <>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {place.vendors[expandedPhoto.vendorId - 1].name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Photo {expandedPhoto.photoIndex + 1} of{' '}
                          {place.vendors[expandedPhoto.vendorId - 1].photos.length}
                        </p>
                      </div>

                      {/* Photo thumbnail navigation */}
                      <div className="flex gap-2">
                        {place.vendors[expandedPhoto.vendorId - 1].photos.slice(0, 3).map((photo: string, i: number) => (
                          <button
                            key={i}
                            onClick={() =>
                              setExpandedPhoto({
                                vendorId: expandedPhoto.vendorId,
                                photoIndex: i,
                              })
                            }
                            className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                              i === expandedPhoto.photoIndex
                                ? 'border-primary'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <img src={photo} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>

                      {/* Close button alternative */}
                      <Button
                        onClick={() => setExpandedPhoto(null)}
                        variant="outline"
                        className="w-full"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back to Vendor
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Nearby gems */}
        <div>
          <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            💎 {t('nearby-gems')}
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scroll-smooth">
            {place.nearby.map((nearby: any, i: number) => (
              <div
                key={i}
                onClick={() => {
                  // In a real app, this would navigate to that place
                  onNavigate(`detail-${nearby.id}`);
                }}
                className="flex-shrink-0 w-40 cursor-pointer group"
              >
                <Card className="overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full flex flex-col bg-card">
                  {/* Image Container */}
                  <div className="relative h-28 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                    <img
                      src={nearby.image}
                      alt={nearby.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  {/* Content Container */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground text-xs line-clamp-2 mb-1">
                        {nearby.name}
                      </h4>
                    </div>

                    {/* Distance Footer */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t border-border/50">
                      <MapPin className="w-3 h-3 flex-shrink-0 text-primary" />
                      <span>{nearby.distance}</span>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Local tips */}
        <div>
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            💬 {t('local-tips')}
          </h3>
          <div className="space-y-2">
            {place.tips.map((tip: string, i: number) => (
              <Card key={i} className="p-3">
                <p className="text-sm text-foreground">{tip}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Reviews & Comments Section */}
        <div>
          <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {t('reviews-comments')}
          </h3>

          {/* Existing reviews */}
          <div className="space-y-3 mb-4">
            {place.reviews && place.reviews.map((review: any) => (
              <Card key={review.id} className="p-4 border-border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{review.author}</p>
                    <p className="text-xs text-muted-foreground">{review.timestamp}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating ? 'fill-primary text-primary' : 'text-border'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-foreground">{review.text}</p>
              </Card>
            ))}
          </div>

          {/* Add review form */}
          <Card className="p-4 border-border">
            <p className="text-sm font-semibold text-foreground mb-3">{t('add-review')}</p>
            
            {/* Rating selector */}
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-2">{t('rating')}</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    onClick={() => setRating(i)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        i <= rating
                          ? 'fill-primary text-primary'
                          : 'fill-border text-border hover:fill-primary/50 hover:text-primary/50'
                      } transition-colors cursor-pointer`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review text input */}
            <div className="mb-3">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={t('write-comment')}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                rows={3}
              />
            </div>

            {/* Submit button */}
            <Button
              disabled={!reviewText.trim() || rating === 0}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => {
                // In a real app, this would submit to a server
                setReviewText('');
                setRating(0);
              }}
            >
              <Send className="w-4 h-4 mr-2" />
              {t('submit-review')}
            </Button>
          </Card>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-3 right-3 z-10 bg-background/90 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors"
              aria-label="Close map"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            {/* Map container */}
            <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-accent/20 relative flex items-center justify-center">
              {/* Placeholder map - in a real app this would be an actual map */}
              <div className="text-center space-y-3">
                <div className="text-5xl">🗺️</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{place.name}</h3>
                  <p className="text-sm text-muted-foreground">{place.location}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Hours: {place.hours}
                  </p>
                </div>
              </div>
            </div>

            {/* Map info footer */}
            <div className="p-4 space-y-3">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Location:</span> {place.location}
              </p>
              <p className="text-sm text-muted-foreground">
                This map shows the location of {place.name}. Open in your device's maps app for detailed directions.
              </p>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => {
                    const coords = placeCoordinates[placeId];
                    if (coords) {
                      const encodedName = encodeURIComponent(place.name);
                      onNavigate(`map-view-${placeId}_${coords.lat}_${coords.lng}_${encodedName}`);
                    }
                  }}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowMap(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
