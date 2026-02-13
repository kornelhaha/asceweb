window.API_URL = 'https://asce-f5us.onrender.com';

window.currentUser = null;
window.currentConfig = {};
window.pendingUpdates = {};
window.lastSentConfig = {};
window.saveTimeout = null;
window.isUpdatingFromServer = false;
window.SAVE_DEBOUNCE_MS = 500;

async function init() {
    try {
        await loadUserProfile();
        await loadSettings();
        connectWebSocket();
    } catch (error) {
        console.error('Init error:', error);
    }
}

window.addEventListener('load', init);
