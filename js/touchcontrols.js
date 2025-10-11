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

// SPACE INVADER APPROACH - Touch ID tracking system
var leftTouchID = null;
var rightTouchID = null;
var jumpTouchID = null;
var activeTouches = new Map(); // Track active touches by ID
var globalSafetyHandlers = false; // Flag to prevent duplicate handlers

/*!
 * 
 * INITIALIZE TOUCH CONTROLS - Show controls and setup event listeners
 * 
 */
function initTouchControls() {
    // Initialize touch controls (hidden by default via CSS)
    touchControlsActive = true;
    
    // NUCLEAR OPTION - Comprehensive webview compatibility
    setupNuclearOptionTouchControls();
    setupDocumentEventBlocking();
    
    console.log('✅ Touch controls initialized with NUCLEAR OPTION - Hold buttons for continuous movement');
}

// OLD NUCLEAR OPTION FUNCTIONS REMOVED - Using Space Invader approach instead

// OLD JUMP CONTROL FUNCTION REMOVED - Handled by Space Invader approach

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
 * UPDATE TOUCH CONTROLS - SPACE INVADER APPROACH - Called every frame to handle continuous movement
 * This function enables HOLD-TO-WALK behavior using simple flag checking
 */
function updateTouchControls() {
    if (!touchControlsActive) {
        console.log('⚠️ Touch controls not active');
        return;
    }
    
    if (gamePause) {
        console.log('⚠️ Game is paused');
        return;
    }
    
    // Get current player position
    var currentX = gamePlayer ? gamePlayer.x : 0;
    var targetX = currentX;
    
    // Debug current state
    console.log('🔄 updateTouchControls called - leftPressed:', leftPressed, 'rightPressed:', rightPressed, 'window.leftPressed:', window.leftPressed, 'window.rightPressed:', window.rightPressed, 'currentX:', currentX);
    
    // NUCLEAR OPTION - Dual flag system for maximum reliability
    var isMovingLeft = leftPressed || window.leftPressed;
    var isMovingRight = rightPressed || window.rightPressed;
    
    if (isMovingLeft) {
        targetX = currentX - moveSpeed;
        console.log('🚀 NUCLEAR OPTION MOVING LEFT - Speed:', moveSpeed, 'Current X:', currentX, 'TouchID:', leftTouchID);
    } else if (isMovingRight) {
        targetX = currentX + moveSpeed;
        console.log('🚀 NUCLEAR OPTION MOVING RIGHT - Speed:', moveSpeed, 'Current X:', currentX, 'TouchID:', rightTouchID);
    }
    
    // Apply movement if there's a change
    if (targetX !== currentX) {
        movePlayerPosX(targetX);
        console.log('✅ MOVEMENT APPLIED - New X:', targetX);
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
 * RESET TOUCH CONTROLS - Reset button states (Nuclear Option approach)
 * 
 */
function resetTouchControls() {
    leftPressed = false;
    rightPressed = false;
    
    // Reset global backup flags
    window.leftPressed = false;
    window.rightPressed = false;
    
    // Reset touch IDs
    leftTouchID = null;
    rightTouchID = null;
    jumpTouchID = null;
    
    // Clear active touches
    activeTouches.clear();
    
    // Remove active classes
    var btnLeft = document.getElementById('btnLeft');
    var btnRight = document.getElementById('btnRight');
    var btnJump = document.getElementById('btnJump');
    if (btnLeft) btnLeft.classList.remove('active');
    if (btnRight) btnRight.classList.remove('active');
    if (btnJump) btnJump.classList.remove('active');
    
    console.log('🔄 Touch controls reset - all flags cleared');
}

// OLD DOCUMENT EVENT BLOCKING REMOVED - Space Invader approach handles this differently

// OLD CANVAS EVENT BLOCKING REMOVED - Space Invader approach is simpler

// OLD GLOBAL SAFETY HANDLERS REMOVED - Space Invader approach handles cleanup in touchend/touchcancel

/*!
 * 
 * NUCLEAR OPTION - Maximum webview compatibility touch controls
 * Based on proven nuclear option approach from memories
 */
function setupNuclearOptionTouchControls() {
    console.log('🚀 Setting up SPACE INVADER APPROACH for webview compatibility');
    
    // Get button elements
    var btnLeft = document.getElementById('btnLeft');
    var btnRight = document.getElementById('btnRight');
    var btnJump = document.getElementById('btnJump');
    
    console.log('🔍 Button detection:', {
        btnLeft: btnLeft ? 'FOUND' : 'NOT FOUND',
        btnRight: btnRight ? 'FOUND' : 'NOT FOUND', 
        btnJump: btnJump ? 'FOUND' : 'NOT FOUND'
    });
    
    if (!btnLeft || !btnRight || !btnJump) {
        console.error('❌ Control buttons not found! Check HTML structure.');
        console.log('Available elements with IDs:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
        return;
    }
    
    // NUCLEAR OPTION - Multiple event types with maximum prevention
    
    // LEFT BUTTON - Pointer Events (Primary for webview)
    btnLeft.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        leftTouchID = e.pointerId;
        leftPressed = true;
        rightPressed = false;
        window.leftPressed = true; // Global backup flag
        activeTouches.set(leftTouchID, 'left');
        btnLeft.classList.add('active');
        console.log('🔥 LEFT POINTER DOWN - NUCLEAR OPTION activated');
    }, { passive: false, capture: true });
    
    btnLeft.addEventListener('pointerup', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.pointerId === leftTouchID) {
            leftTouchID = null;
            leftPressed = false;
            window.leftPressed = false;
            activeTouches.delete(e.pointerId);
            btnLeft.classList.remove('active');
            console.log('🔥 LEFT POINTER UP - NUCLEAR OPTION deactivated');
        }
    }, { passive: false, capture: true });
    
    btnLeft.addEventListener('pointercancel', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.pointerId === leftTouchID) {
            leftTouchID = null;
            leftPressed = false;
            window.leftPressed = false;
            activeTouches.delete(e.pointerId);
            btnLeft.classList.remove('active');
        }
    }, { passive: false, capture: true });
    
    // LEFT BUTTON - Touch Events (Backup for webview)
    btnLeft.addEventListener('touchstart', function(e) {
        if (e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        if (e.touches.length > 0) {
            leftTouchID = e.touches[0].identifier;
            leftPressed = true;
            rightPressed = false;
            window.leftPressed = true;
            activeTouches.set(leftTouchID, 'left');
            btnLeft.classList.add('active');
            console.log('🔥 LEFT TOUCH START - NUCLEAR OPTION activated');
        }
    }, { passive: false, capture: true });
    
    // RIGHT BUTTON - Pointer Events (Primary for webview)
    btnRight.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        rightTouchID = e.pointerId;
        rightPressed = true;
        leftPressed = false;
        window.rightPressed = true; // Global backup flag
        activeTouches.set(rightTouchID, 'right');
        btnRight.classList.add('active');
        console.log('🔥 RIGHT POINTER DOWN - NUCLEAR OPTION activated');
    }, { passive: false, capture: true });
    
    btnRight.addEventListener('pointerup', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.pointerId === rightTouchID) {
            rightTouchID = null;
            rightPressed = false;
            window.rightPressed = false;
            activeTouches.delete(e.pointerId);
            btnRight.classList.remove('active');
            console.log('🔥 RIGHT POINTER UP - NUCLEAR OPTION deactivated');
        }
    }, { passive: false, capture: true });
    
    btnRight.addEventListener('pointercancel', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.pointerId === rightTouchID) {
            rightTouchID = null;
            rightPressed = false;
            window.rightPressed = false;
            activeTouches.delete(e.pointerId);
            btnRight.classList.remove('active');
        }
    }, { passive: false, capture: true });
    
    // RIGHT BUTTON - Touch Events (Backup for webview)
    btnRight.addEventListener('touchstart', function(e) {
        if (e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        if (e.touches.length > 0) {
            rightTouchID = e.touches[0].identifier;
            rightPressed = true;
            leftPressed = false;
            window.rightPressed = true;
            activeTouches.set(rightTouchID, 'right');
            btnRight.classList.add('active');
            console.log('🔥 RIGHT TOUCH START - NUCLEAR OPTION activated');
        }
    }, { passive: false, capture: true });
    
    // JUMP BUTTON - Pointer Events (Primary for webview)
    btnJump.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        jumpTouchID = e.pointerId;
        activeTouches.set(jumpTouchID, 'jump');
        btnJump.classList.add('active');
        handleJump();
        console.log('🔥 JUMP POINTER DOWN - NUCLEAR OPTION activated');
    }, { passive: false, capture: true });
    
    btnJump.addEventListener('pointerup', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.pointerId === jumpTouchID) {
            jumpTouchID = null;
            activeTouches.delete(e.pointerId);
            btnJump.classList.remove('active');
        }
    }, { passive: false, capture: true });
    
    // JUMP BUTTON - Touch Events (Backup for webview)
    btnJump.addEventListener('touchstart', function(e) {
        if (e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        if (e.touches.length > 0) {
            jumpTouchID = e.touches[0].identifier;
            activeTouches.set(jumpTouchID, 'jump');
            btnJump.classList.add('active');
            handleJump();
            console.log('🔥 JUMP TOUCH START - NUCLEAR OPTION activated');
        }
    }, { passive: false, capture: true });
    
    // Document-level touch handling (like Space Invader)
    document.addEventListener('touchmove', function(e) {
        // Prevent scrolling but don't interfere with button tracking
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchend', function(e) {
        // Handle touch end for any tracked touches
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const touchType = activeTouches.get(touch.identifier);
            
            if (touch.identifier === leftTouchID) {
                leftTouchID = null;
                leftPressed = false;
                btnLeft.classList.remove('active');
                activeTouches.delete(touch.identifier);
                console.log('🔥 LEFT TOUCH END - Space Invader style');
            } else if (touch.identifier === rightTouchID) {
                rightTouchID = null;
                rightPressed = false;
                btnRight.classList.remove('active');
                activeTouches.delete(touch.identifier);
                console.log('🔥 RIGHT TOUCH END - Space Invader style');
            } else if (touch.identifier === jumpTouchID) {
                jumpTouchID = null;
                btnJump.classList.remove('active');
                activeTouches.delete(touch.identifier);
                console.log('🔥 JUMP TOUCH END - Space Invader style');
            }
        }
    });
    
    // Safety cleanup on touch cancel
    document.addEventListener('touchcancel', function(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            
            if (touch.identifier === leftTouchID) {
                leftTouchID = null;
                leftPressed = false;
                btnLeft.classList.remove('active');
                activeTouches.delete(touch.identifier);
            } else if (touch.identifier === rightTouchID) {
                rightTouchID = null;
                rightPressed = false;
                btnRight.classList.remove('active');
                activeTouches.delete(touch.identifier);
            } else if (touch.identifier === jumpTouchID) {
                jumpTouchID = null;
                btnJump.classList.remove('active');
                activeTouches.delete(touch.identifier);
            }
        }
    });
    
    // Desktop mouse support (simplified)
    btnLeft.addEventListener('mousedown', function(e) {
        e.preventDefault();
        leftPressed = true;
        rightPressed = false;
        btnLeft.classList.add('active');
    });
    
    btnLeft.addEventListener('mouseup', function(e) {
        e.preventDefault();
        leftPressed = false;
        btnLeft.classList.remove('active');
    });
    
    btnRight.addEventListener('mousedown', function(e) {
        e.preventDefault();
        rightPressed = true;
        leftPressed = false;
        btnRight.classList.add('active');
    });
    
    btnRight.addEventListener('mouseup', function(e) {
        e.preventDefault();
        rightPressed = false;
        btnRight.classList.remove('active');
    });
    
    btnJump.addEventListener('mousedown', function(e) {
        e.preventDefault();
        btnJump.classList.add('active');
        handleJump();
    });
    
    btnJump.addEventListener('mouseup', function(e) {
        e.preventDefault();
        btnJump.classList.remove('active');
    });
}

