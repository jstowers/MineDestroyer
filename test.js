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
