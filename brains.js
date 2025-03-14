//                                   Thanks to Joseph Mendimsa for his help
document.addEventListener("DOMContentLoaded", () => {
    const box = document.getElementById("game-container");
    const mouse = document.getElementById("character");

    let score = 0;
    let enemies = [];
    let dots = [];
    let numEnemies = 1;
    let moveSpeed = 1;
    let numDots = 1;
    let lives = 3;
    let gameInterval;
    let gameRunning = true;


    let counts = { A:0,B:0,C:0,D:0,E:0,F:0,J:0,K:0,L:0,M:0,N:0,O:0,P:0};
    // let probabilities = { 
    // A: 0.4,
    // B: 0.2,
    // C: 0.15,
    // D: 0.1,
    // E: 0.06,
    // F: 0.04,
    // J: 0.02,
    // K: 0.015,
    // L: 0.01,
    // M: 0.005,
    // N: 0.004,
    // O: 0.003,
    // P: 0.001}

    let probabilities = { 
        A: 0.33,
        B: 0.33,
        C: .33,
        // D: 0.1,
        // E: 0.06,
        // F: 0.04,
        // J: 0.02,
        // K: 0.015,
        // L: 0.01,
        // M: 0.005,
        // N: 0.004,
        // O: 0.003,
        // P: 0.5
    }

    // let probabilities = { A: .5, B: .25, C: 0.25, D: 0, E: 0.0, F: 0.0 };

    function createDot() {
        UpdateInformation()
        const dot = document.createElement("div");
        dot.classList.add("dot");
        box.appendChild(dot);
        moveDot(dot);
        dots.push(dot);
    }

    function createEnemy() {
        UpdateInformation()
        const enemy = document.createElement("div");
        enemy.classList.add("enemy");
        box.appendChild(enemy);
        moveEnemy(enemy);
        enemies.push(enemy);
    }

    function getRandomPosition() {
        UpdateInformation()
        const boxRect = box.getBoundingClientRect();
        return {
            left: Math.random() * (boxRect.width - 20) + "px",
            top: Math.random() * (boxRect.height - 20) + "px",
        };
    }

    function moveDot(dot) {
        updateDots()
        dotProbabilities(dot);
        // console.log(counts)
        UpdateInformation()
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
        UpdateInformation()
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
        UpdateInformation()
        enemies.forEach(enemy => {
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

            enemy.style.left = `${Math.max(0, Math.min(boxRect.width - 20, enemyX))}px`;
            enemy.style.top = `${Math.max(0, Math.min(boxRect.height - 20, enemyY))}px`;

            if (areElementsTouching(mouse, enemy)) {
                gameOver();
                
            }
        });
    }

    function gameOver() {
        UpdateInformation()
        if (!gameRunning) return;
        lives--;
        moveSpeed = 1;
        numEnemies = 1;
        numDots = 1;
            score = 0;
        updateEnemies();
        updateDots()
    
        if (lives < 1) {
            character.style.backgroundColor = 'black';
            stopGame();
        }
    }

    function stopGame() {
        gameRunning = false;
        clearInterval(gameInterval);
        const dots = document.querySelectorAll('.dot');
        dots.forEach(dot => dot.remove());
        const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => enemy.remove());
    const player = document.getElementById('character');
    player.remove();
    }

    gameInterval = setInterval(function() {
        if (gameRunning) {
            moveEnemies();
        } else {
        }
    }, 50);
    
    function decrementLives() {
        lives--;
        gameOver();
    }

    // Function to safely decrease numEnemies
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
    
        dots.forEach(dot => {
            if (areElementsTouching(mouse, dot)) {
                updateDots()
                UpdateInformation();
                
                if (counts["A"] == 1){
                    moveSpeed++;
                    score++;
                    numEnemies++;
                    console.log(numEnemies)
                    updateEnemies();
                }
                
                else if(counts["B"] == 1){
                    score++;
                    moveSpeed++
                }
                
                else if(counts["C"] == 1){
                    score++;
                    console.log(numEnemies)
                    if(numEnemies > 1){
                        decreaseEnemies(1);
                    }
                }
                
                else if(counts["D"] == 1){
                    score += 2;
                    numDots++;
                    if(numEnemies > 2){
                        decreaseEnemies(2);
                    } else if(numEnemies > 1){
                        decreaseEnemies(1);
                    }
                }
                
                else if(counts["E"] == 1){
                    score += 3;
                    decreaseEnemies(1);
                }
                
                else if(counts["F"] == 1){
                    score += 3;
                    numDots += 3;
                    updateEnemies();
                    setTimeout(() => {
                        numDots = Math.max(1, numDots - 2);
                        updateDots();
                    }, 1000);
                    if(numEnemies > 2){
                        decreaseEnemies(2);
                    } else if(numEnemies > 1){
                        decreaseEnemies(1);
                    }
                }
                
                else if(counts["G"] == 1){
                    score += 4;
                    if(numEnemies > 1){
                        decreaseEnemies(1);
                    }
                }
                
                else if(counts["H"] == 1){
                    score += 4;
                    lives++;
                }
                
                else if(counts["I"] == 1){
                    score += 5;
                    moveSpeed = Math.max(1, moveSpeed - 1);
                    if (numEnemies > 3){
                        decreaseEnemies(3);
                    } else if(numEnemies > 2){
                        decreaseEnemies(2);
                    } else if(numEnemies > 1){
                        decreaseEnemies(1);
                    }
                }
                
                else if(counts["J"] == 1){
                    score += 6;
                    numDots += 5;
                    setTimeout(() => {
                        numDots += 3;
                        updateDots();
                    }, 5000);

                    if (numEnemies > 3){
                        decreaseEnemies(3);
                    } else if(numEnemies > 2){
                        decreaseEnemies(2);
                    } else if(numEnemies > 1){
                        decreaseEnemies(1);
                    }
                    
                    moveSpeed = Math.max(1, moveSpeed - 3);
                }
                
                else if(counts["K"] == 1){
                    score += 8;
                    lives++;
                    console.log("K: " + numEnemies)
                    if(numEnemies > 4){
                        decreaseEnemies(4);
                        setTimeout(() => {
                            numEnemies += 2;
                            updateEnemies();
                        }, 5000);
                    } else if (numEnemies > 3){
                        decreaseEnemies(3);
                        setTimeout(() => {
                            numEnemies++;
                            updateEnemies();
                        }, 5000);
                    } else if(numEnemies > 2){
                        decreaseEnemies(2);
                    } else if(numEnemies > 1){
                        decreaseEnemies(1);
                    }
                }
                
                else if(counts["L"] == 1){
                    score += 10;
                    if(numEnemies > 4){
                        decreaseEnemies(4);
                    } else if (numEnemies > 3){
                        decreaseEnemies(3);
                    } else if(numEnemies > 2){
                        decreaseEnemies(2);
                    } else if(numEnemies > 1){
                        decreaseEnemies(1);
                    }
                }
                
                else if(counts["M"] == 1){
                    score += 22; // 12 + 10
                    numDots += 3;
                    
                    if(numEnemies > 5){
                        decreaseEnemies(5);
                    } else if(numEnemies > 4){
                        decreaseEnemies(4);
                    } else if (numEnemies > 3){
                        decreaseEnemies(3);
                    } else if(numEnemies > 2){
                        decreaseEnemies(2);
                    } else if(numEnemies > 1){
                        decreaseEnemies(1);
                    }
                }
                
                else if(counts["N"] == 1){
                    score += 15;
                    moveSpeed = Math.max(1, moveSpeed - 5);
                    
                    if(numEnemies > 5){
                        decreaseEnemies(5);
                    } else if(numEnemies > 4){
                        decreaseEnemies(4);
                    } else if (numEnemies > 3){
                        decreaseEnemies(3);
                    } else if(numEnemies > 2){
                        decreaseEnemies(2);
                    } else if(numEnemies > 1){
                        decreaseEnemies(1);
                    }
                }
                
                else if(counts["O"] == 1){
                    score += 500;
                    numDots += 10;
                    
                    if(numEnemies > 6){
                        decreaseEnemies(6);
                    } else if(numEnemies > 5){
                        decreaseEnemies(5);
                    } else if(numEnemies > 4){
                        decreaseEnemies(4);
                    } else if (numEnemies > 3){
                        decreaseEnemies(3);
                    } else if(numEnemies > 2){
                        decreaseEnemies(2);
                    } else if(numEnemies > 1){
                        decreaseEnemies(1);
                    }
                }
                
                else if(counts["P"] == 1){
                    score += 1000;
                    lives = 100;
                    
                    if(numEnemies > 6){
                        decreaseEnemies(6);
                    } else if(numEnemies > 5){
                        decreaseEnemies(5);
                    } else if(numEnemies > 4){
                        decreaseEnemies(4);
                    } else if (numEnemies > 3){
                        decreaseEnemies(3);
                    } else if(numEnemies > 2){
                        decreaseEnemies(2);
                    } else if(numEnemies > 1){
                        decreaseEnemies(1);
                    }
                }
                
                moveDot(dot);
            }
        });
    });

    function updateDots() {
        let currentDots = document.querySelectorAll('.dot').length;
    
        if (currentDots < numDots) {
            for (let i = currentDots; i < numDots; i++) {
                createDot();
            }
        } else if (currentDots > numDots) {
            const extraDots = document.querySelectorAll('.dot');
            for (let i = currentDots - 1; i >= numDots; i--) {
                extraDots[i].remove();
            }
        }
    }

    function updateEnemies() {
        let currentEnemies = document.querySelectorAll('.enemy').length;
        
        if (currentEnemies < numEnemies) {
            for (let i = currentEnemies; i < numEnemies; i++) {
                createEnemy();
            }
        } else if (currentEnemies > numEnemies) {
            const extraEnemies = document.querySelectorAll('.enemy');
            for (let i = currentEnemies - 1; i >= numEnemies; i--) {
                extraEnemies[i].remove();
            }
        }
    }

    for (let i = 0; i < numDots; i++) {
        createDot();
    }
    
    function UpdateInformation(){
        let scoreUpdate = document.getElementById('score')
        scoreUpdate.innerHTML = score
        let livesUpdate = document.getElementById('lives')
        livesUpdate.innerHTML = lives
        let enemyUpdate = document.getElementById('enemy')
        enemyUpdate.innerHTML = numEnemies
        let dotUpdate = document.getElementById('dots')
        dotUpdate.innerHTML = numDots
        let speedUpdate = document.getElementById('speed')
        speedUpdate.innerHTML = moveSpeed
    }

    function dotProbabilities(dot) {
        Object.keys(counts).forEach(letter => counts[letter] = 0);

        for (let i = 0; i < 1; i++) {
            let randomNumber = Math.random();
            let cumulativeProbability = 0;

            for (let letter in probabilities) {
                cumulativeProbability += probabilities[letter];
                if (randomNumber < cumulativeProbability) {
                    counts[letter]++;
                    console.log("counts", counts)
                    break; // Exit the loop once a letter is chosen
                }
            }
        }

        console.log(counts);

        // let dot = document.getElementsByClassName("dot");
{
        if (counts["A"] == 1) {
            dot.style.background = "radial-gradient(circle, #ff0000 20%, #990000 100%)"; // Bright Red
            dot.style.boxShadow = "0px 0px 10px rgba(255, 0, 0, 0.8)";
        } else if (counts["B"] == 1) {
            dot.style.background = "radial-gradient(circle, #ff4500 20%, #b22222 100%)"; // Deep Orange
            dot.style.boxShadow = "0px 0px 10px rgba(255, 69, 0, 0.8)";
        } else if (counts["C"] == 1) {
            dot.style.background = "radial-gradient(circle, #ff9900 20%, #cc6600 100%)"; // Vivid Orange
            dot.style.boxShadow = "0px 0px 10px rgba(255, 153, 0, 0.8)";
        } else if (counts["D"] == 1) {
            dot.style.background = "radial-gradient(circle, #ffcc00 20%, #b38f00 100%)"; // Bright Yellow
            dot.style.boxShadow = "0px 0px 10px rgba(255, 204, 0, 0.8)";
        } else if (counts["E"] == 1) {
            dot.style.background = "radial-gradient(circle, #ffff00 20%, #b3b300 100%)"; // Yellow-Green
            dot.style.boxShadow = "0px 0px 10px rgba(255, 255, 0, 0.8)";
        } else if (counts["F"] == 1) {
            dot.style.background = "radial-gradient(circle, #66ff00 20%, #339900 100%)"; // Bright Green
            dot.style.boxShadow = "0px 0px 10px rgba(102, 255, 0, 0.8)";
        } else if (counts["G"] == 1) {
            dot.style.background = "radial-gradient(circle, #00cc00 20%, #006600 100%)"; // Deep Green
            dot.style.boxShadow = "0px 0px 10px rgba(0, 204, 0, 0.8)";
        } else if (counts["H"] == 1) {
            dot.style.background = "radial-gradient(circle, #00ffcc 20%, #008b8b 100%)"; // Cyan
            dot.style.boxShadow = "0px 0px 10px rgba(0, 255, 204, 0.8)";
        } else if (counts["I"] == 1) {
            dot.style.background = "radial-gradient(circle, #0099ff 20%, #0066cc 100%)"; // Sky Blue
            dot.style.boxShadow = "0px 0px 10px rgba(0, 153, 255, 0.8)";
        } else if (counts["J"] == 1) {
            dot.style.background = "radial-gradient(circle, #0044ff 20%, #0022aa 100%)"; // Deep Blue
            dot.style.boxShadow = "0px 0px 10px rgba(0, 68, 255, 0.8)";
        } else if (counts["K"] == 1) {
            dot.style.background = "radial-gradient(circle, #6600cc 20%, #4b0082 100%)"; // Indigo
            dot.style.boxShadow = "0px 0px 10px rgba(102, 0, 204, 0.8)";
        } else if (counts["L"] == 1) {
            dot.style.background = "radial-gradient(circle, #8b00ff 20%, #5a0099 100%)"; // Violet
            dot.style.boxShadow = "0px 0px 10px rgba(139, 0, 255, 0.8)";
        } else if (counts["M"] == 1) {
            dot.style.background = "radial-gradient(circle, #9900cc 20%, #660099 100%)"; // Deep Purple
            dot.style.boxShadow = "0px 0px 10px rgba(153, 0, 204, 0.8)";
        } else if (counts["N"] == 1) {
            dot.style.background = "radial-gradient(circle, #ff00cc 20%, #b3008b 100%)"; // Pink-Magenta
            dot.style.boxShadow = "0px 0px 10px rgba(255, 0, 204, 0.8)";
        } else if (counts["O"] == 1) {
            dot.style.background = "radial-gradient(circle, #ff1493 20%, #c71585 100%)"; // Bright Pink
            dot.style.boxShadow = "0px 0px 10px rgba(255, 20, 147, 0.8)";
        } else if (counts["P"] == 1) {
            dot.style.background = "radial-gradient(circle, #ff0066 20%, #b30047 100%)"; // Hot Pink
            dot.style.boxShadow = "0px 0px 10px rgba(255, 0, 102, 0.8)";
        }
        
        
    }}
    
    updateEnemies();
});