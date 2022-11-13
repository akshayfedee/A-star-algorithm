

// Cloned by Toyatma Fedee on 13 Nov 2022 from Mind "Complex Mind (clone by Toyatma Fedee)" by Toyatma Fedee 
// Please leave this clone trail here.
 


// ==== Starter Mind ===============================================================================================
// (c) Ancient Brain Ltd. All rights reserved.
// This code is only for use on the Ancient Brain site.
// This code may be freely copied and edited by anyone on the Ancient Brain site.
// This code may not be copied, re-published or used on any other website.
// To include a run of this code on another website, see the "Embed code" links provided on the Ancient Brain site.




// =================================================================================================
// Sample Mind for more complex starter World  
// =================================================================================================

// World tells us agent position and enemy position
// World does not tell us of existence of walls
// if return invalid move (not empty square) World just ignores it and we miss a turn 


 

	AB.mind.getAction = function ( x )		// x is an array of [ ai, aj, ei, ej ]
	{ 
		var ai = x[0];
		var aj = x[1];
		var ei = x[2];
		var ej = x[3];

        // console.log("mind: " + x);
		// if strictly move away, will get stuck at wall, so introduce randomness 

		 if ( ej < aj ) 	return ( AB.randomPick ( ACTION_UP,		AB.randomPick(ACTION_RIGHT,ACTION_LEFT) 	)); 
		 if ( ej > aj ) 	return ( AB.randomPick ( ACTION_DOWN,	AB.randomPick(ACTION_RIGHT,ACTION_LEFT) 	)); 

		 if ( ei < ai ) 	return ( AB.randomPick ( ACTION_RIGHT,	AB.randomPick(ACTION_UP,ACTION_DOWN) 		)); 
		 if ( ei > ai ) 	return ( AB.randomPick ( ACTION_LEFT,	AB.randomPick(ACTION_UP,ACTION_DOWN) 		)); 

 		return  ( AB.randomIntAtoB (0,3) );
	};

