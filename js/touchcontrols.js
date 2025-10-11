////////////////////////////////////////////////////////////
// TOUCH CONTROLS
////////////////////////////////////////////////////////////

/*!
 * 
 * TOUCH CONTROLS INITIALIZATION - This is the function that initializes on-screen touch controls
 * 
 */

var touchControlsActive = false;
var leftPressed = false;
var rightPressed = false;
var moveSpeed = 8; // Speed of horizontal movement

// WEBVIEW NUCLEAR OPTION - Multi-touch support
var activePointers = new Map(); // Track multiple simultaneous touches
var globalSafetyHandlers = false; // Flag to prevent duplicate handlers

/*!
 * 
 * INITIALIZE TOUCH CONTROLS - Show controls and setup event listeners
 * 
 */
function initTouchControls() {
    // Initialize touch controls (hidden by default via CSS)
    touchControlsActive = true;
    
    // WEBVIEW NUCLEAR OPTION - Global safety handlers
    setupGlobalSafetyHandlers();
    
    // WEBVIEW NUCLEAR OPTION - Document-level event isolation
    setupDocumentEventBlocking();
    
    // WEBVIEW NUCLEAR OPTION - Canvas-level event blocking
    setupCanvasEventBlocking();
    
    // Setup event listeners for D-Pad buttons
    setupDPadControls();
    
    // Setup event listener for Jump button
    setupJumpControl();
    
    console.log('✅ Touch controls initialized with WEBVIEW NUCLEAR OPTION - Hold buttons for continuous movement');
}

/*!
 * 
 * SETUP D-PAD CONTROLS - WEBVIEW NUCLEAR OPTION - Handle left/right movement
 * 
 */
