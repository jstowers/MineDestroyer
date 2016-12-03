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

	let fireCounter = 0;
	let moveCounter = 0;

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
					fireCounter += 1;
					fireInTheHole(gridArray, stepArray[j]);
					

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
		output(i+1, gridIni, scriptArray[i], '. * .', result);


		// if game not over, loop to next step

	} // end scriptArray for loop
} // end function main


// function returns the midpoint [x,y] of an n x m grid
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



function fireInTheHole(grid, pattern) {

	// place ship at middle of grid
	let shipLoc = findGridMidpoint(grid);
	console.log('shipLoc = ', shipLoc);


	// destroy mine if offset === character


		// if destroy mine => character becomes 



	// return a resultant grid (??)
}





// function to output result for each step
// step = number, gridIni = string; script = string; 
// resultGrid = string; result = array
function output(step, gridIni, script, resultGrid, result){

	console.log('Step', step, '\n');
	console.log(gridIni, '\n');
	console.log(script, '\n');
	console.log(resultGrid, '\n');
	console.log(result[0], '(' + result[1] + ')', '\n');

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
	console.log('strToArr = ', strToArr);

	// determine line count for grid based on '\n'
	let lineCount =  string.split(/\r\n|\r|\n/).length;
	console.log('lineCount = ', lineCount);

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


