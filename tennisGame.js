var canvas = document.getElementById("gameCanvas");
var canvasContext;
var ballX = 50;
var ballY = 300;
var ballSpeedX = 10;
var ballSpeedY = 6;

var player1Score = 0;
var player2Score = 0;

var showingWinScore = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;
const WINNING_SCORE = 3;

function calculateMousePos(event) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = event.clientX - rect.left - root.scrollLeft;
	var mouseY = event.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(event) {
	if (showingWinScore) {
		player1Score = 0;
		player2Score = 0;
		showingWinScore = false;
	}
}

window.onload = function() {
	console.log("Connected!");
	//var canvas = document.getElementById("gameCanvas");
	canvasContext = canvas.getContext("2d");
	
	var framesPerSecond = 30;
	setInterval(function() {
		drawEverything();
		moveEverything();
		bounce();		
	}, 1000/framesPerSecond);

	canvas.addEventListener("mousedown", handleMouseClick);

	canvas.addEventListener("mousemove", function(event) {
		var mousePos = calculateMousePos(event);
		//LEFT PADDLE CONTROL
		paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);

		//RIGHT PADDLE CONTROL
		//paddle2Y = mousePos.y - (PADDLE_HEIGHT/2);
	});
}

function ballReset() {
	if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
		showingWinScore = true;
	}

	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function drawNet() {
	for (var i = 0; i < canvas.height; i+=40) {
		colorRect((canvas.width/2)-1, i, 2, 20, 'white');	
	}
}

function drawEverything() {
	//draws the black canvas
	colorRect(0, 0, canvas.width, canvas.height, 'black');	
	if (showingWinScore) {
		canvasContext.fillStyle = 'white';
		if(player1Score >= WINNING_SCORE) {
			canvasContext.fillText("Player 1 WON", 350, 100);
		} else if(player2Score >= WINNING_SCORE) {
			canvasContext.fillText("Player 2 WON", 350, 100);
		}
		canvasContext.fillText("Click to Continue", 350, 500);
		return;
	}
	
	drawNet();

	//left player paddle
	colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
	
	//right computer paddle
	colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
	
	//draws the ball
	circleColor(ballX, ballY, 10, 'white');

	//Score 
	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function circleColor(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

function colorRect(leftx, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftx, topY, width, height);
}

function computerMovement() {
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	if (paddle2YCenter < (ballY - 35)) {
		paddle2Y += 12;
	} else if (paddle2YCenter > (ballY + 35)) {
		paddle2Y -= 12;
	}
}

function moveEverything() {
	if (showingWinScore) {
		return;
	}

	computerMovement();

	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;
}

function bounce() {
	bounceVertical();
	bounceHorizontal();
}

function bounceVertical() {
	if (ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	} else if (ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
}

function bounceHorizontal() {
	if (ballX > canvas.width) {
		if(ballY < (paddle2Y + PADDLE_HEIGHT) && ballY > paddle2Y) {
			ballSpeedX = -ballSpeedX;
			//ball control
			var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player1Score ++;//must be BEFORE ballReset()
			ballReset();
		}
	} else if (ballX < 0) {
		if(ballY < (paddle1Y + PADDLE_HEIGHT) && ballY > paddle1Y) {
			ballSpeedX = -ballSpeedX;
			//ball control
			var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player2Score ++;
			ballReset();
		}
	}
}