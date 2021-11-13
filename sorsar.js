//player character


pLeft = true; //left and right movement enablers
pRight = true;

wallFlag = false; //flag used when wall detection occurs



grav  = true; //gravity is applied when grav is true

var pass = false;

var norm_x = 0; //difference between colliding objects
var norm_y = 0;



class sorsar { 
  constructor(x,y){
    this.position = new p5.Vector(x, y);
    this.velocity = new p5.Vector(0, 0);
    this.acceleration = new p5.Vector(0, 0);
    this.force = new p5.Vector(0, 0);
    this.currFrame = frameCount;
    this.jump = 1;
  }
  
  applyForce(force) {
    this.acceleration.add(force);
  }
  
  draw(){
    
  
    fill(255,42,42); 
    angleMode(RADIANS);
    arc(this.position.x, this.position.y, 28, 40, -0.2, -0.1); //right legs
    arc(this.position.x, this.position.y, 28, 40, 0.1, 0.2);
    arc(this.position.x, this.position.y, 28, 40, 0.4, 0.5);
    
    arc(this.position.x, this.position.y, 28, 40, 2.5, 2.6); //left legs
    arc(this.position.x, this.position.y, 28, 40, 2.8, 2.9);
    arc(this.position.x, this.position.y, 28, 40, 3.1, 3.2);
    
    fill(165,42,42); //brown
    ellipse(this.position.x, this.position.y, 8, 16 ); //body of the roach
    
   this.acceleration.set(0, 0);
    
 
   
  }
   move() {
     
     
     if(keyIsDown(65) && pLeft && (this.position.x > 0))  //move left
       {
         mySorsar.velocity.set(-1.5,mySorsar.velocity.y)
       }
     else if(keyIsDown(68) && pRight && (this.position.x < 770)) //move right
      {
        mySorsar.velocity.set(1.5, mySorsar.velocity.y)
      }
     else
       {
         mySorsar.velocity.set(0,mySorsar.velocity.y)
       }
   
    this.applyForce(this.force);
    if(grav)
    {
      this.applyForce(gravity);
    }
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    


  } //end move


  titleAnimation() //jumping animation used for title screen
  {
    if(game.xCor == 0 && mySorsar.position.y < 240)
    {
      mySorsar.velocity.set(1.5, mySorsar.velocity.y)
    }
    else
    {
      mySorsar.velocity.set(0, mySorsar.velocity.y)
    }

    this.applyForce(this.force);
    if(grav)
    {
      this.applyForce(gravity);
    }
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);


    
}

  
    checkCollision() {
    if(this.position.y > 250) //bottom of player area
    {
      this.position.y = 250
      grav = false;
      pass = false;
      mySorsar.velocity.set(mySorsar.velocity.x, 0 )
    }
    else
    {
      grav = true;
    }
    if(this.velocity.y == 0)
    {
      this.jump = 0;
    }
    else
    {
      this.jump = 1;
    }
   
    for (var i=0; i<game.objects.length; i++) {
        if (dist(this.position.x, this.position.y, game.objects[i].x, game.objects[i].y) < 22) 
        {
            if (game.objects[i].collide) 
            {
                norm_x = this.position.x - game.objects[i].x;
                norm_y = this.position.y  - game.objects[i].y;
                wallFlag = true;
                break;
            }
          //other environment collision here
        }

    }
      if(wallFlag)
        {
          
         if( (norm_y < -14)) //platform collision from top
            {

              grav = false;
              this.velocity.y = 0;
              
            }
          else if(norm_y > 16) //platform colision from bottom
            {
               // this.force.add(0, 0.2)
                this.force.set(0, 0);
                this.velocity.y = 0;
            }
          if(norm_x > 14 ) //colision with left 
            {  
              //this.force.add(0.1,0 )  
              this.velocity.x = 0;
             // grav = false;   
              pLeft = false;

            }
            else
            {
              pLeft = true;
            }
          if(norm_x < -14 ) //colision with right
            {
              pRight = false;
              this.velocity.x = 0;
            }
            else
            {
              pRight = true;
            }
         wallFlag = false;
          
        

        }
      else
        {
          this.force.set(0, 0);
          wallFlag = false;
          pass = false;
          pLeft = true;
          pRight = true;
            
          
        }
      

  }//end checkCollision
  
  getRow()
  {
    var i = round(((this.position.y) / game.rows))
    return(i)
  }

  getCol()
  {
    var j = round(this.position.x / game.cols)
    return(j)
  }

  getBottom()
  {
    var i = this.getRow();
    var j = this.getCol();
    return(game.tilemap[i][j + 1])
  }
  
}//end sorsar




function keyPressed() {
  if (keyCode === 87 && mySorsar.jump == 0 && game.gameState == 2) {
    mySorsar.force.add(jumpForce);
    mySorsar.jump = 1;
  } else {
    mySorsar.force.set(0, 0);
  }
}

function keyReleased() {
   mySorsar.force.set(0, 0);
}


