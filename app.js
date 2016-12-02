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

	// loop through each step of scriptArray
	for (var i = 0; i < scriptArray.length; i++){

		// function to read step and create array of action(s)
		// can have multiple actions per step
		let stepArray = makeStepArray(scriptArray[i]);

		// function to perform logic on each action
		for (var j = 0; j < stepArray.length; j++){

			let fireActions = ['alpha', 'beta', 'gamma', 'delta'];
			let moveActions = ['north', 'south', 'east', 'west'];


			// if action is firing pattern
			if (fireActions.includes(stepArray[j])){
				

			} else if (moveActions.includes(stepArray[j])){
			// if action is move

			} else {
			// exit game if incorrect action	
				console.log('ERROR: '+ stepArray[j] + 
					' is an incorrect firing action or move.' + '\n' + 'Exiting Game.');
				process.exit(1);
			}


			


		} // end stepArray for loop

		// function to calculate result after all actions

		let result = ['pass', 1]

		// function to output result for step
		output(i+1, gridIni, scriptArray[i], '. * .', result);


		// if game not over, loop to next step


	} // end scriptArray for loop
} // end function main




// function to output result for each step
// grids are strings

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


