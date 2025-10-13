// Game State Variables
var gameState = {
    isPlaying: false,
    isPaused: false,
    score: 0,
    timeLeft: 120, // 2 minutes in seconds
    gameTimer: null,
    arrowsShot: 0
};

// DOM Elements
var svg = document.querySelector("svg");
var cursor = svg.createSVGPoint();
var arrows = document.querySelector(".arrows");
var scoreElement = document.getElementById("score");
var timerElement = document.getElementById("timer");
var gameOverlay = document.getElementById("game-overlay");
var startScreen = document.getElementById("start-screen");
var gameOverScreen = document.getElementById("game-over-screen");
var finalScoreElement = document.getElementById("final-score");
var startButton = document.getElementById("start-button");
var restartButton = document.getElementById("restart-button");
var instructionsElement = document.getElementById("instructions");

// Game Variables
var randomAngle = 0;
var isDragging = false;
var currentTouch = null;

// Target and collision detection
var target = {
    x: 900,
    y: 249.5
};

var lineSegment = {
    x1: 875,
    y1: 280,
    x2: 925,
    y2: 220
};

var pivot = {
    x: 100,
    y: 250
};

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

function initializeGame() {
    // NUCLEAR OPTION - Button event listeners with maximum override
    startButton.addEventListener('click', startGame);
    startButton.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        startGame();
    }, { passive: false, capture: true });
    startButton.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        startGame();
    }, { passive: false, capture: true });
    
    restartButton.addEventListener('click', restartGame);
    restartButton.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        restartGame();
    }, { passive: false, capture: true });
    restartButton.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        restartGame();
    }, { passive: false, capture: true });
    
    // Set up touch and mouse controls
    setupControls();
    
    // Show start screen
    showStartScreen();
    
    // Initial aim position
    aim({
        clientX: 320,
        clientY: 300
    });
}

