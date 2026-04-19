'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Star, MessageCircle, Plus } from 'lucide-react';

interface VendorListScreenProps {
  onNavigate: (screen: string) => void;
}

export function VendorListScreen({ onNavigate }: VendorListScreenProps) {
  const { t } = useLanguage();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/vendors');
        if (response.ok) {
          const data = await response.json();
          setVendors(data.vendors || []);
        }
      } catch (error) {
        console.error('[v0] Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div className="w-full bg-background">
      <div className="max-w-sm mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="h-auto p-1"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <h1 className="font-bold text-2xl text-foreground">{t('vendors')}</h1>
        </div>

        {/* Vendors Grid */}
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Loading vendors...</p>
        ) : vendors.length > 0 ? (
          <div className="space-y-3">
            {vendors.map((vendor) => (
              <Card key={vendor.id} className="p-4 border-border hover:shadow-md transition-shadow">
                <div className="flex gap-3">
                  {/* Vendor Image */}
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex-shrink-0 overflow-hidden">
                    {vendor.photos && vendor.photos.length > 0 ? (
                      <img 
                        src={vendor.photos[0]} 
                        alt={vendor.business_name || vendor.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🏪</div>
                    )}
                  </div>

                  {/* Vendor Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm">
                      {vendor.business_name || vendor.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-1">
                      {vendor.business_category || vendor.category}
                    </p>
                    <p className="text-xs text-foreground line-clamp-2 mb-2">
                      {vendor.description}
                    </p>

                    {/* Rating */}
                    {vendor.rating && (
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(vendor.rating)
                                  ? 'fill-primary text-primary'
                                  : 'text-border'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {vendor.rating} ({vendor.review_count || 0})
                        </span>
                      </div>
                    )}

                    {/* Contact Button */}
                    <Button
                      size="sm"
                      className="w-full bg-success hover:bg-success/90 text-success-foreground text-xs py-1 h-7"
                      onClick={() => {
                        const vendorName = vendor.business_name || vendor.name;
                        const whatsappNumber = (vendor.whatsapp_number || vendor.whatsapp || '').replace(/[^\d+]/g, '');
                        if (whatsappNumber) {
                          const message = `Hi ${vendorName}, I'm interested in your offerings.`;
                          window.open(
                            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
                            '_blank'
                          );
                        }
                      }}
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Contact
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {t('no-vendors-yet') || 'No vendors registered yet. Be the first!'}
            </p>
          </Card>
        )}

        {/* Create Profile CTA */}
        <div className="mt-8 space-y-3">
          <div className="border-t border-border pt-6">
            <h2 className="font-bold text-lg text-foreground mb-2">
              {t('become-vendor') || 'Become a Vendor'}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {t('vendor-cta-text') || 'Join our marketplace and showcase your business to travelers. Register your business and gain visibility in your market.'}
            </p>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
              onClick={() => onNavigate('vendor-form')}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('create-profile') || 'Create Your Profile'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
