class Animal {

    //Parameters of the animal (chicken)
    constructor(
        spriteXPositionCanvas, // Horizontal position on canvas (lærred)
        spriteYPositionCanvas, // Vertical position on canvas (lærred)
        spriteWidth, // Width of animal's sprite (image)
        spriteHeight, //Height of animal's sprite (image)
        spriteSpeed, //
        spriteFramePositionX, // Horizontal position of animal in img frame
        spriteFramePositionY, // Vertical position of animal in img frame
        spriteFrameWidth, // Width of frame in which the animal must fit
        spriteFrameHeight, // Height of frame in which the animal must fit
        areaRange // The area in which the animal moves around
    ) {
        this.spriteXPostitionCanvas = spriteXPositionCanvas;
        this.spriteYPositionCanvas = spriteYPositionCanvas;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.spriteSpeed = spriteSpeed;
        this.direction = DIRECTION_RIGHT; //TODO: Remember
        this.spriteFramePositionX = spriteFramePositionX;
        this.spriteFramePositionY = spriteFramePositionY;
        this.spriteFrameHeight = spriteFrameHeight;
        this.spriteFrameWidth = spriteFrameWidth;
        this.areaRange = areaRange;
        this.randomTarget = parseInt(4 * Math.random());
        this.target = randomTargetsForAnimals[this.randomTarget];
        setInterval(() => {
            this.changeRandomDirection();
        }, 10000);
    }


    /* Logic to determine how animal hunts PacPony (by using coordinates):
    In range = hunt - if not = moving randomly until PacPony is in range.*/
    isInRange() {
        let xDistance = Math.abs(pacpony.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacpony.getMapY() - this.getMapY());
        if (
            Math.sqrt(xDistance * xDistance + yDistance * yDistance) <=
            this.areaRange
        ) {
            return true;
        }
        return false;
    }

    changeRandomDirection() {
        let addition = 1;
        this.randomTarget += addition;
        this.randomTarget = this.randomTarget % 4;
    }

