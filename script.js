// DOM Elements
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score-display");
const timerDisplay = document.getElementById("timer-display");
const leftButton = document.getElementById("left-button");
const rightButton = document.getElementById("right-button");
const controlButtons = document.querySelector(".control-buttons");

// Game Colors
const color = getComputedStyle(document.documentElement).getPropertyValue("--button-color");
const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue("--sidebar-color");
const brickColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

// Game State
let score = 0;
let level = 1;
let gameRunning = true;
let gameTime = 120; // 2 minutes in seconds
let gameTimer = null;
const brickRowCount = 9;
const brickColumnCount = 5;

// Set responsive canvas dimensions based on screen size
const isMobile = window.innerWidth <= 768;
ctx.canvas.width = isMobile ? 380 : 600;
ctx.canvas.height = isMobile ? 300 : 450;

// Game Elements - Responsive sizes
const ballSize = isMobile ? 6 : 8;
const paddleWidth = isMobile ? 60 : 80;
const paddleHeight = isMobile ? 8 : 10;
const paddleSpeed = isMobile ? 6 : 8;

const ball = {
  x: canvas.width / 2,
  y: canvas.height - 35, // Start from paddle position
  size: ballSize,
  baseSpeed: isMobile ? 2.5 : 3, // Better starting speed for level 1
  dx: isMobile ? 2.5 : 3,
  dy: isMobile ? -2.5 : -3,
  trail: [], // For ball trail effect
  lastCollisionTime: 0 // Collision cooldown
};

// Speed calculation function based on level
function getBallSpeed(level) {
  const baseSpeed = isMobile ? 2.5 : 3;
  const speedIncrease = isMobile ? 0.4 : 0.5;
  return baseSpeed + (level - 1) * speedIncrease;
}

// Speed limits based on level
function getSpeedLimits(level) {
  const currentSpeed = getBallSpeed(level);
  return {
    minSpeed: Math.max(currentSpeed * 0.8, isMobile ? 2 : 2.5),
    maxSpeed: currentSpeed * 1.4
  };
}

const paddle = {
  x: canvas.width / 2 - paddleWidth / 2,
  y: canvas.height - 25,
  w: paddleWidth,
  h: paddleHeight,
  speed: paddleSpeed,
  dx: 0,
};

// Calculate responsive brick dimensions
const canvasWidth = ctx.canvas.width;
const canvasHeight = ctx.canvas.height;
const totalBrickWidth = canvasWidth - 60; // Leave margins
const brickWidth = Math.floor(totalBrickWidth / brickRowCount) - 4;
const brickHeight = isMobile ? 12 : 16;

const brickInfo = {
  w: brickWidth,
  h: brickHeight,
  padding: 4,
  offsetX: Math.floor((canvasWidth - (brickRowCount * (brickWidth + 4))) / 2),
  offsetY: canvasHeight * 0.18, // Move bricks lower to avoid level text overlap
  visible: true,
};

// Initialize Bricks with Colors
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    const colorIndex = j % brickColors.length;
    bricks[i][j] = { 
      x, 
      y, 
      ...brickInfo, 
      color: brickColors[colorIndex],
      hits: 0,
      maxHits: 1
    };
  }
}

// Enhanced Drawing Functions
function drawBall() {
  // Draw ball trail
  ball.trail.forEach((pos, index) => {
    const alpha = (index + 1) / ball.trail.length * 0.3;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, ball.size * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = '#4ECDC4';
    ctx.fill();
  });
  
  // Reset alpha and draw main ball
  ctx.globalAlpha = 1;
  
  // Ball gradient
  const gradient = ctx.createRadialGradient(ball.x - 3, ball.y - 3, 0, ball.x, ball.y, ball.size);
  gradient.addColorStop(0, '#FFFFFF');
  gradient.addColorStop(0.3, '#4ECDC4');
  gradient.addColorStop(1, '#45B7D1');
  
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Ball highlight
  ctx.beginPath();
  ctx.arc(ball.x - 3, ball.y - 3, ball.size * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  // Paddle gradient
  const gradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.h);
  gradient.addColorStop(0, '#FFFFFF');
  gradient.addColorStop(0.3, color);
  gradient.addColorStop(1, '#45B7D1');
  
  // Paddle shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 3;
  
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  
  ctx.closePath();
}

