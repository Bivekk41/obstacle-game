const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
const tunnelGap = 200; // Gap between ceiling and floor
const tunnelCeiling = canvas.height / 2 - tunnelGap / 2; // Top of the tunnel
const tunnelFloor = canvas.height / 2 + tunnelGap / 2; // Bottom of the tunnel
let player = { x: 50, y: canvas.height / 2, width: 50, height: 50, dy: 0, gravity: 0.8, inverted: false };
let obstacles = [];
let gameOver = false;
let score = 0;

// Toggle gravity on spacebar
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    player.inverted = !player.inverted; // Flip gravity
  }
});

// Create obstacles at intervals
setInterval(() => {
  const isUpper = Math.random() > 0.5; // 50% chance for upper or lower obstacle
  const obstacleHeight = tunnelGap / 2; // Half the tunnel space
  const yPosition = isUpper ? tunnelCeiling : canvas.height / 2; // Top or bottom half of the tunnel

  obstacles.push({ x: canvas.width, y: yPosition, width: 20, height: obstacleHeight });
}, 2000);

// Game loop
function gameLoop() {
  if (gameOver) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

// Draw tunnel
ctx.fillStyle = '#333'; // Dark walls
ctx.fillRect(0, 0, canvas.width, tunnelCeiling); // Ceiling
ctx.fillRect(0, tunnelFloor, canvas.width, canvas.height - tunnelFloor); // Floor

  // Draw player
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Apply gravity
  player.dy += player.inverted ? -player.gravity : player.gravity; // Reverse gravity if inverted
  player.y += player.dy;

  // Prevent player from leaving the tunnel
  if (player.y < tunnelCeiling) {
    player.y = tunnelCeiling;
    player.dy = 0;
  }
  if (player.y > tunnelFloor - player.height) {
    player.y = tunnelFloor - player.height;
    player.dy = 0;
  }

  // Draw obstacles
  ctx.fillStyle = 'red';
  obstacles.forEach((obstacle, index) => {
    obstacle.x -= 5; // Move obstacle to the left
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
