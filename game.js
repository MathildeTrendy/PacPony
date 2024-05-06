const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacponySizing = document.getElementById("ponyAnimation");
const animalSizing = document.getElementById("animalAnimation");

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;
let lives = 3;
let animalCount = 4;
let animalImageLocations = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
];

// The variables of the game
let ponyAndAnimalSpeed = 20;
let pacpony;
let animal;
let oneBlockSize = 25;
let score = 0;
let animals = [];
let wallSpaceWidth = oneBlockSize / 1.6;


// Creates map/labyrinth of open areas, walls and paths
// 0 = open area, 1 = wall, 2 = path with food
let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let randomTargetsForAnimals = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    {
        x: (map[0].length - 2) * oneBlockSize,
        y: (map.length - 2) * oneBlockSize,
    },
];

let createNewPacpony = () => {
    pacpony = new Pacpony(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5
    );
};

let gameLoop = () => {
    update();
    draw();
};

let gameInterval = setInterval(gameLoop, 500 / ponyAndAnimalSpeed);

let restartPacponyAndAnimals = () => {
    createNewPacpony();
    createAnimals();
};

let gameOver = () => {
    clearInterval(gameInterval);
    alert("GAME OVER - restart game by reloading page");
}
let onAnimalCollision = () => {
    lives--;
    restartPacponyAndAnimals();
    if (lives == 0) {
        gameOver();
    }
};

let update = () => {
    pacpony.moveProcess();
    pacpony.eat();
    updateAnimals();
    if (pacpony.checkAnimalCollision(animals)) {
        onAnimalCollision();
    }
};

let drawFoods = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) {
                createRect(
                    j * oneBlockSize + oneBlockSize / 3,
                    i * oneBlockSize + oneBlockSize / 3,
                    oneBlockSize / 5,
                    oneBlockSize / 5,
                    "#f10404"
                );
            }
        }
    }
};

let drawRemainingLives = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "#000000";
    canvasContext.fillText("Lives: ", 300, oneBlockSize * (map.length + 1));

    const spacing = 16;

    for (let i = 0; i < lives; i++) {
        const xPos = 355 + (i * oneBlockSize + spacing * i);
        canvasContext.drawImage(
            pacponySizing,
            0 * oneBlockSize,
            0,
            1200,
            1200,
            xPos,
            oneBlockSize * map.length + 2,
            oneBlockSize * 2,
            oneBlockSize * 2
        );
    }
};

let drawScore = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "#000000";
    canvasContext.fillText(
        "Score: " + score,
        40,
        oneBlockSize * (map.length + 1)
    );
};

let draw = () => {
    canvasContext.clearRect(50, 0, canvas.width, canvas.height);
    createRect(-675, -240, canvas.width, canvas.height, "#499438");
    drawWalls();
    drawFoods();
    drawAnimals();
    pacpony.draw();
    drawScore();
    drawRemainingLives();
};

let drawWalls = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) {
                createRect(j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    "#795338");
            }
        }
    }
};



let createAnimals = () => {
    animals = [];
    for (let i = 0; i < animalCount * 2; i++) {
        let x = 9 * oneBlockSize + (i % 2) * oneBlockSize;
        let y = 10 * oneBlockSize + (i % 2) * oneBlockSize;
        let newAnimal = new Animal(
            x,
            y,
            oneBlockSize,
            oneBlockSize,
            pacpony.speed / 1.6, // Animal speed
            animalImageLocations[i % 4].x,
            animalImageLocations[i % 4].y,
            124,
            116,
            6 + i
        );
        animals.push(newAnimal);
    }
};


createNewPacpony();
createAnimals();
gameLoop();

window.addEventListener("keydown", (event) => {
    let k = event.keyCode;
    setTimeout(() => {
        switch (k) {
            case 65: // Left - A
                pacpony.nextDirection = DIRECTION_LEFT;
                break;
            case 87: // Up - W
                pacpony.nextDirection = DIRECTION_UP;
                break;
            case 68: // Right - D
                pacpony.nextDirection = DIRECTION_RIGHT;
                break;
            case 83: // Bottom - S
                pacpony.nextDirection = DIRECTION_BOTTOM;
                break;
        }
    }, 1);
});