function drawScore() {
  // Update HTML score display
  scoreDisplay.textContent = score;
  
  // Update timer display
  updateTimerDisplay();
  
  // Level text removed - no longer displayed on canvas
}

function updateTimerDisplay() {
  const minutes = Math.floor(gameTime / 60);
  const seconds = gameTime % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  timerDisplay.textContent = timeString;
  
  // Add warning class when time is low
  if (gameTime <= 30) {
    timerDisplay.classList.add('warning');
  } else {
    timerDisplay.classList.remove('warning');
  }
}

function startGameTimer() {
  if (gameTimer) {
    clearInterval(gameTimer);
  }
  
  gameTimer = setInterval(() => {
    if (gameRunning && gameTime > 0) {
      gameTime--;
      updateTimerDisplay();
      
      if (gameTime <= 0) {
        gameOver();
      }
    }
  }, 1000);
}

function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        // Brick gradient based on hits
        const alpha = 1 - (brick.hits / brick.maxHits) * 0.5;
        const gradient = ctx.createLinearGradient(brick.x, brick.y, brick.x, brick.y + brick.h);
        gradient.addColorStop(0, brick.color);
        gradient.addColorStop(1, adjustBrightness(brick.color, -20));
        
        // Brick shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 2;
        
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.w, brick.h);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Brick highlight
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.rect(brick.x + 2, brick.y + 2, brick.w - 4, brick.h / 3);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        
        // Reset
        ctx.globalAlpha = 1;
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        
        ctx.closePath();
      }
    });
  });
}

// Utility Functions
function adjustBrightness(color, amount) {
  const usePound = color[0] === '#';
  const col = usePound ? color.slice(1) : color;
  const num = parseInt(col, 16);
  let r = (num >> 16) + amount;
  let g = (num >> 8 & 0x00FF) + amount;
  let b = (num & 0x0000FF) + amount;
  r = r > 255 ? 255 : r < 0 ? 0 : r;
  g = g > 255 ? 255 : g < 0 ? 0 : g;
  b = b > 255 ? 255 : b < 0 ? 0 : b;
  return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
}

function createParticles(x, y, color) {
  // Disabled particle creation to prevent layout interference
  // for (let i = 0; i < 8; i++) {
  //   const particle = document.createElement('div');
  //   particle.className = 'particle';
  //   particle.style.left = x + 'px';
  //   particle.style.top = y + 'px';
  //   particle.style.background = color;
  //   particle.style.width = '6px';
  //   particle.style.height = '6px';
  //   particle.style.transform = `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px)`;
  //   document.body.appendChild(particle);
  //   
  //   setTimeout(() => {
  //     if (particle.parentNode) {
  //       particle.parentNode.removeChild(particle);
  //     }
  //   }, 1000);
  // }
}

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Update ball trail
  ball.trail.push({ x: ball.x, y: ball.y });
  if (ball.trail.length > 5) {
    ball.trail.shift();
  }
  
  // Draw all elements
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// Animate Elements
function movePaddle() {
  paddle.x += paddle.dx;
  if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
  if (paddle.x < 0) paddle.x = 0;
}

