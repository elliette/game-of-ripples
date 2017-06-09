'use strict';

// COLOR PALETTE:
const darkblue1 = [9, 28, 87]; // darkest of dark blues
const darkblue2 = [24, 41, 88];
const darkblue3 = [50, 62, 102];
const darkblue4 = [60, 92, 126];
const darkblue5 = [78, 111, 135];
const darkblue6 = [96, 124, 141]; // lighest of dark blues

const lightblue1 = [242, 242, 248]; // lightest of light blues
const lightblue2 = [217, 229, 240];
const lightblue3 = [191, 209, 229];
const lightblue4 = [166, 189, 219];
const lightblue5 = [128, 166, 206];
const lightblue6 = [105, 149, 197]; // darkest of light blues

function Hexagon (x, y, color, alive) {
	this.x = x;
	this.y = y;
	this.alive = alive || false;
	this.neighborHealth = 0;
	this.color = color || darkblue2;
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

function Board (rows) {
	this.rows = rows || [];
}

Board.prototype.init = function () {
	function generateRow (startingX, y) {
		var row = [];
		for (var x = startingX; x <= windowWidth; x += 25){
				row.push( new Hexagon(x, y));
		}
		return row;
	}

	for (var y = 15; y <= windowHeight; y += 44) {
		this.rows.push(generateRow(12, y) );
		this.rows.push(generateRow(25, y + 22));
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
	let nextRows = board.rows.map( row => {
		return row.map(hex => {
			var xAbs = Math.abs(hex.x - mouseX);
			let yAbs = Math.abs(hex.y - mouseY);
			if (xAbs < 12 && yAbs < 12) {
				return new Hexagon(hex.x, hex.y, lightblue6, true);
			} else {
				return hex;
			}
		});
	});
	board.newState(nextRows);
	board.display();
}
