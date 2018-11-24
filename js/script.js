/*
 * add  the entry screen  to canvas , and append the canvas  
 */ 
var app = new PIXI.Application(window.innerWidth, window.innerHeight , {backgroundColor: 0xFF6600});
document.body.appendChild(app.view);
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";



//define the effective elem max count  
var maxCount = 16;
//denfine the current count  
var currentCount = 0;
//denfine score  
var score  =  0 ;

// define title text style
var style = new PIXI.TextStyle({
	fontFamily: 'Arial',
	fontSize: 60,
	fontStyle: 'italic',
	fontWeight: 'bold',
	fill: ['#ffffff', '#00ff99'], 
	stroke: '#4a1850',
	strokeThickness: 5,
	dropShadow: true,
	dropShadowColor: '#000000',
	dropShadowBlur: 4,
	dropShadowAngle: Math.PI / 6,
	dropShadowDistance: 6,
	wordWrap: true,
	wordWrapWidth: 440
});

//establish the title and add to canvas 
var richText = new PIXI.Text('2048', style);
richText.x = app.renderer.width / 2  ;
richText.y = app.renderer.height / 8;
app.stage.addChild(richText);


//establish the score text and add to canvas 
var scoreText = new  PIXI.Text('Score:' + score ,{
	fontSize:48
});
scoreText.x =  200 ;
scoreText.y =  200 ;
app.stage.addChild(scoreText);


//establish a 4 x 4 array , and initial it all zero  
var grid = [] ;
for (var i = 0; i < 4; i++) {
	grid[i] = [0, 0, 0, 0];
}


/*
 * function: getColorByNumber 
 * input   : number 
 * output  : number 
 * discription : input a numbe then return  corresponding colornumber  
 */

function getColorByNumber(number) {
	var colorValue = {
		0: 0xF98903,
		2: 0xF7DB70,
		4: 0xC62727,
		8: 0xBF6900,
		16:0x37A3A6,
		32:0x8095CE,
		64:0x8AACFF,
		128:0xF5B994,
		256:0x879E46,
		512:0xF03861,
		1024:0xC58ADE,
		2048:0xA10054
	};
	var color = colorValue[number];
	if (color === undefined) {
		color = 0xff0fff;
	}

	return color;
}


/*
 * function : flushUI 
 * input    : void 
 * output   : void 
 * discriprion:  flush the stage , calling drawCell function 
 */

var flushUI = function () {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			drawCell(i, j);
		}
	}

	scoreText.text = 'Score: ' + score;
};

/*
 * function: drawCell 
 * input   : rowIndex, columnIndex 
 * output  : void 
 * description: according to the rowIndex and the columnIndex which you get , then draw entire array , if some array elem have value
 * , draw the corresponding number , and set the anchor = 0.5 let the number center display 
 */

function drawCell(rowIndex, columnIndex) {

	var graphics = new PIXI.Graphics();
	var width = app.renderer.width ;
	var height = app.renderer.height ;
	graphics.beginFill(getColorByNumber(grid[rowIndex][columnIndex]), 1);
	graphics.lineStyle(7, 0xFF6600, 1);
	graphics.drawRect(width / 8 * 3 + columnIndex * width / 15, height / 8 * 2  + rowIndex * width / 15, width / 15, width / 15 );
	app.stage.addChild(graphics);
	if (grid[rowIndex][columnIndex] !== 0) {
		var number = new PIXI.Text(grid[rowIndex][columnIndex], {
			fontSize: 48
		});
		number.anchor.set(0.5);
		number.x = width / 30 + width  / 8 * 3 + columnIndex * width / 15;	
		number.y = width / 30 + height / 8 * 2 + rowIndex * width / 15;
		app.stage.addChild(number);
	}
};


/*
 * function : generateRandomNumber 
 * input    : void 
 * output   : a number
 * discription: this function return a number , range 0 to 4 
 */
function generateRandomNumber() {
	return Math.floor(Math.random() * 4);
}

/*
 * function  : addRandomCell 
 * input     : void 
 * output    : void
 * descripton:  randomly add a number which value is 2 , if the array elem have value , re-randomly produce the index , until the elem corresponding by rowIndex and  columnIndex hava no-value 
 */

var addRandomCell = function () {
	if (currentCount === maxCount) return;

	var rowIndex = generateRandomNumber();
	var columnIndex = generateRandomNumber();

	while (grid[rowIndex][columnIndex] !== 0) {
		rowIndex = generateRandomNumber();
		columnIndex = generateRandomNumber();
	}

	grid[rowIndex][columnIndex] = 2;
	currentCount++;
};

/*
 * function: moveCellToRight 
 * input   : void 
 * output  : void 
 * description:let the array fully move to right , if find some neighboring elem have same value , we should merge two elem , meanwhisquare the elem 
 */

