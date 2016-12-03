// Require file system module
var fs = require('fs');

// Assign variables to files from command line arguments
var fieldFile = process.argv[2];
var scriptFile = process.argv[3];

// Synchronous call to read field and script files
// Since both files are small, I chose the simpler synchronous
// calls instead of asynchronous.
let gridIni = fs.readFileSync(fieldFile, 'utf-8');
let scriptIni = fs.readFileSync(scriptFile, 'utf-8');

// Call function main()
main();

function main() {

	// create array for each step in script file
	var scriptArray = makeScriptArray(scriptIni);

	var gridArray = makeGridArray(gridIni);

	let moveCounter = 0;
	let fireArray = [];

	// loop through each step of scriptArray
	for (var i = 0; i < scriptArray.length; i++){

		// if script line is blank, then vessel should 
		// drop 1km without firing or moving.
		// print result and go to next line
		if (scriptArray[i] === ''){
			console.log('inside a blank line');
			// !!!
			// call result();
		}

		// script line contains move, firing pattern, or both
		else {
			// function to read step and create array of action(s)
			// can have multiple actions per step
			let stepArray = makeStepArray(scriptArray[i]);

			
			// function to perform logic on each action
			for (var j = 0; j < stepArray.length; j++){

				let fireActions = ['alpha', 'beta', 'gamma', 'delta'];
				let moveActions = ['north', 'south', 'east', 'west'];

				// if action is firing pattern
				if (fireActions.includes(stepArray[j])){
					fireArray = fireInTheHole(gridArray, stepArray[j]);
					

				}
				// if action is move
				else if (moveActions.includes(stepArray[j])){
					moveCounter += 1;
					//moveTheShip(gridArray, stepArray[j]);
				
				} else {
				// exit game if incorrect action	
					console.log('ERROR: '+ stepArray[j] + 
						' is an incorrect firing action or move.' + '\n' + 'Exiting Game.');
					process.exit(1);
				}

			} // end stepArray for loop
		}

		// function to calculate result after all actions

		let result = ['pass', 1]

		// function to output result for step
		output(i+1, gridIni, scriptArray[i], fireArray[0], result);


		// if game not over, loop to next step

	} // end scriptArray for loop
} // end function main


/* DO NOT USE
function gridSize(grid) {

	// x increases going down
	let gridDown = grid.length;

	// y increases going across
	let gridAcross = grid[0].length; 

	return [gridDown, gridAcross];
}
*/


// function returns the midpoint [x,y] of an n x m grid,
// where n and m are odd numbers
function findGridMidpoint(grid) {

	// grid[0].length => n (across)
	let n = grid[0].length;

	// grid.length => m (down)
	let m = grid.length;

	// midpoint of n
	let nMid = Math.round(n/2) - 1;

	// midpoint of m
	let mMid = Math.round(m/2) - 1;

	return [nMid,mMid];
}

// function returns offset firing pattern
function getFiringPattern(pattern) {

	let patterns = {};

	/*
	alpha	x.x
			...
			x.x

	beta 	.x.
			x.x
			.x.

	gamma	...
			xxx
			...

	delta	.x.
			.x.
			.x.
	*/

	patterns.alpha = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
	patterns.beta = [[-1, 0], [0, -1], [0, 1], [1, 0]];
	patterns.gamma = [[-1, 0], [0, 0], [1, 0]];
	patterns.delta = [[0, -1], [0, 0], [0, 1]];

	for (key in patterns){
		if (pattern === key){
			return patterns[key];
		}
	}

}

// function converts firing pattern offsets to grid coordinates
// and returns only those coordinates that lie within the grid bounds
function offsetToCords(grid, origin, offsets) {

	// determine n x m grid lengths to check sums of coordinates
	// n => across
	let n = grid[0].length;

	// m => down
	let m = grid.length;

	// define cordStorage array
	let offsetCordStorage = [];

	// loop through offsets array and sum [x,y] of origin and offset coordinates
	for (let i = 0; i < offsets.length; i++) {
		let x = origin[0] + offsets[i][0];
		let y = origin[1] + offsets[i][1];

		// only return offsets that are in the grid
		if (x >= 0 && x < n && y >= 0 && y < m ) {
			offsetCordStorage.push([x,y]);
		}
	}

	// return coordinates
	return offsetCordStorage;
}