function setupDPadControls() {
    var btnLeft = document.getElementById('btnLeft');
    var btnRight = document.getElementById('btnRight');
    
    if (!btnLeft || !btnRight) {
        console.error('❌ D-Pad buttons not found!');
        return;
    }
    
    // Apply DOM element style overrides for maximum webview compatibility
    btnLeft.style.touchAction = 'manipulation';
    btnLeft.style.webkitTouchAction = 'manipulation';
    btnLeft.style.msTouchAction = 'manipulation';
    btnLeft.style.pointerEvents = 'auto';
    btnLeft.style.webkitUserSelect = 'none';
    btnLeft.style.userSelect = 'none';
    btnLeft.style.webkitTouchCallout = 'none';
    
    btnRight.style.touchAction = 'manipulation';
    btnRight.style.webkitTouchAction = 'manipulation';
    btnRight.style.msTouchAction = 'manipulation';
    btnRight.style.pointerEvents = 'auto';
    btnRight.style.webkitUserSelect = 'none';
    btnRight.style.userSelect = 'none';
    btnRight.style.webkitTouchCallout = 'none';
    
    // NUCLEAR OPTION EVENT HANDLERS - Multiple event types with maximum prevention
    
    // LEFT BUTTON - Pointer Events (Primary for webview)
    btnLeft.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        leftPressed = true;
        rightPressed = false;
        window.leftPressed = true; // Global backup flag
        btnLeft.classList.add('active');
        console.log('🔥 LEFT POINTER DOWN - FORCE activated');
    }, { passive: false, capture: true });
    
    btnLeft.addEventListener('pointerup', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        leftPressed = false;
        window.leftPressed = false;
        btnLeft.classList.remove('active');
        console.log('🔥 LEFT POINTER UP - FORCE deactivated');
    }, { passive: false, capture: true });
    
    btnLeft.addEventListener('pointercancel', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        leftPressed = false;
        window.leftPressed = false;
        btnLeft.classList.remove('active');
    }, { passive: false, capture: true });
    
    btnLeft.addEventListener('pointerleave', function(e) {
        leftPressed = false;
        window.leftPressed = false;
        btnLeft.classList.remove('active');
    }, { passive: false, capture: true });
    
    // LEFT BUTTON - Touch Events (Backup for webview)
    btnLeft.addEventListener('touchstart', function(e) {
        if (e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        leftPressed = true;
        rightPressed = false;
        window.leftPressed = true;
        btnLeft.classList.add('active');
        console.log('🔥 LEFT TOUCH START - FORCE activated');
    }, { passive: false, capture: true });
    
    btnLeft.addEventListener('touchend', function(e) {
        if (e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        leftPressed = false;
        window.leftPressed = false;
        btnLeft.classList.remove('active');
        console.log('🔥 LEFT TOUCH END - FORCE deactivated');
    }, { passive: false, capture: true });
    
    btnLeft.addEventListener('touchcancel', function(e) {
        if (e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        leftPressed = false;
        window.leftPressed = false;
        btnLeft.classList.remove('active');
    }, { passive: false, capture: true });
    
    // RIGHT BUTTON - Pointer Events (Primary for webview)
    btnRight.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        rightPressed = true;
        leftPressed = false;
        window.rightPressed = true; // Global backup flag
        btnRight.classList.add('active');
        console.log('🔥 RIGHT POINTER DOWN - FORCE activated');
    }, { passive: false, capture: true });
    
    btnRight.addEventListener('pointerup', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        rightPressed = false;
        window.rightPressed = false;
        btnRight.classList.remove('active');
        console.log('🔥 RIGHT POINTER UP - FORCE deactivated');
    }, { passive: false, capture: true });
    
    btnRight.addEventListener('pointercancel', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        rightPressed = false;
        window.rightPressed = false;
        btnRight.classList.remove('active');
    }, { passive: false, capture: true });
    
    btnRight.addEventListener('pointerleave', function(e) {
        rightPressed = false;
        window.rightPressed = false;
        btnRight.classList.remove('active');
    }, { passive: false, capture: true });
    
    // RIGHT BUTTON - Touch Events (Backup for webview)
    btnRight.addEventListener('touchstart', function(e) {
        if (e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        rightPressed = true;
        leftPressed = false;
        window.rightPressed = true;
        btnRight.classList.add('active');
        console.log('🔥 RIGHT TOUCH START - FORCE activated');
    }, { passive: false, capture: true });
    
    btnRight.addEventListener('touchend', function(e) {
        if (e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        rightPressed = false;
        window.rightPressed = false;
        btnRight.classList.remove('active');
        console.log('🔥 RIGHT TOUCH END - FORCE deactivated');
    }, { passive: false, capture: true });
    
    btnRight.addEventListener('touchcancel', function(e) {
        if (e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        rightPressed = false;
        window.rightPressed = false;
        btnRight.classList.remove('active');
    }, { passive: false, capture: true });
    
    // DESKTOP MOUSE EVENTS (for testing)
    btnLeft.addEventListener('mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        leftPressed = true;
        rightPressed = false;
        btnLeft.classList.add('active');
    });
    
    btnLeft.addEventListener('mouseup', function(e) {
        e.preventDefault();
        e.stopPropagation();
        leftPressed = false;
        btnLeft.classList.remove('active');
    });
    
    btnLeft.addEventListener('mouseleave', function(e) {
        leftPressed = false;
        btnLeft.classList.remove('active');
    });
    
    btnRight.addEventListener('mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        rightPressed = true;
        leftPressed = false;
        btnRight.classList.add('active');
    });
    
    btnRight.addEventListener('mouseup', function(e) {
        e.preventDefault();
        e.stopPropagation();
        rightPressed = false;
        btnRight.classList.remove('active');
    });
    
    btnRight.addEventListener('mouseleave', function(e) {
        rightPressed = false;
        btnRight.classList.remove('active');
    });
}

/*!
 * 
 * SETUP JUMP CONTROL - WEBVIEW NUCLEAR OPTION - Handle jump button
 * 
 */
