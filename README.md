# MineDestroyer

## CognitiveScale Coding Assessment (12/5/2016)


### Directions for Cloning this Repository

If you would like to put this repository on your
computer, follow these easy steps:

1. 	Go to https://github.com/jstowers/MineDestroyer.

2. 	Click the green button to clone with HTTPS.

3. 	Copy the HTTPS link to the clipboard.

4. 	In a console window (like iTerm), create a new folder 
   	in a directory of your choosing. For example, in your Documents
   	directory, you could create a Coding folder:

		$ cd Documents

		$ mkdir Coding

5. 	Go to your new folder:

	  	$ cd Coding

6. 	Clone the MineDestroyer repository to your folder with the
	git clone command and pasting the link you copied above:
	
	  	$ git clone https://github.com/jstowers/MineDestroyer

7. 	That's it.  Are you ready to enter the Starfleet Academy!


### Directions for Running the App

1. 	After cloning this repository, check to make sure you 
   	have the necessary files:

	  	$ ls

2.  You should have the following files:

	  	a.	app.js
	  	b.	grid.txt
	  	c.	script.txt
	  	d.	README.md

3.	When you're ready to start your search and destroy mission, enter
	the following command:

	  	$ node app.js grid.txt script.txt

4.	GOOD LUCK!!

-------------------------------------------------------------------------

### Journal


*Thursday, 12/1/2016*

10:00 pm => I spent my evening programming the basic command line code
to read in the grid and script files.  I researched using callbacks and
promises for the fs.read method, but decided that since the files were
small, a straightforward synchronous function was more efficient.

----------------------------------------------------------------------------


*Friday, 12/2/2016*

10:00 am => Created a basic design outline for my program, considering 
the different functions and logic structures.  Based on the grid
structure, I decided to use nested arrays with for loops.  This allows
for straightforward manipulation of array elements, including firing
at the mines, moving locations, and changing depth.

I divided the problem into the following:

	1.	main() - basic program flow, stepping through the script file
	2.	parsing input files and creating grid
	3.  logic - fire, move, resize, pass over mine
	4.	output - print results in requested format

----------------------------------------------------------------------------

4:00 pm => Worked in the afternoon on looping through the grid structure
and the firing functionality.

----------------------------------------------------------------------------


*Saturday, 12/3/2016*

10:05 am => Realized last night that when looping through a 
nested array with two for loops the x and y coordinates were 
switched from the problem statement.  

To ensure consistency throughout the program, going to try
and refactor the recursion function that creates a grid into the 
proper format for looping.

Nested Array Before:
[[A,B,C], [D,E,F], [G,H,I]]

Nested Array After:
[[A,D,G], [B,E,H], [C,F,I]]

This will ensure that an (x,y) coordinate pair is equal
to an (i, j) pair in the code.

				 i (x) -->
             	 0   1   2
             	----------
   			0 |	 A   B   C
   	j (y)	1 |  D   E   F
			2 |  G   H   I

------------------------------------------------------------------------

2:05 pm => Completed refactor of code and coordinates work fine.  Also 
refactored function makeResultString() to convert the grid into the
proper string format for printing to output.

------------------------------------------------------------------------

4:00 pm =>  NOTE ON CHANGE IN NORTH/SOUTH MOVE DIRECTIONS

In the problem statement, the top-left corner of the grid
is given as (0,0,0).  Based on the mine locations given
in this statement, x coordinates increase from left to right 
and y coordinates increase from top to bottom.

This convention is customary for an x/y plane in three-dimensional
space.

Also in the problem statement, the direction moves are given as:

	north		increment y-coordinate of ship
	south		decrement y-coordinate of ship
	east		increment x-coordinate of ship
	west		decrement x-coordinate of ship

In the provided examples, I found a discrepancy in the direction
changes for north and south.  For north, the ship moves up the grid
instead of down.  This is the conventional direction of north on maps.
And for south, the ship moves down the grid.  These movements, however, 
conflict with the layout of the grid in the problem statement.

To ensure consistency with the provided examples, I'm changing the
north and south direction moves as follows:

	north		decrement y-coordinate of ship
	south		increment y-coordinate of ship

The east and west coordinates remain the same.

-------------------------------------------------------------------------

5:00 pm => In working to resize the array, I initially tried to add rows
for a N/S change by manipulating the grid array structure.  This proved
unwieldy.  Realizing that the resized array would be output as a 
string initially and not requiring array computations, I switched my
focus to building the resize array as a string.  This proved much easier.

