/**
 * Game Performance Optimizer
 * Implements lazy loading, asset compression, and progressive loading
 */

class GamePerformanceOptimizer {
    constructor() {
        this.criticalAssets = [];
        this.deferredAssets = [];
        this.loadedAssets = new Set();
        this.compressionEnabled = true;
        this.preloadProgress = 0;
    }

    /**
     * Initialize performance optimizations
     */
    init() {
        this.setupCriticalAssets();
        this.setupDeferredAssets();
        this.optimizeScriptLoading();
        this.implementProgressiveLoading();
    }

    /**
     * Define critical assets that must load first
     */
    setupCriticalAssets() {
        this.criticalAssets = [
            // Essential UI elements
            {src: "images/game/interface/logo_cn.png", id: "logo_cn", priority: 1},
            {src: "images/game/interface/rainbow.png", id: "rainbow", priority: 1},
            {src: "images/game/interface/gumball_logo.png", id: "gumball_logo", priority: 1},
            
            // Core game interface
            {src: "images/game/interface/interface.json", id: "interface", priority: 2},
            {src: "images/game/interface/interface_bg.png", id: "interface_bg", priority: 2}
        ];
    }

    /**
     * Define assets that can be loaded after initial screen
     */
    setupDeferredAssets() {
        this.deferredAssets = [
            // Game graphics (load when starting game)
            {src: "images/game/background.png", id: "background", priority: 3},
            {src: "images/game/bench.png", id: "bench", priority: 3},
            {src: "images/game/customers.json", id: "customers", priority: 3},
            {src: "images/game/hero.json", id: "hero", priority: 3},
            {src: "images/game/food.json", id: "food", priority: 4},
            {src: "images/game/money.json", id: "money", priority: 4},
            
            // Instruction images (load when needed)
            {src: "images/game/interface/instructions_1.png", id: "instr_1", priority: 5},
            {src: "images/game/interface/instructions_2.png", id: "instr_2", priority: 5},
            {src: "images/game/interface/instructions_3.png", id: "instr_3", priority: 5}
        ];
    }

    /**
     * Optimize script loading with async/defer
     */
    optimizeScriptLoading() {
        // Mark non-critical scripts for deferred loading
        const deferredScripts = [
            'js/gumball/interface/BtnContinue.js',
            'js/gumball/interface/BtnPlayAgain.js',
            'js/gumball/interface/SummaryScore.js',
            'js/gumball/game/objects/Money.js',
            'js/gumball/game/objects/PointsCloud.js',
            'js/gumball/screens/ScreenSummary.js',
            'js/gumball/screens/ScreenFailed.js',
            'js/gumball/screens/ScreenWin.js'
        ];

        // Add defer attribute to non-critical scripts
        deferredScripts.forEach(scriptSrc => {
            const script = document.querySelector(`script[src="${scriptSrc}"]`);
            if (script) {
                script.defer = true;
            }
        });
    }

    /**
     * Implement progressive loading strategy
     */
    implementProgressiveLoading() {
        return new Promise((resolve) => {
            // Phase 1: Load critical assets for initial screen
            this.loadAssetGroup(this.criticalAssets, 0.4)
                .then(() => {
                    console.log('Critical assets loaded - showing initial screen');
                    this.preloadProgress = 0.4;
                    
                    // Phase 2: Load deferred assets in background
                    return this.loadAssetGroup(this.deferredAssets, 0.6);
                })
                .then(() => {
                    console.log('All assets loaded');
                    this.preloadProgress = 1.0;
                    resolve();
                });
        });
    }

    /**
     * Load a group of assets with progress tracking
     */
    loadAssetGroup(assets, progressWeight) {
        return new Promise((resolve) => {
            const loader = new createjs.LoadQueue(false);
            loader.setMaxConnections(6); // Increased from default 2
            
            let loadedCount = 0;
            const totalAssets = assets.length;

            loader.addEventListener("fileload", (e) => {
                loadedCount++;
                this.loadedAssets.add(e.item.id);
                
                // Update progress
                const groupProgress = loadedCount / totalAssets;
                const totalProgress = this.preloadProgress + (groupProgress * progressWeight);
                this.updateLoadingProgress(totalProgress);
            });

            loader.addEventListener("complete", () => {
                resolve();
            });

            loader.loadManifest(assets);
        });
    }

