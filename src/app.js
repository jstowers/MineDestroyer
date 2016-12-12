
// Require app modules
const Input = require('./Input')
const Grid = require('./Grid');

function main() {

	let stepObject = Input.makeStepObject();

	runLoop(stepObject);

} // end function main


// Call function main()
main();

// run loop for running each step, and each
// action within each step (if given)
function runLoop(stepObject){

	let gridIni = Input.makeInitialGrid(); // returns initial grid from grid.txt
	let actions = stepObject.actions;
	let maxSteps = stepObject.steps.length;

	let gridNew = [];
	let actionStorage = [];
	let stepStorage = [];
	let resultStorage = [];

	function stepRecursive (stepCount,grid,action){

		if (stepCount > maxSteps){
			// console.log('stepCount = ', stepCount)

			return;
		}
		// multi-action steps
		else if (action.length > 1){

			let multiActionResult = multiActionStep(stepCount, grid, action);
			//console.log('multiActionResult = ', multiActionResult);

			stepStorage.push(multiActionResult);

			gridNew = multiActionResult[3];

		} 
		// single-action step
		else {

			// STRUCTURE:
			// stepStorage = [step, gridIni, action, gridFin, fireCount, moveCount];

			let singleActionResult = actionLogic(stepCount, grid, action[0]);

			stepStorage.push(singleActionResult);

			gridNew = singleActionResult[3];

		}

		/*	Check on Results => break out of recursion if necessary
	
			// Add function to check results

			// If no result, push step to storageResult

			// Consider adding queue/dequeue for printing results

		*/

		stepCount += 1;
		
		stepRecursive(stepCount, gridNew, actions[stepCount-1]);

	} // end function recursive

	// initial function call
	stepRecursive(1, gridIni, actions[0]);

	// push stepStorage to resultStorage
	resultStorage.push(stepStorage);

	// complete all steps and calculate result
	// calcScore(resultStorage, resultNum)
	let result = calcScore(resultStorage, 4);

	printResult(resultStorage, result[0], result[1]);
}


function multiActionStep(stepCount, grid, actions) {

	// Assign initial variables for output
	let step = stepCount;
	let gridIni = Grid.makeResultString(grid);
	let actionsString = actions.join(" ");
	let gridNew = '';
	let totalFireCount = 0;
	let totalMoveCount = 0;

	// Recursive function to loop through each action
	function recursive(step, grid, actions) {

		// Base case => exit recursion
		if(actions.length === 0){
			return;
		}

		let solution = actionLogic(step, grid, actions[0]);

		gridNew = solution[3]; // array
		totalFireCount += solution[4];
		totalMoveCount += solution[5];

		recursive(step, gridNew, actions.slice(1));
	}

	// initial function call to recursive()
	recursive(step, grid, actions)

	// convert final grid to string for output
	let gridFin = makeResultString(gridNew);

	console.log('multiActionStep return = ', [step, gridIni, actionsString, gridFin, totalFireCount, totalMoveCount]);
	return [step, gridIni, actionsString, gridFin, totalFireCount, totalMoveCount]
}


function actionLogic(depth, grid, action) {

	let actionStorage = [];

	let gridIni = makeResultString(grid);

	actionStorage.push(depth, gridIni, action);

	// determine type of action
	let actionResult = takeAction(grid, action, depth);

	actionResult.forEach(function(ele){
		actionStorage.push(ele);
	})

	// actionStorage = [step, gridIni, action, fireCount, moveCount, gridFin];
	// console.log('actionLogi() return = ', actionStorage);
	return actionStorage;
}

