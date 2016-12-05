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


// function creates object with initial depths and actions
// for each step
function readScriptArray(array) {

	// each element of the script array represents a step.
	// after completing all actions in each step, the ship
	// will drop in -1 km in depth

	let stepCount = 1;
	let depth = 0;

	let stepObject = {};
	stepObject.steps = [];
	stepObject.depthIni = [];
	stepObject.actions = [];

	array.forEach(function(ele){
		stepObject.steps.push(stepCount);
		stepObject.depthIni.push(depth);
		stepObject.actions.push(ele);
		stepCount++
		depth--;
	});

	return stepObject;
}

// run loop for running each step, and each
// action within each step (if given)
function runLoop(stepObject){

	let actions = stepObject.actions;
	let maxSteps = stepObject.steps.length;
	// console.log('maxSteps = ', maxSteps)

	let gridArray = makeGridArray(gridIni);
	let gridNew = [];

	let stepStorage = [];
	let resultStorage = [];

	function stepRecursive (stepCount,grid,action){

		if (stepCount > maxSteps){
			// console.log('stepCount = ', stepCount)
			return;
		}

		//console.log('action = ', action);
		//console.log('stepCount = ', stepCount);
		//console.log('grid = ', grid);

		if (action.length > 1){
			actionRecursive(stepCount,grid,action);

		} else {

			let actionStorage = [];
			actionStorage.push(stepCount, grid, action[0]);

			// change initial grid to string
			let temp = makeResultString(grid);

			actionLogic(actionStorage);

			// assign the initial grid the value of temp
			// based on the recursive stack, after I call a function
			// that changes the grid, it changes the initial grid in 
			// actionStorage.  So I needed to save the initial grid 
			// as a temp string.
			actionStorage[1] = temp;

			// STRUCTURE:
			// actionStorage = [step, gridIni, action, gridFin, fireCount, moveCount];

			// convert gridFin to string for printing to output
			actionStorage[3] = makeResultString(actionStorage[3]);
			stepStorage.push(actionStorage);
			outputAction(actionStorage);

			// gridNew becomes gridIni for the next step
			gridNew = makeGridArray(actionStorage[3]);

		}

		stepCount += 1;
		stepRecursive(stepCount, gridNew, actions[stepCount-1]);
	}

	stepRecursive(1, gridArray, actions[0]);

	// push stepStorage to resultStorage
	resultStorage.push(stepStorage);

	// complete all steps and calculate result
	// calcScore(resultStorage, resultNum)
	calcScore(resultStorage, 4);


	function actionRecursive(stepCount, grid, action){

		if (action.length === 0){
			stepStorage.push(actionStorage)
			return;
		}

		// console.log('action = ', action[0]);
		// console.log('grid = ', grid);
		// insert logic for each action
		// console.log('multi-action logic')

		actionRecursive(stepCount, grid, action.slice(1))
	}
}

function calcScore(resultStorage, resultNum) {

	// resultStorage is an array

	let result = ''
	let totPoints = 0;

	// resultNum
	// ---------------------------------------------
	// 1 = passed or hit a mine
	// 2 = steps completed, but mines remaining
	// 3 = all mines cleared, but steps remaining
	// 4 = all mines cleared and no steps remaining

	if (resultNum === 1 || resultNum === 2) {
		result = 'fail';
	} else result = 'pass';

	// totPoints
	if (resultNum === 3) {
		totPoints = 1;
	}
	else if (resultNum === 4){
		
		let totFireCount = fireOrMoveCount(resultStorage, 'fire');
		console.log('totFireCount = ', totFireCount);
		let totMoveCount = fireOrMoveCount(resultStorage, 'move');
		console.log('totMoveCount = ', totMoveCount);
		//totPoints = resultFourScore(totFireCount, totMoveCount);
		
	}

	//printResult(resultStorage, result, totPoints);

}

function fireOrMoveCount(array, type){

	let index = 0;
	let count = 0;
	let totCount = []

	// array = [step, gridIni, action, gridFin, fireCount, moveCount];
	if (type === 'fire'){
		index = 4;
	} else index = 5;

	totCount = array.map(function(step){
		step.forEach(function(ele){
			count += ele[index]
		})
		return count;
	});

	console.log('totCount = ', totCount[0]);
	return totCount[0];
}


		




