                                                                  /*
^
|
|
Click the gray play button in the top left corner
*/


//Change this number to tweak the width of the game screen
var canvasWidth = 350; 

//Change this number to tweak the height of the game screen
var canvasHeight = 580; 

/*
Changing the width or height too much might 
make the game unplayable 
*/

function setup() {
  landingSound = loadSound("landingSound2.mp3");
  firingSound = loadSound("firingSound2.mp3");
  springSound = loadSound("springSound2.mp3");
  breakingBlockSound = loadSound("breakingBlockSound.mp3");
  monsterSound = loadSound("monsterSound.mp3");
  fallingSound = loadSound("fallingSound2.mp3");
  createCanvas(canvasWidth, canvasHeight);
  noStroke();
}

//the block object
function block(xPos, yPos, type, speed) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.type = type;
  this.blockDirec = 1;
  this.blockSpeed = speed;
  this.i = 0;
  this.staticY = yPos;
  this.myPowerUp = 0;

  //function for drawing a block
  this.drawBlock = function() {
    noStroke();
    /*fill('red');
    textSize(15);
    text(round(this.xPos) + ', ' + round(this.yPos), this.xPos, this.yPos);*/
    if (this.type == 1) {
      fill(100, 198, 55);
    } else if (this.type == 2) {
      fill(45, 172, 229);
    } else if (this.type == 3) {
      fill(86, 124, 143);
    }

    rect(this.xPos + (1 / 6) * blockWidth, this.yPos, (2 / 3) * blockWidth, blockHeight);
    ellipse(this.xPos + (1 / 6) * blockWidth, this.yPos + blockHeight / 2, (1 / 3) * blockWidth, blockHeight)
    ellipse(this.xPos + (2 / 3) * blockWidth + (1 / 6) * blockWidth, this.yPos + blockHeight / 2, (1 / 3) * blockWidth, blockHeight)
  }

  //function for moving a block down
  this.updatePos = function() {
    this.yPos += scrollSpeed;
    this.staticY += scrollSpeed;
  }

  this.moveX = function() {
    if (this.xPos + blockWidth >= canvasWidth) {
      this.blockDirec = -1;
    }
    if (this.xPos <= 0) {
      this.blockDirec = 1;
    }
    this.xPos += this.blockDirec * this.blockSpeed;
  }

  this.moveY = function() {
    this.yPos = this.staticY + 100 * cos(PI / (120 * (1 - this.blockSpeed / 10)) * this.i) - 100;
    this.i++;
  }

  this.isInRange = function(xVal, yVal, type) {
    if (type == 2) {
      return (yVal <= this.staticY + blockHeight && yVal >= this.staticY - 200) || (yVal + blockHeight <= this.staticY + blockHeight && yVal + blockHeight >= this.staticY - 200);
    } else {
      return ((xVal <= this.xPos + blockWidth && xVal >= this.xPos) || (xVal + blockWidth <= this.xPos + blockWidth && xVal + blockWidth >= this.xPos)) && ((yVal <= this.staticY + blockHeight && yVal >= this.staticY - 200) || (yVal + blockHeight <= this.staticY + blockHeight && yVal + blockHeight >= this.staticY - 200));
    }
  }

  function powerUp(xPos, yPos, type) {
    this.type = type;
    if (this.type == 'spring') {
      this.x = xPos;
      this.y = yPos;
      this.width = 20;
      this.height = 20;

      this.draw = function(newX, newY) {
        this.x = newX;
        this.y = newY;
        noStroke();
        fill(169, 169, 169);
        rect(this.x, this.y, this.width, this.height);
        stroke(105, 105, 105);
        strokeWeight(3);
        for (let i = 0; i < 4; i++) {
          line(this.x, this.y + i * this.height / 4, this.x + this.width, this.y + i * this.height / 4 + 3);
        }
      }
    } else if (this.type == 'shield') {
      this.x = xPos;
      this.y = yPos;
      this.width = 40;
      this.height = 40;

      this.draw = function(newX, newY) {
        this.x = newX;
        this.y = newY;

        stroke(159, 229, 249);
        strokeWeight(2);
        fill(174, 175, 175);

        ellipse(this.x, this.y, this.width, this.height);

        noStroke();
        fill(56, 166, 58);
        rect(this.x - this.width / 4, this.y - this.height / 4, this.width / 4, this.height * (3 / 5));
        fill(56, 125, 166);
        rect(this.x, this.y - this.height / 4, this.width / 4, this.height * (3 / 5));

        fill(174, 175, 175);
        ellipse(this.x - this.width / 8, this.y - this.height / 4, this.width / 5);
        ellipse(this.x + this.width / 8, this.y - this.height / 4, this.width / 5);

        push();
        translate(this.x - this.width * (2 / 5), this.y + this.height * (1 / 4));
        rotate(radians(-55));
        rect(0, 0, this.width / 6, this.height * (2 / 5));
        pop();

        push();
        translate(this.x + this.width / 3, this.y + this.height * (1 / 10));
        rotate(radians(55));
        rect(0, 0, this.width / 6, this.height * (2 / 5));
        pop();
      }
    }

  }

  this.getSpring = function() {
    this.myPowerUp = new powerUp(this.xPos + blockWidth / 2 - 10, this.yPos - 20, 'spring');
  }

  this.getShield = function() {
    this.myPowerUp = new powerUp(this.xPos + blockWidth / 2, this.yPos - 20, 'shield');
  }

  this.drawPowerUp = function() {
    if (this.myPowerUp != 0) {

      if (this.myPowerUp.type == 'spring') {
        this.myPowerUp.draw(this.xPos + blockWidth / 2 - 10, this.yPos - 20);
      } else if (this.myPowerUp.type == 'shield') {
        this.myPowerUp.draw(this.xPos + blockWidth / 2, this.yPos - 20);
      }

    }
  }

  this.deletePowerUp = function() {
    this.myPowerUp = 0;
  }
  
  this.endScreen = function(){
    this.yPos -= 15;
  }

}

