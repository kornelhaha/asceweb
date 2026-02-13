window.API_URL = 'https://asce-f5us.onrender.com';

let currentUser = null;
let currentConfig = {};
let pendingUpdates = {};
let lastSentConfig = {};
let saveTimeout = null;
let isUpdatingFromServer = false;
const SAVE_DEBOUNCE_MS = 500;

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
