

//text for instructions
var txt1 = "Move LEFT and RIGHT with A and D"
var txt2 = "JUMP on Enemies with W"
var txt3 = "Collect All Garbage and Avoid getting Crushed!"

var game;   //holds current game object
var mySorsar; //holds player object
var shoes = []; //array for all the shoes
var clouds = [];  //array for the clouds


var roach_y = -20;  //title screent positions
var runner_y = 420;


function preload(){ //load images for sprites and environment
  shoeImg = loadImage("images/shoe.png")
  surfaceTile = loadImage("images/surface.bmp");
  brickTile = loadImage("images/brick.bmp")
  city = loadImage("images/city_bg.png")
  cloud1 = loadImage("images/cloud1.png")
  cloud2 = loadImage("images/cloud2.png")
  sign = loadImage("images/sign.png")
  trash = loadImage("images/trash.png")
  lamp = loadImage("images/lamp.png")
  canImg = loadImage("images/can.png")
  myFont = loadFont("fonts/ArcadeClassic.ttf")
}


class canObj { //objective object
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  draw() {
    image(canImg, this.x, this.y)
    //check if player has collected the object
    if(dist(this.x, this.y, mySorsar.position.x, mySorsar.position.y) < 20)
      {
        game.score++;
        this.x = 2000;
      }
  }
  
}

class wallObj //wall object. collides with player and npc
{
  constructor(x, y, o)
  {
    this.x = x; 
    this.y = y;
    this.o = o; // 0 for surface, 1 for inner tile
    this.collide = true;
  }

  draw()
  {
    if(this.o == 0)
    {
      image(surfaceTile, this.x, this.y)
    }
    else if(this.o == 1)
    {
      image(brickTile, this.x, this.y)
    }
  }
    

}

class cloudObj  //animated clouds
{
  constructor(x, y, o)
  {
    this.x = x; 
    this.y = y;
    this.o = o; //1 for cloud 1 2 for cloud 2
    this.collide = false;
  }

  draw()
  {
    if(this.o == 1)
    {
      image(cloud1, this.x, this.y)
    }
    else if(this.o == 2)
    {
      image(cloud2, this.x, this.y)
    }

    if(this.x < 800)
    {
      this.x+= .2;
    }
    else
    {
      this.x = 0;
    }
  }

}


class gameObj { //game object
  constructor() {
  //initial tilemap for titlescreen
  this.tilemap = [
        "                    ",
        "                                         ",
        "  c            c         c              w",
        "     c     c     c            c    c    w",
        "                                        w",
        "                                        w",
        "                                        w",
        "sssss                                   w",
        "                                        w",
        "                                        w",
        "                                        w",
        "                                        w",
        "                                        w",
        "sssssssssssssssssssssssssssssssssssssssss",
        "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
        "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
        "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
        "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
        "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
        "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",];

    this.score = 0;
    this.currFrame = 0;
    this.objects = [];
    this.xCor = -400; //camera coordinate
    this.gameState = 0; //0 for titlescreen, 1 for instructions, 2 for gameplay, 3 for loss, 4 for win
    this.rows = 20
    this.cols = 41
  }  
  
  
  initialize() {
    for (var i=0; i<this.tilemap.length; i++) {
        for (var j = 0; j < this.tilemap[i].length; j++) {
            switch (this.tilemap[i][j]) {
                case 'w': this.objects.push(new wallObj(j*20, i*20, 1));
                    break;
                case 's':  this.objects.push(new wallObj(j*20, i*20, 0));
                   break;
                case 'c':  this.objects.push(new cloudObj(j*20, i*20, round(random(1,2))));
                   break;
                case 'o':  this.objects.push(new canObj(j*20, i*20));
                   break;
                case 'e':  shoes.push(new shoe(j*20, i*20));
                   break;
            }
        }
    }
  }
  
    drawTilemap() 
    {
    push();
    translate(this.xCor, 0)
    //draw environment
    image(city, 10, 114)
    image(city, 300, 114)
    image(city, 600, 114)
    image(sign, 200, 200)
    image(sign, 400, 200)
    image(trash, 130, 220)
    image(lamp, 300, 200)
    //draw tilemap
    for (var i = 0; i< this.objects.length; i++) 
    {
      this.objects[i].draw()
    }
    pop();

    if(game.gameState == 0) //pan camera if on titlescreen
    {
      if(this.xCor < 0 )     
      {
        this.xCor++;//mySorsar.velocity.x;
      }
    }
    else if(game.gameState == 2) //focus camera on player during gameplay
    {
      if((mySorsar.position.x > 200) && (mySorsar.position.x < 600))
      {
        this.xCor = this.xCor -  mySorsar.velocity.x;
      }

      if(game.score == 10) //check winning condition for level 1
      {
        game.gameState = 4;
      }
    }

  }
        