function brokenBlock(xPos, yPos) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.isFalling = false;
  this.draw = function() {
    if (this.isFalling){
      this.yPos += 10;
    }
    
    noStroke();
    /*fill('red');
    textSize(15);
    text(round(this.xPos) + ', ' + round(this.yPos), this.xPos, this.yPos);*/
    fill(166, 85, 23);

    push();
    translate(this.xPos + (1 / 6) * blockWidth - gapSpace, this.yPos);
    if (this.isFalling == true) {
      rotate(radians(30));
    }
    rect(0, 0, (1 / 3) * blockWidth, blockHeight);
    ellipse(0, blockHeight / 2, (1 / 3) * blockWidth, blockHeight)
    pop();

    push();
    translate(this.xPos + blockWidth / 2 + gapSpace, this.yPos);
    if (this.isFalling == true) {
      translate(0, blockHeight / 1.3);
      rotate(radians(-30));
    }
    rect(0, 0, (1 / 3) * blockWidth, blockHeight);
    ellipse(blockWidth * (1 / 3), blockHeight / 2, (1 / 3) * blockWidth, blockHeight)
    pop();
  }
  this.touchingDood = function() {
    this.isFalling = true;
    if (!breakingBlockSound.isPlaying()){
      breakingBlockSound.play()
    }
  }
  this.updatePos = function() {
    this.yPos += scrollSpeed;
  }
  
  this.endScreen = function(){
    this.yPos -= 15;
  }

}

//the pellet object (thing that the doodler fires)
function pellet() {
  this.xPos = doodX;
  this.yPos = doodY - doodHeight * (4 / 50);

  //function for drawing a pellet
  this.draw = function() {
    noStroke();
    fill('red');
    ellipse(this.xPos, this.yPos, 10, 10);
  }

  //function for moving the pellet up
  this.move = function() {
    this.yPos -= 15;
  }
}