// actionStorage = [step, gridIni, action, gridFin, fireCount, moveCount];
function outputAction(array){

	// dummy result data
	let result = ['pass', 5];

	console.log('Step', array[0], '\n');
	console.log(array[1], '\n');
	console.log(array[2], '\n');
	console.log(array[3], '\n');
	console.log(result[0], '(' + result[1] + ')', '\n');

}


function actionLogic(actionStorage) {

	let grid = actionStorage[1];
	let action = actionStorage[2];

	// determine type of action
	let actionResult = takeAction(actionStorage[1], action);

	actionResult.forEach(function(ele){
		actionStorage.push(ele);
	})

	// actionStorage = [step, gridIni, action, fireCount, moveCount, gridFin];
	return actionStorage;
}

function takeAction(grid, action){

	let fireCount = 0;
	let fireActions = ['alpha', 'beta', 'gamma', 'delta'];

	let moveCount = 0;
	let moveActions = ['north', 'south', 'east', 'west'];

	let gridFin = [];

	// if action is firing pattern
	if (fireActions.includes(action)){

		// returns gridFin and shots fired
		let fireResult = fireInTheHole(grid, action);
		gridFin = fireResult[0];
		fireCount = fireResult[1];
	}
	// if action is move
	else if (moveActions.includes(action)){
		// returns gridFin and ship location
		let moveResult = moveTheShip(grid, action);
		gridFin = moveResult[0];
		moveCount = 1;
	} 
	// if action is blank line ' '
	else if (action === ''){
		console.log('Blank Line');
		// need to step through to next step
	}
	// exit game if incorrect action
	else {
		console.log('ERROR: '+ action + 
			' is an incorrect firing action or move.' + '\n' + 
			'Please check your script file and try again.');
		process.exit(1);
	}

	return [gridFin, fireCount, moveCount];
}


function main() {

	// create array for each step in script file
	let scriptArray = makeScriptArray(scriptIni);
	// console.log('scriptArray = ', scriptArray);

	let stepObject = readScriptArray(scriptArray);
	// console.log('stepObject = ', stepObject);

	runLoop(stepObject);

} // end function main


function moveTheShip(grid, direction) {

	// place ship at middle of grid
	let shipLoc = findGridMidpoint(grid);

	let directions = {};
	directions.north = [0, -1];
	directions.south = [0, 1];
	directions.east = [1, 0];
	directions.west = [-1, 0];

	for (key in directions){
		if (direction === key){
			shipLoc[0] += directions[key][0];
			shipLoc[1] += directions[key][1];
		}
	}

	let gridResize = [];

	if (direction === 'north' || direction === 'south'){

		gridResize = resizeNS(grid,shipLoc,direction);

	} else gridResize = resizeEW(grid,shipLoc,direction);

	return [gridResize, shipLoc];
}


// function resizes grid based on a move north
// or south; returns a string for output
function resizeNS(grid, shipLoc, direction) {

	let x = shipLoc[0];
	let y = shipLoc[1];
	//console.log('x =', x, '  y =', y);

	// n (across) => x axis
	let n = grid.length;

	// m (down) => y axis
	let m = grid[0].length;
	//console.log('m = ', m);

	let yAbove = y - 0;
	//console.log('yAbove =', yAbove);
	let yBelow = m - y - 1;
	//console.log('yBelow =', yBelow);

	let yDiff = yBelow - yAbove;
	//console.log('yDiff =', yDiff)

	let stringAdd = '';

	for (var k = 0; k < Math.abs(yDiff); k++){
		for (var i = 0; i < n; i++){
			stringAdd += '.'
		}
		stringAdd += '\n';
	}

	let tempString = makeResultString(grid);
	let result = '';

	if (yDiff > 0) {
		result = stringAdd + tempString;
	} else {
		result = tempString + '\n' + stringAdd;
	}

	//console.log('result = ' + '\n' + result);

	return result;
}


