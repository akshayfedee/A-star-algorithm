

// Cloned by Toyatma Fedee on 9 Nov 2022 from World "A star" by "Coding Train" project 
// Please leave this clone trail here.
 

// Port of 
// https://github.com/nature-of-code/NOC-S17-2-Intelligence-Learning/tree/master/week1-graphs/05_astar


// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// Part 1: https://youtu.be/aKYlikFAV4k
// Part 2: https://youtu.be/EaZxUCWAjb0
// Part 3: https://youtu.be/jwRT4PCT6RU

// is diagonal move allowed 
    const diagonal = true ;



// canvas size 
    const cw = 900;
    const ch = 600; 

// How many columns and rows 
// different each time
var rando = AB.randomIntAtoB ( 1, 5 );
var cols = 9 * rando;
var rows = 6 * rando;

 
// how many walls to make, from 0 to 1 
// different each time
const wallAmount = AB.randomFloatAtoB ( 0, 0.6 );  

const backcolor = 'white';
const wallcolor = 'black';
const pathcolor = 'darkred';

const opencolor     = 'lightgreen';
const closedcolor   = 'lightpink';


// 2D array
var grid = new Array(cols);

// Open and closed set
var openSet = [];
var closedSet = [];

// Start and end
var start;
var end;

// Width and height of each cell of grid
var w, h;

// The road taken
var path = [];





//=== heuristic ===========================
// this must be always optimistic - real time will be this or longer 

function heuristic ( a, b ) 
{
    if ( diagonal ) return ( dist(a.i, a.j, b.i, b.j) );

        // 2D distance
        // dist is a P5 function 

    else            return ( abs(a.i - b.i) + abs(a.j - b.j) );

        // else not diagonal, can only go across and down 
        // so this is optimistic
        // note this is not optimistic if we can do diagonal move 
}



//=== g function =======================================
// g function is known distance from start along a known path 
// we work this out by adding up adjacent squares in a cumulative fashion
// note g definition should be separate from h definition (in earlier version they were confused)

function gfn ( a, b ) 
{
    if ( diagonal ) return ( dist(a.i, a.j, b.i, b.j) );            // 2D distance

    else            return ( abs(a.i - b.i) + abs(a.j - b.j) );     // else go across and down 
}



// Function to delete element from the array
function removeFromArray(arr, elt) 
{
  // Could use indexOf here instead to be more efficient
  for (var i = arr.length - 1; i >= 0; i--) 
    if (arr[i] == elt) 
      arr.splice(i, 1);
}




// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// Part 1: https://youtu.be/aKYlikFAV4k
// Part 2: https://youtu.be/EaZxUCWAjb0
// Part 3: https://youtu.be/jwRT4PCT6RU

// An object to describe a spot in the grid
function Spot(i, j) 
{

  // Location
  this.i = i;
  this.j = j;

  // f, g, and h values for A*
  this.f = 0;
  this.g = 0;
  this.h = 0;

  // Neighbors
  this.neighbors = [];

  // Where did I come from?
  this.previous = undefined;

  // Am I an wall?
  if (random(1) < wallAmount)   this.wall = true;
  else                          this.wall = false;

  // Display me
  this.show = function(col) 
  {
    if (this.wall) 
    {
      fill(wallcolor);
      noStroke();
      
      // wall fills square 
            rect (      this.i * w,             this.j * h,             w,          h           );
        
      // wall only partially fills square 
      //    ellipse (   this.i * w + w / 2,     this.j * h + h / 2,     w * 0.7,    h * 0.7     );

    }
    else if (col)
    {
      fill(col);
      rect(this.i * w, this.j * h, w, h);
    }
  };
  

  // Figure out who my neighbors are
  this.addNeighbors = function(grid) 
  {
    var i = this.i;
    var j = this.j;
    
    if (i < cols - 1)   this.neighbors.push(grid[i + 1][j]);
    if (i > 0)          this.neighbors.push(grid[i - 1][j]);
    if (j < rows - 1)   this.neighbors.push(grid[i][j + 1]);
    if (j > 0)          this.neighbors.push(grid[i][j - 1]);
    
if (diagonal)
// diagonals are also neighbours:
{
    if (i > 0 && j > 0)                 this.neighbors.push(grid[i - 1][j - 1]);
    if (i < cols - 1 && j > 0)          this.neighbors.push(grid[i + 1][j - 1]);
    if (i > 0 && j < rows - 1)          this.neighbors.push(grid[i - 1][j + 1]);
    if (i < cols - 1 && j < rows - 1)   this.neighbors.push(grid[i + 1][j + 1]);
}
    
  }
  
}





