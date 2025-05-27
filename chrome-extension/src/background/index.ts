import 'webextension-polyfill';
import { themeStorage } from '@extension/storage';

themeStorage.get().then(theme => {
  console.log('theme', theme);
});

console.log('Background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");

// Helper to attach the debugger to the last focused tab and start monitoring
function attachDebuggerToLastFocusedTab() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    if (tabs.length === 0) {
      console.warn('No active tab found.');
      return;
    }

    const tabId = tabs[0].id;

    // Step 1: Attach to the tab
    chrome.debugger.attach({ tabId }, '1.3', () => {
      console.log('Debugger attached to tab:', tabId);
      if (chrome.runtime.lastError) {
        console.error('Attach error:', chrome.runtime.lastError.message);
        return;
      }

      console.log('Debugger attached to tab:', tabId);

      // Step 2: Enable network monitoring
      chrome.debugger.sendCommand({ tabId }, 'Network.enable');

      // Step 3: Listen for network events
      chrome.debugger.onEvent.addListener((source, method, params) => {
        if (source.tabId !== tabId) return;

        if (method === 'Network.requestWillBeSent') {
          console.log('Request sent:', params.request.url);
        }

        if (method === 'Network.responseReceived') {
          console.log('Response received:', params.response.url, params.response.status);
        }
      });
    });
  });
}

// Example: Call this on browser action click
chrome.action.onClicked.addListener(() => {
  attachDebuggerToLastFocusedTab();
});