function takeAction(grid, action, depth){

	let fireCount = 0;
	let fireActions = ['alpha', 'beta', 'gamma', 'delta'];

	let moveCount = 0;
	let moveActions = ['north', 'south', 'east', 'west'];

	let gridFin = [];

	// if action is firing pattern
	if (fireActions.includes(action)){

		let fireResult = fireInTheHole(grid, action);
		gridFin = fireResult[0];
		fireCount = fireResult[1];
	}
	// if action is move
	else if (moveActions.includes(action)){

		let moveResult = moveTheShip(grid, action, depth);
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

	// returns nested grid array, fire count, and move count
	return [gridFin, fireCount, moveCount];
}


function moveTheShip(grid, direction,depth) {

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

	// send grid and -depth
	let gridAdjust = depthAdjust(gridResize,-depth);

	// return [gridResiz, shipLoc];
	return [gridAdjust, shipLoc];
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

  let resizeGrid = Grid.makeGridArray(grid);

  // n (across) => x axis
  let n = resizeGrid.length;

  // m (down) => y axis 
  let m = resizeGrid[0].length;
  
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
  //console.log('newDepth = ', newDepth)
  
  for (var i = 0; i < n; i++){
    for (var j = 0; j < m; j++){

      if (resizeGrid[i][j] !== '.' && resizeGrid[i][j] !== '*'){
        let currDepth = '';
        for (var key in depthChart){
          if(resizeGrid[i][j] === depthChart[key]){
            //console.log('char = ', resizeGrid[i][j])
            currDepth = key;
            //console.log('currDepth = ', currDepth)
          }
        }
        
        //console.log('currDepth after = ', currDepth);
        //console.log('newDepth = ', newDepth);
        
        if(Number(currDepth) === newDepth){
          //console.log('newDepth = ', newDepth);
          grid[i][j] = '*';
        }
        else{
          let depthAdjust = -1 + Number(currDepth);
          resizeGrid[i][j] = depthChart[depthAdjust];
        }
        //console.log('grid[' + i + '][' + j + '] = ' + resizeGrid[i][j] );
        currDepth = '';
      }
    }
  }
  
  // return updated grid
  return resizeGrid;
}


// function returns the midpoint [x,y] of an n x m grid,
// where n and m are odd numbers
function findGridMidpoint(grid) {

	// console.log('grid in Midpoint: ' + '\n' + grid);
	// console.log('typeof grid = ', typeof(grid))

	// n (across) => x axis
	let n = grid.length;
	// console.log('n = ', n);

	// m (down) => y axis
	let m = grid[0].length;
	// console.log('m = ', m);

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

	// console.log('origin = ', origin);

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

	// console.log('fireInTheHole typeof grid = ', typeof(grid))

	// place ship at middle of grid
	let shipLoc = findGridMidpoint(grid);
	// console.log('shipLoc = ', shipLoc);

	// return array of offset coordinates for fire pattern
	let firePattern = getFiringPattern(pattern);
	// console.log('firePattern = ', firePattern);

	// convert offset locations to grid coordinates
	let offsets = offsetToCords(grid, shipLoc, firePattern);
	// console.log('offsets = ', offsets);

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

	return [grid, shotsFired];
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



// resultStorage = [[step, gridIni, action, gridFin, fireCount, moveCount]];
function printResult(array, result, score){

	array.forEach(function(step){

		step.forEach(function(ele){
			console.log('Step', ele[0], '\n');
			console.log(ele[1], '\n');
			console.log(ele[2], '\n');
			console.log(ele[3], '\n');
		});
	});

	console.log(result, '(' + score + ')', '\n');
}


// function calculates final result and score
// based on the runLoop() logic
function calcScore(resultStorage, resultNum) {

	// resultStorage = [step, gridIni, action, gridFin, fireCount, moveCount]

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

		let totMoveCount = fireOrMoveCount(resultStorage, 'move');

		totPoints = resultFourScore(totFireCount, totMoveCount);
		
	}

	return [result, totPoints];
}

// function returns the total fire or move count, based
// on an array for action, step, or result
function fireOrMoveCount(array, type){

	let index = 0;
	let count = 0;
	let totCount = []

	if (type === 'fire'){
		index = 4;
	} else index = 5;

	totCount = array.map(function(step){
		step.forEach(function(ele){
			count += ele[index]
		})
		return count;
	});

	// console.log('totCount ' + type + ' = ' + totCount[0]);
	return totCount[0];
}

// function calculates the final score for 
// result #4: all mines cleared, no steps remaining
function resultFourScore(totFireCount, totMoveCount) {

	let finalScore = 0;

	let numMines = initialMineCount();

	let iniScore = 10 * numMines;

	let fireScore = Math.min((5*totFireCount),(5*numMines));

	let moveScore = Math.min((2*totMoveCount),(3*numMines));

	finalScore = iniScore - fireScore - moveScore;

	// return finalScore
	return finalScore;
}

// function calculates the initial mine count
function initialMineCount() {

	let numMines = [];

	let gridIni = Input.makeInitialGrid();

	gridIni.map(function(ele){

		ele.forEach(function(index){

			if(index !== '.' && index !== '\n'){
				numMines.push(index);
			}
		})
	})

	return numMines.length;
}