# A-star-algorithm
2022/2023 CA686I Foundations of Artificial Intelligence - make a better enemy using the A* algorithm using heuristic methods 


World 1: A* to seek out the agent
Clone Complex World.
Change the cosmetic style of the World to your own version:
Change some or all of: images, background, grid size, box density, run speed, music, etc.
This is important! This is to help me recall who did what, and tell your submission apart from other submissions.
Generate a new World image.
Keep the agent (the Mind) the same as the original.
The AI will go into the enemy (built-in to the World).
The agent gets a score showing how well it did. Your aim as the enemy is to reduce that score.
Diagonal moves off: Change the World so the enemy cannot make diagonal moves. This makes obstacles much harder.
Change the enemy to use A* to make a move.
What do we mean by this? After all, we are only going to move one square per step. A World where the enemy immediately jumped to the agent square before the agent had a chance to move would not be interesting.
So what we mean is that you use A* to figure the best route. Then make the first step on that route. Then the agent will move. Then you do a new A* to get the new route. And do the first step of that. And so on.
Prove it is A* by drawing the paths on screen. I will be changing the speed of the run, the size of the grid, and the density of boxes to see that it is A*. So make sure it works even as these variables change.
  
World 2: World 1 plus moving walls
Once the above is working, you can Clone it to make the following changes.
Allow some walls move at random during the run.
Holes will open up and close dynamically.
Make it a parameter we can change to experiment with more or less dynamic Worlds.
At the top of the code put these parameters that I can experiment with:
WALLMOVENO - number of wall blocks that will move, from 0 upwards.
WALLMOVETICK - wall blocks move every WALLMOVETICK timesteps. Zero for never.
Still draw the paths on screen, so we can watch the enemy route around moving walls.
  
Document and submission
Write a short document to explain your program. Point out anything I need to notice.
Prove that your algorithm can route around barriers.
Prove that your algorithm can adapt to moving walls.
Show failed experiments.
Your document does not need to include your code. I have root access and can see your code. You can highlight code snippets in the document.
When done, use the practical submission form to submit. The password for the form will be given out to the class.
The form asks for a URL. I ask for two Worlds which would have two URLs. So I suggest you use the URL of your Ancient Brain home page. You can list the two World URLs clearly in the document.
Complex world making a better enemy using the A* algorithm to catch the Agent :

Need Reloads for all the pages.

https://run.ancientbrain.com/run.php?world=1501174803&mind=1937063776




Other projects links :

A star path finder live demo : https://run.ancientbrain.com/run.php?world=1189485319

My wonderful world : https://run.ancientbrain.com/run.php?world=6474419238
