'use client';

import { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from '@/app/context/LanguageContext';
import { useAuth } from '@/app/context/AuthContext';
import { LoginModal } from '@/components/LoginModal';
import { BottomNavigation } from '@/components/BottomNavigation';
import { OnboardingScreen } from '@/components/screens/OnboardingScreen';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { DiscoverScreen } from '@/components/screens/DiscoverScreen';
import { PlaceDetailScreen } from '@/components/screens/PlaceDetailScreen';
import { OfflineMapScreen } from '@/components/screens/OfflineMapScreen';
import { VendorPortalScreen } from '@/components/screens/VendorPortalScreen';
import { VendorListScreen } from '@/components/screens/VendorListScreen';
import { SavedProfileScreen } from '@/components/screens/SavedProfileScreen';
import { DownloadsScreen } from '@/components/screens/DownloadsScreen';
import { UnifiedMapScreen } from '@/components/screens/UnifiedMapScreen';

type Screen = 'onboarding' | 'home' | 'discover' | 'map' | 'saved' | 'vendor' | 'downloads' | string;

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [savedPlaceIds, setSavedPlaceIds] = useState<number[]>([]);
  const { setLanguage, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ action: string; params?: any } | null>(null);

  // Close LoginModal when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && showLoginModal) {
      setShowLoginModal(false);
    }
  }, [isAuthenticated, showLoginModal]);

  // Skip onboarding and go to home if user is authenticated
  useEffect(() => {
    if (isAuthenticated && currentScreen === 'onboarding') {
      // If language is not set, set default to English
      if (!language) {
        setLanguage('en');
      }
      // Go to home screen
      setCurrentScreen('home');
    }
  }, [isAuthenticated, currentScreen, language, setLanguage]);

  // Load saved places from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedPlaces');
    if (saved) {
      try {
        setSavedPlaceIds(JSON.parse(saved));
      } catch (e) {
        console.error('[v0] Error parsing saved places:', e);
      }
    }
  }, []);

  // Save to localStorage whenever savedPlaceIds changes
  useEffect(() => {
    localStorage.setItem('savedPlaces', JSON.stringify(savedPlaceIds));
  }, [savedPlaceIds]);

  const handleLanguageSelect = (lang: 'en' | 'pt') => {
    setLanguage(lang);
    setCurrentScreen('home');
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleProtectedAction = (action: string, params?: any) => {
    if (!isAuthenticated) {
      setPendingAction({ action, params });
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  const handleSavePlace = (placeId: number) => {
    setSavedPlaceIds((prev) =>
      prev.includes(placeId)
        ? prev.filter((id) => id !== placeId)
        : [...prev, placeId]
    );
  };

  // Determine which component to render
  let screenComponent = null;

  if (currentScreen === 'onboarding') {
    screenComponent = <OnboardingScreen onSelectLanguage={handleLanguageSelect} />;
  } else if (currentScreen === 'home') {
    screenComponent = <HomeScreen onNavigate={handleNavigate} />;
  } else if (currentScreen === 'discover') {
    screenComponent = <DiscoverScreen onNavigate={handleNavigate} />;
  } else if (currentScreen === 'map') {
    screenComponent = <OfflineMapScreen onNavigate={handleNavigate} />;
  } else if (currentScreen === 'saved') {
    screenComponent = <SavedProfileScreen onNavigate={handleNavigate} savedPlaceIds={savedPlaceIds} onUnsavePlace={(placeId) => handleSavePlace(placeId)} />;
  } else if (currentScreen === 'downloads') {
    screenComponent = <DownloadsScreen onNavigate={handleNavigate} />;
  } else if (currentScreen === 'vendor') {
    screenComponent = <VendorListScreen onNavigate={handleNavigate} />;
  } else if (currentScreen === 'vendor-form') {
    screenComponent = <VendorPortalScreen onNavigate={handleNavigate} />;
  } else if (currentScreen.startsWith('map-view-')) {
    // Parse map-view-{placeId}_{latitude}_{longitude}_{placeName}
    const mapViewPart = currentScreen.substring(9); // Remove 'map-view-'
    const parts = mapViewPart.split('_');
    const placeId = parseInt(parts[0]);
    const latitude = parseFloat(parts[1]);
    const longitude = parseFloat(parts[2]);
    const placeName = decodeURIComponent(parts.slice(3).join('_'));
    screenComponent = <UnifiedMapScreen placeName={placeName} latitude={latitude} longitude={longitude} onNavigate={handleNavigate} />;
  } else if (currentScreen.startsWith('detail-')) {
    const placeId = parseInt(currentScreen.split('-')[1]);
    screenComponent = <PlaceDetailScreen placeId={placeId} onNavigate={handleNavigate} isSaved={savedPlaceIds.includes(placeId)} onSavePlace={handleSavePlace} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Layout */}
      <div className="md:hidden flex-1 flex flex-col w-full bg-background">
        <div className="flex-1 overflow-y-auto pb-20">
          {screenComponent}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex md:flex-col items-center justify-center flex-1 min-h-screen bg-background">
        <div className="w-full max-w-sm bg-background shadow-lg rounded-2xl overflow-hidden flex flex-col max-h-screen">
          <div className="relative bg-background flex-1 overflow-y-auto pb-20">
            {screenComponent}
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Consistent across all pages */}
      <BottomNavigation currentScreen={currentScreen} onNavigate={handleNavigate} />

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setPendingAction(null);
        }}
      />
    </div>
  );
}

export default function Page() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
