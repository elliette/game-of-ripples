'use strict';

// COLOR PALETTE:
// darkest of dark blues
const darkblue1 = [9, 28, 87]; // neighbor health = 0;
const darkblue2 = [24, 41, 88]; // neighbor health = 1;
const darkblue3 = [50, 62, 102]; // neighbor health = 2; => becomes alive on next round
const darkblue4 = [60, 92, 126]; // neighbor health = 3; => becomes alive on next round
const darkblue5 = [78, 111, 135]; // neighbor health = 4; => becomes alive on next round
const darkblue6 = [96, 124, 141]; // neighbor health = 5; => becomes alive on next round
const darkblue7 = [117, 117, 197] // neighbor health = 6; => becomes alive on next round
// lighest of dark blues

// lightest of light blues
const lightblue = [255, 255, 255]; // neighbor health = 6;
const lightblue1 = [242, 242, 248]; // neighbor health = 5;
const lightblue2 = [217, 229, 240]; // neighbor health = 4
const lightblue3 = [191, 209, 229]; // neighbor health = 3
const lightblue4 = [166, 189, 219]; // neighbor = 2; => becomes dead on next round
const lightblue5 = [128, 166, 206]; // neighbor health = 1; => becomes dead on next round
const lightblue6 = [105, 149, 197]; // neighbor health = 0; => becomes dead on next round
// darkest of light blues

function Hexagon (x, y, row, column, color, alive) {
	this.x = x;
	this.y = y;
	this.row = row;
	this.column = column;
	this.alive = alive || false;
	this.neighborHealth = 0;
	this.color = color || darkblue1;
}

Hexagon.prototype.make = function() {
	push();
	translate(this.x, this.y);
	rotate(11);
	var angle = TWO_PI / 6; // 6 is the number of points a hexagon has
	beginShape();
	for (var a = 0; a < TWO_PI; a += angle) {
		var sx = cos(a) * 14; // 14 is our hexagon's size
		var sy = sin(a) * 14;
		vertex(sx, sy);
	}
	fill(this.color);
	endShape(CLOSE);
	pop();
};

Hexagon.prototype.toggleLifeStatus = function () {
	if (this.alive && this.neighborHealth < 3) {
		this.alive = false;
	} else if (!this.alive && this.neighborHealth > 1) {
		this.alive = true;
	}
};

Hexagon.prototype.checkNeighbors = function (rows) {
	for (var currRow = this.row - 1; currRow <= this.row + 1; currRow++) {
		for (var currCol = this.column; currCol <= this.column + 1; currCol++) {
			var hexToFindRow = currRow;
			var hexToFindCol = currCol;
			if (hexToFindRow === this.row && hexToFindCol === this.column){
				hexToFindCol--;
			}
			let neighborHex = rows[hexToFindRow][hexToFindCol];
			neighborHex.neighborHealth++;
			if (neighborHex.neighborHealth.alive) {
				this.neighborHealth++;
			}
			neighborHex.toggleLifeStatus();
			neighborHex.changeColor();
			// change neighborHex color;
		}
	}
	this.changeColor();
};

Hexagon.prototype.changeColor = function () {
	//console.log('old color is', this.color);
	if (this.alive) {
		console.log('its alive!!!!')
		console.log(this.neighborHealth);
		if (this.neighborHealth === 6){
			this.color = lightblue;
		} else if (this.neighborHealth === 5) {
			this.color = lightblue1;
		} else if (this.neighborHealth === 4) {
			this.color = lightblue2;
		} else if (this.neighborHealth === 3) {
			this.color = lightblue3;
		} else if (this.neighborHealth === 2) {
			this.color = lightblue4;
		} else if (this.neighborHealth === 1) {
			console.log('new color is light blue 5', lightblue5);
			this.color = lightblue5;
			console.log('with new color', this);
		} else if (this.neighborHealth === 0) {
			this.color = lightblue6;
		}
	} else {
		if (this.neighborHealth === 6){
			this.color = darkblue7;
		} else if (this.neighborHealth === 5) {
			this.color = darkblue6;
		} else if (this.neighborHealth === 4) {
			this.color = darkblue5;
		} else if (this.neighborHealth === 3) {
			this.color = darkblue4;
		} else if (this.neighborHealth === 2) {
			this.color = darkblue3;
		} else if (this.neighborHealth === 1) {
			this.color = darkblue2;
		} else if (this.neighborHealth === 0) {
			this.color = darkblue1;
		}
	}
	//console.log('new color is', this.color);
};

function Board (rows) {
	this.rows = rows || [];
}