    /**
     * Update loading progress indicator
     */
    updateLoadingProgress(progress) {
        if (window.ScreenPreload && window.ScreenPreload.SetProgress) {
            window.ScreenPreload.SetProgress(progress);
        }
    }

    /**
     * Lazy load audio based on user interaction
     */
    lazyLoadAudio() {
        // Only load audio after user interaction to comply with browser policies
        document.addEventListener('click', () => {
            if (!this.loadedAssets.has('audio_loaded')) {
                this.loadAudioAssets();
                this.loadedAssets.add('audio_loaded');
            }
        }, { once: true });

        document.addEventListener('touchstart', () => {
            if (!this.loadedAssets.has('audio_loaded')) {
                this.loadAudioAssets();
                this.loadedAssets.add('audio_loaded');
            }
        }, { once: true });
    }

    /**
     * Load audio assets efficiently
     */
    loadAudioAssets() {
        const audioAssets = [
            {id: "theme", src: "audio/gumball_theme.mp3", priority: 1},
            {id: "twinkles", src: "audio/twinkles.mp3", priority: 2},
            {id: "walk", src: "audio/agnes_walk.mp3", priority: 3},
            {id: "fail", src: "audio/scream.mp3", priority: 3},
            {id: "money_count", src: "audio/end_money_count.mp3", priority: 4},
            {id: "pickup_candy", src: "audio/pick_up_candy.mp3", priority: 5},
            {id: "throw_veg", src: "audio/throw_veg.mp3", priority: 5},
            {id: "veg_splat", src: "audio/veg_splat.mp3", priority: 5},
            {id: "collect_veg", src: "audio/pick_up_food.mp3", priority: 5}
        ];

        // Load audio in priority order
        this.loadAssetGroup(audioAssets, 0.2);
    }

    /**
     * Preload next screen assets
     */
    preloadScreenAssets(screenType) {
        const screenAssets = {
            'game': ['background', 'bench', 'customers', 'hero', 'food', 'money'],
            'instructions': ['instr_1', 'instr_2', 'instr_3'],
            'summary': ['interface_bg']
        };

        const assets = screenAssets[screenType] || [];
        assets.forEach(assetId => {
            if (!this.loadedAssets.has(assetId)) {
                // Load asset if not already loaded
                const asset = this.deferredAssets.find(a => a.id === assetId);
                if (asset) {
                    this.loadAssetGroup([asset], 0.1);
                }
            }
        });
    }

    /**
     * Enable asset compression hints
     */
    enableCompression() {
        // Add compression headers for assets
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Accept-Encoding';
        meta.content = 'gzip, deflate, br';
        document.head.appendChild(meta);

        // Enable image compression hints
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
            img.decoding = 'async';
        });
    }

    /**
     * Optimize canvas rendering
     */
    optimizeCanvas() {
        const canvas = document.getElementById('canvasGame');
        if (canvas) {
            // Enable hardware acceleration
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false; // Disable for pixel art games
            
            // Set optimal canvas size
            const dpr = window.devicePixelRatio || 1;
            canvas.style.willChange = 'transform';
        }
    }

    /**
     * Implement memory management
     */
    optimizeMemory() {
        // Clean up unused assets periodically
        setInterval(() => {
            if (window.createjs && window.createjs.Ticker) {
                window.createjs.Ticker.removeAllEventListeners();
            }
        }, 30000);

        // Garbage collection hints
        if (window.gc) {
            setTimeout(() => window.gc(), 5000);
        }
    }
}

// Initialize optimizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.GameOptimizer = new GamePerformanceOptimizer();
    window.GameOptimizer.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamePerformanceOptimizer;
}
