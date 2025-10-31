// ========================================
// MOBILE AUDIO FIX FOR STAR BLASTER
// ========================================
// This file MUST load AFTER xtype.js
// Overrides the mobile sound disable

(function() {
    'use strict';
    
    console.log('🎵 MOBILE AUDIO FIX LOADED');
    
    // IMMEDIATE: Force enable sound
    if (window.ig && window.ig.Sound) {
        window.ig.Sound.enabled = true;
        console.log('✓ ig.Sound.enabled = true (immediate)');
    }
    
    // Wait for game initialization
    var attempts = 0;
    var maxAttempts = 100;
    
    var initInterval = setInterval(function() {
        attempts++;
        
        // Force enable sound
        if (window.ig && window.ig.Sound) {
            if (!window.ig.Sound.enabled) {
                window.ig.Sound.enabled = true;
                console.log('✓ Re-enabled sound (attempt ' + attempts + ')');
            }
        }
        
        // Check if soundManager is initialized
        if (window.ig && window.ig.soundManager) {
            console.log('✓ soundManager detected');
            
            // Check if it has a format (means it initialized properly)
            if (!window.ig.soundManager.format) {
                console.error('⚠️ soundManager.format is NULL - recreating soundManager');
                
                // Recreate soundManager
                if (window.ig.SoundManager) {
                    window.ig.Sound.enabled = true;
                    window.ig.soundManager = new window.ig.SoundManager();
                    console.log('✓ soundManager recreated');
                    console.log('   Format:', window.ig.soundManager.format);
                }
            } else {
                console.log('✓ soundManager format:', window.ig.soundManager.format);
            }
            
            // Ensure volume is at 100%
            window.ig.soundManager.volume = 1.0;
        }
        
        // Check if music is initialized  
        if (window.ig && window.ig.music) {
            console.log('✓ music system detected');
            window.ig.music.volume = 1.0;
        }
        
        // Stop after max attempts or when everything is ready
        if (attempts >= maxAttempts || 
            (window.ig && window.ig.Sound && window.ig.Sound.enabled && 
             window.ig.soundManager && window.ig.soundManager.format)) {
            
            clearInterval(initInterval);
            console.log('✓ MOBILE AUDIO FIX COMPLETE');
            
            // Final diagnostic
            if (window.ig) {
                console.log('=== FINAL AUDIO STATE ===');
                console.log('ig.Sound.enabled:', window.ig.Sound ? window.ig.Sound.enabled : 'N/A');
                console.log('soundManager.format:', window.ig.soundManager ? window.ig.soundManager.format : 'N/A');
                console.log('soundManager.volume:', window.ig.soundManager ? window.ig.soundManager.volume : 'N/A');
                console.log('music.volume:', window.ig.music ? window.ig.music.volume : 'N/A');
                
                // Test audio support
                var audio = new Audio();
                console.log('MP3 support:', audio.canPlayType('audio/mpeg'));
                console.log('OGG support:', audio.canPlayType('audio/ogg; codecs=vorbis'));
                console.log('========================');
            }
        }
    }, 100);
    
    // Also add user interaction handler for iOS
    var audioUnlocked = false;
    function unlockAudio() {
        if (audioUnlocked) return;
        
        console.log('🎵 User interaction detected - unlocking audio');
        audioUnlocked = true;
        
        // Force enable
        if (window.ig && window.ig.Sound) {
            window.ig.Sound.enabled = true;
        }
        
        // Try to play/pause all audio clips
        if (window.ig && window.ig.soundManager && window.ig.soundManager.clips) {
            for (var path in window.ig.soundManager.clips) {
                var channels = window.ig.soundManager.clips[path];
                for (var i = 0; i < channels.length; i++) {
                    try {
                        var audio = channels[i];
                        audio.muted = false;
                        audio.volume = 1.0;
                        audio.play().then(function() {
                            audio.pause();
                            audio.currentTime = 0;
                        }).catch(function() {});
                    } catch(e) {}
                }
            }
        }
        
        // Try to play/pause music
        if (window.ig && window.ig.music && window.ig.music.tracks) {
            for (var i = 0; i < window.ig.music.tracks.length; i++) {
                try {
                    var track = window.ig.music.tracks[i];
                    track.muted = false;
                    track.volume = 1.0;
                    track.play().then(function() {
                        track.pause();
                        track.currentTime = 0;
                    }).catch(function() {});
                } catch(e) {}
            }
        }
        
        console.log('✓ Audio unlock attempted');
        
        // Remove listeners
        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('touchend', unlockAudio);
        document.removeEventListener('click', unlockAudio);
    }
    
    // Add unlock listeners
    document.addEventListener('touchstart', unlockAudio, { passive: true });
    document.addEventListener('touchend', unlockAudio, { passive: true });
    document.addEventListener('click', unlockAudio, { passive: true });
    
})();