function moveBall() {
  if (!gameRunning) return;
  
  ball.x += ball.dx;
  ball.y += ball.dy;
  
  // Wall collision (left and right)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }
  
  // Top wall collision
  if (ball.y - ball.size < 0) {
    ball.dy *= -1;
  }
  
  // Paddle collision with angle calculation
  if (
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y &&
    ball.y < paddle.y + paddle.h
  ) {
    // Calculate hit position on paddle (0 to 1)
    const hitPos = (ball.x - paddle.x) / paddle.w;
    // Adjust angle based on hit position
    const angle = (hitPos - 0.5) * Math.PI / 3; // Max 60 degrees
    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    ball.dx = speed * Math.sin(angle);
    ball.dy = -Math.abs(speed * Math.cos(angle));
  }
  
  // Improved brick collision with realistic physics
  const currentTime = Date.now();
  const collisionCooldown = 50; // Reduced cooldown for more responsive gameplay
  
  if (currentTime - ball.lastCollisionTime > collisionCooldown) {
    let brickHit = false;
    
    for (let i = 0; i < bricks.length && !brickHit; i++) {
      for (let j = 0; j < bricks[i].length && !brickHit; j++) {
        const brick = bricks[i][j];
        
        if (brick.visible) {
          // More precise collision detection
          const ballLeft = ball.x - ball.size;
          const ballRight = ball.x + ball.size;
          const ballTop = ball.y - ball.size;
          const ballBottom = ball.y + ball.size;
          
          if (ballRight > brick.x && ballLeft < brick.x + brick.w &&
              ballBottom > brick.y && ballTop < brick.y + brick.h) {
            
            // Calculate overlap distances
            const overlapLeft = ballRight - brick.x;
            const overlapRight = (brick.x + brick.w) - ballLeft;
            const overlapTop = ballBottom - brick.y;
            const overlapBottom = (brick.y + brick.h) - ballTop;
            
            // Find minimum overlap to determine collision side
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
            
            // Apply realistic physics based on collision side
            if (minOverlap === overlapLeft || minOverlap === overlapRight) {
              // Side collision
              ball.dx *= -1;
              // Add slight randomness for more interesting gameplay
              ball.dy += (Math.random() - 0.5) * 0.5;
              
              // Position ball outside brick
              if (minOverlap === overlapLeft) {
                ball.x = brick.x - ball.size - 1;
              } else {
                ball.x = brick.x + brick.w + ball.size + 1;
              }
            } else {
              // Top/bottom collision
              ball.dy *= -1;
              // Add slight randomness
              ball.dx += (Math.random() - 0.5) * 0.5;
              
              // Position ball outside brick
              if (minOverlap === overlapTop) {
                ball.y = brick.y - ball.size - 1;
              } else {
                ball.y = brick.y + brick.h + ball.size + 1;
              }
            }
            
            // Maintain speed limits for realistic physics based on current level
            const speedLimits = getSpeedLimits(level);
            const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
            
            if (currentSpeed < speedLimits.minSpeed) {
              const speedMultiplier = speedLimits.minSpeed / currentSpeed;
              ball.dx *= speedMultiplier;
              ball.dy *= speedMultiplier;
            } else if (currentSpeed > speedLimits.maxSpeed) {
              const speedMultiplier = speedLimits.maxSpeed / currentSpeed;
              ball.dx *= speedMultiplier;
              ball.dy *= speedMultiplier;
            }
            
            // Break brick and set cooldown
            brick.visible = false;
            increaseScore();
            brickHit = true;
            ball.lastCollisionTime = currentTime;
            
            // Create particle effect
            const rect = canvas.getBoundingClientRect();
            createParticles(
              rect.left + brick.x + brick.w / 2,
              rect.top + brick.y + brick.h / 2,
              brick.color
            );
          }
        }
      }
    }
  }
  
  // Game over condition
  if (ball.y + ball.size > canvas.height) {
    gameOver();
  }
}

function increaseScore() {
  score += 10 * level;
  
  // Check if all bricks are destroyed
  const allDestroyed = bricks.every(column => 
    column.every(brick => !brick.visible)
  );
  
  if (allDestroyed) {
    nextLevel();
  }
}

function nextLevel() {
  level++;
  showAllBricks();
  resetBall(); // This will now use the new level's speed
  
  // Show level up message in UI instead of alert
  showLevelUpMessage();
}

function gameOver() {
  gameRunning = false;
  
  // Clear timer
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
  
  // Create and show blur overlay
  createBlurOverlay();
  
  // Send game over message to parent window immediately after blur
  setTimeout(() => {
    window.parent.postMessage({ 
      type: "GAME_OVER", 
      score: score 
    }, "*");
  }, 100); // Brief delay to ensure blur is visible
}

function restartGame() {
  // Remove blur overlay if it exists
  removeBlurOverlay();
  
  score = 0;
  level = 1; // Reset to level 1
  gameRunning = true;
  gameTime = 120; // Reset to 2 minutes
  showAllBricks();
  resetBall(); // This will use level 1 speed
  startGameTimer();
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 35; // Start from paddle position
  
  // Set speed based on current level
  const levelSpeed = getBallSpeed(level);
  ball.dx = levelSpeed;
  ball.dy = -levelSpeed;
  
  ball.trail = [];
  ball.lastCollisionTime = 0; // Reset collision cooldown
}

function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      brick.visible = true;
      brick.hits = 0;
    });
  });
}

// Handle Key Events
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") paddle.dx = paddle.speed;
  else if (e.key === "Left" || e.key === "ArrowLeft") paddle.dx = -paddle.speed;
}

function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

// Update Canvas
function update() {
  // update
  movePaddle();
  moveBall();
  // draw
  draw();
  requestAnimationFrame(update);
}

