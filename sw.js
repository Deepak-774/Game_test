/**
 * Service Worker for Game Asset Caching
 * Implements aggressive caching strategy for faster loading
 */

const CACHE_NAME = 'gumball-game-v1.2';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Critical assets to cache immediately
const CRITICAL_ASSETS = [
    '/',
    '/index.html',
    '/index-optimized.html',
    '/css/fonts.css',
    '/css/game.css',
    '/js/libs/createjs-2013.12.12.min.js',
    '/js/libs/jquery-1.11.1.min.js',
    '/js/performance-optimizer.js',
    '/js/gumball/Main.js',
    '/js/gumball/Navigation.js',
    '/images/game/interface/logo_cn.png',
    '/images/game/interface/rainbow.png',
    '/images/game/interface/gumball_logo.png'
];

// Game assets to cache on demand
const GAME_ASSETS = [
    '/images/game/background.png',
    '/images/game/bench.png',
    '/images/game/customers.png',
    '/images/game/hero.png',
    '/images/game/food.png',
    '/images/game/money.png',
    '/images/game/interface/interface.png',
    '/images/game/interface/interface_bg.png'
];

// Audio assets to cache lazily
const AUDIO_ASSETS = [
    '/audio/gumball_theme.mp3',
    '/audio/twinkles.mp3',
    '/audio/agnes_walk.mp3',
    '/audio/scream.mp3',
    '/audio/end_money_count.mp3',
    '/audio/pick_up_candy.mp3',
    '/audio/throw_veg.mp3',
    '/audio/veg_splat.mp3',
    '/audio/pick_up_food.mp3'
];

/**
 * Install event - Cache critical assets
 */
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching critical assets...');
                return cache.addAll(CRITICAL_ASSETS);
            })
            .then(() => {
                console.log('Critical assets cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Failed to cache critical assets:', error);
            })
    );
});

/**
 * Activate event - Clean up old caches
 */
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

/**
 * Fetch event - Implement caching strategy
 */
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Only handle same-origin requests
    if (url.origin !== location.origin) {
        return;
    }
    
    // Determine caching strategy based on resource type
    if (isImageRequest(event.request)) {
        event.respondWith(handleImageRequest(event.request));
    } else if (isAudioRequest(event.request)) {
        event.respondWith(handleAudioRequest(event.request));
    } else if (isJSOrCSSRequest(event.request)) {
        event.respondWith(handleStaticAssetRequest(event.request));
    } else {
        event.respondWith(handleDocumentRequest(event.request));
    }
});

/**
 * Handle image requests with cache-first strategy
 */
async function handleImageRequest(request) {
    try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse && !isExpired(cachedResponse)) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Add timestamp for expiry checking
            const responseToCache = networkResponse.clone();
            responseToCache.headers.set('sw-cached-at', Date.now().toString());
            cache.put(request, responseToCache);
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Image request failed:', error);
        return new Response('Image not available', { status: 404 });
    }
}

/**
 * Handle audio requests with lazy loading
 */
async function handleAudioRequest(request) {
    try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Only fetch audio if user has interacted (to respect autoplay policies)
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Audio request failed:', error);
        return new Response('Audio not available', { status: 404 });
    }
}

/**
 * Handle JS/CSS requests with stale-while-revalidate
 */
async function handleStaticAssetRequest(request) {
    try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        // Return cached version immediately if available
        if (cachedResponse) {
            // Update cache in background
            fetch(request)
                .then(networkResponse => {
                    if (networkResponse.ok) {
                        cache.put(request, networkResponse.clone());
                    }
                })
                .catch(error => console.log('Background update failed:', error));
            
            return cachedResponse;
        }
        
        // If not cached, fetch from network
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Static asset request failed:', error);
        return new Response('Asset not available', { status: 404 });
    }
}

/**
 * Handle document requests with network-first strategy
 */
async function handleDocumentRequest(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Fallback to cache if network fails
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return new Response('Page not available offline', { 
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

/**
 * Utility functions
 */
function isImageRequest(request) {
    return request.destination === 'image' || 
           request.url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i);
}

function isAudioRequest(request) {
    return request.destination === 'audio' || 
           request.url.match(/\.(mp3|wav|ogg|m4a)$/i);
}

function isJSOrCSSRequest(request) {
    return request.destination === 'script' || 
           request.destination === 'style' ||
           request.url.match(/\.(js|css)$/i);
}

function isExpired(response) {
    const cachedAt = response.headers.get('sw-cached-at');
    if (!cachedAt) return false;
    
    const cacheAge = Date.now() - parseInt(cachedAt);
    return cacheAge > CACHE_EXPIRY;
}

/**
 * Background sync for preloading game assets
 */
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'PRELOAD_GAME_ASSETS') {
        preloadGameAssets();
    }
});

async function preloadGameAssets() {
    try {
        const cache = await caches.open(CACHE_NAME);
        
        // Preload game assets in background
        const preloadPromises = GAME_ASSETS.map(async (asset) => {
            const cached = await cache.match(asset);
            if (!cached) {
                try {
                    const response = await fetch(asset);
                    if (response.ok) {
                        await cache.put(asset, response);
                        console.log('Preloaded:', asset);
                    }
                } catch (error) {
                    console.log('Failed to preload:', asset, error);
                }
            }
        });
        
        await Promise.all(preloadPromises);
        console.log('Game assets preloading completed');
    } catch (error) {
        console.error('Game assets preloading failed:', error);
    }
}

/**
 * Periodic cache cleanup
 */
self.addEventListener('periodicsync', event => {
    if (event.tag === 'cache-cleanup') {
        event.waitUntil(cleanupExpiredCache());
    }
});

async function cleanupExpiredCache() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const requests = await cache.keys();
        
        const cleanupPromises = requests.map(async (request) => {
            const response = await cache.match(request);
            if (response && isExpired(response)) {
                await cache.delete(request);
                console.log('Cleaned up expired cache:', request.url);
            }
        });
        
        await Promise.all(cleanupPromises);
        console.log('Cache cleanup completed');
    } catch (error) {
        console.error('Cache cleanup failed:', error);
    }
}