function setup() 
{
    // slower frame rate to see how it is working 
   // frameRate (2);
    
    
  createCanvas(cw, ch);

  // Grid cell size
  w = width / cols;
  h = height / rows;

  // Making a 2D array
  for (var i = 0; i < cols; i++) 
    grid[i] = new Array(rows);

  for (var i = 0; i < cols; i++) 
    for (var j = 0; j < rows; j++) 
      grid[i][j] = new Spot(i, j);

  // All the neighbors
  for (var i = 0; i < cols; i++) 
    for (var j = 0; j < rows; j++) 
      grid[i][j].addNeighbors(grid);


  // Start and end
  start     = grid[0][0];
  end       = grid[cols - 1][rows - 1];
  start.wall    = false;
  end.wall      = false;

  // openSet starts with beginning only
  openSet.push(start);
  
    console.log('start search');

}



function draw() 
// the search goes on over many timesteps 
// each timestep, check one more square and draw current partial solution 
{

  // --- begin still searching -----------------------------
  if (openSet.length > 0) 
  {

    // Best next option
    var winner = 0;
    
    for (var i = 0; i < openSet.length; i++) 
      if (openSet[i].f < openSet[winner].f) 
        winner = i;
        
    var current = openSet[winner];

    // Did I finish?
    if (current === end) 
    {
      noLoop();
      console.log("success - found path");
    }

    // Best option moves from openSet to closedSet
    removeFromArray(openSet, current);
    closedSet.push(current);

    // Check all the neighbors
    var neighbors = current.neighbors;
    
    //--- start of for loop -----------
    for (var i = 0; i < neighbors.length; i++) 
    {
      var neighbor = neighbors[i];

      // Valid next spot?
      if (!closedSet.includes(neighbor) && !neighbor.wall) 
      {
        var g = current.g + gfn ( neighbor, current );      // add up g values in cumulative way 

        // Is this a better path than before?
        var newPath = false;
        if (openSet.includes(neighbor)) 
        {
          if (g < neighbor.g) 
          {
            neighbor.g = g;
            newPath = true;
          }
        }
        else 
        {
          neighbor.g = g;
          newPath = true;
          openSet.push(neighbor);
        }

        // Yes, it's a better path
        if (newPath) 
        {
          neighbor.h = heuristic ( neighbor, end );
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }
    //--- end of for loop -----------
    
  }
  // --- end still searching -----------------------------
  
  
  else 
  {
    console.log('fail - no path exists');
    noLoop();
    return;
  }


  // Draw current state of everything
  background(backcolor);

  for (var i = 0; i < cols; i++) 
    for (var j = 0; j < rows; j++) 
      grid[i][j].show();

  for (var i = 0; i < closedSet.length; i++) 
    closedSet[i].show( closedcolor );

  for (var i = 0; i < openSet.length; i++) 
    openSet[i].show( opencolor );


  // Find the path by working backwards
  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) 
  {
    path.push(temp.previous);
    temp = temp.previous;
  }


  
if (diagonal)
{
  // path as continuous line
  noFill();
  stroke(pathcolor);
  strokeWeight(w / 8);
  beginShape();
  for (var i = 0; i < path.length; i++) 
        vertex (    (path[i].i * w) + w / 2,     (path[i].j * h) + h / 2   );
  endShape();
}
else 
{
    // path as solid blocks 
   for (var i = 0; i < path.length; i++) 
     path[i].show(pathcolor);
}


}




