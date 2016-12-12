// Result Module
const Result = {};



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