    /* MoveProcess() uses logic of the methods below, for
     executing how animal has to behave in the map:
    * isInRange(): Checks if PacPony-position is in range of animal.
    * checkCollision(): Checks if animal collides with walls. */
    moveProcess() {
        if (this.isInRange()) {
            this.target = pacpony;
        } else {
            this.target = randomTargetsForAnimals[this.randomTarget];
        }

        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            return;
        }
    }

    moveBackwards() {
        switch (this.direction) {
            case 4: // Right
                this.spriteXPostitionCanvas -= this.spriteSpeed;
                break;
            case 3: // Up
                this.spriteYPositionCanvas += this.spriteSpeed;
                break;
            case 2: // Left
                this.spriteXPostitionCanvas += this.spriteSpeed;
                break;
            case 1: // Bottom
                this.spriteYPositionCanvas -= this.spriteSpeed;
                break;
        }
    }

    moveForwards() {
        switch (this.direction) {
            case 4: // Right
                this.spriteXPostitionCanvas += this.spriteSpeed;
                break;
            case 3: // Up
                this.spriteYPositionCanvas -= this.spriteSpeed;
                break;
            case 2: // Left
                this.spriteXPostitionCanvas -= this.spriteSpeed;
                break;
            case 1: // Bottom
                this.spriteYPositionCanvas += this.spriteSpeed;
                break;
        }
    }


    checkCollisions() {
        let isCollided = false;
        if (
            map[parseInt(this.spriteYPositionCanvas / oneBlockSize)][
                parseInt(this.spriteXPostitionCanvas / oneBlockSize)
                ] === 1 ||
            map[parseInt(this.spriteYPositionCanvas / oneBlockSize + 0.9999)][
                parseInt(this.spriteXPostitionCanvas / oneBlockSize)
                ] === 1 ||
            map[parseInt(this.spriteYPositionCanvas / oneBlockSize)][
                parseInt(this.spriteXPostitionCanvas / oneBlockSize + 0.9999)
                ] === 1 ||
            map[parseInt(this.spriteYPositionCanvas / oneBlockSize + 0.9999)][
                parseInt(this.spriteXPostitionCanvas / oneBlockSize + 0.9999)
                ] === 1
        ) {
            isCollided = true;
        }
        return isCollided;
    }

    changeDirectionIfPossible() {
        const tempDirection = this.direction;
        this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x / oneBlockSize),
            parseInt(this.target.y / oneBlockSize)
        );

        if (this.direction === undefined) {
            this.direction = tempDirection;
            return;
        }

        if ((this.getMapY() != this.getMapYRightSide()) &&
            (this.direction === DIRECTION_LEFT || this.direction === DIRECTION_RIGHT)) {
            this.direction = DIRECTION_UP;
        }

        if ((this.getMapX() != this.getMapXRightSide()) && (this.direction === DIRECTION_UP)) {
            this.direction = DIRECTION_LEFT;
        }

        this.moveForwards();

        if (this.checkCollisions()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }

        console.log(this.direction);
    }


    // Function to make new direction based on breadth-first search
    calculateNewDirection(map, destX, destY) {
       /* Coping map to mp: A copy of the map called mp
       This is done to mark the visited places without altering the original map (labyrinth). */
        let mp = [];
        for (let i = 0; i < map.length; i++) {
            mp[i] = map[i].slice();
        }

        /*A queue is created with one element containing the starting position (x, y) of the
        current location, along with the actions (moves) taken to get there.
        This also includes the x and y coordinates of the sides of the object. */
        let queue = [
            {
                x: this.getMapX(),
                y: this.getMapY(),
                rightX: this.getMapXRightSide(),
                rightY: this.getMapYRightSide(),
                moves: [],
            },
        ];
        /*Breadth-first search (BFS): A breadth-first search is made on the map
        until the pony (destX, destY) is reached or the entire map is searched
        (searching until the queue is empty for nodes */
        while (queue.length > 0) {
            // Taking the first element from the queue
            let poped = queue.shift();
            // Check if the popped node is the destination/pony
            if (poped.x == destX && poped.y == destY) {
                // Return the first move to reach the pony
                return poped.moves[0];
            } else {
                // Marks the popped node as searched through by changing it in the copy of the map (mp)
                mp[poped.y][poped.x] = 1;
                // Add neighbors (nodes) to the queue
                let neighborList = this.addNeighbors(poped, mp);
                for (let i = 0; i < neighborList.length; i++) {
                    queue.push(neighborList[i]);
                }
            }
        }
        // If the pony is not reached, return a default direction (1).
        return 1;
    }

    addNeighbors(poped, mp) {
        let queue = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;

        const pushNeighbor = (x, y, direction) => {
            if (x >= 0 && x < numOfRows && y >= 0 && y < numOfColumns && mp[y][x] != 1) {
                let tempMoves = poped.moves.slice();
                tempMoves.push(direction);
                queue.push({ x, y, moves: tempMoves });
            }
        };

        pushNeighbor(poped.x - 1, poped.y, DIRECTION_LEFT);
        pushNeighbor(poped.x + 1, poped.y, DIRECTION_RIGHT);
        pushNeighbor(poped.x, poped.y - 1, DIRECTION_UP);
        pushNeighbor(poped.x, poped.y + 1, DIRECTION_BOTTOM);

        return queue;
    }


    getMapX() {
        return parseInt(this.spriteXPostitionCanvas / oneBlockSize);
    }

    getMapY() {
        return parseInt(this.spriteYPositionCanvas / oneBlockSize);
    }

    getMapXRightSide() {
        return parseInt((this.spriteXPostitionCanvas * 0.99 + oneBlockSize) / oneBlockSize);
    }

    getMapYRightSide() {
        return parseInt((this.spriteYPositionCanvas * 0.99 + oneBlockSize) / oneBlockSize);
    }

    changeAnimation() {
        this.currentFrame =
            this.currentFrame === this.frameCount ? 1 : this.currentFrame + 1;
    }

    draw() {
        canvasContext.save();

        // Definér skalafaktorer for at matche ponyens størrelse
        const scaleX = 0.4; // Ændre bredden ved en faktor på 2,5
        const scaleY = 0.4; // Ændre højden ved en faktor på 2,5
        const scaledWidth = this.spriteWidth * scaleX;
        const scaledHeight = this.spriteHeight * scaleY;
        const scaledCenterX = this.spriteXPostitionCanvas + scaledWidth;
        const scaledCenterY = this.spriteYPositionCanvas + scaledHeight;

        // Skift tegnepositionen til midten af det skalerede billede
        canvasContext.translate(scaledCenterX, scaledCenterY);

        // Anvend skaleringen
        canvasContext.scale(scaleX, scaleY);

        // Tegn det skalerede billede med det justerede midtpunkt
        canvasContext.drawImage(
            animalSizing,
            this.spriteFramePositionX * 0.3, // her ser man vidden
            this.spriteFramePositionY * 4, // hvor på billedet man ser hønen (top, bund af den)
            this.spriteFrameWidth * 3,
            this.spriteFrameHeight * 1.9,
            -scaledWidth,
            -scaledHeight,
            this.spriteFrameWidth * 1, // Behold original billedbredde
            this.spriteFrameHeight * 1 // Behold original billedhøjde
        );
        canvasContext.restore();
    }
}

    let updateAnimals = () => {
    for (let i = 0; i < animals.length; i++) {
        animals[i].moveProcess();
    }
};

let drawAnimals = () => {
    for (let i = 0; i < animals.length; i++) {
        animals[i].draw();
    }
};
