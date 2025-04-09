//                                   Thanks to Joseph Mendimsa for his help
document.addEventListener("DOMContentLoaded", () => {
  const box = document.getElementById("game-container");
  const mouse = document.getElementById("character");

  let score = 0;
  let enemies = [];
  let dots = [];
  let numEnemies = 0;
  let moveSpeed = 0;
  let seconds = 0;
  let numDots = 0;
  let gameInterval;
  let gameRunning = false;
  seconds = 0;
  temp = false

  UpdateInformation();
  const pickup = document.getElementById("pickup");
  const intervalId = setInterval(1000);


  window.onload = function () {
    gameRunning = false;
    clearInterval(gameInterval);

    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot) => dot.remove());

    const enemies = document.querySelectorAll(".enemy");
    enemies.forEach((enemy) => enemy.remove());

    const player = document.getElementById("character");
    player.style.display = "none";
    const modal1 = document.getElementById("modal-dead");
    modal1.style.visibility = "hidden";
    // const modal2 = document.getElementById("modal-howto");
    // modal2.style.visibility = "hidden";

    const songs = [
      "kemt - Next to You.mp4",
      "Paperkraft - S Act.mp4",
      "Seb Wildblood - Familiar Boundaries.mp4",

      
    ];

    let currentSong = 0;
    const mediaPlayer = document.getElementById("mediaPlayer");

    function playNextSong() {
      if (currentSong >= songs.length) {
        currentSong = 0; // Loop back to first song
      }

      mediaPlayer.src = songs[currentSong];

      mediaPlayer
        .play()
        .then(() => {})
        .catch((error) => {});

      currentSong++;


      document.getElementById("modal-close").addEventListener("click", closeModal);

  function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
    score = 0;
    numEnemies = 1;
    moveSpeed = 1;
    numDots = 1;
    gameRunning = true;
    temp = true
    seconds = 0;

    createDot();
    if (gameRunning) {
      seconds++;
      console.log(seconds)
      UpdateInformation();
    }

    createEnemy();
    UpdateInformation();
    const player = document.getElementById("character");
    player.style.display = "block";

    gameInterval = setInterval(function () {
      if (gameRunning) {
        moveEnemies();
      }
    }, 50);
  }
    }

    mediaPlayer.addEventListener("ended", playNextSong);

    // 🔹 Try autoplay
    playNextSong();

    // 🔹 If autoplay fails, let user start playback with a single click
    document.addEventListener(
      "click",
      function () {
        mediaPlayer.play();
      },
      { once: true }
    ); // Only runs once
  };



  let counts = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    J: 0,
    K: 0,
    L: 0,
    M: 0,
    N: 0,
    O: 0,
    P: 0,
  };
  let probabilities = {
    A: 0.4,
    B: 0.2,
    C: 0.15,
    D: 0.1,
    E: 0.06,
    F: 0.04,
    J: 0.02,
    K: 0.015,
    L: 0.01,
    M: 0.005,
    N: 0.004,
    O: 0.003,
    P: 0.001,
  };
  
  function createDot() {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    box.appendChild(dot);
    moveDot(dot);
    dots.push(dot);

    console.log("num dots", dots.length);

    UpdateInformation();
  }

  function createEnemy() {
    console.log("create enemy");

    const enemy = document.createElement("div");
    enemy.classList.add("enemy");

    // Get the player's current position
    const player = document.getElementById("character");
    const playerRect = player.getBoundingClientRect();

    let enemyX, enemyY;
    let overlap = true;

    // Keep trying to generate an enemy until it doesn't overlap with the player
    while (overlap) {
        // Random position for the enemy within the game container
        enemyX = Math.random() * (box.offsetWidth - 50);  // 50px width of the enemy (adjust as needed)
        enemyY = Math.random() * (box.offsetHeight - 50);  // 50px height of the enemy (adjust as needed)

        // Check if the enemy's generated position overlaps with the player
        const enemyRect = { left: enemyX, top: enemyY, right: enemyX + 50, bottom: enemyY + 50 };

        // Check for overlap with player (bounding box collision detection)
        if (
            enemyRect.right < playerRect.left || 
            enemyRect.left > playerRect.right || 
            enemyRect.bottom < playerRect.top || 
            enemyRect.top > playerRect.bottom
        ) {
            overlap = false;  // No overlap, exit the loop
        }
    }

    // Set the position of the enemy
    enemy.style.left = `${enemyX}px`;
    enemy.style.top = `${enemyY}px`;

    // Append the enemy to the container and initiate movement
    box.appendChild(enemy);
    moveEnemy(enemy);

    enemies.push(enemy);

    console.log("num enemies", enemies.length);

    UpdateInformation();
}


  function getRandomPosition() {
    const boxRect = box.getBoundingClientRect();
    return {
      left: Math.random() * (boxRect.width - 20) + "px",
      top: Math.random() * (boxRect.height - 20) + "px",
    };
  }

  function moveDot(dot) {
    updateDots();
    dotProbabilities(dot);

    const newPos = getRandomPosition();

    dot.style.left = newPos.left;
    dot.style.top = newPos.top;
  }

  function moveEnemy(enemy) {
    const newPos = getRandomPosition();

    enemy.style.left = newPos.left;
    enemy.style.top = newPos.top;
  }

  function areElementsTouching(el1, el2) {
    // UpdateInformation()
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    return (
      rect1.left < rect2.right &&
      rect1.right > rect2.left &&
      rect1.top < rect2.bottom &&
      rect1.bottom > rect2.top
    );
  }

    function moveEnemies() {
    enemies.forEach((enemy) => {
      const mouseRect = mouse.getBoundingClientRect();
      const enemyRect = enemy.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();

      let enemyX = parseFloat(enemy.style.left) || 0;
      let enemyY = parseFloat(enemy.style.top) || 0;

      let mouseX = mouseRect.left - boxRect.left;
      let mouseY = mouseRect.top - boxRect.top;

      let dx = mouseX - enemyX;
      let dy = mouseY - enemyY;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0) {
        dx /= dist;
        dy /= dist;
      }

      enemyX += dx * moveSpeed;
      enemyY += dy * moveSpeed;

      enemy.style.left = `${Math.max(
        0,
        Math.min(boxRect.width - 20, enemyX)
      )}px`;
      enemy.style.top = `${Math.max(
        0,
        Math.min(boxRect.height - 20, enemyY)
      )}px`;

      if (areElementsTouching(mouse, enemy)) {
        gameOver();
      }
    });
  }

  function gameOver() {
    console.log("game over");

    // UpdateInformation()
    // if (!gameRunning) return;
    gameRunning = false;
    const finalScore = document.getElementById("ripScore");
    finalScore.innerHTML = score;
    finalScore.style.color = "#FFD700";
    const finalTime = document.getElementById("ripTime");
    console.log(seconds);
    finalTime.innerHTML = seconds;
    finalTime.style.color = "#FFD700";

    clearInterval(gameInterval);
    console.log(intervalId)
    clearInterval(intervalId);
    const dots = document.querySelectorAll(".dot");
    numDots = 0;
    dots.forEach((dot) => dot.remove());
    const enemies = document.querySelectorAll(".enemy");
    numEnemies = 0;
    updateEnemies();
    const player = document.getElementById("character");
    player.style.visibility = "hidden";

    const modal1 = document.getElementById("modal-dead");
    modal1.style.visibility = "visible";

    // const modal2 = document.getElementById("modal-howto");
    // modal2.style.visibility = "hidden";

    document.getElementById("restart").addEventListener("click", restart);
    // document.getElementById("modal-close2").addEventListener("click", closeModal2);
    document.getElementById("information").addEventListener("click", information);

    function information(){
    //   const modal2 = document.getElementById("modal-howto");
    // modal2.style.visibility = "visible";
    const modal1 = document.getElementById("modal-dead");
    modal1.style.visibility = "hidden";
    }

  // function closeModal2() {
  //   UpdateInformation()
  //   updateDots();
  //   updateEnemies();
  //   const modal = document.getElementById("modal-howto");
  //   modal.style.visibility = "hidden";
  //   score = 0;
  //   numEnemies = 0;
  //   moveSpeed = 0;
  //   numDots = 1;
  //   gameRunning = true;
  //   temp = true
  //   seconds = 0;


  //   createDot();
  //   createEnemy();
  //   UpdateInformation();
  //   const player = document.getElementById("character");
  //   player.style.visibility = "visible";

  //   gameInterval = setInterval(function () {
  //     if (gameRunning) {
  //       moveEnemies();
  //     }
  //   }, 50);

  //   if (gameRunning) {
  //     seconds++;
  //     console.log(seconds)
  //     UpdateInformation();
  //   }
  // }
    

  function restart() {
    location.reload();    // const modal = document.getElementById("modal");
    // modal.style.display = "none";
    // score = 0;
    // numEnemies = 1;
    // moveSpeed = 1;
    // numDots = 1;
    // gameRunning = true;
    // temp = true
    // seconds = 0;

    // updateDots();
    // updateEnemies();
    // if (gameRunning) {
    //   seconds++;
    //   console.log(seconds)
    //   UpdateInformation();
    // }
    // UpdateInformation();

    // gameInterval = setInterval(function () {
    //   if (gameRunning) {
    //     moveEnemies();
    //   }
    // }, 50);

    // const player = document.getElementById("character");
    // player.style.visibility = "visible";

    // const modal1 = document.getElementById("modal-dead");
    // modal1.style.visibility = "hidden";
  }
  }

  function decreaseEnemies(amount) {
    numEnemies = Math.max(1, numEnemies - amount);
    updateEnemies();
  }

  window.addEventListener("mousemove", (event) => {
    const boxRect = box.getBoundingClientRect();
    const x = event.clientX - boxRect.left - mouse.offsetWidth / 2;
    const y = event.clientY - boxRect.top - mouse.offsetHeight / 2;

    mouse.style.left = `${Math.max(0, Math.min(boxRect.width - 20, x))}px`;
    mouse.style.top = `${Math.max(0, Math.min(boxRect.height - 20, y))}px`;

    dots.forEach((dot) => {
      if (areElementsTouching(mouse, dot)) {
        updateDots();
        // UpdateInformation();
        pickup.play();

        if (counts["A"] == 1) {
          console.log("A");
          moveSpeed++;
          score++;
          numEnemies++;
          // createEnemy();
          updateEnemies();
        } else if (counts["B"] == 1) {
          score++;
          moveSpeed++;
        } else if (counts["C"] == 1) {
          score++;
          if (numEnemies > 1) {
            decreaseEnemies(1);
          } else {
          }
        } else if (counts["D"] == 1) {
          score += 2;
          numDots++;
          if (numEnemies > 2) {
            decreaseEnemies(2);
          } else if (numEnemies > 1) {
            decreaseEnemies(1);
          }
        } else if (counts["E"] == 1) {
          score += 3;
          decreaseEnemies(1);
        } else if (counts["F"] == 1) {
          console.log("F");
          score += 3;
          numDots += 3;
          updateEnemies();
          setTimeout(() => {
            numDots = Math.max(1, numDots - 2);
            updateDots();
          }, 1000);
          if (numEnemies > 2) {
            decreaseEnemies(2);
          } else if (numEnemies > 1) {
            decreaseEnemies(1);
          }
        } else if (counts["G"] == 1) {
          score += 4;
          if (numEnemies > 1) {
            decreaseEnemies(1);
          }
        } else if (counts["H"] == 1) {
          score += 4;
        } else if (counts["I"] == 1) {
          score += 5;
          moveSpeed = Math.max(1, moveSpeed - 1);
          if (numEnemies > 3) {
            decreaseEnemies(3);
          } else if (numEnemies > 2) {
            decreaseEnemies(2);
          } else if (numEnemies > 1) {
            decreaseEnemies(1);
          }
        } else if (counts["J"] == 1) {
          score += 6;
          numDots += 5;
          setTimeout(() => {
            numDots += 3;
            updateDots();
          }, 5000);

          if (numEnemies > 3) {
            decreaseEnemies(3);
          } else if (numEnemies > 2) {
            decreaseEnemies(2);
          } else if (numEnemies > 1) {
            decreaseEnemies(1);
          }

          moveSpeed = Math.max(1, moveSpeed - 3);
        } else if (counts["K"] == 1) {
          console.log("K");
          score += 8;
          if (numEnemies > 4) {
            decreaseEnemies(4);
            setTimeout(() => {
              numEnemies += 2;
              updateEnemies();
            }, 5000);
          } else if (numEnemies > 3) {
            decreaseEnemies(3);
            setTimeout(() => {
              numEnemies++;
              updateEnemies();
            }, 5000);
          } else if (numEnemies > 2) {
            decreaseEnemies(2);
          } else if (numEnemies > 1) {
            decreaseEnemies(1);
          }
        } else if (counts["L"] == 1) {
          score += 10;
          if (numEnemies > 4) {
            decreaseEnemies(4);
          } else if (numEnemies > 3) {
            decreaseEnemies(3);
          } else if (numEnemies > 2) {
            decreaseEnemies(2);
          } else if (numEnemies > 1) {
            decreaseEnemies(1);
          }
        } else if (counts["M"] == 1) {
          score += 22; // 12 + 10
          numDots += 3;

          if (numEnemies > 5) {
            decreaseEnemies(5);
          } else if (numEnemies > 4) {
            decreaseEnemies(4);
          } else if (numEnemies > 3) {
            decreaseEnemies(3);
          } else if (numEnemies > 2) {
            decreaseEnemies(2);
          } else if (numEnemies > 1) {
            decreaseEnemies(1);
          }
        } else if (counts["N"] == 1) {
          score += 15;
          moveSpeed = Math.max(1, moveSpeed - 5);

          if (numEnemies > 5) {
            decreaseEnemies(5);
          } else if (numEnemies > 4) {
            decreaseEnemies(4);
          } else if (numEnemies > 3) {
            decreaseEnemies(3);
          } else if (numEnemies > 2) {
            decreaseEnemies(2);
          } else if (numEnemies > 1) {
            decreaseEnemies(1);
          }
        } else if (counts["O"] == 1) {
          score += 500;
          numDots += 10;

          if (numEnemies > 6) {
            decreaseEnemies(6);
          } else if (numEnemies > 5) {
            decreaseEnemies(5);
          } else if (numEnemies > 4) {
            decreaseEnemies(4);
          } else if (numEnemies > 3) {
            decreaseEnemies(3);
          } else if (numEnemies > 2) {
            decreaseEnemies(2);
          } else if (numEnemies > 1) {
            decreaseEnemies(1);
          }
        } else if (counts["P"] == 1) {
          score += 1000;

          if (numEnemies > 6) {
            decreaseEnemies(6);
          } else if (numEnemies > 5) {
            decreaseEnemies(5);
          } else if (numEnemies > 4) {
            decreaseEnemies(4);
          } else if (numEnemies > 3) {
            decreaseEnemies(3);
          } else if (numEnemies > 2) {
            decreaseEnemies(2);
          } else if (numEnemies > 1) {
            decreaseEnemies(1);
          }
        }

        // UpdateInformation();
        moveDot(dot);
      }
    });
  });

  function updateDots() {
    let currentDots = document.querySelectorAll(".dot").length;

    if (currentDots < numDots) {
      for (let i = currentDots; i < numDots; i++) {
        createDot();
      }
    } else if (currentDots > numDots) {
      const extraDots = document.querySelectorAll(".dot");
      for (let i = currentDots - 1; i >= numDots; i--) {
        extraDots[i].remove();
      }
    }
  }

  function updateEnemies() {
    let currentEnemies = document.querySelectorAll(".enemy").length;
    // console.log(currentEnemies)
    if (currentEnemies < numEnemies) {
      for (let i = currentEnemies; i < numEnemies; i++) {
        createEnemy();
      }
    } else if (currentEnemies > numEnemies) {
      const extraEnemies = document.querySelectorAll(".enemy");
      for (let i = currentEnemies - 1; i >= numEnemies; i--) {
        extraEnemies[i].remove();
      }
    }
  }

  for (let i = 0; i < numDots; i++) {
    createDot();
  }

  function UpdateInformation() {
    console.log("Move Speed" + moveSpeed);
    let scoreUpdate = document.getElementById("score");
    scoreUpdate.innerHTML = score;
    console.log("Updated score: " + score);

    let enemyUpdate = document.getElementById("enemy");
    enemyUpdate.innerHTML = document.querySelectorAll(".enemy").length;

    let dotUpdate = document.getElementById("dots");
    dotUpdate.innerHTML = document.querySelectorAll(".dot").length;

    let speedUpdate = document.getElementById("speed");
    speedUpdate.innerHTML = moveSpeed;
    
    let timeUpdate = document.getElementById("time");
    timeUpdate.innerHTML = seconds;
  }

  function dotProbabilities(dot) {
    Object.keys(counts).forEach((letter) => (counts[letter] = 0));

    for (let i = 0; i < 1; i++) {
      let randomNumber = Math.random();
      let cumulativeProbability = 0;

      for (let letter in probabilities) {
        cumulativeProbability += probabilities[letter];
        if (randomNumber < cumulativeProbability) {
          counts[letter]++;
          break; // Exit the loop once a letter is chosen
        }
      }
    }

    // let dot = document.getElementsByClassName("dot");
    {
      if (counts["A"] == 1) {
        dot.style.background =
          "radial-gradient(circle, #ff0000 20%, #990000 100%)"; // Bright Red
        dot.style.boxShadow = "0px 0px 10px rgba(255, 0, 0, 0.8)";
      } else if (counts["B"] == 1) {
        dot.style.background =
          "radial-gradient(circle, #ff4500 20%, #b22222 100%)"; // Deep Orange
        dot.style.boxShadow = "0px 0px 10px rgba(255, 69, 0, 0.8)";
      } else if (counts["C"] == 1) {
        dot.style.background =
          "radial-gradient(circle, #ff9900 20%, #cc6600 100%)"; // Vivid Orange
        dot.style.boxShadow = "0px 0px 10px rgba(255, 153, 0, 0.8)";
      } else if (counts["D"] == 1) {
        dot.style.background =
          "radial-gradient(circle, #ffcc00 20%, #b38f00 100%)"; // Bright Yellow
        dot.style.boxShadow = "0px 0px 10px rgba(255, 204, 0, 0.8)";
      } else if (counts["E"] == 1) {
        dot.style.background =
          "radial-gradient(circle, #ffff00 20%, #b3b300 100%)"; // Yellow-Green
        dot.style.boxShadow = "0px 0px 10px rgba(255, 255, 0, 0.8)";
      } else if (counts["F"] == 1) {
        dot.style.background =
          "radial-gradient(circle, #66ff00 20%, #339900 100%)"; // Bright Green
        dot.style.boxShadow = "0px 0px 10px rgba(102, 255, 0, 0.8)";
      } else if (counts["G"] == 1) {
        dot.style.background =
          "radial-gradient(circle, #00cc00 20%, #006600 100%)"; // Deep Green
        dot.style.boxShadow = "0px 0px 10px rgba(0, 204, 0, 0.8)";
      } else if (counts["H"] == 1) {
        dot.style.background =
          "radial-gradient(circle, #00ffcc 20%, #008b8b 100%)"; // Cyan
        dot.style.boxShadow = "0px 0px 10px rgba(0, 255, 204, 0.8)";
      } else if (counts["I"] == 1) {
        dot.style.background =
          "radial-gradient(circle, #0099ff 20%, #0066cc 100%)"; // Sky Blue
        dot.style.boxShadow = "0px 0px 10px rgba(0, 153, 255, 0.8)";
      } else if (counts["J"] == 1) {
        dot.style.background =
          "radial-gradient(circle, #0044ff 20%, #0022aa 100%)"; // Deep Blue
        dot.style.boxShadow = "0px 0px 10px rgba(0, 68, 255, 0.8)";
      } else if (counts["K"] == 1) {
        dot.style.background =
          "radial-gradient(circle, #6600cc 20%, #4b0082 100%)"; // Indigo
        dot.style.boxShadow = "0px 0px 10px rgba(102, 0, 204, 0.8)";
      } else if (counts["L"] == 1) {
        dot.style.background =
          "radial-gradient(circle, #8b00ff 20%, #5a0099 100%)"; // Violet
        dot.style.boxShadow = "0px 0px 10px rgba(139, 0, 255, 0.8)";
      } else if (counts["M"] == 1) {
        dot.style.background =
          "radial-gradient(circle, #9900cc 20%, #660099 100%)"; // Deep Purple
        dot.style.boxShadow = "0px 0px 10px rgba(153, 0, 204, 0.8)";
      } else if (counts["N"] == 1) {
        dot.style.background =
          "radial-gradient(circle, #ff00cc 20%, #b3008b 100%)"; // Pink-Magenta
        dot.style.boxShadow = "0px 0px 10px rgba(255, 0, 204, 0.8)";
      } else if (counts["O"] == 1) {
        dot.style.background =
          "radial-gradient(circle, #ff1493 20%, #c71585 100%)"; // Bright Pink
        dot.style.boxShadow = "0px 0px 10px rgba(255, 20, 147, 0.8)";
      } else if (counts["P"] == 1) {
        dot.style.background =
          "radial-gradient(circle, #ff0066 20%, #b30047 100%)"; // Hot Pink
        dot.style.boxShadow = "0px 0px 10px rgba(255, 0, 102, 0.8)";
      }
    }
  }
});