

// Cloned by Toyatma Fedee on 13 Nov 2022 from World "Complex World using A* " by Toyatma Fedee 
// Please leave this clone trail here.
 

//********************************************************************************************************************
//*******************************************************************************************************************

// Description: AB Starter World with addtional functions whenever the logicalMoveEnemy() function is called.
// The A* function uses a standalone grid made up of objects containg the A data elements, including the hueristic,
// distance. By Toyatma Fedee Student number *22***85 as part of 
// 2022/2023 CA686I Foundations of Artificial Intelligence


// ===================================================================================================================

// The sets are managed by a sorted array containing the open set, while the closed set is based on a flag
// in the A* array.
// The  visuals and the sound have been replaced by blue boxes and a click that gets slightly louder and faster
// when the enemy and agent are close to each other.


// ==== Starter World ===============================================================================================
// (c) Ancient Brain Ltd. All rights reserved.
// This code is only for use on the Ancient Brain site.
// This code may be freely copied and edited by anyone on the Ancient Brain site.
// This code may not be copied, re-published or used on any other website.
// To include a run of this code on another website, see the "Embed code" links provided on the Ancient Brain site.
// ==================================================================================================================

// =============================================================================================
// More complex starter World
// 3d-effect Maze World (really a 2-D problem)
// Movement is on a semi-visible grid of squares
//
// This more complex World shows:
// - Skybox
// - Internal maze (randomly drawn each time)
// - Enemy actively chases agent
// - Music/audio
// - 2D world (clone this and set show3d = false)
// - User keyboard control (clone this and comment out Mind actions to see)
// =============================================================================================


// =============================================================================================
// Scoring:
// Bad steps = steps where enemy is within one step of agent.
// Good steps = steps where enemy is further away.
// Score = good steps as percentage of all steps.
//
// There are situations where agent is trapped and cannot move.
// If this happens, you score zero.
// =============================================================================================






// === Start of tweaker's box ========================================================================================
// ===================================================================================================================

// The easiest things to modify are in this box.
// You should be able to change things in this box without being a JavaScript programmer.
// Go ahead and change some of these. What's the worst that could happen?


AB.clockTick = 100; // Speed of run: Step every n milliseconds. Default 100.

AB.maxSteps = 1000; // Length of run: Maximum length of run in steps. Default 1000.

AB.screenshotStep = 50; // Take screenshot on this step. (All resources should have finished loading.) Default 50.

//---- global constants: ----------------------------------------------------------------------

 const show3d = true;						// Switch between 3d and 2d view (both using Three.js) 

 const TEXTURE_WALL 	= '/uploads/f3d33/squarebox.jpg';       // wall texture
 const TEXTURE_MAZE 	= '/uploads/f3d33/2.jpg';               // maze texture
 const TEXTURE_AGENT 	= '/uploads/f3d33/mushroom.jpeg' ;      // agent texture
 const TEXTURE_ENEMY 	= '/uploads/f3d33/mario.jpg' ;          // enemy tecture


 const MUSIC_BACK  = '/uploads//biradap2/music.mp3' ;
 const SOUND_ALARM = '/uploads/starter/air.horn.mp3' ;

	
const gridsize = 50;						// number of squares along side of world	   

const NOBOXES =  Math.trunc ( (gridsize * gridsize) / 10 );
		// density of maze - number of internal boxes
		// (bug) use trunc or can get a non-integer 

const squaresize = 100;					// size of square in pixels

const MAXPOS = gridsize * squaresize;		// length of one side in pixels 
	
const SKYCOLOR 	= 0xddffdd;				// a number, not a string 

 
const startRadiusConst	 	= MAXPOS * 0.8 ;		// distance from centre to start the camera at
const maxRadiusConst 		= MAXPOS * 10  ;		// maximum distance from camera we will render things  



//--- change ABWorld defaults: ------------------------------------------------------------------------

ABHandler.MAXCAMERAPOS 	= maxRadiusConst ;

