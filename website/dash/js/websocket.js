if (typeof window.API_URL === 'undefined') {
    window.API_URL = 'https://asce-f5us.onrender.com';
}

let ws = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 2000;
const HEARTBEAT_INTERVAL = 30000;
let heartbeatTimer = null;
let isUpdatingFromServer = false;

function connectWebSocket() {
    if (!localStorage.getItem('token')) return;
    
    const token = localStorage.getItem('token');
    
    const wsUrl = window.API_URL.replace('https://', 'wss://').replace('http://', 'ws://') + `?token=${token}`;
    
    console.log('[WS] Connecting to:', wsUrl);
    updateConnectionStatus(false);
    
    try {
        ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
            console.log('[WS] Connected');
            reconnectAttempts = 0;
            updateConnectionStatus(true);
            startHeartbeat();
        };
        
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                handleWebSocketMessage(data);
            } catch (error) {
                console.error('[WS] Message parse error:', error);
            }
        };
        
        ws.onerror = (error) => {
            console.error('[WS] Error:', error);
            updateConnectionStatus(false);
        };
        
        ws.onclose = () => {
            console.log('[WS] Disconnected');
            updateConnectionStatus(false);
            stopHeartbeat();
            
            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                reconnectAttempts++;
                console.log(`[WS] Reconnecting in ${RECONNECT_DELAY/1000}s (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
                setTimeout(connectWebSocket, RECONNECT_DELAY);
            } else {
                console.error('[WS] Max reconnection attempts reached');
            }
        };
    } catch (error) {
        console.error('[WS] Connection error:', error);
        updateConnectionStatus(false);
    }
}

function handleWebSocketMessage(data) {
    console.log('[WS] Message received:', data.type);
    
    switch(data.type) {
        case 'connected':
            console.log('[WS]', data.message);
            break;
            
        case 'settings_updated':
            console.log('[WS] Settings updated from server:', data.settings);
            isUpdatingFromServer = true;
            
            if (window.currentConfig) {
                Object.assign(window.currentConfig, data.settings);
                if (typeof applySettings === 'function') {
                    applySettings(window.currentConfig);
                }
            }
            
            setTimeout(() => {
                isUpdatingFromServer = false;
            }, 100);
            break;
            
        case 'agent_heartbeat':
            if (data.data) {
                updateConnectionStatus(true);
            }
            break;
            
        case 'heartbeat_ack':
            break;
            
        case 'license_revoked':
            alert('Your license has been revoked. Please activate with a new license key.');
            window.location.href = 'auth.html';
            break;
            
        default:
            console.log('[WS] Unknown message type:', data.type);
    }
}

function startHeartbeat() {
    stopHeartbeat();
    
    heartbeatTimer = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            try {
                ws.send(JSON.stringify({ type: 'heartbeat' }));
            } catch (error) {
                console.error('[WS] Heartbeat send error:', error);
            }
        }
    }, HEARTBEAT_INTERVAL);
}

function stopHeartbeat() {
    if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
    }
}

function updateConnectionStatus(connected) {
    const dot = document.getElementById('connectionDot');
    const text = document.getElementById('connectionText');
    
    if (dot && text) {
        if (connected) {
            dot.style.background = '#0f0';
            dot.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
            text.textContent = 'connected';
        } else {
            dot.style.background = '#f00';
            dot.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.5)';
            text.textContent = 'not connected';
        }
    }
}

async function syncSettings() {
    try {
        const response = await fetch(`${window.API_URL}/api/agent/settings`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            console.error('[SYNC] Failed to load settings:', response.status);
            return;
        }
        
        const settings = await response.json();
        console.log('[SYNC] Settings loaded from server:', settings);
        
        isUpdatingFromServer = true;
        
        if (window.currentConfig !== undefined) {
            window.currentConfig = { ...settings };
        }
        
        if (typeof applySettings === 'function') {
            applySettings(settings);
        }
        
        setTimeout(() => {
            isUpdatingFromServer = false;
        }, 100);
        
    } catch (error) {
        console.error('[SYNC] Error:', error);
    }
}

function disconnectWebSocket() {
    if (ws) {
        ws.close();
        ws = null;
    }
    stopHeartbeat();
}

if (typeof window !== 'undefined') {
    window.connectWebSocket = connectWebSocket;
    window.disconnectWebSocket = disconnectWebSocket;
    window.syncSettings = syncSettings;
    window.isUpdatingFromServer = () => isUpdatingFromServer;
}
