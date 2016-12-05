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
// action within each step
function runLoop(stepObject){

	let actions = stepObject.actions;
	let maxSteps = stepObject.steps.length;
	console.log('maxSteps = ', maxSteps)
	let stepCount = 0;

	let gridArray = makeGridArray(gridIni);

	function stepRecursive (grid,action){

		if (stepCount === maxSteps){
			return;
		}

		console.log('action = ', action);
		console.log('grid = ', grid);

		if (action.length > 1){
			actionRecursive(grid,action);
		} else {
			console.log('single action');
			// insert logic for single action steps
		}

		stepCount += 1;
		stepRecursive(grid, actions[stepCount]);
	}

	stepRecursive(gridArray,actions[0]);


	function actionRecursive(grid, action){

		//console.log('action.length = ', action.length);

		if (action.length === 0){
			console.log('complete actionSteps');
			return;
		}

		console.log('action = ', action[0]);
		console.log('grid = ', grid);
		// insert logic for each action
		console.log('multi-action logic')

		actionRecursive(grid, action.slice(1))
	}
}


function fire(grid, action) {

	// call torpedo offsets()

	// calculate shots fired

	// return grid with result

}


function move(grid, action) {




}








function runLogic(action, step, depth){

	console.log('action = ', action, '  step = ', step, '  depth = ', depth);

	
/*
	let fireActions = ['alpha', 'beta', 'gamma', 'delta'];
	let moveActions = ['north', 'south', 'east', 'west'];

	// if action is firing pattern
	if (fireActions.includes(action)){

		fireInTheHole(gridArray, action);
		//fireInTheHole(gridArray, action);
			
	}

	/*
	// if action is move
	else if (moveActions.includes(action){
		//moveCounter += 1;
		moveArray = moveTheShip(gridArray, action);
		
	} else {
	// exit game if incorrect action	
		console.log('ERROR: '+ stepArray[j] + 
			' is an incorrect firing action or move.' + '\n' + 'Exiting Game.');
		process.exit(1);
	}
	*/


}


function main() {

	// create array for each step in script file
	let scriptArray = makeScriptArray(scriptIni);
	console.log('scriptArray = ', scriptArray);

	let stepObject = readScriptArray(scriptArray);
	console.log('stepObject = ', stepObject);

	runLoop(stepObject);


	/*
	let moveCounter = 0;
	let fireArray = [];
	let moveArray = [];

	// loop through each step of scriptArray
	for (var i = 0; i < scriptArray.length; i++){

		// if script line is blank, then vessel should 
		// drop 1km without firing or moving.
		// print result and go to next line
		if (scriptArray[i] === ''){
			console.log('inside a blank line');
			// need to call function dropKM()
			// print result
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
					moveArray = moveTheShip(gridArray, stepArray[j]);
					
				} else {
				// exit game if incorrect action	
					console.log('ERROR: '+ stepArray[j] + 
						' is an incorrect firing action or move.' + '\n' + 'Exiting Game.');
					process.exit(1);
				}

			} // end stepArray for loop

			depthAdjust(gridArray, -1);
		}

		// function to calculate result after all actions

		let result = ['pass', 1]

		// function to output result for step
		output(i+1, gridIni, scriptArray[i], moveArray[0], result);


		// if game not over, loop to next step

	} // end scriptArray for loop

	*/
} // end function main


function moveTheShip(grid, direction) {

	// place ship at middle of grid
	let shipLoc = findGridMidpoint(grid);
	console.log('shipLoc before = ', shipLoc);

	/* NOTE ON CHANGE IN NORTH/SOUTH MOVE DIRECTIONS

		In the problem statement, the top-left corner of the grid
		is given as (0,0,0).  Based on the mine locations given
		in the problem statement, x coordinates increase 
		from left to right and y coordinates increase from top to bottom.

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
	*/

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

	console.log('shipLoc after = ', shipLoc);

	if (direction === 'north' || direction === 'south'){

		resizeNS(grid,shipLoc,direction);

	} else resizeEW(grid,shipLoc,direction);

	return [grid, shipLoc];
}


// function resizes grid based on a move north
// or south; returns a string for output
function resizeNS(grid, shipLoc, direction) {

	let x = shipLoc[0];
	let y = shipLoc[1];
	console.log('x =', x, '  y =', y);

	// n (across) => x axis
	let n = grid.length;

	// m (down) => y axis
	let m = grid[0].length;
	console.log('m = ', m);

	let yAbove = y - 0;
	console.log('yAbove =', yAbove);
	let yBelow = m - y - 1;
	console.log('yBelow =', yBelow);

	let yDiff = yBelow - yAbove;
	console.log('yDiff =', yDiff)

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

	console.log('result = ' + '\n' + result);

	return result;
}


// function resizes grid based on a move east
// or west; returns a string for output
function resizeEW(grid, shipLoc, direction) {

	let x = shipLoc[0];
	let y = shipLoc[1];
	console.log('x =', x, '  y =', y);

	// n (across) => x axis
	let n = grid.length;

	// m (down) => y axis
	let m = grid[0].length;
	console.log('m = ', m);

	let xRight = n - x - 1;
	console.log('xRight =', xRight);
	let xLeft = x - 0;
	console.log('xLeft =', xLeft);

	let xDiff = xRight - xLeft;
	console.log('xDiff =', xDiff);

	let tempString = makeResultString(grid);
	let strToArr = tempString.split('\n');
	console.log('strToArr = ', strToArr);

	let string = '';

	// create basic string based on number 
	// of additional columns
	for (var k = 0; k < Math.abs(xDiff); k++) {
		string += '.';
	}
	console.log('string = ', string);

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
	console.log('result = ' + '\n' + result);

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
	console.log('n = ', n);

	// m (down) => y axis
	let m = grid[0].length;
	console.log('m = ', m);

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
	console.log('shipLoc = ', shipLoc);

	// return array of offset coordinates for fire pattern
	let firePattern = getFiringPattern(pattern);
	console.log('firePattern = ', firePattern);

	// convert offset locations to grid coordinates
	let offsets = offsetToCords(grid, shipLoc, firePattern);
	console.log('offsets = ', offsets);

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
	console.log('grid result = ', grid);
	console.log('shotsFired = ', shotsFired);

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