/*!
 * 
 * NUCLEAR OPTION - Document-level event blocking for webview isolation
 * 
 */
function setupDocumentEventBlocking() {
    console.log('🚀 Setting up DOCUMENT-LEVEL NUCLEAR OPTION for webview compatibility');
    
    // Complete document gesture isolation - allow only control buttons and canvas
    document.addEventListener('touchstart', function(e) {
        var target = e.target || e.srcElement;
        var allowedElements = ['btnLeft', 'btnRight', 'btnJump', 'gameCanvas'];
        var isAllowed = allowedElements.some(function(id) {
            return target.id === id || target.closest('#' + id);
        });
        
        // Also allow if target is the game canvas (for EaselJS buttons like btnStart)
        if (!isAllowed && target.tagName === 'CANVAS') {
            isAllowed = true;
        }
        
        if (!isAllowed) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, { passive: false, capture: true });
    
    // Always prevent touchmove to stop scrolling/panning
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }, { passive: false, capture: true });
    
    document.addEventListener('touchend', function(e) {
        var target = e.target || e.srcElement;
        var allowedElements = ['btnLeft', 'btnRight', 'btnJump', 'gameCanvas'];
        var isAllowed = allowedElements.some(function(id) {
            return target.id === id || target.closest('#' + id);
        });
        
        // Also allow if target is the game canvas (for EaselJS buttons like btnStart)
        if (!isAllowed && target.tagName === 'CANVAS') {
            isAllowed = true;
        }
        
        if (!isAllowed) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, { passive: false, capture: true });
}
