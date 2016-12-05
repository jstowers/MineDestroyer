// Joseph Stowers
// December 4, 2016

// CognitiveScale 
// Coding Challenge

// MineDestroyer
// Program Outline


STORAGE ARRAYS:

	Array Format:
	------------------------------------------------------------------------
	actionStorage = [step, gridIni, action, gridFin, fireCount, moveCount];

	stepStorage = [[actionStorage1], [actionStorage2], . . .]

	resultStorage = [[stepStorage1], [stepStorage2], . . .]


	Process:
	------------------------------------------------------------------------
	actionStorage => stepStorage => resultStorage => printResult()

		1.	push actionStorage to stepStorage at end of action:

				stepStorage.push(actionStorage);

		2.	if no more actions, push stepStorage into resultStorage:

				if (stepStorage.length > 0){

					stepOutput(stepStorage)
					// this function will:
						1. sum number of moves
						2. sum number of shots fired
					// push resultant array into resultStorage
					 	resultStorage.push(stepStorage);

				} else {
					resultStorage.push(stepStorage);
				}

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
		let totFireCount = fireCount(resultStorage);
		let totMoveCount = moveCount(resultStorage);
		totPoints = resultFourScore(totFireCount, totMoveCount);
	}

	printResult(resultStorage, result, totPoints);

}


function fireOrMoveCount(array, type){

	let totCount = 0;
	// actionStorage = [step, gridIni, action, gridFin, fireCount, moveCount];

	// going to add all the element 4 of a nested array


	return totCount;

}

/*
	// DONE! => read grid and script files

	// read step from script file
	   	how: create object with array for step count, and actions
	DONE!//  stepObject = {[stepCount:number, actions:[array]], . . .}

	??	//	determine number of actions per step

				1. blank line
						=> go to result()
				2. one action
				3. multiple actions

		//	LOOP (array/recursion): if 1 or more actions:

			INPUT => (gridIni, action)
					actionStorage.push(step, gridIni, action)

			// run an action
					1. fire
					2. move
					actionStorage.push(fireCount, moveCount)

			// redraw grid (gridFin)
					actionStorage.push(gridFin)

			// actionStorage = [step, gridIni, action, fireCount, moveCount, gridFin];

			// determine if action FAILS:
					1. pass mine
						depthAdjust() => if '*' in grid
					2. hit mine
						hitMine() => shipLoc[x,y] !== '.'

					YES:	=>	Result #1 
								---------------------------------
								stepStorage.push(actionStorage);
								resultStorage.push(stepStorage);
								calcScore(resultStorage, 1);
								GAME OVER

			// determine if action WINS:
					1. all mines cleared

					YES: 
						Are steps remaining?
					
						YES =>  Result #3
								----------------------------------
								resultStorage.push(stepStorage);
								calcScore(resultStorage, 3);
								GAME OVER

						NO => 	Result #4
								----------------------------------
								resultStorage.push(actionStorage);
								calcScore(resultStorage, 4);

			// Mines remain
			   Are there more actions in this step?

				YES: 1. stepStorage.push(actionStorage);

					 2.	LOOP
							gridIni = gridFin
							action (grab from stepObject.actions.unshift

				NO: 1.  

					2. Do any steps remain?

						YES =>	LOOP 
								gridIni = gridFin
								action (grab from array)

						NO  => 	Result #2
								----------------------------------
								resultStorage.push(stepStorage);
								calcScore(resultStorage, 2);


			if WIN, see if more actions to run in this step
				How? unshift a value off the actions array
				
					// YES: go back to run



					// NO: go to result



	// 

*/