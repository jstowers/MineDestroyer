// Grid Module
const Grid = {};

// This module generates a grid array for each step
// of the game, calculates grid dimensions, and converts
// a nested grid array into a string for printing the 
// result.


// makeGridArray() 
// input  => string representing a grid
// output => nested array with x and y coordinates as defined in the problem.
Grid.makeGridArray = function(string){

  // split string into an array of characters
  let strToArr = string.split('');

  // call gridDimensions to return array dimensions
  let xy = this.gridDimensions(string);

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


// gridDimensions() 
// input  => string representing a grid
// output => array representing the grid dimensions: [xLength, yLength]
Grid.gridDimensions = function(string){

  // split string into an array of characters
  let strToArr = string.split('');

  // count number of /n or /r characters => depth of array (y)
  let yLength =  string.split(/\r\n|\r|\n/).length;

  // count number of characters before first /n => width of array (x)
  let xLength = 0;

  // recursive function to determine width of array
  function recursive(string){

    // base case
    if (string.length === 0) {
      return xLength;
    }

    // if character !== '\n'
    else if (string[0] !== '\n'){
      xLength += 1;
      recursive(string.slice(1));
    }
  }

  recursive(strToArr);

  return [xLength, yLength];

}

// makeResultString()
// function takes a grid array and converts
// it into a string for printing to output
Grid.makeResultString = function(grid) {

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


module.exports = Grid;