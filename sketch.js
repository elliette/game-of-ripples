'use strict';

// UTILITY FUNCTIONS

function makeHexagon() {
	var angle = TWO_PI / 6; // 6 is the number of points a hexagon has
	beginShape();
	for (var a = 0; a < TWO_PI; a += angle) {
		var sx = cos(a) * 14; // 14 is our hexagon's size?
		var sy = sin(a) * 14;
		vertex(sx, sy);
	}
	endShape(CLOSE);
}

function generateRow (startingWidth, height) {
	for (var width = startingWidth; width <= windowWidth; width += 25){
		push();
		translate(width, height);
		rotate(11); // each hexagon is rotated 11 degress
		makeHexagon();
		pop();
	}
}

function generateBoard () {
	for (var height = 15; height <= windowHeight; height += 44) {
		generateRow(12, height);
		generateRow(25, height + 22);
	}
}

// MAKE P5.JS CANVAS

function setup () {
	createCanvas(windowWidth, windowHeight);
}

function draw () {
	background(30);
	generateBoard();
}