function setupJumpControl() {
    var btnJump = document.getElementById('btnJump');
    
    if (!btnJump) {
        console.error('❌ Jump button not found!');
        return;
    }
    
    // Apply DOM element style overrides for maximum webview compatibility
    btnJump.style.touchAction = 'manipulation';
    btnJump.style.webkitTouchAction = 'manipulation';
    btnJump.style.msTouchAction = 'manipulation';
    btnJump.style.pointerEvents = 'auto';
    btnJump.style.webkitUserSelect = 'none';
    btnJump.style.userSelect = 'none';
    btnJump.style.webkitTouchCallout = 'none';
    
    // NUCLEAR OPTION EVENT HANDLERS - Multiple event types with maximum prevention
    
    // Pointer Events (Primary for webview)
    btnJump.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        btnJump.classList.add('active');
        handleJump();
        console.log('🔥 JUMP POINTER DOWN - FORCE activated');
    }, { passive: false, capture: true });
    
    btnJump.addEventListener('pointerup', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        btnJump.classList.remove('active');
    }, { passive: false, capture: true });
    
    btnJump.addEventListener('pointercancel', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        btnJump.classList.remove('active');
    }, { passive: false, capture: true });
    
    // Touch Events (Backup for webview)
    btnJump.addEventListener('touchstart', function(e) {
        if (e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        btnJump.classList.add('active');
        handleJump();
        console.log('🔥 JUMP TOUCH START - FORCE activated');
    }, { passive: false, capture: true });
    
    btnJump.addEventListener('touchend', function(e) {
        if (e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        btnJump.classList.remove('active');
    }, { passive: false, capture: true });
    
    btnJump.addEventListener('touchcancel', function(e) {
        if (e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        btnJump.classList.remove('active');
    }, { passive: false, capture: true });
    
    // Mouse events for testing on desktop
    btnJump.addEventListener('mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        btnJump.classList.add('active');
        handleJump();
    });
    
    btnJump.addEventListener('mouseup', function(e) {
        e.preventDefault();
        e.stopPropagation();
        btnJump.classList.remove('active');
    });
}

/*!
 * 
 * HANDLE JUMP - Execute jump action
 * 
 */
function handleJump() {
    if (!gamePause) {
        if (playerJump == 0) {
            playerJump = 1;
            jumpPlayer();
        } else if (playerJump == 2) {
            jumpPlayer();
        }
    }
}

/*!
 * 
 * UPDATE TOUCH CONTROLS - WEBVIEW ENHANCED - Called every frame to handle continuous movement
 * This function enables HOLD-TO-WALK behavior with dual flag checking
 */
function updateTouchControls() {
    if (!touchControlsActive) {
        return;
    }
    
    if (gamePause) {
        return;
    }
    
    // Get current player position
    var currentX = gamePlayer.x;
    var targetX = currentX;
    
    // DUAL FLAG SYSTEM - Check both local and global flags for maximum reliability
    var isMovingLeft = leftPressed || window.leftPressed;
    var isMovingRight = rightPressed || window.rightPressed;
    
    // Calculate continuous movement based on button press state
    // Player walks continuously while button is held down
    if (isMovingLeft) {
        targetX = currentX - moveSpeed;
        console.log('🚀 FORCE MOVING LEFT - Speed:', moveSpeed, 'Current X:', currentX);
    } else if (isMovingRight) {
        targetX = currentX + moveSpeed;
        console.log('🚀 FORCE MOVING RIGHT - Speed:', moveSpeed, 'Current X:', currentX);
    }
    
    // Apply movement if there's a change
    if (targetX !== currentX) {
        movePlayerPosX(targetX);
    }
}

/*!
 * 
 * HIDE TOUCH CONTROLS - Hide controls during menus
 * 
 */
function hideTouchControls() {
    // Remove 'active' class to hide controls (display: none)
    $('#touchControls').removeClass('active');
}

/*!
 * 
 * SHOW TOUCH CONTROLS - Show controls during gameplay
 * 
 */
function showTouchControls() {
    // Add 'active' class to show controls (display: block)
    $('#touchControls').addClass('active');
}

/*!
 * 
 * RESET TOUCH CONTROLS - Reset button states
 * 
 */
function resetTouchControls() {
    leftPressed = false;
    rightPressed = false;
    // Reset global flags too
    window.leftPressed = false;
    window.rightPressed = false;
}

/*!
 * 
 * WEBVIEW NUCLEAR OPTION - Document-level event blocking
 * 
 */
function setupDocumentEventBlocking() {
    console.log('🚀 Setting up DOCUMENT-LEVEL NUCLEAR OPTION for webview compatibility');
    
    // Complete document gesture isolation
    document.addEventListener('touchstart', function(e) {
        // Allow only specific interactive elements
        var target = e.target || e.srcElement;
        var allowedElements = ['btnLeft', 'btnRight', 'btnJump'];
        var isAllowed = allowedElements.some(function(id) {
            return target.id === id || target.closest('#' + id);
        });
        
        if (!isAllowed) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, { passive: false, capture: true });
    
    document.addEventListener('touchmove', function(e) {
        // Always prevent touchmove to stop scrolling/panning
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }, { passive: false, capture: true });
    
    document.addEventListener('touchend', function(e) {
        var target = e.target || e.srcElement;
        var allowedElements = ['btnLeft', 'btnRight', 'btnJump'];
        var isAllowed = allowedElements.some(function(id) {
            return target.id === id || target.closest('#' + id);
        });
        
        if (!isAllowed) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, { passive: false, capture: true });
    
    // Same for pointer events
    document.addEventListener('pointerdown', function(e) {
        var target = e.target || e.srcElement;
        var allowedElements = ['btnLeft', 'btnRight', 'btnJump'];
        var isAllowed = allowedElements.some(function(id) {
            return target.id === id || target.closest('#' + id);
        });
        
        if (!isAllowed) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, { passive: false, capture: true });
    
    document.addEventListener('pointermove', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }, { passive: false, capture: true });
    
    document.addEventListener('pointerup', function(e) {
        var target = e.target || e.srcElement;
        var allowedElements = ['btnLeft', 'btnRight', 'btnJump'];
        var isAllowed = allowedElements.some(function(id) {
            return target.id === id || target.closest('#' + id);
        });
        
        if (!isAllowed) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, { passive: false, capture: true });
}

/*!
 * 
 * WEBVIEW NUCLEAR OPTION - Canvas-level event blocking
 * 
 */
function setupCanvasEventBlocking() {
    console.log('🚀 Setting up CANVAS-LEVEL NUCLEAR OPTION for webview compatibility');
    
    var gameCanvas = document.getElementById('gameCanvas');
    var box2dCanvas = document.getElementById('box2dCanvas');
    
    if (gameCanvas) {
        // Maximum style override
        gameCanvas.style.touchAction = 'none';
        gameCanvas.style.webkitTouchAction = 'none';
        gameCanvas.style.msTouchAction = 'none';
        gameCanvas.style.pointerEvents = 'auto';
        gameCanvas.style.userSelect = 'none';
        gameCanvas.style.webkitUserSelect = 'none';
        gameCanvas.style.webkitTouchCallout = 'none';
        gameCanvas.style.webkitTapHighlightColor = 'transparent';
        
        // Complete event blocking with capture
        gameCanvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }, { passive: false, capture: true });
        
        gameCanvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }, { passive: false, capture: true });
        
        gameCanvas.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }, { passive: false, capture: true });
        
        gameCanvas.addEventListener('pointerdown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }, { passive: false, capture: true });
        
        gameCanvas.addEventListener('pointermove', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }, { passive: false, capture: true });
        
        gameCanvas.addEventListener('pointerup', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }, { passive: false, capture: true });
    }
    
    if (box2dCanvas) {
        // Same treatment for box2d canvas
        box2dCanvas.style.touchAction = 'none';
        box2dCanvas.style.webkitTouchAction = 'none';
        box2dCanvas.style.msTouchAction = 'none';
        box2dCanvas.style.pointerEvents = 'none'; // This one should be none since it's hidden
        box2dCanvas.style.userSelect = 'none';
        box2dCanvas.style.webkitUserSelect = 'none';
        box2dCanvas.style.webkitTouchCallout = 'none';
    }
}

