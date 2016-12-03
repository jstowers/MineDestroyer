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

Saturday, 12/3/2016

10:05 am => Realized that when looping through a nested array with two
for loops that the x and y coordinates are switched from the problem
statement.  To ensure consistency throughout the program, going to try
and refactor the recursion function that creates a grid into the proper
format for looping.

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
