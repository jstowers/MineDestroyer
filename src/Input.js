// Input Module
const Input = {};

// This module reads the grid and script files specified
// in the command line execution and extracts the data
// to create the initial data structures.

// Require Grid module
const Grid = require('./Grid')

// Require file system module
const fs = require('fs');

// Assign variables to files specified in command line arguments
let fieldFile = process.argv[2];
let scriptFile = process.argv[3];


// makeInitialGrid()
// reads field file and returns an array representing
// the initial grid
Input.makeInitialGrid = function() {

	let gridIni = fs.readFileSync(fieldFile, 'utf-8');

	return Grid.makeGridArray(gridIni);

}

// makeStepObject()
// stepObject { steps:[ ], depthIni:[ ], actions:[ ] }
// reads script file and returns an object with initial
// depths and actions for each step.
Input.makeStepObject = function () {

	let scriptIni = fs.readFileSync(scriptFile, 'utf-8');

	let scriptArray = this.makeScriptArray(scriptIni);

	// each element of the script array represents a step.
	// after completing all actions in each step, the ship
	// will drop down -1 km in depth
	
	let stepCount = 1;
	let depth = 0;

	let stepObject = {};
	stepObject.steps = [];
	stepObject.depthIni = [];
	stepObject.actions = [];

	scriptArray.forEach(function(ele){
		stepObject.steps.push(stepCount);
		stepObject.depthIni.push(depth);
		stepObject.actions.push(ele);
		stepCount++
		depth--;
	});

	return stepObject;
}


// makeScriptArray(string)
// input  => string
// output => array
// takes a script file as a string, splits it into an array 
// with each element representing a step, then splits each step
// into multiple actions (if more than one).
Input.makeScriptArray = function(string) {

	let strToArr = string.split('\n');

	let scriptArray = [];

	strToArr.forEach(function(ele){
		scriptArray.push(ele.split(" "));
	});

	console.log('scriptArray = ', scriptArray);
	return scriptArray;
}

module.exports = Input;