// function executes a torpedo fire command
function fireInTheHole(grid, pattern) {

	console.log('grid = ', grid);

	// place ship at middle of grid
	let shipLoc = findGridMidpoint(grid);
	console.log('shipLoc = ', shipLoc);

	// return array of offset coordinates for fire pattern
	let firePattern = getFiringPattern(pattern);
	console.log('firePattern = ', firePattern);

	// convert offset locations to grid coordinates
	let offsets = offsetToCords(grid, shipLoc, firePattern);
	console.log('offsets = ', offsets);

	// calculate shots fired
	let shotsFired = offsets.length;

	// Please note that the problem statement has x coordinates
	// going across and y coordinates going down.
	// But in looping through this nested array, the y coordinates
	// go down and the x coordinates go across.
	// To correct for this discrepancy, I switched the x and y in the 
	// offsets conditionals so that we're comparing in the correct order.

	// n => across (y)
	let n = grid[0].length;

	// m => down (x)
	let m = grid.length;

	// loop through grid and see if mines are located 
	// in the offset coordinates
	// a mine is a character a-z, A-Z that does not equal '.'
	// if mine destroyed, change character to '.'

	for (let i = 0; i < offsets.length; i++) {
		for (let x = 0; x < m; x++){
			for (let y = 0; y < n; y++){
				//console.log('x = ', x, ' y = ', y, ' grid[x][y] = ', grid[x][y]);
				if(grid[x][y] !== '.' && offsets[i][0] === y && offsets[i][1] === x) {
					//console.log('We have a direct hit');
					grid[x][y] = '.';
				}
			}
		}
	}

	// return resultant grid + shotsFired
	console.log('grid result = ', grid);
	console.log('shotsFired = ', shotsFired);
	return [grid, shotsFired];
}


// function to output result for each step
// step = number, gridIni = string; script = string; 
// resultGrid = string; result = array
function output(step, gridIni, script, resultGrid, result){

	let finalGrid = makeResultGrid(resultGrid);

	console.log('Step', step, '\n');
	console.log(gridIni, '\n');
	console.log(script, '\n');
	console.log(finalGrid, '\n');
	console.log(result[0], '(' + result[1] + ')', '\n');

}


function makeResultGrid(grid) {

	let storage = [];
	let string = '';

	for (let i = 0; i < grid.length; i++){
		for (let j = 0; j < grid[0].length; j++) {
			string += grid[i][j];
		}
		storage.push(string);
		string = "";
	}

	console.log('storage = ', storage);

	let result = storage.toString();
	console.log('result = ', result);

	return result.split(',').join("\n");

}



function makeStepArray(string) {
	let strToArr = string.split(' ');
	return strToArr;
}


function makeScriptArray(string) {

	let strToArr = string.split('\n');
	return strToArr;
}


function makeGridArray(string) {

	// split string into an array of characters
	let strToArr = string.split('');

	// determine line count for grid based on '\n'
	let lineCount =  string.split(/\r\n|\r|\n/).length;

	let array = [];
	let storage = [];

	// recursive function to create grid of nested arrays
	function recursive(string){

		// base case
		if (string.length === 0) {
			array.push(storage);
		}

		// if character != '\n'
		// push character into storage
		// slice character off string, call recursive(string)
		else if (string[0] !== '\n'){
			storage.push(string[0]);
			recursive(string.slice(1));
		}

		// if character = '\n'
		// push storage into array
		// empty storage for next nested array
		// slice '\n' off string, call recursive(string)
		else {
			array.push(storage);
			storage = [];
			recursive(string.slice(1));
		}
	}

	recursive(strToArr);

	return array;

};