function monster(xPos, yPos) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.n = 0;
  this.warningSound = monsterSound;
  this.drawMonster = function() {
    if (this.yPos >= -200 && !this.warningSound.isPlaying()){
      this.warningSound.play();
    }
    strokeWeight(1.5);
    stroke('black');

    //spikes
    push();
    translate(this.xPos, this.yPos);
    for (let i = 0; i < 18; i++) {
      line(0, 0, monsterWidth * (2 / 3), 0);
      rotate(radians(20));
    }
    pop();

    //body
    fill(202, 55, 55);
    ellipse(this.xPos, this.yPos, monsterWidth, monsterHeight);

    //eyes
    fill('gold');
    ellipse(this.xPos, this.yPos - monsterHeight / 4, monsterWidth / 5 - 1, monsterWidth / 5 - 1);
    ellipse(this.xPos + (3 / 12) * monsterWidth, this.yPos - monsterHeight * (3 / 40), monsterWidth / 5, monsterWidth / 5);
    ellipse(this.xPos - (3 / 12) * monsterWidth, this.yPos - monsterHeight * (3 / 40), monsterWidth / 5, monsterWidth / 5);

    //pupils
    fill('black')
    ellipse(this.xPos, this.yPos - monsterHeight / 4, monsterWidth / 18 - 1, monsterWidth / 18 - 1);
    ellipse(this.xPos + (3 / 12) * monsterWidth, this.yPos - monsterHeight * (3 / 40), monsterWidth / 18, monsterWidth / 18);
    ellipse(this.xPos - (3 / 12) * monsterWidth, this.yPos - monsterHeight * (3 / 40), monsterWidth / 18, monsterWidth / 18);

    //mouth
    line(this.xPos - monsterWidth / 2.2, this.yPos + monsterHeight / 5, this.xPos + monsterWidth / 2.2, this.yPos + monsterHeight / 5);
  }

  this.shake = function() {
    this.xPos = xPos + 10 * sin(this.n / 4);
    this.n++;
  }

  this.updatePos = function() {
    this.yPos += scrollSpeed;
  }

  this.hit = function() {
    for (let i in pellets) {
      return (pellets[i].xPos >= this.xPos - monsterWidth / 2 && pellets[i].xPos <= this.xPos + monsterWidth / 2) && (pellets[i].yPos <= this.yPos + monsterHeight / 2 && pellets[i].yPos >= this.yPos - monsterHeight / 2)
    }
  }
  this.endScreen = function(){
    this.yPos -= 15;
  }
}


//function for sensing if the dood's feet is touching any block
var touchedBlock = function(value, type) {
  //cycles through all the blocks
  if (type == 'broken') {
    for (let i in brokenBlocks) {
      if ((doodX >= brokenBlocks[i].xPos - doodWidth / 2) && (doodX <= brokenBlocks[i].xPos + blockWidth + doodWidth / 2) && (legY + legLength <= brokenBlocks[i].yPos + blockHeight / 3) && (legY + legLength >= brokenBlocks[i].yPos - blockHeight / 3) && alive) {
        brokenBlocks[i].touchingDood();
      }
    }
  } else if (type == 'norm') {
    for (let i in blocks) {
      //if the dood's feet is touching a block surface:
      if ((doodX >= blocks[i].xPos - doodWidth / 2) && (doodX <= blocks[i].xPos + blockWidth + doodWidth / 2) && (legY + legLength <= blocks[i].yPos + blockHeight / 3) && (legY + legLength >= blocks[i].yPos - blockHeight / 3) && alive) {

        if (blocks[i].myPowerUp != 0) {
          if (blocks[i].myPowerUp.type == 'spring') {
            springJump = true;
            springSound.play();
          }
        }

        //if a boolean was asked for, return true
        if (value == 'boolean') {
          return true;
        }
        //otherwise if the block 'id' was asked, return the position of the block in the array
        else if (value == '#') {
          return blocks[i];
        }

      }
    }
    //if the dood was not touching a block, return false
    if (value == 'boolean') {
      return false;
    }
  }
}

var touchingMonster = function() {
  for (let i in monsters) {
    if (collisionEllipses(doodX, doodY, doodWidth, doodHeight + legLength, monsters[i].xPos, monsters[i].yPos, monsterWidth, monsterHeight)) {
      if (doodY + doodWidth/2 < monsters[i].yPos && alive && jumpCycle >= jumpHeightMax){
        monsters[i].warningSound.stop();
        monsters.splice(i, 1);
        jumpedOnMonster = true;
        return false;
      } 
      else if (springJump) {
        monsters[i].warningSound.stop();
        monsters.splice(i, 1);
        return false;
      }

      return true;
    }
  }
}

