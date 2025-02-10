let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// 게임 시작 버튼 눌렀을 때의 이벤트
document.querySelector(".game-start").addEventListener("click", () => {
  const gameTutorial = document.querySelector(".game-tutorial");
  canvas.width = gameTutorial.clientWidth;
  canvas.height = 400;
  gameTutorial.style.display = "none";

  const gameStart = document.querySelector(".game-start");
  gameStart.style.display = "none";

  const score = document.querySelector(".game-score");
  score.style.display = "flex";

  frameRun();
});

// 움직이는 배경 만들기
let backgroundX = 0;
const backgroundImage = new Image();
backgroundImage.src = "./img/background.png";

function drawBackground() {
  ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, 400);
  ctx.drawImage(
    backgroundImage,
    backgroundX + canvas.width,
    0,
    canvas.width,
    400
  );

  backgroundX -= 2;
  if (backgroundX <= -canvas.width) {
    backgroundX = 0;
  }
}

let timer = 0;
let animation;

function frameRun() {
  // 움직이는 배경
  animation = requestAnimationFrame(frameRun);
  ctx.clearRect(0, 0, canvas.widht, canvas.height);

  drawBackground();
  timer++;

  // 움직이는 바닥
  drawFloor();

  // 장애물
  if (Math.random() < 0.01) {
    let obstacleNum = Math.round(Math.random() * 2);
    let obstacle = new Obstacle(obstacleNum);

    manyObstacles.push(obstacle);
  }
  manyObstacles.forEach((a, i, o) => {
    if (a.x < 0) o.splice(i, 1);
    a.x = a.x - 5;

    a.draw();

    crash(cat, a); // 고양이와 장애물 충돌 감지
  });

  // 고양이
  if (timer % 20 === 0) {
    currentCat = (currentCat + 1) % 2;
  }
  cat.draw();

  // 고양이 점프
  if (jumpSwitch) {
    cat.jump();
    jumpTimer++;
  } else {
    if (cat.y < 270) {
      if (cat.y == 180) jumpCount = 1;
      else if (cat.y == 260) jumpCount = 0;
      cat.y = cat.y + 2;
    }
  }
  if (jumpTimer > 8) {
    jumpSwitch = false;
    jumpTimer = 0;
  }
}

// 움직이는 바닥 만들기
let floorX = 0;
const floorImage = new Image();
floorImage.src = "./img/floor.png";
function drawFloor() {
  ctx.drawImage(floorImage, floorX, 320, canvas.width, 100);
  ctx.drawImage(floorImage, floorX + canvas.width, 320, canvas.width, 100);

  floorX -= 4;
  if (floorX <= -canvas.width) {
    floorX = 0;
  }
}

// 랜덤 장애물 그리기
let manyObstacles = [];
const obstacleImgs = [
  { img: new Image(), y: 286, width: 40, height: 45 },
  { img: new Image(), y: 286, width: 40, height: 45 },
  { img: new Image(), y: 320, width: 70, height: 80 },
];
obstacleImgs[0].img.src = "./img/obstacle1.png";
obstacleImgs[1].img.src = "./img/obstacle2.png";
obstacleImgs[2].img.src = "./img/obstacle3.png";

class Obstacle {
  constructor(num) {
    this.num = num;
    this.width = obstacleImgs[num].width;
    this.height = obstacleImgs[num].height;
    this.x = canvas.width - this.width;
    this.y = obstacleImgs[num].y;
  }
  draw() {
    ctx.drawImage(
      obstacleImgs[this.num].img,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

// 점수 기록
let score = 0;
let scoreInterval = setInterval(updateScore, 1000);
function updateScore() {
  score += 1;
  document.querySelector(".game-score span").textContent = score;
}

// 움직이는 고양이 그리기
const catImages = [new Image(), new Image()];
catImages[0].src = "./img/cat1.png";
catImages[1].src = "./img/cat2.png";

let currentCat = 0;
let cat = {
  x: 30,
  y: 270,
  width: 70,
  height: 60,
  draw() {
    ctx.drawImage(
      catImages[currentCat],
      this.x,
      this.y,
      this.width,
      this.height
    );
  },
  jump() {
    this.y -= 12;
  },
  fall() {
    if (this.y < 10) {
      this.y += 8;
    }
  },
};

// 고양이와 장애물 충돌

function crash(cat, obstacle) {
  let xCal = obstacle.x - (cat.x + cat.width);
  let yCal = obstacle.y - (cat.y + cat.height);

  if (
    (xCal < 0 && yCal < 0) ||
    (xCal < 0 && obstacle.num == 2 && cat.y == 270)
  ) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(animation);
    clearInterval(scoreInterval);
    const totalScore = document.querySelector(".total-score");
    const gameOver = document.querySelector(".game-over");

    totalScore.textContent = `${score}`;
    gameOver.style.display = "flex";

    manyObstacles = [];

    const gameTutorial = document.querySelector(".game-tutorial");
    gameTutorial.style.display = "block";
  }
}

// 고양이 점프
var jumpSwitch = false;
let jumpCount = 0;
let jumpTimer = 0;
/*
let lastSpacePressTIme = 0;
마지막으로 스페이스바를 누른 시간을 기록하여 연속 점프 시간의 간격을 조정하고자 했으나
고양이 이미지의 y축 위치를 기준으로 연속 점프를 관리하여 사용하지 않게 된 변수
*/

document.addEventListener("keydown", function (e) {
  if (e.code === "Space" || e.code === "ArrowUp") {
    if (jumpCount <= 1) {
      jumpSwitch = true;
      jumpCount++;
    }
  }
});

// 리플레이
document.querySelector(".replay").addEventListener("click", () => {
  replayGame();
});

function replayGame() {
  cancelAnimationFrame(animation);
  clearInterval(scoreInterval);
  score = 0;
  document.querySelector(".game-score span").textContent = score;
  manyObstacles = [];
  currentCat = 0;
  jumpSwitch = false;
  jumpCount = 0; // 스페이스바를 누르며 "다시하기" 버튼 클릭 시 해당 변수 초기화가 되지 않는 이슈로 추가된 코드
  lastSpacePressTIme = 0;

  frameRun();

  const gameOver = document.querySelector(".game-over");
  gameOver.style.display = "none";
  const gameTutorial = document.querySelector(".game-tutorial");
  gameTutorial.style.display = "none";

  if (scoreInterval) clearInterval(scoreInterval);
  scoreInterval = setInterval(updateScore, 1000);
}
