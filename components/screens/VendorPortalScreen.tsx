'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useAuth } from '@/app/context/AuthContext';
import { LoginModal } from '@/components/LoginModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { PhotoUploadSection } from './PhotoUploadSection';

interface VendorPortalScreenProps {
  onNavigate: (screen: string) => void;
}

export function VendorPortalScreen({ onNavigate }: VendorPortalScreenProps) {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    whatsappNumber: '',
    category: '',
    photos: [] as string[],
  });

  const categories = [
    'FEIMA',
    'Mercado do Peixe',
    'Xipamanine Market',
    'Estrela Market',
    'Mafalala',
    'Tunduru Garden Cafe',
  ];

  const handleNext = () => {
    if (formStep < 3) {
      setFormStep(formStep + 1);
    }
  };

  const handleBack = () => {
    if (formStep > 0) {
      setFormStep(formStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: formData.businessName,
          businessCategory: formData.category,
          whatsappNumber: formData.whatsappNumber,
          description: formData.description,
          photos: formData.photos,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitError(result.error || 'Failed to submit vendor profile');
        return;
      }

      setSubmitSuccess(true);
      setFormStep(4); // Success screen
    } catch (error) {
      console.error('[v0] Submission error:', error);
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = formData.businessName.trim().length > 0 && formData.description.trim().length > 0;
  const isStep2Valid = formData.category.length > 0;
  const isStep3Valid = formData.whatsappNumber.trim().length > 0;
  const isAllValid = isStep1Valid && isStep2Valid && isStep3Valid;

  const stepTitles = [
    t('step1-info'),
    t('step2-category'),
    t('step3-photos'),
    t('step4-review'),
  ];

  return (
    <div className="w-full bg-background p-4">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="h-auto p-1"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <h1 className="font-bold text-lg text-foreground">{t('register-vendor')}</h1>
          <div className="w-5" />
        </div>

        {/* Progress indicator */}
        {formStep < 4 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Step {formStep + 1} of 4
              </span>
              <span>{stepTitles[formStep]}</span>
            </div>
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((formStep + 1) / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 1: Business Information */}
        {formStep === 0 && (
          <Card className="p-6 space-y-4">
            <div>
              <h2 className="font-bold text-lg text-foreground mb-1">{stepTitles[0]}</h2>
              <p className="text-sm text-muted-foreground">
                {t('describe-your-business')}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  {t('business-name')}
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Rosa's Flower Shop"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  {t('business-description')}
                </label>
                <textarea
                  placeholder="Tell us what you sell and what makes your business special..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={4}
                />
              </div>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleNext}
              disabled={!isStep1Valid}
            >
              {t('next')}
            </Button>
          </Card>
        )}

        {/* Step 2: Category Selection */}
        {formStep === 1 && (
          <Card className="p-6 space-y-4">
            <div>
              <h2 className="font-bold text-lg text-foreground mb-1">{stepTitles[1]}</h2>
              <p className="text-sm text-muted-foreground">
                {t('this-determines-visibility')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-semibold ${
                    formData.category === cat
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleBack}
              >
                {t('back')}
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleNext}
                disabled={!isStep2Valid}
              >
                {t('next')}
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Photo Upload */}
        {formStep === 2 && (
          <Card className="p-6 space-y-4">
            <div>
              <h2 className="font-bold text-lg text-foreground mb-1">{stepTitles[2]}</h2>
              <p className="text-sm text-muted-foreground">
                {t('photo-guidelines')}
              </p>
            </div>

            <PhotoUploadSection
              photos={formData.photos}
              onPhotosChange={(photos) =>
                setFormData({ ...formData, photos })
              }
            />

            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">
                {t('whatsapp-label')}
              </label>
              <Input
                type="tel"
                placeholder="+258 84 123 4567"
                value={formData.whatsappNumber}
                onChange={(e) =>
                  setFormData({ ...formData, whatsappNumber: e.target.value })
                }
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {t('whatsapp-required')}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleBack}
              >
                {t('back')}
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleNext}
              >
                {t('next')}
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Review & Submit */}
        {formStep === 3 && (
          <Card className="p-6 space-y-4">
            <div>
              <h2 className="font-bold text-lg text-foreground mb-1">{stepTitles[3]}</h2>
              <p className="text-sm text-muted-foreground">
                Verify your information before submitting
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-3 bg-secondary/20 p-4 rounded-lg">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{t('business-name')}</p>
                <p className="font-semibold text-foreground">{formData.businessName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{t('select-location')}</p>
                <p className="font-semibold text-foreground">{formData.category}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{t('whatsapp-label')}</p>
                <p className="font-semibold text-foreground">{formData.whatsappNumber}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{t('photos')}</p>
                <p className="font-semibold text-foreground">
                  {formData.photos.length} {formData.photos.length === 1 ? 'photo' : 'photos'}
                </p>
              </div>
            </div>

            {/* Photo preview */}
            {formData.photos.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">{t('photos')}</p>
                <div className="grid grid-cols-3 gap-2">
                  {formData.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`Photo ${idx + 1}`}
                      className="w-full aspect-square object-cover rounded-lg border border-border"
                    />
                  ))}
                </div>
              </div>
            )}

            {submitError && (
              <Card className="p-3 bg-destructive/10 border-destructive/30 flex gap-2">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{submitError}</p>
              </Card>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                {t('back')}
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleSubmit}
                disabled={isSubmitting || !isAllValid}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    {t('uploading')}
                  </>
                ) : (
                  t('submit')
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Success Screen */}
        {formStep === 4 && (
          <Card className="p-6 space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
            </div>

            <div>
              <h2 className="font-bold text-lg text-foreground mb-1">{t('success')}</h2>
              <p className="text-sm text-muted-foreground">{t('success-message')}</p>
            </div>

            <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
              <p className="text-sm">
                <span className="font-semibold text-foreground">{formData.businessName}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Now appearing under <span className="font-semibold">{formData.category}</span>
              </p>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => onNavigate('home')}
            >
              {t('view-profile')}
            </Button>
          </Card>
        )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          if (isAuthenticated) {
            setShowLoginModal(false);
          } else {
            onNavigate('home');
          }
        }}
      />
      </div>
    </div>
  );
}
