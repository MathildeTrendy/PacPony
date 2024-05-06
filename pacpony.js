class Pacpony {
  constructor(x, y, width, height, speed) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.direction = 4;
      this.nextDirection = 4;
      this.frameCount = 7;
      this.currentFrame = 1;
      setInterval(() => {
          this.changeAnimation();
      }, 100);
  }

  moveProcess() {
      this.changeDirectionIfPossible();
      this.moveForwards();
      if (this.checkCollisions()) {
          this.moveBackwards();
          return;
      }
  }

  eat() {
      for (let i = 0; i < map.length; i++) {
          for (let j = 0; j < map[0].length; j++) {
              if (
                  map[i][j] == 2 &&
                  this.getMapX() == j &&
                  this.getMapY() == i
              ) {
                  map[i][j] = 3;
                  score++;
              }
          }
      }
  }

  moveBackwards() {
      switch (this.direction) {
          case DIRECTION_RIGHT: // Right
              this.x -= this.speed;
              break;
          case DIRECTION_UP: // Up
              this.y += this.speed;
              break;
          case DIRECTION_LEFT: // Left
              this.x += this.speed;
              break;
          case DIRECTION_BOTTOM: // Bottom
              this.y -= this.speed;
              break;
      }
  }

  moveForwards() {
      switch (this.direction) {
          case DIRECTION_RIGHT: // Right
              this.x += this.speed;
              break;
          case DIRECTION_UP: // Up
              this.y -= this.speed;
              break;
          case DIRECTION_LEFT: // Left
              this.x -= this.speed;
              break;
          case DIRECTION_BOTTOM: // Bottom
              this.y += this.speed;
              break;
      }
  }

  checkCollisions() {
      let isCollided = false;
      if (
          map[parseInt(this.y / oneBlockSize)][
              parseInt(this.x / oneBlockSize)
          ] == 1 ||
          map[parseInt(this.y / oneBlockSize + 0.9999)][
              parseInt(this.x / oneBlockSize)
          ] == 1 ||
          map[parseInt(this.y / oneBlockSize)][
              parseInt(this.x / oneBlockSize + 0.9999)
          ] == 1 ||
          map[parseInt(this.y / oneBlockSize + 0.9999)][
              parseInt(this.x / oneBlockSize + 0.9999)
          ] == 1
      ) {
          isCollided = true;
      }
      return isCollided;
  }

  checkAnimalCollision(animals) {
      for (let i = 0; i < animals.length; i++) {
          let animal = animals[i];
          if (
              animal.getMapX() == this.getMapX() &&
              animal.getMapY() == this.getMapY()
          ) {
              return true;
          }
      }
      return false;
  }

  changeDirectionIfPossible() {
      if (this.direction == this.nextDirection) return;
      let tempDirection = this.direction;
      this.direction = this.nextDirection;
      this.moveForwards();
      if (this.checkCollisions()) {
          this.moveBackwards();
          this.direction = tempDirection;
      } else {
          this.moveBackwards();
      }
  }

  getMapX() {
      let mapX = parseInt(this.x / oneBlockSize);
      return mapX;
  }

  getMapY() {
      let mapY = parseInt(this.y / oneBlockSize);

      return mapY;
  }

  getMapXRightSide() {
      let mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
      return mapX;
  }

  getMapYRightSide() {
      let mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
      return mapY;
  }

    draw() { // Creating animation of pony
        canvasContext.save();
        canvasContext.translate(
            this.x + oneBlockSize / 3,
            this.y + oneBlockSize / 3
        );
        canvasContext.translate(
            -this.x - oneBlockSize / 0.8,
            -this.y - oneBlockSize / 0.8 // Moves pony up and down in labyrinth
        );

        // Scaling to make the pony bigger
        const scaleX = 2.5; // Change pony animation width
        const scaleY = 2.5; // Change pony animation height

        // Drawing/creating pony with scaling and such
        canvasContext.drawImage(
            document.getElementById("ponyAnimation"),
            (this.currentFrame - 1) * 1200, // Adjust 1200 according to the original width of each frame
            0,
            1200, // Adjust 1200 according to the original width of each frame
            1200, // Adjust 1200 according to the original height of the image
            this.x,
            this.y,
            this.width * scaleX, // Increase width
            this.height * scaleY // Increase height
        );

        canvasContext.restore();
    }
}
