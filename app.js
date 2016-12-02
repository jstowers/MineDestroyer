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

function main() {

	let test = makeGridArray(gridIni);

	console.log('test =', test);


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
			//console.log('array = ', array);
			return array;
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

	return recursive(strToArr);

};

makeGridArray(gridIni);