ABHandler.GROUNDZERO		= true;						// "ground" exists at altitude zero



//--- skybox: ------------------------------------------------------------------------------------------
// skybox is a collection of 6 files 
// x,y,z positive and negative faces have to be in certain order in the array 
// https://threejs.org/docs/#api/en/loaders/CubeTextureLoader 

//---------------------- NEW changes  -------------------------------------------------------------------
 const SKYBOX_ARRAY = [										 
                 "/uploads/f3d33//right.jpg",
                 "/uploads/f3d33//left.jpg",
                 "/uploads/f3d33//top.jpg",
                 "/uploads/f3d33//bottom.jpg",
                 "/uploads/f3d33//front.jpg",
                 "/uploads/f3d33//back.jpg"
                ];
//---------------------- END of changes------------------------------------------------------------------

//--- Mind can pick one of these actions -----------------

const ACTION_LEFT 			= 0;		   
const ACTION_RIGHT 			= 1;
const ACTION_UP 			= 2;		 
const ACTION_DOWN 			= 3;
const ACTION_STAYSTILL 		= 4;

// in initial view, (smaller-larger) on i axis is aligned with (left-right)
// in initial view, (smaller-larger) on j axis is aligned with (away from you - towards you)


// contents of a grid square

const GRID_BLANK 	= 0;
const GRID_WALL 	= 1;
const GRID_MAZE 	= 2;

var BOXHEIGHT;		// 3d or 2d box height 

var GRID 	= new Array(gridsize);			// can query GRID about whether squares are occupied, will in fact be initialised as a 2D array  

var search_grid = new Array(gridsize);  //this grid will be used by the A* algorithm

var theagent, theenemy;
  
var wall_texture, agent_texture, enemy_texture, maze_texture; 


// enemy and agent position on squares
var ei, ej, ai, aj;

var badsteps;

var goodsteps;


	
function loadResources()		// asynchronous file loads - call initScene() when all finished 
{
	var loader1 = new THREE.TextureLoader();
	var loader2 = new THREE.TextureLoader();
	var loader3 = new THREE.TextureLoader();
	var loader4 = new THREE.TextureLoader();
	
	loader1.load ( TEXTURE_WALL, function ( thetexture )  		
	{
		thetexture.minFilter  = THREE.LinearFilter;
		wall_texture = thetexture;
		if ( asynchFinished() )	initScene();		// if all file loads have returned 
	});
		
	loader2.load ( TEXTURE_AGENT, function ( thetexture )  	 
	{
		thetexture.minFilter  = THREE.LinearFilter;
		agent_texture = thetexture;
		if ( asynchFinished() )	initScene();		 
	});	
	
	loader3.load ( TEXTURE_ENEMY, function ( thetexture )  
	{
		thetexture.minFilter  = THREE.LinearFilter;
		enemy_texture = thetexture;
		if ( asynchFinished() )	initScene();		 
	});
	
	loader4.load ( TEXTURE_MAZE, function ( thetexture )  
	{
		thetexture.minFilter  = THREE.LinearFilter;
		maze_texture = thetexture;
		if ( asynchFinished() )	initScene();		 
	});
	
}


function asynchFinished()		 // all file loads returned 
{
	if ( wall_texture && agent_texture && enemy_texture && maze_texture )   return true; 
	else return false;
}	
	
	
 

//--- grid system --------------------------------------------------------------------------------------
// my numbering is 0 to gridsize-1

	
function occupied ( i, j )		// is this square occupied
{
 if ( ( ei == i ) && ( ej == j ) ) return true;		// variable objects 
 if ( ( ai == i ) && ( aj == j ) ) return true;

 if ( GRID[i][j] == GRID_WALL ) return true;		// fixed objects	 
 if ( GRID[i][j] == GRID_MAZE ) return true;		 
	 
 return false;
}

//---------------------- NEW changes  -------------------------------------------------------------------

