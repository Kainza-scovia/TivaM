'use client';

type Screen = 'onboarding' | 'home' | 'discover' | 'map' | 'saved' | 'vendor' | 'downloads' | string;

interface BottomNavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function BottomNavigation({ currentScreen, onNavigate }: BottomNavigationProps) {
  const shouldShow =
    currentScreen !== 'onboarding' &&
    !currentScreen.startsWith('detail-') &&
    !currentScreen.startsWith('map-view-') &&
    currentScreen !== 'vendor' &&
    currentScreen !== 'vendor-form';

  if (!shouldShow) return null;

  return (
    <div className="fixed md:static bottom-0 left-0 right-0 w-full bg-card border-t border-border z-40">
      <div className="flex items-center justify-around px-2 md:px-4 py-2 md:py-3">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-0.5 px-2 md:px-3 py-1 md:py-2 rounded-lg transition-colors ${
            currentScreen === 'home'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Home"
        >
          <span className="text-lg md:text-xl">🏠</span>
          <span className="text-[10px] md:text-xs font-medium">Home</span>
        </button>

        <button
          onClick={() => onNavigate('discover')}
          className={`flex flex-col items-center gap-0.5 px-2 md:px-3 py-1 md:py-2 rounded-lg transition-colors ${
            currentScreen === 'discover'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Discover"
        >
          <span className="text-lg md:text-xl">🔍</span>
          <span className="text-[10px] md:text-xs font-medium">Discover</span>
        </button>

        <button
          onClick={() => onNavigate('saved')}
          className={`flex flex-col items-center gap-0.5 px-2 md:px-3 py-1 md:py-2 rounded-lg transition-colors ${
            currentScreen === 'saved'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Saved"
        >
          <span className="text-lg md:text-xl">❤️</span>
          <span className="text-[10px] md:text-xs font-medium">Saved</span>
        </button>

        <button
          onClick={() => onNavigate('downloads')}
          className={`flex flex-col items-center gap-0.5 px-2 md:px-3 py-1 md:py-2 rounded-lg transition-colors ${
            currentScreen === 'downloads'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Downloads"
        >
          <span className="text-lg md:text-xl">⬇️</span>
          <span className="text-[10px] md:text-xs font-medium">Downloads</span>
        </button>

        <button
          onClick={() => onNavigate('vendor')}
          className={`flex flex-col items-center gap-0.5 px-2 md:px-3 py-1 md:py-2 rounded-lg transition-colors ${
            currentScreen === 'vendor'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          title="For Vendors"
        >
          <span className="text-lg md:text-xl">👨‍💼</span>
          <span className="text-[10px] md:text-xs font-medium">profile</span>
        </button>
      </div>
    </div>
  );
}