// function resizes grid based on a move east
// or west; returns a string for output
function resizeEW(grid, shipLoc, direction) {

	let x = shipLoc[0];
	let y = shipLoc[1];
	//console.log('x =', x, '  y =', y);

	// n (across) => x axis
	let n = grid.length;

	// m (down) => y axis
	let m = grid[0].length;
	//console.log('m = ', m);

	let xRight = n - x - 1;
	//console.log('xRight =', xRight);
	let xLeft = x - 0;
	//console.log('xLeft =', xLeft);

	let xDiff = xRight - xLeft;
	//console.log('xDiff =', xDiff);

	let tempString = makeResultString(grid);
	let strToArr = tempString.split('\n');
	//console.log('strToArr = ', strToArr);

	let string = '';

	// create basic string based on number 
	// of additional columns
	for (var k = 0; k < Math.abs(xDiff); k++) {
		string += '.';
	}
	//console.log('string = ', string);

	let resultString = '';

	if (xDiff > 0){
		for (var i = 0; i < strToArr.length; i++){
			resultString = string + strToArr[i];
			strToArr[i] = resultString;
		}
	} else {
		for (var i = 0; i < strToArr.length; i++){
			strToArr[i] += string;
		}
	}

	let result = strToArr.toString().split(',').join("\n");
	//console.log('result = ' + '\n' + result);

	return result;
}


function depthAdjust(grid, depth){
  
  let depthChart = {
  	1:'a',
  	2:'b',
  	3:'c',
  	4:'d',
  	5:'e',
  	6:'f',
  	7:'g',
  	8:'h',
  	9:'i',
  	10:'j',
  	11:'k',
  	12:'l',
  	13:'m',
  	14:'n',
  	15:'o',
  	16:'p',
  	17:'q',
  	18:'r',
  	19:'s',
  	20:'t',
  	21:'u',
  	22:'v',
  	23:'w',
  	24:'x',
  	25:'y',
  	26:'z',
  	27:'A',
  	28:'B',
  	29:'C',
  	30:'D',
  	31:'E',
  	32:'F',
  	33:'G',
  	34:'H',
  	35:'I',
  	36:'J',
  	37:'K',
  	38:'L',
  	39:'M',
  	40:'N',
  	41:'O',
  	42:'P',
  	43:'Q',
  	44:'R',
  	45:'S',
  	46:'T',
  	47:'U',
  	48:'V',
  	49:'W',
  	50:'X',
  	51:'Y',
  	52:'Z'
  }

  let newDepth = -depth;
  console.log('newDepth = ', newDepth)
  
  for (var i = 0; i < grid.length; i++){
    for (var j = 0; j < grid[0].length; j++){
      if (grid[i][j] !== '.' && grid[i][j] !== '*'){
        let currDepth = '';
        for (var key in depthChart){
          if(grid[i][j] === depthChart[key]){
            //console.log('char = ', grid[i][j])
            currDepth = key;
            //console.log('currDepth = ', currDepth)
          }
        }
        
        //console.log('currDepth after = ', currDepth);
        //console.log('newDepth = ', newDepth);
        
        if(Number(currDepth) === newDepth){
          console.log('newDepth = ', newDepth);
          grid[i][j] = '*';
        }
        else{
          let depthAdjust = -1 + Number(currDepth);
          grid[i][j] = depthChart[depthAdjust];
        }
        console.log('grid[' + i + '][' + j + '] = ' + grid[i][j] );
        currDepth = '';
      }
    }
  }
  
  // return updated grid
  return grid
}


