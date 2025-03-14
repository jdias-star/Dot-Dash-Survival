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
        if (!gameRunning) return; // Prevent further game over processing if the game is already over
    
        console.log("Game Over! The enemy caught you.");
        lives--;
        moveSpeed = 1;
        numEnemies = 1;
        score = 0;
        updateEnemies(); // Ensure it runs correctly
        console.log("Lives:", lives);
    
        if (lives < 1) {
            console.log("Game Hella Over Bro");
    
            // Change character color to black
            character.style.backgroundColor = 'black';
            
            const gameContainer = document.getElementById('game-container');
        gameContainer.style.backgroundImage = 'url("dead.jpg")'; // Set the background image
        gameContainer.style.backgroundSize = 'cover';  // Ensure the image covers the entire container
        gameContainer.style.backgroundPosition = 'center';  // Center the background image
        gameContainer.style.backgroundRepeat = 'no-repeat'; // Don't repeat the image

        console.log("Changing background to dead.jpg");
    
            console.log("Changing background color to spotted red blood-like effect");
            stopGame();  // Stop the game after game over
        }
    }

    function stopGame() {
        gameRunning = false;  // Set the flag to false to stop the game loop
        clearInterval(gameInterval);  // Clear the interval to stop enemy movement
        console.log("Game has been stopped.");
        const dots = document.querySelectorAll('.dot');
        dots.forEach(dot => dot.remove());
        const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => enemy.remove());
    const player = document.getElementById('character');
    player.remove();
    }

    gameInterval = setInterval(function() {
        if (gameRunning) {  // Only move enemies if the game is still running
            moveEnemies();
        } else {
            // Optionally do something once the game stops, e.g., show a game over screen
            console.log("Game stopped, no more movement.");
        }
    }, 50);
    
    // Example of how lives decrease and game over occurs (replace with your event triggering)
    function decrementLives() {
        lives--;  // Decrease lives by 1, and if needed, check for game over
        gameOver();  // Check if the game should be over
    }

    window.addEventListener("mousemove", (event) => {
        const boxRect = box.getBoundingClientRect();
        const x = event.clientX - boxRect.left - mouse.offsetWidth / 2;
        const y = event.clientY - boxRect.top - mouse.offsetHeight / 2;
    
        mouse.style.left = `${Math.max(0, Math.min(boxRect.width - 20, x))}px`;
        mouse.style.top = `${Math.max(0, Math.min(boxRect.height - 20, y))}px`;
    
        dots.forEach(dot => {
            if (areElementsTouching(mouse, dot)) {
                UpdateInformation()
                moveSpeed++;
                moveDot(dot);
                console.log("Speed:", moveSpeed);
                score++;
                console.log("Score:", score);
                numEnemies++;
                updateEnemies(numEnemies);
            }
        });
    });

    function checkAndUpdateDots() {
        let currentDots = document.querySelectorAll('.dot').length;
    
        if (currentDots < numDots) {
            for (let i = currentDots; i < numDots; i++) {
                createDot();
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
    let dotUpdate = document.getElementById('dot')
    dotUpdate.innerHTML = numDots
    let speedUpdate = document.getElementById('speed')
    speedUpdate.innerHTML = moveSpeed
}
    
    

    updateEnemies(numEnemies);
});