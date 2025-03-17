const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x87CEEB,
});
document.body.appendChild(app.view);

let fish, food = [], scoreText, gameOver = false, score = 0;
let moveUp = false, moveDown = false, moveLeft = false, moveRight = false;

const fishTexture = PIXI.Texture.from('https://pixijs.com/assets/tutorials/fish-pond/fish2.png');
fish = new PIXI.Sprite(fishTexture);
fish.anchor.set(0.5);
fish.x = 100;
fish.y = 300;
fish.scale.set(0.3);
app.stage.addChild(fish);

scoreText = new PIXI.Text(`Score: ${score}`, { fontSize: 24, fill: "#ffffff" });
scoreText.x = 10;
scoreText.y = 10;
app.stage.addChild(scoreText);

const restartButton = document.createElement("button");
restartButton.textContent = "Restart Game";
restartButton.style.position = "absolute";
restartButton.style.bottom = "20px";
restartButton.style.left = "50%";
restartButton.style.transform = "translateX(-50%)";
restartButton.style.fontSize = "24px";
restartButton.style.padding = "10px 20px";
restartButton.style.backgroundColor = "#4CAF50";
restartButton.style.color = "white";
restartButton.style.border = "none";
restartButton.style.cursor = "pointer";
document.body.appendChild(restartButton);
restartButton.style.display = "none";
restartButton.addEventListener("click", restartGame);

function createFood() {
  const colors = { yellow: 0xFFFF00, green: 0x00FF00, blue: 0x0000FF };
  const types = Object.keys(colors);
  const type = types[Math.floor(Math.random() * types.length)];

  let foodItem = new PIXI.Graphics();
  foodItem.beginFill(colors[type]);
  foodItem.drawCircle(0, 0, 15);
  foodItem.endFill();
  foodItem.x = Math.random() * (app.view.width - 50) + 25;
  foodItem.y = Math.random() * (app.view.height - 50) + 25;
  foodItem.foodType = type;
  foodItem.radius = 15;
  app.stage.addChild(foodItem);
  food.push(foodItem);
}

function checkFoodCollision() {
  for (let i = food.length - 1; i >= 0; i--) {
    let f = food[i];
    let dx = fish.x - f.x;
    let dy = fish.y - f.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < (fish.width / 2) + f.radius) {
      app.stage.removeChild(f);
      food.splice(i, 1);
      score++;
      scoreText.text = `Score: ${score}`;

      if (f.foodType === 'yellow') {
        fish.scale.set(fish.scale.x + 0.02);
      } else if (f.foodType === 'green') {
        fish.scale.set(fish.scale.x + 0.02); 
      } else if (f.foodType === 'blue') {
        fish.scale.set(fish.scale.x + 0.02); 
      }
      createFood();
      break;
    }
  }
}

let speed = 5;
document.addEventListener('keydown', (event) => {
  if (event.key === "ArrowUp" || event.key === "w") moveUp = true;
  if (event.key === "ArrowDown" || event.key === "s") moveDown = true;
  if (event.key === "ArrowLeft" || event.key === "a") moveLeft = true;
  if (event.key === "ArrowRight" || event.key === "d") moveRight = true;
});

document.addEventListener('keyup', (event) => {
  if (event.key === "ArrowUp" || event.key === "w") moveUp = false;
  if (event.key === "ArrowDown" || event.key === "s") moveDown = false;
  if (event.key === "ArrowLeft" || event.key === "a") moveLeft = false;
  if (event.key === "ArrowRight" || event.key === "d") moveRight = false;
});

app.ticker.add(() => {
  if (gameOver) return;

  let adjustedSpeed = speed / fish.scale.x;
  if (moveUp) fish.y -= adjustedSpeed;
  if (moveDown) fish.y += adjustedSpeed;
  if (moveLeft) fish.x -= adjustedSpeed;
  if (moveRight) fish.x += adjustedSpeed;

  checkFoodCollision();

  if (fish.x < 0 || fish.x > app.view.width || fish.y < 0 || fish.y > app.view.height) {
    gameOver = true;
    scoreText.text = `Game Over! Final Score: ${score}`;
    scoreText.style.fontSize = 48;
    scoreText.x = app.view.width / 2 - scoreText.width / 2;
    scoreText.y = app.view.height / 2 - scoreText.height / 2;
    restartButton.style.display = "block";
  }
});

function restartGame() {
  score = 0;
  gameOver = false;
  scoreText.text = `Score: ${score}`;
  scoreText.style.fontSize = 24;
  scoreText.x = 10;
  scoreText.y = 10;
  fish.x = 100;
  fish.y = 300;
  fish.scale.set(0.3);
  speed = 5;
  food.forEach(f => app.stage.removeChild(f));
  food = [];
  createFood();
  restartButton.style.display = "none";
}

createFood();