  loadLevel1()
  {
    //load the tilemap for level one
    this.objects = [];
    this.tilemap = [
      "  c        c           c     c      c    ",
      "      c       c    c      c      c       ",
      "                                         ",
      "   sss                           sss     ",
      "            o  e  o  e  o                ",
      "            sssssssssssss                ",
      "oe                                   eo  ",
      "ss                                   ss  ",
      "    e o         o          e   o  e      ",
      "   sssss    sssssssss   ssssssssssss     ",
      "                                         ",
      "                                         ",
      " o                                     o ",
      "sssssssssssssssssssssssssssssssssssssssss",
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",];
      this.initialize();

      
  }

} 



function mouseClicked() {
  //handle menu buttons for different states
  if((game.gameState == 0) && (game.xCor == 0))//titlescreen
  {
      if((mouseX > 160) && (mouseX < 240) && (mouseY > 240) && (mouseY < 280))
      {
        game.gameState = 2;
        mySorsar.position.set(200, 200)
        game.loadLevel1();
      }
      else if((mouseX > 150) && (mouseX < 285) && (mouseY > 310) && (mouseY < 350))
      {
        game.gameState = 1;
        
      }
  }

  else if(game.gameState == 1)// instructions menu
  {
    if((mouseX > 160) && (mouseX < 240) && (mouseY > 285) && (mouseY < 325))
    {
      game.gameState = 0;
    }

  }

  else if(game.gameState == 3 || game.gameState == 4) //endscreen
  {
    if((mouseX > 160) && (mouseX < 240) && (mouseY > 240) && (mouseY < 280))
    {
      mySorsar.position.set(0, 20)
      game = new gameObj;
      shoes = [];
      roach_y = -20;
      runner_y = 420;
      game.initialize();
    }

  }
}


function setup() {  
  jumpForce = new p5.Vector(0, -5);
  cnv = createCanvas(400,400);
  mySorsar = new sorsar(20, 0)
  game = new gameObj;
  gravity = new p5.Vector(0, 0.15);
  game.initialize();
}





function draw() {

  //create gradient background
  c1 = color(204, 40, 0);
  c2 = color(0);
  for(let y=0; y<height; y++){
    n = map(y,0,height,0,1);
    let newc = lerpColor(c1,c2,n);
    stroke(newc);
    line(0,y,width, y);
  }
  
  
  if(game.gameState == 0)//titlescreen
  {
   
    game.drawTilemap();

    stroke(255) //titletext animation
    fill(255, 0, 0);
    textFont(myFont)
    textSize(40);
    textStyle(NORMAL);
    text("Roach", 70, roach_y);
    textStyle(ITALIC);
    text("Runner", 200, runner_y);

    if(roach_y < 80)
    {
      roach_y+=4;
    }
    if((roach_y == 80) && (runner_y > 80))
    {
      runner_y-=4;
    }
    if(game.xCor == 0)  //camera pan is finished
    {
      
      fill(255)
      textSize(20);
      text("Play",180, 265);
      text("Instructions",157, 330);
      noFill();
      stroke(255);
      rect(150, 310, 135, 40);
      rect(160, 240, 80, 40);
      text("Sayf Eldomiaty", 150, 380)
     
    }

    push()
    translate(game.xCor, 0)
    mySorsar.draw()
    mySorsar.titleAnimation()
    mySorsar.checkCollision()
    pop()
  }
  else if(game.gameState == 1) //instructions menu
  {
    game.drawTilemap();
    fill(255)
    stroke(255)
    textSize(30)
    text("Instructions", 120, 80)
    stroke(255, 0, 0)
    textSize(17)
    text(txt1, 70, 120)
    text(txt2, 95, 140)
    text(txt3, 10, 160)
    



    textSize(20)
    text("Back", 180, 310);
    noFill()
    rect(160, 285, 80, 40);
    
  }

  else if(game.gameState == 2) //level 1
  {
    
    game.drawTilemap();
    translate(game.xCor, 0)
    mySorsar.draw()
    mySorsar.move()
    mySorsar.checkCollision()
    for(var i = 0; i < shoes.length; i++)
    {
      shoes[i].draw();
      shoes[i].checkCollision();
      shoes[i].move();
      shoes[i].state[shoes[i].curState].execute(shoes[i]);
    }
  }

  else if(game.gameState == 3 || game.gameState == 4) //endscreen
  {
    game.drawTilemap();
    fill(255)
    stroke(255)
    textStyle(NORMAL);  
    if(game.gameState == 3)
    {
      text('You Were Crushed!', 150, 50)
    }
    else
    {
      text('You Have Completed the First Level!', 50, 50)
    }
    text("Return",170, 265);
    noFill();
    rect(160, 240, 80, 40);


  }
  
 


}



