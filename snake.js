CURRENTLENGTHSTART = 2;
CURRENTLOCATIONSTART = [0,8];
//0 for north, 1 for east, 2 for south and 3 for west
DIRECTIONSTART = 2;
TEMPDIRECTIONSTART = 2;
MOVEMENTSPEEDSTART = 1000;
CURRENTAPPLESTART = [0, 32];
$(document).ready(function(){	
	//allow calling .last();
	Array.prototype.last = function() { return this[this.length - 1]; };
	var canvas = document.getElementById("snakeGameCanvas");
	var context = canvas.getContext("2d");
	function drawRectangle(x,y,width,height,colour,linewidth="2") {
		context.beginPath();
		context.lineWidth = linewidth;
		context.fillStyle = colour;
		context.fillRect(x, y, width, height);
		context.stroke();
	}
	function endGameHandler() {
		document.getElementById('startmenu').style.display = "block";
		document.getElementById('snakeGameCanvas').style.display = "none";
		if (document.getElementById('highscoretext').innerHTML.split(" ").last() < currentlength) {
			document.getElementById('highscoretext').innerHTML = "Current high score: " + String(currentlength);
		}
	}
	function initBoard() {
		currentlength = CURRENTLENGTHSTART;
		currentlocation = CURRENTLOCATIONSTART.slice();
		//0 for north, 1 for east, 2 for south and 3 for west
		direction = DIRECTIONSTART;
		tempdirection = TEMPDIRECTIONSTART;
		movementspeed = MOVEMENTSPEEDSTART;
		currentapple = CURRENTAPPLESTART.slice();
		currentsnakeblocks = [];
		//clear the canvas just incase
		context.clearRect(0, 0, canvas.width, canvas.height);
		//initialise the snake by creating the full snake to start the game
		var i;
		nextcoords = currentlocation.slice();
		//for each block of the snake, create the block in the canvas and add it to the array of snakeblocks
		for (i = 0; i < currentlength; i++) {
			//draw the snake block on the canvas
			drawRectangle(nextcoords[0], nextcoords[1], 8, 8, "blue");
			//add the coordinates of the snake block to the end of list
			currentsnakeblocks.push([nextcoords[0],nextcoords[1]]);
			//work out what the coordinates of the next block to be drawn should be
			switch(direction) {
				case 0:
					nextcoords[1] += 8;
					break;
				case 1:
					nextcoords[0] += 8;
					break;
				case 2:
					nextcoords[1] -= 8;
					break;
				case 3:
					nextcoords[0] -= 8;
					break;
			}
		}
		//draw the apple on the canvas
		drawRectangle(currentapple[0], currentapple[1], 8, 8,"red");
	}
	window.onkeydown = function(event) {
		if(event.keyCode == '37' && direction != 3) {
			tempdirection = 1;
		}
		else if(event.keyCode == '38' && direction != 2) {
			tempdirection = 0;
		}
		else if(event.keyCode == '39' && direction != 1) {
			tempdirection = 3;
		}
		else if(event.keyCode == '40' && direction != 0) {
			tempdirection = 2;
		}
	}
	document.getElementById('startgamebutton').addEventListener('click', startGame);
	function startGame() {
		document.getElementById('startmenu').style.display = "none";
		document.getElementById('snakeGameCanvas').style.display = "block";
		initBoard();
		clock = window.setInterval(function(){
			//alter the currentlocation so that it is the coordinates of where the head of the snake should be on the next canvas draw.
			//tempdirection is used to stop the user being able to change the direction of the snake multiple times, possibly allowing a collision when the snake has not collided.
			direction = tempdirection;
			switch(direction) {
				case 0:
					currentlocation[1] -= 8;
					break;
				case 1:
					currentlocation[0] -= 8;
					break;
				case 2:
					currentlocation[1] += 8;
					break;
				case 3:
					currentlocation[0] += 8;
					break;
			}
			//log the current location
			console.log(currentlocation);
			//detect if the snake has reached an edge
			if (currentlocation[0] < 0 || currentlocation[0] > canvas.width || currentlocation[1] < 0 || currentlocation[1] > canvas.height) {
				//the snake has reached an edge, so stop the clock and end the game.
				console.log("collision with wall detected");
				//stop the clock
				clearInterval(clock);
				document.getElementById('startmenu').style.display = "block";
				document.getElementById('snakeGameCanvas').style.display = "none";
				if (document.getElementById('highscoretext').innerHTML.split(" ").last() < currentlength) {
					document.getElementById('highscoretext').innerHTML = "Current high score: " + String(currentlength);
				}
				return;
			}
			else {
				//the snake did not hit an edge
				//now check to see if the snake has hit itself
				var collided = false;
				for(i = 0; i < currentsnakeblocks.length; i++) {
					if(currentlocation[0] == currentsnakeblocks[i][0] && currentlocation[1] == currentsnakeblocks[i][1]) {
						//snake has collided with itself, so stop the clock and end the game.
						console.log("collision with snake detected");
						clearInterval(clock);
						document.getElementById('startmenu').style.display = "block";
						document.getElementById('snakeGameCanvas').style.display = "none";
						return;
					}
				}
				if (!collided) {
					//if the snake has not died, check for collison with an apple
					if(String(currentlocation) == String(currentapple)) {
						//snake has collided with an apple
						console.log("collision with apple detected");
						//remove the apple coordinates from the array
						currentapple = [];
						//add one to the length of the snake
						currentlength += 1;
						//clear the apple from the canvas
						context.clearRect(currentlocation[0], currentlocation[1], 8, 8);
						//draw the snake head over where the apple once was
						drawRectangle(currentlocation[0], currentlocation[1], 8, 8, "blue");
						//add the new block to the start of the list
						currentsnakeblocks.unshift([currentlocation[0],currentlocation[1]]);
						//generate a new location for the apple
						currentapple[0] = Math.floor(Math.floor(Math.random() * (canvas.width + 1)) / 8) * 8;
						currentapple[1] = Math.floor(Math.floor(Math.random() * (canvas.height + 1)) / 8) * 8;
						//draw the new apple
						drawRectangle(currentapple[0], currentapple[1], 8, 8, "red");
					}
					else {
						//no collisions detected, so just draw the snake head
						drawRectangle(currentlocation[0], currentlocation[1], 8, 8, "blue");
						//remove the oldest block from the end of the list
						removethisblock = currentsnakeblocks.pop();
						//remove this block from the canvas
						context.clearRect(removethisblock[0], removethisblock[1], 8, 8);
						//add the new block to the start of the list
						currentsnakeblocks.unshift([currentlocation[0],currentlocation[1]]);
					}
				}
			}
		}, movementspeed);
	}
});