// Simple Control Buttons Setup
function setupControlButtons() {
  console.log('Setting up control buttons...');
  
  if (!leftButton || !rightButton) {
    console.error('Control buttons not found!');
    return;
  }

  // LEFT BUTTON
  leftButton.addEventListener('mousedown', () => {
    paddle.dx = -paddle.speed;
  });
  
  leftButton.addEventListener('mouseup', () => {
    paddle.dx = 0;
  });
  
  leftButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    paddle.dx = -paddle.speed;
  });
  
  leftButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    paddle.dx = 0;
  });

  // RIGHT BUTTON
  rightButton.addEventListener('mousedown', () => {
    paddle.dx = paddle.speed;
  });
  
  rightButton.addEventListener('mouseup', () => {
    paddle.dx = 0;
  });
  
  rightButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    paddle.dx = paddle.speed;
  });
  
  rightButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    paddle.dx = 0;
  });

  console.log('Control buttons setup complete');
}

// Nuclear option canvas setup
function setupCanvasNuclearOption() {
  // Force disable all touch behaviors on canvas
  canvas.style.touchAction = 'none';
  canvas.style.webkitTouchAction = 'none';
  canvas.style.msTouchAction = 'none';
  canvas.style.userSelect = 'none';
  canvas.style.webkitUserSelect = 'none';
  canvas.style.msUserSelect = 'none';
  canvas.style.mozUserSelect = 'none';
  canvas.style.webkitTouchCallout = 'none';
  canvas.style.webkitTapHighlightColor = 'transparent';
  canvas.style.pointerEvents = 'auto';
  
  // Prevent context menu
  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
}

// Prevent scrolling on mobile
function preventScrolling() {
  // Document-level touch prevention with selective allowance
  document.addEventListener('touchstart', (e) => {
    // Allow control buttons and UI buttons
    if (e.target.id === 'left-button' || 
        e.target.id === 'right-button' || 
        e.target.id === 'rules-btn' || 
        e.target.id === 'close-btn' ||
        e.target.classList.contains('control-btn') ||
        e.target.classList.contains('btn')) {
      return; // Allow these elements to receive touches
    }
    
    e.preventDefault();
  }, { passive: false });
  
  // Prevent touchmove to stop scrolling
  document.addEventListener('touchmove', (e) => {
    e.preventDefault();
  }, { passive: false });
}

// Event Listeners
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Initialize controls and prevent scrolling
setupCanvasNuclearOption();
setupControlButtons();
preventScrolling();

// UI Message Functions (replacing alerts)
function showLevelUpMessage() {
  const messageDiv = document.createElement('div');
  messageDiv.id = 'level-up-message';
  messageDiv.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 30px;
      border-radius: 15px;
      font-family: 'Balsamiq Sans', cursive;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 1000;
      animation: levelUpPulse 2s ease-in-out;
    ">
      🎉 Level ${level}! 🎉<br>
      <span style="font-size: 18px;">Speed increased!</span>
    </div>
  `;
  
  // Add animation keyframes if not already added
  if (!document.getElementById('level-up-styles')) {
    const style = document.createElement('style');
    style.id = 'level-up-styles';
    style.textContent = `
      @keyframes levelUpPulse {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        40% { transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(messageDiv);
  
  // Remove message after 3 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
  }, 3000);
}


function hideGameMessages() {
  const levelUpMsg = document.getElementById('level-up-message');
  
  if (levelUpMsg && levelUpMsg.parentNode) {
    levelUpMsg.parentNode.removeChild(levelUpMsg);
  }
}

function createBlurOverlay() {
  // Remove existing blur overlay if any
  removeBlurOverlay();
  
  // Create blur overlay element
  const blurOverlay = document.createElement('div');
  blurOverlay.id = 'game-over-blur';
  blurOverlay.className = 'game-over-blur';
  
  // Add to body
  document.body.appendChild(blurOverlay);
  
  // Trigger animation
  setTimeout(() => {
    blurOverlay.classList.add('active');
  }, 10);
}

function removeBlurOverlay() {
  const blurOverlay = document.getElementById('game-over-blur');
  if (blurOverlay && blurOverlay.parentNode) {
    blurOverlay.parentNode.removeChild(blurOverlay);
  }
}

console.log('Game initialized with simple control buttons');

// Start the game and timer
startGameTimer();
update();
