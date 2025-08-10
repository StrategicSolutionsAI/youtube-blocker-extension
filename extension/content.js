// Content script to bridge communication between web app and extension
console.log('YouTube Blocker: Content script loaded on', window.location.href);

// Add a global indicator that the content script is loaded
window.youtubeBlockerContentScript = true;

// Listen for messages from the web page
window.addEventListener('message', (event) => {
  // Only accept messages from the same origin
  if (event.origin !== window.location.origin) {
    return;
  }

  // Check if it's a YouTube Blocker message
  if (event.data && event.data.type === 'YOUTUBE_BLOCKER_TOGGLE') {
    console.log('YouTube Blocker: Received toggle message', event.data);
    
    // Send message to background script
    chrome.runtime.sendMessage({
      type: 'TOGGLE_BLOCKING',
      isBlocked: event.data.isBlocked
    });
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'BLOCKING_STATE_CHANGED') {
    console.log('YouTube Blocker: Broadcasting state change', message);
    
    // Send message to web page
    window.postMessage({
      type: 'YOUTUBE_BLOCKER_STATE_UPDATE',
      isBlocked: message.isBlocked
    }, window.location.origin);
  }
});

// Request initial state when content script loads
chrome.runtime.sendMessage({ type: 'GET_BLOCKING_STATE' }, (response) => {
  if (response) {
    window.postMessage({
      type: 'YOUTUBE_BLOCKER_STATE_UPDATE',
      isBlocked: response.isBlocked
    }, window.location.origin);
  }
});