var collisionEllipses = function(x, y, w, h, x2, y2, w2, h2) {
  return ((x + w / 2 >= x2 - w2 / 2 && x + w / 2 <= x2 + w2 / 2) || (x - w / 2 >= x2 - w2 / 2 && x - w / 2 <= x2 + w2 / 2)) && ((y + h / 2 >= y2 - h2 / 2 && y + h / 2 <= y2 + h2 / 2) || (y - h / 2 >= y2 - h2 / 2 && y - h / 2 <= y2 + h2 / 2))
}

var collisionRectangles = function(x, y, w, h, x2, y2, w2, h2) {
  return ((x + w >= x2 && x + w <= x2 + w2) || (x >= x2 && x <= x2 + w2)) && ((y + h >= y2 && y + h <= y2 + h2) || (y >= y2 && y <= y2 + h2))
}

var counter = 0;
var endScreen = function(){
  if (counter <= canvasHeight/10){
    for (let i in blocks){
      blocks[i].endScreen();
    }
    for (let i in brokenBlocks){
      brokenBlocks[i].endScreen();
    }
    for (let i in monsters){
      monsters[i].endScreen();
    }
    doodY -= 15;
    counter++;
  }
  else{
    textSize(30);
    fill('black');
    text('Your Score: ' + score, canvasWidth/6, canvasHeight/2);
    textSize(14);
    text('Click the play button in the top left \ncorner of your screen to play again.', canvasWidth/6, canvasHeight/2 + 30);
  }
  
}
//------VARIABLES and ARRAYS-------//

var blockWidth = 75;
var blockHeight = 15;
//creates an array of blocks and stores a new block in it
var blocks = [new block(canvasWidth / 2 - blockWidth / 2, canvasHeight - 50, 1)];
var verticalBlocks = [];
var horizontalBlocks = [];
var gapSpace = 2;
var brokenBlocks = [];

var doodHeight = 50;
var legLength = 5;

var doodX = canvasWidth / 2;
var doodY = (canvasHeight - 50) - (doodHeight / 2 + legLength);

var speed = 1;
var jumpCycle = 0;
var scrollScreen = 0;
var scrollSpeed = 10;
let scrollSpeedFactor = 0.1;

var doodDirection = 'right';
var mouthUp = false;
var sign;
var score = 0;

var pellets = [];
var waitTimer = 0;
var mouseDown = false;

var monsterWidth = 50;
var monsterHeight = 40;
var monsters = [];
var alive = true;
var springJump = false;

var storedDoodY = 0;
var distanceToScroll;

var shieldIsActive = false;
var shieldTimer;

var jumpedOnMonster = false;

var end = false;

