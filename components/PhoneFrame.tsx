'use client';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="w-screen h-screen overflow-auto flex items-center justify-center bg-blue-50 p-4">
      {/* Phone Container */}
      <div className="relative w-full max-w-sm flex-shrink-0">
        {/* Phone Body */}
        <div className="bg-black rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-black">
          {/* Screen Area */}
          <div className="relative bg-white">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-50 flex items-center justify-center">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                <div className="flex-1"></div>
                <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="h-8 bg-white flex items-center justify-between px-4 pt-1 text-xs font-semibold text-black">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                </svg>
                {/* SIM Card Bar */}
                <div className="w-4 h-3 border border-black rounded-sm flex items-center justify-center">
                  <div className="w-2 h-1.5 bg-black rounded-sm"></div>
                </div>
                <svg className="w-4 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C21 4.6 20.4 4 19.67 4zm-.34 16H8.67V5.33h6.66v14.67z"/>
                </svg>
              </div>
            </div>

            {/* App Content - with proper scrolling inside */}
            <div className="w-full h-[620px] overflow-y-auto overflow-x-hidden bg-background flex flex-col">
              {children}
            </div>

            {/* Home Indicator */}
            <div className="h-6 bg-black flex items-end justify-center pb-1">
              <div className="w-32 h-1 bg-gray-800 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Speaker Grille (top) */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-gray-800 rounded-full shadow-lg"></div>
      </div>
    </div>
  );
}
