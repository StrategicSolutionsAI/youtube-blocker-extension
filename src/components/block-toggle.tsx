"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
      console.log('YouTube Blocker Web: Direct Chrome storage not available');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>YouTube Blocking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {isBlocked ? 'YouTube is blocked' : 'YouTube is accessible'}
          </span>
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
              isBlocked 
                ? "bg-red-600 focus:ring-red-500" 
                : "bg-gray-300 dark:bg-gray-600 focus:ring-gray-500"
            )}
            aria-label={isBlocked ? "Disable YouTube blocking" : "Enable YouTube blocking"}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                isBlocked ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {isBlocked 
            ? "YouTube and related domains are currently blocked"
            : "You can access YouTube normally"}
        </p>
      </CardContent>
    </Card>
  );
}
