const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let player = { x: 50, y: canvas.height - 150, width: 50, height: 50, dy: 0, gravity: 0.8, jumpPower: -15 };
let obstacles = [];
let isJumping = false;
let gameOver = false;
let score = 0;

// Create obstacles at intervals
setInterval(() => {
  const height = Math.random() * (canvas.height / 2) + 20;
  obstacles.push({ x: canvas.width, y: canvas.height - height, width: 20, height });
}, 2000);

// Handle player jump
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !isJumping) {
    player.dy = player.jumpPower;
    isJumping = true;
  }
});

// Game loop
function gameLoop() {
  if (gameOver) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Apply gravity
  player.dy += player.gravity;
  player.y += player.dy;

  // Prevent player from falling below the ground
  if (player.y > canvas.height - player.height) {
    player.y = canvas.height - player.height;
    isJumping = false;
  }

  // Draw obstacles
  ctx.fillStyle = 'red';
  obstacles.forEach((obstacle, index) => {
    obstacle.x -= 5;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // Check collision
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      gameOver = true;
      alert(`Game Over! Score: ${score}`);
      document.location.reload();
    }

    // Remove off-screen obstacles
    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
      score++;
    }
  });

  // Display score
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 20, 40);

  // Loop
  requestAnimationFrame(gameLoop);
}

// Start game loop
gameLoop();
