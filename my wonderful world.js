var img;

function preload() 
{
   img = loadImage ( '/uploads/f3d33/1667856423.png' );
}


// make an array of random (x,y,z) positions 

const noboxes = 30;                 	// how many boxes to have 
var a = new Array(noboxes);         	// array of the box positions

for ( var i=0; i < noboxes; i++ )   	// set up the array
{
    a[i] = [ AB.randomIntAtoB(-500,500), AB.randomIntAtoB(-500,500), AB.randomIntAtoB(-500,500) ];
}	

const MUSICFILE = '/uploads/f3d33/BobMarley-SunIsShining.mp3';
AB.backgroundMusic ( MUSICFILE );


// Cloned by Toyatma Fedee on 29 Oct 2022 from World "One Cube World (P5)" by Starter user 
// Please leave this clone trail here.
 

const objectsize    = 150;      // size of object   

const anglechange   = 0.002;     // how much the rotate angle changes each step 

var angle = 0;                  // rotate angle starts at 0  


function setup()        // "setup" is called once at start of run 
{
  createCanvas ( ABWorld.fullwidth(), ABWorld.fullheight(),  WEBGL );
}

function draw()         // "draw" is called every timestep during run 
{
    background("WhiteSmoke");    // background color 
    //fill("DarkSlateGray");               // paint box with this color 
    
         texture(img);        	
  
    rotateX(angle);             // set each dimension rotation angle to "angle"
    rotateY(angle);
    rotateZ(angle);
    
for ( var i=0; i < noboxes; i++ )
{
  translate ( a[i][0], a[i][1], a[i][2] );		// get box position i 
  box(objectsize);             
}
 


    //box(objectsize);
  
  // box ( 200, 200, 200 );            // draw a cube of this size 
    
       
  
    angle = angle + anglechange ;       // change angle each step to get rotate movement
}

