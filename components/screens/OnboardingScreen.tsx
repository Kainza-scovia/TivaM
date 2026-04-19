'use client';

import { useLanguage } from '@/app/context/LanguageContext';
import { Button } from '@/components/ui/button';

interface OnboardingScreenProps {
  onSelectLanguage: (lang: 'en' | 'pt') => void;
}

export function OnboardingScreen({ onSelectLanguage }: OnboardingScreenProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-background to-blue-50 flex flex-col items-center justify-center px-6">
      {/* Decorative top element */}
      <div className="mb-12 relative">
        <div className="w-24 h-24 rounded-full bg-primary/10 absolute -top-4 -left-4 blur-xl" />
        <div className="w-32 h-32 rounded-full bg-accent/10 absolute -bottom-8 -right-8 blur-2xl" />
        
        <div className="relative z-10 text-center">
          <div className="text-5xl font-bold text-primary mb-3">Tiva</div>
          <div className="text-lg font-medium text-accent mb-2">Maputo</div>
          <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent rounded-full mx-auto" />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-sm w-full space-y-8 text-center">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">{t('discover-title')}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t('discover-subtitle')}
          </p>
        </div>

        {/* Language selection buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={() => onSelectLanguage('en')}
            className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all transform hover:scale-105"
          >
            English
          </Button>
          <Button
            onClick={() => onSelectLanguage('pt')}
            className="w-full py-6 text-lg font-semibold bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition-all transform hover:scale-105"
          >
            Português
          </Button>
        </div>

        {/* Research note */}
        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground italic">
            {t('research-note')}
          </p>
        </div>
      </div>

      {/* Decorative bottom element */}
      <div className="mt-16 w-full max-w-sm h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full" />
    </div>
  );
}