// function returns the midpoint [x,y] of an n x m grid,
// where n and m are odd numbers
function findGridMidpoint(grid) {

	// n (across) => x axis
	let n = grid.length;
	//console.log('n = ', n);

	// m (down) => y axis
	let m = grid[0].length;
	//console.log('m = ', m);

	// midpoint of n
	let nMid = Math.round(n/2) - 1;

	// midpoint of m
	let mMid = Math.round(m/2) - 1;

	//console.log('midPoint = [', nMid, ',', mMid, ']');

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
	// n (across) => x axis
	let n = grid.length;

	// m (down) => y axis
	let m = grid[0].length;

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

	// place ship at middle of grid
	let shipLoc = findGridMidpoint(grid);
	//console.log('shipLoc = ', shipLoc);

	// return array of offset coordinates for fire pattern
	let firePattern = getFiringPattern(pattern);
	//console.log('firePattern = ', firePattern);

	// convert offset locations to grid coordinates
	let offsets = offsetToCords(grid, shipLoc, firePattern);
	//console.log('offsets = ', offsets);

	// calculate shots fired
	let shotsFired = offsets.length;

	// n => across (x)
	let n = grid.length;

	// m => down (y)
	let m = grid[0].length;

	for (let k = 0; k < offsets.length; k++) {
		for (let i = 0; i < n; i++){
			for (let j = 0; j < m; j++){
				//console.log('x = ', i, ' y = ', j, ' grid[x][y] = ', grid[i][j]);
				if(grid[i][j] !== '.' && offsets[k][0] === i && offsets[k][1] === j) {
					// console.log('We have a direct hit');
					grid[i][j] = '.';
				}
			}
		}
	}

	// return resultant grid + shotsFired
	// console.log('grid result = ', grid);
	// console.log('shotsFired = ', shotsFired);

	// call function to check current location to see if mine exists


	// check resultant grid for number of mines remaining

		// if all mines blown away, then win


	return [grid, shotsFired];
}


// function outputs results for each step
// step = number, gridIni = string; script = string; 
// gridFin = string; result = array
function output(step, gridIni, script, resultGrid, result){

	let gridFin = makeResultString(resultGrid);

	console.log('Step', step, '\n');
	console.log(gridIni, '\n');
	console.log(script, '\n');
	console.log(gridFin, '\n');
	console.log(result[0], '(' + result[1] + ')', '\n');

}

// function takes a grid array and converts
// it into a string for printing to output()
function makeResultString(grid) {

  //console.log('grid in ResultString =', grid);

  let storage = [];
  let string = '';

    for (let j = 0; j < grid[0].length; j++) {

      for (let i = 0; i < grid.length; i++){
        string += grid[i][j];
      }

      storage.push(string);
      string = "";
    };

  let result = storage.toString().split(',').join("\n");

  return result;
}


function makeStepArray(string) {

	let strToArr = string.split(' ');
	return strToArr;
}


// function takes a script file as a string,
// splits it into an array with each element
// representing a step, then splits each step
// into multiple actions (if more than one).
// function returns an array.
function makeScriptArray(string) {

	let strToArr = string.split('\n');

	let scriptArray = [];

	strToArr.forEach(function(ele){
		scriptArray.push(ele.split(" "));
	});

	return scriptArray;
}


// function takes a string representing a grid
// and formats it into a nested array with
// x and y coordinates as defined in the problem.
function makeGridArray(string){

  // split string into an array of characters
  let strToArr = string.split('');

  // call gridDimensions to return array diemenions
  let xy = gridDimensions(string);

  let xWidth = xy[0];
  let yWidth = xy[1];

  let storage = [];
  let array = [];

  for (var i = 0; i < xWidth; i++){
    for (var k = i; k < strToArr.length; k += (xWidth+1)){
      storage.push(strToArr[k]);
    }
    array.push(storage);
    storage = [];
  }

  /* Nested for loops for checking format
  for (var i = 0; i < xWidth; i++){
    for (var j = 0; j < yWidth; j++){
      console.log('array[',i,'][',j,'] =', array[i][j]);
    }
  }
  */

  // return nested array
  return array;
}


// function determines the x and y grid dimensions
// based on a string input
function gridDimensions(string){

  // split string into an array of characters
  let strToArr = string.split('');

  // count number of /n or /r characters => depth of array (y)
  let yLength =  string.split(/\r\n|\r|\n/).length;

  // count number of characters before /n => width of array (x)
  let xLength = 0;

  // recursive function to determine width of array
  function recursive(string){

    // base case
    if (string.length === 0) {
      return xLength;
    }

    // if character != '\n'
    else if (string[0] !== '\n'){
      xLength += 1;
      recursive(string.slice(1));
    }
  }

  recursive(strToArr);

  return [xLength, yLength];

}