function setupControls() {
    // Mouse events for desktop
    svg.addEventListener("mousedown", startDraw);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", endDraw);
    
    // Simplified touch events - direct approach
    svg.addEventListener("touchstart", function(e) {
        if (!gameState.isPlaying) return;
        e.preventDefault();
        console.log("SVG touchstart detected");
        const touch = e.touches[0];
        currentTouch = touch.identifier;
        startDraw({ clientX: touch.clientX, clientY: touch.clientY });
    }, { passive: false });
    
    window.addEventListener("touchmove", function(e) {
        if (!gameState.isPlaying || !isDragging) return;
        e.preventDefault();
        const touch = Array.from(e.touches).find(t => t.identifier === currentTouch);
        if (touch) {
            handleMove({ clientX: touch.clientX, clientY: touch.clientY });
        }
    }, { passive: false });
    
    window.addEventListener("touchend", function(e) {
        if (!gameState.isPlaying || !isDragging) return;
        e.preventDefault();
        console.log("Touch end - shooting arrow");
        currentTouch = null;
        endDraw();
    }, { passive: false });
    
    // SVG touch optimization - Allow interaction while preventing default behaviors
    svg.style.touchAction = 'none';
    svg.style.webkitTouchAction = 'none';
    svg.style.userSelect = 'none';
    svg.style.webkitUserSelect = 'none';
    svg.style.webkitTouchCallout = 'none';
    svg.style.webkitTapHighlightColor = 'transparent';
    
    // MODIFIED - Allow SVG game area touches while preventing other gestures
    document.addEventListener('touchstart', function(e) {
        const allowedElements = ['start-button', 'restart-button'];
        const isButton = allowedElements.some(id => e.target.id === id || e.target.closest('#' + id));
        const isSVG = e.target.closest('svg') || e.target.tagName === 'svg';
        
        // Allow buttons and SVG game area, block everything else
        if (!isButton && !isSVG) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, { passive: false, capture: true });
    
    document.addEventListener('touchmove', function(e) {
        const isSVG = e.target.closest('svg') || e.target.tagName === 'svg';
        
        // Allow SVG touches during gameplay, prevent everything else
        if (!isSVG || !gameState.isPlaying) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, { passive: false, capture: true });
    
    document.addEventListener('touchend', function(e) {
        const allowedElements = ['start-button', 'restart-button'];
        const isButton = allowedElements.some(id => e.target.id === id || e.target.closest('#' + id));
        const isSVG = e.target.closest('svg') || e.target.tagName === 'svg';
        
        // Allow buttons and SVG game area, block everything else
        if (!isButton && !isSVG) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, { passive: false, capture: true });
    
    // Same logic for pointer events
    document.addEventListener('pointerdown', function(e) {
        const allowedElements = ['start-button', 'restart-button'];
        const isButton = allowedElements.some(id => e.target.id === id || e.target.closest('#' + id));
        const isSVG = e.target.closest('svg') || e.target.tagName === 'svg';
        
        // Allow buttons and SVG game area, block everything else
        if (!isButton && !isSVG) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, { passive: false, capture: true });
    
    document.addEventListener('pointermove', function(e) {
        const isSVG = e.target.closest('svg') || e.target.tagName === 'svg';
        
        // Allow SVG touches during gameplay, prevent everything else
        if (!isSVG || !gameState.isPlaying) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, { passive: false, capture: true });
    
    document.addEventListener('pointerup', function(e) {
        const allowedElements = ['start-button', 'restart-button'];
        const isButton = allowedElements.some(id => e.target.id === id || e.target.closest('#' + id));
        const isSVG = e.target.closest('svg') || e.target.tagName === 'svg';
        
        // Allow buttons and SVG game area, block everything else
        if (!isButton && !isSVG) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, { passive: false, capture: true });
}

// Simplified event handlers

function startDraw(e) {
    if (!gameState.isPlaying) {
        console.log("startDraw called but game not playing");
        return;
    }
    
    console.log("Starting draw - isDragging set to true");
    isDragging = true;
    randomAngle = (Math.random() * Math.PI * 0.03) - 0.015;
    
    TweenMax.to(".arrow-angle use", 0.3, {
        opacity: 1
    });
    
    aim(e);
}

function handleMove(e) {
    if (!gameState.isPlaying || !isDragging) return;
    aim(e);
}

function endDraw() {
    if (!gameState.isPlaying || !isDragging) return;
    
    console.log("Ending draw - shooting arrow");
    isDragging = false;
    loose();
}



// Game State Management
function startGame() {
    console.log("Starting game");
    gameState.isPlaying = true;
    gameState.score = 0;
    gameState.timeLeft = 120;
    gameState.arrowsShot = 0;
    
    updateScore();
    updateTimer();
    hideOverlay();
    showInstructions();
    
    // Start game timer
    gameState.gameTimer = setInterval(function() {
        gameState.timeLeft--;
        updateTimer();
        
        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function restartGame() {
    console.log("Restarting game");
    clearInterval(gameState.gameTimer);
    
    // Clear all arrows
    arrows.innerHTML = '';
    
    // Reset arrow visibility
    TweenMax.set(".arrow-angle use", { opacity: 0 });
    
    startGame();
}

function endGame() {
    console.log("Ending game");
    gameState.isPlaying = false;
    isDragging = false;
    clearInterval(gameState.gameTimer);
    
    hideInstructions();
    showGameOverScreen();
}

function showStartScreen() {
    gameOverlay.classList.remove('hidden');
    startScreen.classList.remove('hidden');
    gameOverScreen.classList.add('hidden');
}

function showGameOverScreen() {
    finalScoreElement.textContent = gameState.score;
    gameOverlay.classList.remove('hidden');
    startScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
}

function hideOverlay() {
    gameOverlay.classList.add('hidden');
}

function showInstructions() {
    instructionsElement.classList.remove('hidden');
}

function hideInstructions() {
    instructionsElement.classList.add('hidden');
}

function updateScore() {
    scoreElement.textContent = gameState.score;
}

function updateTimer() {
    var minutes = Math.floor(gameState.timeLeft / 60);
    var seconds = gameState.timeLeft % 60;
    var timeString = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    timerElement.textContent = timeString;
    
    // Add warning class when time is low
    if (gameState.timeLeft <= 30) {
        timerElement.classList.add('warning');
    } else {
        timerElement.classList.remove('warning');
    }
}

function addScore(points) {
    gameState.score += points;
    updateScore();
    
    // Show score popup
    showScorePopup(points);
}

function showScorePopup(points) {
    // Create temporary score popup
    var popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.color = '#00ff00';
    popup.style.fontSize = '2em';
    popup.style.fontWeight = 'bold';
    popup.style.textShadow = '0 0 10px #00ff00';
    popup.style.zIndex = '1000';
    popup.style.pointerEvents = 'none';
    popup.textContent = '+' + points;
    
    document.body.appendChild(popup);
    
    // Animate popup
    TweenMax.fromTo(popup, 1, 
        { opacity: 0, scale: 0.5, y: 0 },
        { opacity: 1, scale: 1.2, y: -50, ease: Power2.easeOut }
    );
    
    TweenMax.to(popup, 0.5, {
        delay: 0.5,
        opacity: 0,
        scale: 0.8,
        onComplete: function() {
            document.body.removeChild(popup);
        }
    });
}

function aim(e) {
    // get mouse/touch position in relation to svg position and scale
    var point = getMouseSVG(e);
    point.x = Math.min(point.x, pivot.x - 7);
    point.y = Math.max(point.y, pivot.y + 7);
    var dx = point.x - pivot.x;
    var dy = point.y - pivot.y;
    // Make it more difficult by adding random angle each time
    var angle = Math.atan2(dy, dx) + randomAngle;
    var bowAngle = angle - Math.PI;
    var distance = Math.min(Math.sqrt((dx * dx) + (dy * dy)), 50);
    var scale = Math.min(Math.max(distance / 30, 1), 2);
    
    TweenMax.to("#bow", 0.3, {
        scaleX: scale,
        rotation: bowAngle + "rad",
        transformOrigin: "right center"
    });
    
    var arrowX = Math.min(pivot.x - ((1 / scale) * distance), 88);
    TweenMax.to(".arrow-angle", 0.3, {
        rotation: bowAngle + "rad",
        svgOrigin: "100 250"
    });
    
    TweenMax.to(".arrow-angle use", 0.3, {
        x: -distance
    });
    
    TweenMax.to("#bow polyline", 0.3, {
        attr: {
            points: "88,200 " + Math.min(pivot.x - ((1 / scale) * distance), 88) + ",250 88,300"
        }
    });

    var radius = distance * 9;
    var offset = {
        x: (Math.cos(bowAngle) * radius),
        y: (Math.sin(bowAngle) * radius)
    };
    var arcWidth = offset.x * 3;

    TweenMax.to("#arc", 0.3, {
        attr: {
            d: "M100,250c" + offset.x + "," + offset.y + "," + (arcWidth - offset.x) + "," + (offset.y + 50) + "," + arcWidth + ",50"
        },
        autoAlpha: distance/60
    });
}

function loose() {
    if (!gameState.isPlaying) return;
    
    console.log("Shooting arrow");
    gameState.arrowsShot++;
    
    TweenMax.to("#bow", 0.4, {
        scaleX: 1,
        transformOrigin: "right center",
        ease: Elastic.easeOut
    });
    
    TweenMax.to("#bow polyline", 0.4, {
        attr: {
            points: "88,200 88,250 88,300"
        },
        ease: Elastic.easeOut
    });
    
    // duplicate arrow
    var newArrow = document.createElementNS("http://www.w3.org/2000/svg", "use");
    newArrow.setAttributeNS('http://www.w3.org/1999/xlink', 'href', "#arrow");
    arrows.appendChild(newArrow);

    // animate arrow along path
    var path = MorphSVGPlugin.pathDataToBezier("#arc");
    TweenMax.to([newArrow], 0.5, {
        force3D: true,
        bezier: {
            type: "cubic",
            values: path,
            autoRotate: ["x", "y", "rotation"]
        },
        onUpdate: hitTest,
        onUpdateParams: ["{self}"],
        onComplete: onMiss,
        ease: Linear.easeNone
    });
    
    TweenMax.to("#arc", 0.3, {
        opacity: 0
    });
    
    //hide previous arrow
    TweenMax.set(".arrow-angle use", {
        opacity: 0
    });
}

function hitTest(tween) {
    if (!gameState.isPlaying) return;
    
    // check for collisions with arrow and target
    var arrow = tween.target[0];
    var transform = arrow._gsTransform;
    var radians = transform.rotation * Math.PI / 180;
    var arrowSegment = {
        x1: transform.x,
        y1: transform.y,
        x2: (Math.cos(radians) * 60) + transform.x,
        y2: (Math.sin(radians) * 60) + transform.y
    }

    var intersection = getIntersection(arrowSegment, lineSegment);
    if (intersection.segment1 && intersection.segment2) {
        tween.pause();
        var dx = intersection.x - target.x;
        var dy = intersection.y - target.y;
        var distance = Math.sqrt((dx * dx) + (dy * dy));
        
        var selector = ".hit";
        var points = 50; // Hit points
        
        if (distance < 7) {
            selector = ".bullseye";
            points = 100; // Bullseye points
        }
        
        // Add score
        addScore(points);
        showMessage(selector);
    }
}

function onMiss() {
    if (!gameState.isPlaying) return;
    showMessage(".miss");
}

function showMessage(selector) {
    // handle all text animations by providing selector
    TweenMax.killTweensOf(selector);
    TweenMax.killChildTweensOf(selector);
    TweenMax.set(selector, {
        autoAlpha: 1
    });
    TweenMax.staggerFromTo(selector + " path", .5, {
        rotation: -5,
        scale: 0,
        transformOrigin: "center"
    }, {
        scale: 1,
        ease: Back.easeOut
    }, .05);
    TweenMax.staggerTo(selector + " path", .3, {
        delay: 2,
        rotation: 20,
        scale: 0,
        ease: Back.easeIn
    }, .03);
}



function getMouseSVG(e) {
    // normalize mouse/touch position within svg coordinates
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    return cursor.matrixTransform(svg.getScreenCTM().inverse());
}

function getIntersection(segment1, segment2) {
    // find intersection point of two line segments and whether or not the point is on either line segment
    var dx1 = segment1.x2 - segment1.x1;
    var dy1 = segment1.y2 - segment1.y1;
    var dx2 = segment2.x2 - segment2.x1;
    var dy2 = segment2.y2 - segment2.y1;
    var cx = segment1.x1 - segment2.x1;
    var cy = segment1.y1 - segment2.y1;
    var denominator = dy2 * dx1 - dx2 * dy1;
    if (denominator == 0) {
        return null;
    }
    var ua = (dx2 * cy - dy2 * cx) / denominator;
    var ub = (dx1 * cy - dy1 * cx) / denominator;
    return {
        x: segment1.x1 + ua * dx1,
        y: segment1.y1 + ua * dy1,
        segment1: ua >= 0 && ua <= 1,
        segment2: ub >= 0 && ub <= 1
    };
}