
/**
 * Image Optimization Runtime
 */

// WebP Support Detection
function supportsWebP() {
    return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            resolve(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

// Add WebP class to document
supportsWebP().then(supported => {
    document.documentElement.classList.add(supported ? 'webp' : 'no-webp');
});

// Lazy Loading Implementation
class LazyImageLoader {
    constructor() {
        this.images = [];
        this.observer = null;
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            this.setupLazyImages();
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }
    }
    
    setupLazyImages() {
        const lazyImages = document.querySelectorAll('[data-src]');
        lazyImages.forEach(img => {
            this.observer.observe(img);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        }
    }
    
    loadAllImages() {
        const lazyImages = document.querySelectorAll('[data-src]');
        lazyImages.forEach(img => this.loadImage(img));
    }
}

// Image Preloading for Critical Assets
class ImagePreloader {
    constructor() {
        this.criticalImages = [
            'images/game/interface/logo_cn.png',
            'images/game/interface/rainbow.png',
            'images/game/interface/gumball_logo.png'
        ];
        this.preloadedImages = new Set();
    }
    
    preloadCritical() {
        this.criticalImages.forEach(src => {
            if (!this.preloadedImages.has(src)) {
                const img = new Image();
                img.onload = () => {
                    this.preloadedImages.add(src);
                    console.log('Preloaded:', src);
                };
                img.src = src;
            }
        });
    }
    
    preloadGameAssets() {
        const gameImages = [
            'images/game/background.png',
            'images/game/bench.png',
            'images/game/customers.png',
            'images/game/hero.png'
        ];
        
        // Preload with delay to not block critical loading
        setTimeout(() => {
            gameImages.forEach(src => {
                if (!this.preloadedImages.has(src)) {
                    const img = new Image();
                    img.onload = () => {
                        this.preloadedImages.add(src);
                    };
                    img.src = src;
                }
            });
        }, 1000);
    }
}

// Initialize optimizations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const lazyLoader = new LazyImageLoader();
    const preloader = new ImagePreloader();
    
    preloader.preloadCritical();
    
    // Preload game assets after initial load
    window.addEventListener('load', () => {
        preloader.preloadGameAssets();
    });
});

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ImageOptimization = {
        LazyImageLoader,
        ImagePreloader,
        supportsWebP
    };
}
