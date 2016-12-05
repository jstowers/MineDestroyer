// Require file system module
var fs = require('fs');

// Assign variables to files from command line arguments
var fieldFile = process.argv[2];
let gridIni = fs.readFileSync(fieldFile, 'utf-8');
console.log('gridIni = ', gridIni);

function gridDimensions(string){

  // split string into an array of characters
  let strToArr = string.split('');
  //console.log('strToArr = ', strToArr)

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

// function takes a string representing a grid
// and formats it into a nested array with
// x and y coordinates as defined in the problem.

function makeGrid(string){

  console.log('string = ', string);

  // split string into an array of characters
  let strToArr = string.split('');
  console.log('strToArr = ', strToArr)

  let xy = gridDimensions(string);

  let xWidth = xy[0]; // 3
  let yWidth = xy[1]; // 5

  console.log('xWidth =' , xWidth, '  yWidth =', yWidth);

  let storage = [];
  let array = [];

  for (var i = 0; i < xWidth; i++){

    for (var k = i; k < strToArr.length; k += (xWidth+1)){

      storage.push(strToArr[k]);

    }

    array.push(storage);
    storage = [];
  }

  /*
  for (var i = 0; i < xWidth; i++){
    for (var j = 0; j < yWidth; j++){
      console.log('array[',i,'][',j,'] =', array[i][j]);
    }
  }
  */

  // return nested array
  console.log('array width (x) = ', array.length);
  console.log('array depth (y) = ', array[0].length);
  return array;

}

let testGrid = makeGrid(gridIni);

// function to reconstruct grid into 
// output string format
function makeResultGrid(grid) {

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

console.log('result Grid = ' + '\n' + makeResultGrid(testGrid));







/*
function runLogic(action, step, depth){

  console.log('action = ', action, '  step = ', step, '  depth = ', depth);

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
}
*/


// OLD CODE FOR MAIN()
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

/*
OUTPUT RESULT:

// passed or hit a mine
function calcScore(resultStorage, resultNum) {

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
    let totFireCount = fireOrMoveCount(resultStorage[4]);
    let totMoveCount = moveOrMoveCount(resultStorage[5]);
    totPoints = resultFourScore(totFireCount, totMoveCount);
  }

  printResult(resultStorage, result, totPoints);

}
*/