// function to specifically check if the spot is either occupied
// by wall or maze
function isOccupied ( i, j )		// is this square occupied
{

 if ( GRID[i][j] == GRID_WALL ) return true;		// fixed objects	 
 if ( GRID[i][j] == GRID_MAZE ) return true;		 
	 
 return false;
}
//---------------------- END of changes------------------------------------------------------------------
 
// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates
// logically, coordinates are: y=0, x and z all positive (no negative)    
// logically my dimensions are all positive 0 to MAXPOS
// to centre everything on origin, subtract (MAXPOS/2) from all dimensions 

function translate ( i, j )			
{
	var v = new THREE.Vector3();
	
	v.y = squaresize;	
	v.x = ( i * squaresize ) - ( MAXPOS/2 );   		 
	v.z = ( j * squaresize ) - ( MAXPOS/2 );   	
	
	return v;
}

//---------------------- NEW changes--------------------------------------------------------------------
//A*
//Spot class
function Spot(i,j){
    
    this.i = i;
    this.j = j;
    
    // f, g, and h values for A*
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.maze = false;
    this.neighbors = [];
    this.previous = undefined;
    
    if(search_grid[this.i][this.j] == GRID_MAZE){
        this.maze = true;
    }
    
    // Figure out who my neighbors are
  this.addNeighbors = function(search_grid) {
    var i = this.i;
    var j = this.j;
    if (i < gridsize - 1) 
      this.neighbors.push(search_grid[i + 1][j]);
    if (i > 0) 
      this.neighbors.push(search_grid[i - 1][j]);
    if (j < gridsize - 1) 
      this.neighbors.push(search_grid[i][j + 1]);
    if (j > 0) 
      this.neighbors.push(search_grid[i][j - 1]);
      
    // to allow diagonal movements  
    /*if (i > 0 && j > 0) 
      this.neighbors.push(search_grid[i - 1][j - 1]);
    if (i < gridsize - 1 && j > 0) 
      this.neighbors.push(search_grid[i + 1][j - 1]);
    if (i > 0 && j < gridsize - 1) 
      this.neighbors.push(search_grid[i - 1][j + 1]);
    if (i < gridsize - 1 && j < gridsize - 1) 
      this.neighbors.push(search_grid[i + 1][j + 1]);*/
      
  };
    
  
}

//---------------------- END of changes------------------------------------------------------------------
	
