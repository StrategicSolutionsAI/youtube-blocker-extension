// Check blocking state from Chrome storage
async function checkBlockingState() {
  try {
    // Get the blocking state from Chrome storage
    const result = await chrome.storage.local.get(['youtube-blocked']);
    const isBlocked = result['youtube-blocked'] === 'true';
    
    console.log('YouTube Blocker: Checking state -', { result, isBlocked });
    
    // Enable or disable the ruleset based on the state
    chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: isBlocked ? ['ruleset_1'] : [],
      disableRulesetIds: isBlocked ? [] : ['ruleset_1']
    });
    
    console.log('YouTube Blocker: Rules updated -', isBlocked ? 'BLOCKING' : 'ALLOWING');
  } catch (error) {
    console.error('Failed to check blocking state:', error);
  }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('YouTube Blocker: Background received message', message);
  
  if (message.type === 'TOGGLE_BLOCKING') {
    // Update storage and rules
    chrome.storage.local.set({ 'youtube-blocked': String(message.isBlocked) }, () => {
      checkBlockingState();
      
      // Notify all tabs about the state change
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          if (tab.url && tab.url.includes('youtube-blocker-tracker.windsurf.build')) {
            chrome.tabs.sendMessage(tab.id, {
              type: 'BLOCKING_STATE_CHANGED',
              isBlocked: message.isBlocked
            }).catch(() => {
              // Tab might not have content script loaded
            });
          }
        });
      });
    });
    
    sendResponse({ success: true });
  } else if (message.type === 'GET_BLOCKING_STATE') {
    chrome.storage.local.get(['youtube-blocked'], (result) => {
      const isBlocked = result['youtube-blocked'] === 'true';
      sendResponse({ isBlocked });
    });
    return true; // Keep message channel open for async response
  }
});

// Listen for storage changes (for manual storage updates)
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes['youtube-blocked']) {
    checkBlockingState();
  }
});

// Check state on startup
checkBlockingState();

// Also check when user navigates to YouTube
chrome.webNavigation.onBeforeNavigate.addListener(
  function(details) {
    if (details.frameId === 0) {
      checkBlockingState();
    }
  },
  { url: [
    { hostContains: 'youtube.com' },
    { hostContains: 'youtu.be' }
  ]}
);