Board.prototype.init = function () {
	function generateRow (startingX, y, rowNum) {
		var row = [];
		var columnNum = 0;
		for (var x = startingX; x <= windowWidth; x += 25){
			row.push( new Hexagon(x, y, rowNum, columnNum));
			columnNum++;
		}
		return row;
	}

	var currentRow = 0;
	for (var y = 15; y <= windowHeight; y += 44) {
		this.rows.push(generateRow(12, y, currentRow) );
		currentRow++;
		this.rows.push(generateRow(25, y + 22, currentRow));
		currentRow++;
	}
};

Board.prototype.display = function () {
	this.rows.forEach( row => {
		row.forEach(hex => hex.make() );
	});
};

Board.prototype.newState = function (newRows) {
	this.rows = newRows;
};

// MAKE P5.JS CANVAS
var board = new Board();

function setup () {
	let canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('canvas');
	background(30);
	board.init();
	board.display();
}

function draw () {
	// FILL IN HERE
}

function mousePressed () {
	var selectedHex;
	board.rows.forEach( row => {
		row.forEach(hex => {
			var xAbs = Math.abs(hex.x - mouseX);
			let yAbs = Math.abs(hex.y - mouseY);
			if (xAbs < 12 && yAbs < 12) {
				selectedHex = hex;
				console.log(selectedHex);
			}
		});
	});

	var row = selectedHex.row;
	var col = selectedHex.column;
	var even = true;

	var topLNeigh;
	var topRNeigh;
	var LNeigh;
	var RNeigh;
	var bottomLNeigh;
	var bottomRNeigh;

	var neighbors;

	if (!selectedHex.column % 2) { //  if the column is even
		topLNeigh = board.rows[row - 1][col];
		topRNeigh = board.rows[row - 1][col + 1];
		LNeigh = board.rows[row][col - 1];
		RNeigh = board.rows[row][col + 1];
		bottomLNeigh = board.rows[row + 1][col];
		bottomRNeigh = board.rows[row + 1][col + 1];
		//neighbors = [topLNeigh, topRNeigh, LNeigh, RNeigh, bottomLNeigh, bottomRNeigh];
		// console.log(neighbors);
	} else { // if the column is odd
		even = false;

		topLNeigh = board.rows[row - 1][col - 1];
		topRNeigh = board.rows[row - 1][col];
		LNeigh = board.rows[row][col - 1];
		RNeigh = board.rows[row][col];
		bottomLNeigh = board.rows[row][col - 1];
		bottomRNeigh = board.rows[row + 1][col];
	}
	neighbors = [topLNeigh, topRNeigh, LNeigh, RNeigh, bottomLNeigh, bottomRNeigh];
	neighbors = neighbors.map(neighHex => {
		neighHex.neighborHealth++;
		neighHex.changeColor();
		if (neighHex.alive){
			selectedHex.neighborHealth++;
		}
		return neighHex;
	});

	var newRowBefore; 
	var newCurrRow;
	var newRowAfter;

	if (even) {
		console.log('even!!')
		newRowBefore = board.rows[row - 1];
		topLNeigh = neighbors[0];
		topRNeigh = neighborHealth[1];
		newRowBefore = newRowBefore.slice(0, col) + topLNeigh + topRNeigh + newRowBefore.slice(col + 2);
		//newRowAfter.slice(col + 2);
		board.newState(newRowBefore);
		board.display();

	}

	console.log(neighbors);



	// var neighborRangeRows = Array.from(new Array(3), (x, i) => i + selectedHex.row - 1);
	// var neighborRangeCols = Array.from(new Array(3), (x, i) => i + selectedHex.column -1);
	// var nextRows = board.rows.map( row => {
	// 	return row.map(hex => {
	// 		if (neighborRangeRows.includes(hex.row) && neighborRangeCols.includes(hex.column) ){
	// 			if (hex.column === selectedHex.column-1 && hex.row !== selectedHex.row ) {
	// 				return hex;
	// 			} else if (hex.column === selectedHex.column && hex.row === selectedHex.row) {
	// 				// then this is the clicked on hexagon
	// 				return hex;
	// 			} else {
	// 				//if (hex.alive) console.log('alive neighbor is', hex);
	// 				hex.neighborHealth++;
	// 				if (hex.alive){
	// 					selectedHex.neighborHealth++;
	// 				}
	// 				hex.toggleLifeStatus();
	// 				//console.log('old color is', hex.color);
	// 				hex.changeColor();
	// 				//console.log('WHY DOESNT THIS COLOR MATCH', hex.color);
	// 				return new Hexagon(hex.x, hex.y, hex.row, hex.column, hex.color, hex.alive);
	// 			}
	// 		} else {
	// 			return hex;
	// 		}
	// 	});
	// });
	// selectedHex.alive = true;
	// selectedHex.changeColor();
	// //console.log(selectedHex);
	// nextRows[selectedHex.row][selectedHex.column] = new Hexagon(selectedHex.x, selectedHex.y, selectedHex.row, selectedHex.column, selectedHex.color, selectedHex.alive );
	// board.newState(nextRows);
	// board.display();
}
