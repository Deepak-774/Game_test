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

/*!
 * 
 * INITIALIZE TOUCH CONTROLS - Show controls and setup event listeners
 * 
 */
function initTouchControls() {
    // Initialize touch controls (hidden by default via CSS)
    touchControlsActive = true;
    
    // Setup event listeners for D-Pad buttons
    setupDPadControls();
    
    // Setup event listener for Jump button
    setupJumpControl();
    
    console.log('✅ Touch controls initialized - Hold buttons for continuous movement');
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
 * SETUP JUMP CONTROL - Handle jump button
 * 
 */
function setupJumpControl() {
    var btnJump = document.getElementById('btnJump');
    
    if (!btnJump) {
        console.error('❌ Jump button not found!');
        return;
    }
    
    // Touch events
    btnJump.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handleJump();
    });
    
    // Mouse events for testing on desktop
    btnJump.addEventListener('mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handleJump();
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
}