function moveCellToRight() {
	var isChanged = false;

	for (var rowIndex = 0; rowIndex < 4; rowIndex++) {
		for (var columnIndex = 2; columnIndex >= 0; columnIndex--) {
			if (grid[rowIndex][columnIndex] === 0) continue;

			var theEmptyCellIndex = findTheFirstRightCell(rowIndex, columnIndex);
			if (theEmptyCellIndex !== -1) {
				grid[rowIndex][theEmptyCellIndex] = grid[rowIndex][columnIndex];
				grid[rowIndex][columnIndex] = 0;
				isChanged = true;
			}
			var currentIndex = theEmptyCellIndex === -1 ? columnIndex : theEmptyCellIndex;

			if (grid[rowIndex][currentIndex] === grid[rowIndex][currentIndex + 1]) {
				grid[rowIndex][currentIndex + 1] += grid[rowIndex][currentIndex];
				grid[rowIndex][currentIndex] = 0;

				score += grid[rowIndex][currentIndex + 1];

				isChanged = true;

				currentCount--;
			}

		}
	}

	return isChanged;
}

/*
 * function : findTheFirstRightCell 
 * input    : number : rowIndex, number : columnIndex
 * output   : nuber 
 * discription : find the array elem which position on the right side of the elem corresponding by the rowIndex and columnIndex, if find it return the columnIndex , otherwise return -1 
 */

function findTheFirstRightCell(rowIndex, columnIndex) {
	for (let i = 3; i > columnIndex; i--) {
		if (grid[rowIndex][i] === 0) {
			return i;
		}
	}

	return -1;
}

/*
 * function: onToRightEventHandler 
 * input   : void 
 * output  : void 
 * description: if succesly move to right , randomly add a cell , and flush the stage , check the game is over or not , if over , 
 * alert the message"Game over"
 */

var onToRightEventHandler = function () {
	var isChanged = moveCellToRight();
	if (isChanged) {
		addRandomCell();
	}
	flushUI();
	if (checkGameOver()) {
		alert('Game over.');
	}
};

/*
 * function: onToDownEventHandle
 * input   : void 
 * output  : void 
 * description: rotate the array 3 times, move the array to right, then rotate the array 1 time, and flush the stage and check game 
 * is over or not 
 */

var onToDownEventHandler = function () {
	rotateArray(3);
	var isChanged = moveCellToRight();
	rotateArray(1);
	if (isChanged) {
		addRandomCell();
	}
	flushUI();
	if (checkGameOver()) {
		alert('Game over.');
	}
};

/*
 * function: onToLeftEventHandle
 * input   : void 
 * output  : void 
 * description: same with onToDownEventHandle , the difference is rotate array 2 twice and move to right then rotate twice 
 */
var onToLeftEventHandler = function () {
	rotateArray(2);
	var isChanged = moveCellToRight();
	rotateArray(2);
	if (isChanged) {
		addRandomCell();
	}
	flushUI();
	if (checkGameOver()) {
		alert('Game over.');
	}
};

/*
 * function: onToUpEventHandle
 * input   : void 
 * output  : void 
 * description: same with onToDownEventHandle , the difference is rotate array once and move to right then rotate 3 times 
 */
var onToUpEventHandler = function () {
	rotateArray(1);
	var isChanged = moveCellToRight();
	rotateArray(3);
	if (isChanged) {
		addRandomCell();
	}
	flushUI();
	if (checkGameOver()) {
	flushUI();
		alert('Game over.');
	}
};


/*
 * function: rotateArray 
 * input   : rotateCount 
 * output  : void 
 * description: according to the input rotate counts , rotate array some times 
 */

function rotateArray(rotateCount) {
	for (var i = 0; i < rotateCount; i++) {
		grid = rotateArrayToRightOnce(grid);
	}
	
	           
/*
 * function: rotateArrayToRightOnce 
 * input   : array
 * output  : void 
 * description: rotate the cooresponding  array once 
 */
	function rotateArrayToRightOnce(array) {      // es6 map映射函数：遍历每个值和索引,然后对每个值和索引条用回调函数
		return array.map((row, rowIndex) => { // 箭头函数
			return row.map((item, columnIndex) => {
				return array[3 - columnIndex][rowIndex];
			})
		})
	}
}
/*
 * function : checkGameOver
 * input    : viod 
 * output   : viod 
 * description: when the currentCount equals to maxCount , judgeing whether every elem can be merged . 
 */
function checkGameOver() {
	if (currentCount !== maxCount) return false;

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (grid[i][j] === grid[i][j - 1] ||
				grid[i][j] === grid[i][j + 1] ||
				(grid[i-1] && grid[i][j] === grid[i - 1][j]) ||
				(grid[i+1] && grid[i][j] === grid[i + 1][j])
			) {
				return false;
			}
		}
	}

	return true;
}

addRandomCell();
addRandomCell();
flushUI();


// monitor  whether the keyboard press on some key 

document.addEventListener('keydown', function (event) {
	if (event.key === 'ArrowRight') {
		onToRightEventHandler();
	}

	if (event.key === 'ArrowUp') {
		onToUpEventHandler();
	}

	if (event.key === 'ArrowLeft') {
		onToLeftEventHandler();
	}

	if (event.key === 'ArrowDown') {
		onToDownEventHandler();
	}
});


// monitor  whether the screen is swipe by finger
var hammertime = new Hammer.Manager(document, {
	recognizers: [
		[Hammer.Swipe, {direction: Hammer.DIRECTION_ALL}]
	]
});
hammertime.on('swiperight', function() {
	onToRightEventHandler();
});
hammertime.on('swipeup', function () {
	onToUpEventHandler();
});
hammertime.on('swipeleft', function () {
	onToLeftEventHandler();
});
hammertime.on('swipedown', function () {
	onToDownEventHandler();
});