function initScene()		// all file loads have returned 
{
	 var i,j, shape, thecube;
	 
	// set up GRID as 2D array
	 
	 for ( i = 0; i < gridsize ; i++ ) 
		GRID[i] = new Array(gridsize);		 


	// set up walls
	 
	 for ( i = 0; i < gridsize ; i++ ) 
	  for ( j = 0; j < gridsize ; j++ ) 
		if ( ( i===0 ) || ( i===gridsize-1 ) || ( j===0 ) || ( j===gridsize-1 ) )
		{
			GRID[i][j] = GRID_WALL;		 
			shape    = new THREE.BoxGeometry ( squaresize, BOXHEIGHT, squaresize );			 
			thecube  = new THREE.Mesh( shape );
			thecube.material = new THREE.MeshBasicMaterial( { map: wall_texture } );
			
			thecube.position.copy ( translate(i,j) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 
			ABWorld.scene.add(thecube);
		}
		else 
   			GRID[i][j] = GRID_BLANK;

		
   // set up maze 
   
    for ( var c=1 ; c <= NOBOXES ; c++ )
	{
		i = AB.randomIntAtoB(1,gridsize-2);		// inner squares are 1 to gridsize-2
		j = AB.randomIntAtoB(1,gridsize-2);
			
		GRID[i][j] = GRID_MAZE ;
		
		shape    = new THREE.BoxGeometry ( squaresize, BOXHEIGHT, squaresize );			 
		thecube  = new THREE.Mesh( shape );
		thecube.material = new THREE.MeshBasicMaterial( { map: maze_texture } );		  

		thecube.position.copy ( translate(i,j) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 
		ABWorld.scene.add(thecube);		
	}
	 	 
   
	// set up enemy 
	// start in random location
	
	 do
	 {
	  i = AB.randomIntAtoB(1,gridsize-2);
	  j = AB.randomIntAtoB(1,gridsize-2);
	 }
	 while ( occupied(i,j) );  	  // search for empty square 

	 ei = i;
	 ej = j;
	 
	 shape    = new THREE.BoxGeometry ( squaresize, BOXHEIGHT, squaresize );			 
	 theenemy = new THREE.Mesh( shape );
 	 theenemy.material =  new THREE.MeshBasicMaterial( { map: enemy_texture } );
	 ABWorld.scene.add(theenemy);
	 drawEnemy();		  

	 
	
	// set up agent 
	// start in random location
	
	 do
	 {
	  i = AB.randomIntAtoB(1,gridsize-2);
	  j = AB.randomIntAtoB(1,gridsize-2);
	 }
	 while ( occupied(i,j) );  	  // search for empty square 

	 ai = i;
	 aj = j;
 
	 shape    = new THREE.BoxGeometry ( squaresize, BOXHEIGHT, squaresize );			 
	 theagent = new THREE.Mesh( shape );
	 theagent.material =  new THREE.MeshBasicMaterial( { map: agent_texture } );
	 ABWorld.scene.add(theagent);
	 drawAgent(); 


  // finally skybox 
  // setting up skybox is simple 
  // just pass it array of 6 URLs and it does the asych load 
  
  	 ABWorld.scene.background = new THREE.CubeTextureLoader().load ( SKYBOX_ARRAY, 	function() 
	 { 
		ABWorld.render(); 
	 
		AB.removeLoading();
	
		AB.runReady = true; 		// start the run loop
	 });
 		

//---------------------- NEW changes  -------------------------------------------------------------------

 	//make a 2D searchGrid Array
 	for (var z = 0; z < gridsize; z++) {
        search_grid[z] = new Array(gridsize);
    }
  
 	// create a new spot for each of the grid position
 	for(var x =0;x<gridsize;x++){
        for(var y=0;y<gridsize;y++){
            
            search_grid[x][y] = new Spot(x,y);
        }
    }
    
    //add neighbors to a Spot
    for(var m =0;m<gridsize;m++){
        for(var n=0;n<gridsize;n++){
            
            search_grid[m][n].addNeighbors(search_grid);
        }
    }
//---------------------- END of changes------------------------------------------------------------------
 	
}
 
 
 


// --- draw moving objects -----------------------------------


function drawEnemy()		// given ei, ej, draw it 
{
	theenemy.position.copy ( translate(ei,ej) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 

	ABWorld.lookat.copy ( theenemy.position );	 		// if camera moving, look back at where the enemy is  
}


function drawAgent()		// given ai, aj, draw it 
{
	theagent.position.copy ( translate(ai,aj) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 

	ABWorld.follow.copy ( theagent.position );			// follow vector = agent position (for camera following agent)
}

//---------------------- NEW changes  -------------------------------------------------------------------
//A*
function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

function heuristic(a,b){
  
  var d = Math.abs(a.i-b.i) + Math.abs(a.j-b.j);
  return d;
}

pathArray = []
function displayPath(path){
    

    for(var i=0;i<path.length-1;i++){
        var x = path[i].i;
        var y = path[i].j;

        var geometry = new THREE.CircleGeometry( x, y );
        var material = new THREE.MeshBasicMaterial( { color: 0x7FFF00} );
        var circle = new THREE.Mesh( geometry, material );
        pathArray[i] = circle.uuid;
        circle.position.copy ( translate(x,y) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates
        ABWorld.scene.add( circle );
        
    }
    
  }

function deletePath(){
    
    for (var e = 0; e < pathArray.length; e++) {
        var t = pathArray[e];
        const a = ABWorld.scene.getObjectByProperty("uuid", t);
        ABWorld.scene.remove(a)
    }
    
    pathArray = [];
    
}
function findBestPath(grid,e,a){
    
    var path = [];
    var openSet = [];
    var closedSet = [];
    var return_spot;
    openSet.push(e);
    
    while(openSet.length > 0){
            
            var winner = 0;
            for (var i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[winner].f) {
                winner = i;
                }
             }
             
        var current = openSet[winner];
        
        if(current == a ){
            
            // reached enemy, return the first element in the path array
            var temp = current;
            path.push(temp);
            while(temp.previous){
                if(temp.previous == e)
                    return_spot = temp;
                path.push(temp.previous);
                temp = temp.previous;
            }
            displayPath(path);
            break;
            
        }else{
            
            //continue search
            removeFromArray(openSet,current);
            closedSet.push(current);
            var neighbors = current.neighbors;
            for(var j = 0;j<neighbors.length;j++){
                var neighbor = neighbors[j];
                
                
                if(!closedSet.includes(neighbor) && !isOccupied(neighbor.i,neighbor.j)){
                    var tempG = current.g + 1;
                    
                    if(openSet.includes(neighbor)){
                        if(tempG< neighbor.g){
                            neighbor.g = tempG;
                        }
                    }else{
                        neighbor.g = tempG;
                        openSet.push(neighbor);
                    }
                    neighbor.h = heuristic(neighbor,a);
                    neighbor.f = neighbor.g + neighbor.f;
                    neighbor.previous = current;
                
                }
             }
        
        }
    }
    
    return return_spot;
    
}

//---------------------- END of changes------------------------------------------------------------------

// --- take actions -----------------------------------



function moveLogicalEnemy()
{ 
// move towards agent 

//---------------------- NEW changes  -------------------------------------------------------------------

 var enemy_position = search_grid[ei][ej];
 var agent_position = search_grid[ai][aj];
 
 var new_position = findBestPath(search_grid,enemy_position,agent_position)
 
 // clear search_grid
 var clear;
 for (i = 0; i < gridsize; i++) {
    for (j = 0; j < gridsize; j++) {
            clear = search_grid[i][j];
            clear.f = 0;
            clear.h = 0;
            clear.g = 0;
            clear.previous = undefined;
        }
    }
 
 ei = new_position.i;
 ej = new_position.j;
 

}

//---------------------- END of changes------------------------------------------------------------------

function moveLogicalAgent( a )			// this is called by the infrastructure that gets action a from the Mind 
{ 
 var i = ai;
 var j = aj;		 

      if ( a == ACTION_LEFT ) 	i--;
 else if ( a == ACTION_RIGHT ) 	i++;
 else if ( a == ACTION_UP ) 		j++;
 else if ( a == ACTION_DOWN ) 	j--;

 if ( ! occupied(i,j) ) 
 {
  ai = i;
  aj = j;
 }
}




// --- key handling --------------------------------------------------------------------------------------
// This is hard to see while the Mind is also moving the agent:
// AB.mind.getAction() and AB.world.takeAction() are constantly running in a loop at the same time 
// have to turn off Mind actions to really see user key control 

// we will handle these keys: 

var OURKEYS = [ 37, 38, 39, 40 ];

function ourKeys ( event ) { return ( OURKEYS.includes ( event.keyCode ) ); }
	

function keyHandler ( event )		
{
	if ( ! AB.runReady ) return true; 		// not ready yet 

   // if not one of our special keys, send it to default key handling:
	
	if ( ! ourKeys ( event ) ) return true;
	
	// else handle key and prevent default handling:
	
	if ( event.keyCode == 37 )   moveLogicalAgent ( ACTION_LEFT 	);   
    if ( event.keyCode == 38 )   moveLogicalAgent ( ACTION_DOWN  	); 	 
    if ( event.keyCode == 39 )   moveLogicalAgent ( ACTION_RIGHT 	); 	 
    if ( event.keyCode == 40 )   moveLogicalAgent ( ACTION_UP		);   
	
	// when the World is embedded in an iframe in a page, we want arrow key events handled by World and not passed up to parent 

	event.stopPropagation(); event.preventDefault(); return false;
}





// --- score: -----------------------------------


function badstep()			// is the enemy within one square of the agent
{
 if ( ( Math.abs(ei - ai) < 2 ) && ( Math.abs(ej - aj) < 2 ) ) return true;
 else return false;
}


function agentBlocked()			// agent is blocked on all sides, run over
{
 return ( 	occupied (ai-1,aj) 		&& 
		occupied (ai+1,aj)		&&
		occupied (  ai,aj+1)		&&
		occupied (  ai,aj-1) 	);		
} 


function updateStatusBefore(a)
// this is called before anyone has moved on this step, agent has just proposed an action
// update status to show old state and proposed move 
{
 var x 		= AB.world.getState();
 AB.msg ( " Step: " + AB.step + " &nbsp; x = (" + x.toString() + ") &nbsp; a = (" + a + ") " ); 
}


function   updateStatusAfter()		// agent and enemy have moved, can calculate score
{
 // new state after both have moved
 
 var y 		= AB.world.getState();
 var score = ( goodsteps / AB.step ) * 100; 

 AB.msg ( " &nbsp; y = (" + y.toString() + ") <br>" +
		" Bad steps: " + badsteps + 
		" &nbsp; Good steps: " + goodsteps + 
		" &nbsp; Score: " + score.toFixed(2) + "% ", 2 ); 
}





AB.world.newRun = function() 
{
	AB.loadingScreen();

	AB.runReady = false;  

	badsteps = 0;	
	goodsteps = 0;

	
	if ( show3d )
	{
	 BOXHEIGHT = squaresize;
	 ABWorld.init3d ( startRadiusConst, maxRadiusConst, SKYCOLOR  ); 	
	}	     
	else
	{
	 BOXHEIGHT = 1;
	 ABWorld.init2d ( startRadiusConst, maxRadiusConst, SKYCOLOR  ); 		     
	}
	
	
	loadResources();		// aynch file loads		
							// calls initScene() when it returns 

	document.onkeydown = keyHandler;	
		 
};



AB.world.getState = function()
{
 var x = [ ai, aj, ei, ej ];
  return ( x );  
};



AB.world.takeAction = function ( a )
{
  updateStatusBefore(a);			// show status line before moves 

  moveLogicalAgent(a);

  if ( ( AB.step % 2 ) === 0 )		// slow the enemy down to every nth step
    moveLogicalEnemy();

  setTimeout(deletePath, 100); // change made by Kushagra 
  if ( badstep() )  badsteps++;
  else   			goodsteps++;

   drawAgent();
   drawEnemy();
   updateStatusAfter();			// show status line after moves  


  if ( agentBlocked() )			// if agent blocked in, run over 
  {
	AB.abortRun = true;
	goodsteps = 0;			// you score zero as far as database is concerned 			 
	musicPause();
	soundAlarm();
  }
    
   
};



AB.world.endRun = function()
{
  musicPause(); 
  if ( AB.abortRun ) AB.msg ( " <br> <font color=red> <B> Agent trapped. Final score zero. </B> </font>   ", 3  );
  else    				AB.msg ( " <br> <font color=green> <B> Run over. </B> </font>   ", 3  );
};

 
AB.world.getScore = function()
{
    var s = ( goodsteps / AB.maxSteps ) * 100;   // float like 93.4372778 
    var x = Math.round (s * 100);                // 9344
    return ( x / 100 );                          // 93.44
};


 



// --- music and sound effects ----------------------------------------

var backmusic = AB.backgroundMusic ( MUSIC_BACK );

function musicPlay()   { backmusic.play();  }
function musicPause()  { backmusic.pause(); }

											 
function soundAlarm()
{
	var alarm = new Audio ( SOUND_ALARM );
	alarm.play();							// play once, no loop 
}



 