var colorChange = 0;
//this function will repeat forever
function draw() {

  //------------------------------BACKGROUND-------------------------------//
  background(248, 244, 220);
  strokeWeight(1);
  stroke(224, 219, 208);
  for (let i = 0; i * 10 < canvasWidth; i++) {
    line(10 * i, 0, 10 * i, canvasHeight);
  }
  for (let i = 0; i * 10 < canvasHeight; i++) {
    line(0, 10 * i, canvasWidth, 10 * i);
  }
  noStroke();

  //------------------------------BLOCKS/POWERUPS------------------------------//

  //draws all existing blocks
  for (let i = 0; i < blocks.length; i++) {
    blocks[i].drawBlock();
    blocks[i].drawPowerUp();
    if (blocks[i].type == 2) {
      blocks[i].moveX();
    }
    if (blocks[i].type == 3) {
      blocks[i].moveY();
    }
    if (blocks[i].yPos >= canvasHeight) {
      if (blocks[i].type == 3) {
        verticalBlocks.splice(i, 1);
      }
      if(blocks[i].type == 2){
        horizontalBlocks.splice(i, 1)
      }
      blocks.splice(i, 1)
      i--;
    }
  }
  for (let i in brokenBlocks) {
    brokenBlocks[i].draw();
    if (brokenBlocks[i].yPos >= canvasHeight) {
      brokenBlocks.splice(i, 1);
      i--;
    }
  }
  
  //makes new blocks if the amount of blocks is less than 20
  let fakeBlocks = 0;
  while (blocks.length + fakeBlocks < 20 && scrollScreen == 0) {
    let randInt = random(1, 100);
    let blockType = 1;
    let randX;
    let randY;
    let blockSpeed = 0;

    if (score < 5000) {
      if (randInt > 60 && randInt < 80 - (10 * (1 + score / 50000))) {
        blockType = 4;
      }
    }
    else if (score >= 5000 && score < 50000) {
      if (randInt < 10 * (1 + score / (50000/3))) {
        blockType = 2;
        blockSpeed = random(1 * (1 + score / 50000), 2 * (1 + score / 50000));
      } 
      else if (randInt > 40 && randInt < 40 + (5 * (1 + score / 50000))) {
        blockType = 3;
        blockSpeed = random(1 * (1 + score / 50000), 2 * (1 + score / 50000));
      } 
      else if (randInt > 60 && randInt < 80 - (10 * (1 + score / 50000))) {
        blockType = 4;
      }
    } 
    else if (score >= 50000) {
      if (randInt < 40) {
        blockType = 2;
        blockSpeed = random(2, 4);
      } 
      else if (randInt < 50) {
        blockType = 3;
        blockSpeed = random(2, 4);
      }
    }

    let isInRange;
    let i = 0;
    do {
      randX = random(0, canvasWidth - 80)
      if (score < 1000) {
        randY = blocks[blocks.length - 1].yPos - random(30, 100)
      } else if (score > 1000 && score < 50000) {
        randY = blocks[blocks.length - 1].yPos - random(30 * (1 + score / 50000), 100 * (1 + score / 50000))
      } else {
        randY = blocks[blocks.length - 1].yPos - random(30 * 2, 100 * 2)
      }

      isInRange = false;
      for (let i in verticalBlocks) {
        if (verticalBlocks[i].isInRange(randX, randY, blockType)) {
          isInRange = true;
        }
      }
      for (let i in horizontalBlocks) {
        if (randY + blockHeight >= horizontalBlocks[i].yPos - 5 && randY + blockHeight <= horizontalBlocks[i].yPos + blockHeight + 5 && randY >= horizontalBlocks[i].yPos - 5 && randY <= horizontalBlocks[i].yPos + blockHeight + 5) {
          isInRange = true;
        }
      }
      for (let i in blocks) {
        if (collisionRectangles(randX, randY, blockWidth, blockHeight, blocks[i].xPos, blocks[i].yPos - 5, blockWidth + 5, blockHeight)) {
          isInRange = true;
        }
      }
      for (let i in brokenBlocks) {
        if (collisionRectangles(randX, randY, blockWidth, blockHeight, brokenBlocks[i].xPos, brokenBlocks[i].yPos, blockWidth, blockHeight)) {
          isInRange = true;
        }
      }
      i++;

    } while (isInRange == true && i < 10);

    if (i < 10 && blockType != 4) {
      blocks.push(new block(randX, randY, blockType, blockSpeed)); //stores a new block in the blocks array
      blocks[blocks.length - 1].drawBlock();

      if (blocks[blocks.length - 1].type == 3) {
        verticalBlocks.push(blocks[blocks.length - 1])
      }
      else if (blocks[blocks.length - 1].type == 2) {
        horizontalBlocks.push(blocks[blocks.length - 1])
      }

      if (round(random(1, 20)) == 10) {
        blocks[blocks.length - 1].getSpring();
      } 
      else if (round(random(1, 40)) == 10) {
        blocks[blocks.length - 1].getShield();
      }

    } 
    else if (i < 10 && blockType == 4) {
      brokenBlocks.push(new brokenBlock(randX, randY)); //stores a new block in the broken blocks array
    } 
    else {
      fakeBlocks++;
    }
  }


  if (shieldTimer + 10000 <= millis()) {
    shieldIsActive = false;
  }


  //-----------------------------------SCROLLING-----------------------------------//

  //if the screen should scroll
  if (doodY <= canvasHeight * (9 / 20) && jumpCycle <= jumpHeightMax * (1 / 4)) {
    scrollScreen = 3;
    storedDoodY = doodY;
    distanceToScroll = canvasHeight * (10 / 20) - storedDoodY;
  }

  if (scrollScreen != 0 && alive) {

    //changes the score and moves the dood down
    score += round(scrollSpeed);
    doodY += scrollSpeed;

    //cycles through all existing blocks
    for (let i in blocks) {
      //moves a block down
      blocks[i].updatePos();
    }

    for (let i in brokenBlocks) {
      //moves a block down
      brokenBlocks[i].updatePos();
    }

    for (let i in monsters) {
      //moves a monster down
      monsters[i].updatePos();
      if (monsters[i].yPos + monsterHeight / 2 >= canvasHeight) {
        monsters.splice(i, 1);
      }
    }

    if (springJump) {
      scrollSpeed = 12 * scrollSpeedFactor;
    } else {
      scrollSpeed = 10 * scrollSpeedFactor;
    }

    if (scrollScreen == 3) {
      if (doodY >= storedDoodY + distanceToScroll / 2) {
        scrollScreen = 2;
      }
      if (scrollSpeedFactor < 1) {
        scrollSpeedFactor += 1 / 10;
      }
    } else if (scrollScreen == 2) {
      if (scrollSpeedFactor > 0.1) {
        scrollSpeedFactor -= 1 / 10;
      } else {
        scrollScreen = 0;
      }
    }

  }


  //----------------------------------MONSTERS----------------------------------//

  for (let i in monsters) {
    monsters[i].drawMonster();
    monsters[i].shake();
    if (monsters[i].hit()) {
      monsters[i].warningSound.stop();
      monsters.splice(i, 1);
      i--;
    }
  }

  let randInt = round(random(1, 1000));

  if (score >= 5000 && randInt <= 1 + (score / 10000) && monsters.length <= 5) {
    if (monsters.length == 0) {
      monsters.push(new monster(random(50, canvasWidth - 50), -canvasHeight * random(1, 2)));
    } else {
      monsters.push(new monster(random(50, canvasWidth - 50), monsters[monsters.length - 1].yPos - canvasHeight * random(3, 5)));
    }
  }
  


  //-----------------------------------PELLETS-----------------------------------//
  if (alive) {
    //cycles through all of the pellets
    for (let i in pellets) {
      pellets[i].draw(); //draws a pellet
      pellets[i].move(); //moves a pellet up

      //deletes a pellet when it goes above the screen
      if (pellets[i].yPos <= 0) {
        pellets.shift()
      }
    }
  }

  //---------------------------------THE GREEN DOOD------------------------------//
  doodWidth = 40;
  doodHeight = 50;
  legLength = 5;
  legY = doodY + doodHeight / 2;

  if (doodDirection == 'right') {
    sign = 1;
  } 
  else if (doodDirection == 'left') {
    sign = -1;
  }

  //legs
  stroke(0, 0, 0);
  strokeWeight(doodWidth * (3 / 50));
  line(doodX - doodWidth * (23 / 50), legY, doodX - doodWidth * (23 / 50), legY + legLength);
  line(doodX - doodWidth * (8 / 50), legY, doodX - doodWidth * (8 / 50), legY + legLength);
  line(doodX + doodWidth * (8 / 50), legY, doodX + doodWidth * (8 / 50), legY + legLength);
  line(doodX + doodWidth * (23 / 50), legY, doodX + doodWidth * (23 / 50), legY + legLength);

  //body
  noStroke();
  if (!alive && !end){
    if (colorChange <= 10){
      fill(216, 70, 70);
    }
    else if (colorChange <= 20){
      fill(147, 213, 54);
    }
    else{
      colorChange = 0;
    }
    colorChange++;
  }
  else{
    fill(147, 213, 54);
  }
  ellipse(doodX, doodY, doodWidth, doodHeight);
  rect(doodX - doodWidth / 2, doodY, doodWidth, doodHeight / 2);

  //mouth
  if (mouthUp) {
    rect(doodX - doodHeight / 12, doodY - doodHeight * (4 / 50), doodHeight / 6, -doodWidth * (45 / 50));
  } 
  else {
    rect(doodX, doodY - doodHeight * (2 / 50), sign * doodWidth * (45 / 50), doodHeight / 6);
  }

  //eyes
  fill(0, 0, 0);
  if (mouthUp) {
    ellipse(doodX + doodWidth * (6 / 50), doodY - doodHeight / 4, doodWidth / 10 - 1, doodWidth / 10 + 1);
    ellipse(doodX - doodWidth * (6 / 50), doodY - doodHeight / 4, doodWidth / 10 - 1, doodWidth / 10 + 1);
  } 
  else {
    ellipse(doodX + sign * doodWidth * (18 / 50), doodY - doodHeight / 6, doodWidth / 10 - 1, doodWidth / 10 + 1);
    ellipse(doodX + sign * doodWidth * (8 / 50), doodY - doodHeight / 6, doodWidth / 10 - 1, doodWidth / 10 + 1);
  }

  for (let i in blocks) {
    if (blocks[i].myPowerUp.type == 'shield') {
      if (collisionEllipses(doodX, doodY, doodWidth, doodHeight, blocks[i].myPowerUp.x, blocks[i].myPowerUp.y, blocks[i].myPowerUp.width, blocks[i].myPowerUp.height)) {
        shieldIsActive = true;
        shieldTimer = millis();
        blocks[i].deletePowerUp();

      }
    }
  }
  
  if (shieldIsActive) {
    fill(183, 236, 66, 100);
    stroke(183, 236, 66);
    ellipse(doodX, doodY, doodHeight * 2);
    fill(56, 125, 166);
    textSize(15);
    text(round((10000 - (millis() - shieldTimer)) / 1000) + 's', doodX + doodWidth, doodY);
  }


  //------------------------------JUMP ANIMATION------------------------------//
  if (springJump) {
    jumpHeightMax = 80;
  } 
  else {
    jumpHeightMax = 40;
  }

  if (jumpCycle === 0) {
    if (springJump) {
      speed = 1.5;
    } 
    else {
      speed = 1;
    }
    jumpCycle++;
  } 
  else if (jumpCycle >= 1 && jumpCycle <= jumpHeightMax) {
    doodY -= 10 * speed;

    let speedChange;
    if (springJump) {
      speedChange = 1.5;
    } 
    else {
      speedChange = 1;
    }

    speed -= speedChange / jumpHeightMax;
    jumpCycle++;
  } 
  else if (jumpCycle >= jumpHeightMax) {
    springJump = false;

    doodY += 10 * speed;

    if (speed < 1) {
      speed += 1 / jumpHeightMax;
      jumpCycle++;
    }

    if ((touchedBlock('boolean', 'norm') || jumpedOnMonster) && alive) {
      jumpCycle = 0;
      landingSound.play();
      if (touchedBlock('boolean', 'norm')) {
        doodY = touchedBlock('#', 'norm').yPos - (doodHeight / 2 + legLength);
      }
      jumpedOnMonster = false;
    }

    touchedBlock(null, 'broken');
  }

  //scorebar
  fill(136, 195, 241, 150);
  rect(0, 0, canvasWidth, 50);
  stroke(0, 0, 0);

  strokeWeight(3.5);
  line(0, 50, canvasWidth, 50);

  noStroke();
  for (let i = 0; i < 8; i++) {
    fill(0, 0, 0, 80 - 10 * i);
    rect(0, 50 + 2 * i, canvasWidth, 2);
  }

  //displays the score
  noStroke()
  fill(0, 0, 0);
  textSize(30);
  text(score, 15, 35);

  
  //-----------------------------------MOVEMENT & SHOOOTING-----------------------------------//
  if (alive) {
    //if the mouse if to the right of the dood, move the dood right
    if (mouseX > doodX + doodWidth) {
      doodX += 4;
      doodDirection = 'right';
    }
    //otherwise, if the mouse if to the left, move the dood left
    else if (mouseX < doodX - doodWidth) {
      doodX -= 4;
      doodDirection = 'left';
    }


    //if the space key is pressed but is not being held down
    if (mouseIsPressed && !mouseDown){
      mouseDown = true; //makes sure the code doesn't get run when space is held down
      mouthUp = true; //moves the mouth up
      pellets.push(new pellet()); //fires a new pellet
      firingSound.play();
      waitTimer = 0;
    }

    //put the mouth down after a small delay
    else if (waitTimer >= 25) {
      mouthUp = false;
      waitTimer = 0;
    } else {
      waitTimer += 1;
    }
  }
  
  if (touchingMonster() && !shieldIsActive && !springJump){
    alive = false;
  }
  
  if (doodY - doodHeight/2 >= canvasHeight||end){
    if(!end){
      fallingSound.play();
    }
    end = true;
    alive = false;
    endScreen();
  }
}

function mouseReleased(){
  mouseDown = false;
}