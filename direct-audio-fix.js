/**
 * DIRECT AUDIO FIX - Bypasses ImpactJS sound system entirely
 * Creates HTML5 Audio elements and hooks into game events
 */
(function() {
    'use strict';
    
    console.log('🔊 DIRECT AUDIO FIX Loading...');
    
    // Pre-load audio files as HTML5 Audio
    var explosionSound = new Audio('media/sounds/explosion.mp3');
    var shootSound = new Audio('media/sounds/plasma-burst.mp3');
    var music = new Audio('media/music/xtype.mp3');
    
    explosionSound.volume = 1.0;  // Full volume for effects
    shootSound.volume = 1.0;      // Full volume for effects
    music.volume = 0.4;            // 30% volume for background music
    music.loop = true;
    
    var initialized = false;
    var soundsEnabled = true;
    
    // Initialize on first interaction
    function initAudio() {
        if (initialized) return;
        initialized = true;
        
        console.log('🎵 Initializing direct audio...');
        
        // Unlock all audio
        [explosionSound, shootSound, music].forEach(function(audio) {
            audio.play().then(function() {
                audio.pause();
                audio.currentTime = 0;
                console.log('✓ Audio unlocked');
            }).catch(function(e) {
                console.log('⚠️ Unlock failed:', e.message);
            });
        });
        
        // Start music
        setTimeout(function() {
            if (soundsEnabled) {
                music.play().catch(function(e) {
                    console.log('Music autoplay blocked:', e.message);
                });
            }
        }, 1000);
    }
    
    // Hook into game to play sounds
    function hookGameSounds() {
        // Wait for game to load
        var checkInterval = setInterval(function() {
            if (window.ig && window.ig.game) {
                clearInterval(checkInterval);
                console.log('✓ Game detected, hooking sounds...');
                
                // Override the play method on all Sound objects
                if (window.ig.Sound && window.ig.Sound.prototype) {
                    var originalPlay = window.ig.Sound.prototype.play;
                    window.ig.Sound.prototype.play = function() {
                        if (!soundsEnabled) return;
                        
                        // Check which sound this is
                        if (this.path && this.path.indexOf('explosion') !== -1) {
                            console.log('🔊 Playing explosion');
                            explosionSound.currentTime = 0;
                            explosionSound.play().catch(function(e) {
                                console.log('Explosion play error:', e.message);
                            });
                        } else if (this.path && this.path.indexOf('plasma') !== -1) {
                            console.log('🔊 Playing shoot');
                            shootSound.currentTime = 0;
                            shootSound.play().catch(function(e) {
                                console.log('Shoot play error:', e.message);
                            });
                        }
                        
                        // Still call original in case it works
                        try {
                            originalPlay.call(this);
                        } catch(e) {}
                    };
                    console.log('✓ Sound.play() hooked');
                }
                
                // Also force enable ImpactJS sound
                if (window.ig.Sound) {
                    window.ig.Sound.enabled = true;
                    console.log('✓ ig.Sound.enabled = true');
                }
            }
        }, 100);
    }
    
    // Setup mute control
    window.toggleGameSound = function() {
        soundsEnabled = !soundsEnabled;
        
        if (soundsEnabled) {
            music.play();
            console.log('🔊 Sound ENABLED');
        } else {
            music.pause();
            console.log('🔇 Sound MUTED');
        }
        
        return soundsEnabled;
    };
    
    // Initialize on any interaction
    document.addEventListener('touchstart', initAudio, { passive: true, once: true });
    document.addEventListener('click', initAudio, { passive: true, once: true });
    
    // Hook game sounds
    hookGameSounds();
    
    console.log('✓ DIRECT AUDIO FIX Ready');
})();