/*!
 * 
 * WEBVIEW NUCLEAR OPTION - Global safety handlers
 * 
 */
function setupGlobalSafetyHandlers() {
    if (globalSafetyHandlers) return; // Prevent duplicate handlers
    globalSafetyHandlers = true;
    
    console.log('🚀 Setting up GLOBAL SAFETY HANDLERS for webview compatibility');
    
    // Reset movement state on window blur (app switching)
    window.addEventListener('blur', function() {
        console.log('🔄 Window blur - Resetting movement state');
        leftPressed = false;
        rightPressed = false;
        window.leftPressed = false;
        window.rightPressed = false;
        activePointers.clear();
        
        // Remove active classes
        var btnLeft = document.getElementById('btnLeft');
        var btnRight = document.getElementById('btnRight');
        var btnJump = document.getElementById('btnJump');
        if (btnLeft) btnLeft.classList.remove('active');
        if (btnRight) btnRight.classList.remove('active');
        if (btnJump) btnJump.classList.remove('active');
    });
    
    // Reset movement state on visibility change (tab switching)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('🔄 Visibility change - Resetting movement state');
            leftPressed = false;
            rightPressed = false;
            window.leftPressed = false;
            window.rightPressed = false;
            activePointers.clear();
            
            // Remove active classes
            var btnLeft = document.getElementById('btnLeft');
            var btnRight = document.getElementById('btnRight');
            var btnJump = document.getElementById('btnJump');
            if (btnLeft) btnLeft.classList.remove('active');
            if (btnRight) btnRight.classList.remove('active');
            if (btnJump) btnJump.classList.remove('active');
        }
    });
    
    // Reset movement state before page unload
    window.addEventListener('beforeunload', function() {
        leftPressed = false;
        rightPressed = false;
        window.leftPressed = false;
        window.rightPressed = false;
        activePointers.clear();
    });
    
    // Enhanced pointer tracking for multi-touch support
    document.addEventListener('pointerdown', function(e) {
        activePointers.set(e.pointerId, {
            target: e.target,
            startTime: Date.now()
        });
    }, { passive: true, capture: true });
    
    document.addEventListener('pointerup', function(e) {
        activePointers.delete(e.pointerId);
    }, { passive: true, capture: true });
    
    document.addEventListener('pointercancel', function(e) {
        activePointers.delete(e.pointerId);
    }, { passive: true, capture: true });
}