I decided to separate the N/S and E/W resize functions for ease of 
design.

With the function makeGridArray(), I can easily convert these strings
into resized arrays.

--------------------------------------------------------------------------

11:00 pm => Completed resizeEW() and tested functionality.
Basic resize functionality N/S and E/W complete.  Need to trim
extra columns/rows of empty space.

Remaining work to complete:

	1.	Depth change of mine characters

	2.	Scoring - 4 scenarios; calculate # mines destroyed

	3.	Make runtime dynamic with script file loop

	4.	Fix output

	5.	Fix resize to trim extra columns of empty space. See Ex. 2, step 4.

	6.	Refactor main()

----------------------------------------------------------------------------


*Sunday, 12/4/2016*

2:00 am => Complete depth change adjustment of mine characters.  I decided to
you an object structure with a depth as a key and the character as a value.
For instance 1:'a'. Accessing an object with 'a':1 was a bit more difficult
since I was wanting to change a character based on the change in depth.

I also considered correlating character and depth to ASCII values for
each character:

```` javascript

		let curVal = 'Z'
		let curValNum = curVal.charCodeAt()
		console.log('Z = ', curValNum); // => 90

		// subtract one from current ASCII value
		let newVal = String.fromCharCode(curValNum-1);

		// return the new character
		console.log('newVal = ', newVal) // => 'Y'
		
````

Although this seemed a bit more intensive at the outset,
after accessing object properties in nested for loops, the ASCII method 
may have been more efficient.

----------------------------------------------------------------------------

8:30 am => Thought of another method to process the depth change 
adjustment.

I could create an array of just grid coordinates that contain a
character.  I pass this array into my depthAdjust() function, 
change the characters for those coordinates, return the 
new characters in a result array, and then insert them into the grid.

The result array could look like: [[[1,1], 'b'], [[2,3], '*'], [[5,5], 'Z']].  
I will consider this refactor if time permits.

----------------------------------------------------------------------------

12:00 pm => Prepare scoring functions.

----------------------------------------------------------------------------

2:00 pm => Spent about 2 hours hand drawing a computational flow diagram for this
program.  Needed to work through all of the functionality that I created and make the proper linkages.  Very similar to creating a process flow diagram for chemical
engineering.

My basic computational flow:

	GridIni + Action (Fire/Move) => Work Done => GridFin => Check Result => Loop Back or Print Result

For work functions, I analyzed what inputs (and data types) were needed and what 
output (and data types) were desired.  This process took a few hours to think through.

----------------------------------------------------------------------------

8:00 pm => I next analyzed how I wanted to store my data as the game progresses.  

First, each action contains a basic set of data that is needed to print the result.  This data is stored in an array called actionStorage[].

Then each step contains one or more actions.  The stepStorage[] array stores each actionStorage[] array for that particular step.

Finally, the resultStorage[] array stores all the stepStorage[] arrays for each
completed step.  resultStorage[] is then printed as output in the desired format.

Here is an overview of the data storage process and array structures:

	Process:

		actionStorage => stepStorage => resultStorage => printResult()

	Data Structures:	

		actionStorage[]:

			actionStorage = [step, gridIni, action, gridFin, fireCount, moveCount]

		stepStorage[]:

			stepStorage = [[actionStorage1], [actionStorage2], . . .]

		resultStorage[]:

			resultStorage = [[stepStorage1], [stepStorage2], . . .]

----------------------------------------------------------------------------

10:00 pm => Worked on a basic recursive runLoop() function to process each action.  I decided that an action is the smallest computational block and it requires only a grid
and an action (fire/move) to run.  I used recursion instead of for loops because the
number of actions that the computer will run is not known at the outset.  It could be
one action or many depending on the mine locations, the fire patterns, and the ship
moves.


------------------------------------------------------------------------------------

*Monday, 12/5/2016*

1:05 am => Complete runLoop() with recursion for single steps.  The runLoop() worked perfectly for single action steps, but I ran into problems for multi-action steps.  I decided to add a sub-recursive loop for steps that contain multiple actions.  Will test functionality with multi-action steps in the morning.

------------------------------------------------------------------------------------

9:00 am => Update README to reflect work completed yesterday.

------------------------------------------------------------------------------------

9:30 am => Work to complete:

	1.  Assign gridFin to gridIni for next action in recursive loop.

	2.	Complete scoring functionality for step 4.

	3.	Check runLoop() functionality for multi-action steps.

	4.	Validate depthAdjust() functionality for each step.





