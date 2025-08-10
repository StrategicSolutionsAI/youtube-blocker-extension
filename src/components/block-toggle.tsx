"use client";

import React, { useEffect, useState } from "react";

export function BlockToggle() {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial state from localStorage
    const saved = localStorage.getItem('youtube-blocked');
    setIsBlocked(saved === 'true');
    setIsLoading(false);

    // Listen for messages from Chrome extension
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'YOUTUBE_BLOCKER_STATE_UPDATE') {
        console.log('YouTube Blocker Web: Received state update from extension', event.data);
        const newState = event.data.isBlocked;
        setIsBlocked(newState);
        localStorage.setItem('youtube-blocked', String(newState));
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Check if content script is loaded
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).youtubeBlockerContentScript) {
        console.log('YouTube Blocker Web: Content script detected');
        // Request initial state from extension
        window.postMessage({
          type: 'YOUTUBE_BLOCKER_GET_STATE'
        }, window.location.origin);
      } else {
        console.log('YouTube Blocker Web: Content script NOT detected - extension may not be loaded');
      }
    }, 1000);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleToggle = () => {
    const newState = !isBlocked;
    setIsBlocked(newState);
    
    console.log('YouTube Blocker Web: Toggle changed to', newState);
    
    // Store in localStorage
    localStorage.setItem('youtube-blocked', String(newState));
    
    // Send message to Chrome extension via content script
    window.postMessage({
      type: 'YOUTUBE_BLOCKER_TOGGLE',
      isBlocked: newState
    }, window.location.origin);

    // Fallback: Also try direct Chrome storage if available (for development/local testing)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const chromeObj = (window as any)?.chrome;
      if (chromeObj?.storage?.local?.set) {
        console.log('YouTube Blocker Web: Fallback - trying direct Chrome storage');
        chromeObj.storage.local.set({ 'youtube-blocked': String(newState) });
      }
    } catch (error) {
      console.log('YouTube Blocker Web: Direct Chrome storage not available', error);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 sm:p-6 border border-amber-100 rounded-xl bg-gradient-to-br from-white to-amber-50/30 shadow-lg shadow-amber-100/20 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-amber-100/30">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg sm:text-xl text-gray-800 mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
          YouTube Blocking
        </h3>
        <p className="text-sm sm:text-base text-gray-600 font-medium">
          {isBlocked ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Currently blocked
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Currently allowed
            </span>
          )}
        </p>
      </div>
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`relative inline-flex h-7 w-14 sm:h-8 sm:w-16 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-400/30 shadow-lg ${
          isBlocked 
            ? "bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/25" 
            : "bg-gradient-to-r from-green-500 to-green-600 shadow-green-500/25"
        } hover:scale-105 flex-shrink-0`}
      >
        <span
          className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ${
            isBlocked ? "translate-x-8 sm:translate-x-9" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
