const canvas = document.getElementById("gameCanvas");
window.focus();
canvas.width = 800;
canvas.height = 400;
let isRunning = false;
document.getElementById("game-wrapper").style.display = "flex";
const buttonToggle = document.getElementById("start");
const ctx = canvas.getContext("2d");
document.getElementById("start").addEventListener("click", (e) => {
  e.target.style.display = "none";
  player.start();
});

const keyBoard = (() => {
  document.addEventListener("keydown", keyHandler);
  document.addEventListener("keyup", keyHandler);
  const keyboard = {
    keySpace: false,
    any: false,
  };
  function keyHandler(e) {
    const state = e.type === "keydown";
    if (e.code === "Space") {
      keyboard.keySpace = state;
      console.log("space");
      e.preventDefault();
    }
    if (state) {
      keyboard.any = true;
    }
  }
  return keyboard;
})();

const world = {
  gravity: 0.2,
  ground: 200,
  groundDrag: 0.9,
  drag: 0.999,
};

const level = {
  levelCounter: 0,
  level: 0,
  levelData: [],
  addLevel(levelData) {
    this.levelData.push(levelData);
  },
  getLevel() {
    return this.levelData[this.level];
  },
  nextLevel() {
    this.level++;
    if (this.level >= this.levelData.length) {
      this.level = 0;
    }
    return this.getLevel();
  },
  reset() {
    this.level = 0;
  },
};
const shapes = {
    sWidth: 10,
    sHeight: 10,
    min : world.ground - 50,
    max: world.ground - 100,
    size: 10,
    x: 0,
    y: 0,  
    size: 10,
  rect(x, y, w, h, color) {
    console.log("rect");
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  },
  triangle(color) {
    const triangle = new Triangle(this.sWidth + 10, this.sHeight + 10, world.ground - this.size,canvas.height - world.ground, this.size, color);
    triangle.draw(color)
    console.log("triangle", triangle);
},
  randomShape(color) {
    const randomNumber = Math.floor(Math.random() * 2); // Generates a random number between 0 and 1
    if (randomNumber === 0) {
      // Create and render a rectangle
        this.rect(300, 500, 10, 10, color)
    } else {
      // Create and render a triangle
    this.triangle(color) 
    }
  },
};
function Triangle (sWidth, sHeight, x, y, size, color) {
    this.sWidth = sWidth
    this.sHeight = sHeight,
    this.x =  x,
    this.y =  y,
    this.size= size,
    this.color = color,
    this.draw = function(color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        let path = new Path2D();
        path.moveTo(this.sWidth / 2 + 30, this.sHeight / 2);
        path.lineTo(this.sWidth / 2, this.sHeight / 2 - 30);
        path.lineTo(this.sWidth / 2 - 30, this.sHeight / 2);
        ctx.fill(path);
    };
};

const player = {
  x: 0,
  y: 0,
  dx: 1,
  dy: 0,
  jumpPower: -5,
  size: 40,
  moveSpeed: 0.005,
  color: "red",
  count: 0,
  playerId: undefined,
  start() {
    if (!this.playerId && !isRunning) {
      console.log("start");
      this.x = ctx.canvas.width / 2 - this.size / 2;
      this.y = world.ground - this.size;
      this.onGround = true;
      this.dx = 0;
      this.dy = 0;
      isRunning = true;
      this.playerId = requestAnimationFrame(mainLoop);
    }
  },
  update() {
    // react to keyboard state
    if (keyBoard.keySpace && this.onGround) {
      this.dy = this.jumpPower;
    }

    // apply gravity drag and move player
    this.dy += world.gravity;
    this.dy *= world.drag;
    this.dx *= this.onGround ? world.groundDrag : world.drag;
    this.x += this.moveSpeed += 0.005;
    this.y += this.dy;

    // test ground contact and left and right limits
    if (this.y + this.size >= world.ground) {
      this.y = world.ground - this.size;
      this.dy = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }
    if (this.x > ctx.canvas.width) {
      this.x -= ctx.canvas.width;
      this.count++;
    }

    if (this.count === 3) {
      this.x = 0;
      console.log("call stop");
      this.stopAnimation();
      level.levelCounter++;
    }
  },
  draw() {
    drawRect(this.x, this.y, this.size, this.size, this.color);
      shapes.randomShape("red");
  },

  stopAnimation() {
    console.log("stop", this.playerId);
    if (this.playerId) {
      this.playerId = undefined;
      this.count = 0;
      this.x = 50;
      this.y = world.ground - this.size;
      this.dx = 0;
      this.dy = 0;
      isRunning = false;
      cancelAnimationFrame(this.playerId);
    }
  },
};

function drawGround(x, y, count = 1) {
  drawRect(x, y, 32 * count, canvas.height - y, "#684027");
  drawRect(x, y, 32 * count, 10, "green");
  //   level.addLevel(shapes.rect(0, 0, 100, 100, "red"), shapes.triangle("blue")
}
function drawRect(x, y, width, height, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.rect(x, y, width, height);
  ctx.fill();
  ctx.closePath();
}
function mainLoop(time) {
 
  if (!isRunning) {
    player.draw();
    buttonToggle.style.display = "flex";
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGround(0, world.ground, 80);
  player.draw();
  player.update();
  requestAnimationFrame(mainLoop);
}

