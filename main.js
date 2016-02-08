'use strict';

(function() {
	var menu = null,
		game = null,
		body = null,
		PLAYER_HEIGHT = 100,
		PLAYER_WIDTH = 10,
		FIELD_WIDTH = 1000,
		FIELD_HEIGHT = 500,
		FIELD_BORDER_WIDTH = 5,
		BALL_SPEED = 5,
		BALL_DIAMETER = 50,
		BUTTON_STYLE = {
			'width': '150px',
			'height': '50px'
		},
		BODY_STYLE = {
			'width': '100%',
			'height': '100%',
			'backgroundColor': '#e7e7e7',
			'fontFamily': 'Arial'
		},
		svgNS = 'http://www.w3.org/2000/svg';

	window.onload = function() {
		body = document.body;
		setStyle(body, BODY_STYLE);
		setMenuScreen();
	}

	function setMenuScreen() {
		menu = {};

		menu.screen = createElement({
			element: 'div',
			className: 'menu-screen',
			style: {
				'width': '100%'
			},
			appendTo: body
		});

		menu.controlBox = createElement({
			element: 'div',
			className: 'control-box',
			style: {
				textAlign: 'center'
			},
			appendTo: menu.screen
		});

		menu.title = createElement({
			element: 'h1',
			textContent: 'Moveball',
			style: {
				textTransform: 'uppercase'
			},
			appendTo: menu.controlBox
		});

		menu.gameButton = createElement({
			element: 'button',
			textContent: 'Let\'s play!',
			onclick: onGameButtonClick,
			appendTo: menu.controlBox
		});

		menu.exitButton = createElement({
			element: 'button',
			textContent: 'Exit',
			onclick: onExitButtonClick,
			appendTo: menu.controlBox
		});
	}

	function setGameScreen() {
		game = {};

		game.screen = createElement({
			element: 'div',
			className: 'game-screen',
			style: {
				'width': '100%'
			},
			appendTo: body
		});

		game.controlBox = createElement({
			element: 'div',
			className: 'control-box',
			style: {
				textAlign: 'center'
			},
			appendTo: game.screen
		});

		game.title = createElement({
			element: 'h1',
			textContent: 'Moveball',
			style: {
				textTransform: 'uppercase'
			},
			appendTo: game.controlBox
		});

		game.menuButton = createElement({
			element: 'button',
			className: 'home-btn',
			textContent: 'Menu',
			onclick: onMenuButtonClick,
			appendTo: game.controlBox
		});

		game.menuButton.style.marginTop = '10px';

		initGame();
	}

	function onGameButtonClick(evt) {
		clearMenuMemory();
		setGameScreen();
	}

	function onMenuButtonClick(evt) {
		clearGameMemory();
		setMenuScreen();
	}

	function onExitButtonClick(evt) {
		alert('Bye-bye!');
		clearAllMemory();
	}

	function createElement(obj) {
		var tag = obj.element,
			element = document.createElement(obj.element);

		if (tag == 'button') {
			obj.style = BUTTON_STYLE;
		}

		for (var p in obj) {
			if (p == 'element') {
				continue;
			} else if (p == 'appendTo') {
				append(element, obj[p]);
				continue;
			} else if (p == 'style') {
				setStyle(element, obj[p]);

				continue;
			}
			element[p] = obj[p];
		}

		return element;
	}

	function clearMenuMemory() {
		menu = null;
		clearHTML();
	}

	function clearGameMemory() {
		if (game) {
			for (var i = 0; i < game.field.balls.length; i++) {
				clearInterval(game.field.balls[i].move);
			}
		}
		game = null;
		clearHTML();
	}

	function clearHTML() {
		document.body.innerHTML = '';
	}

	function clearAllMemory() {
		game = menu = null;
		BUTTON_STYLE = BODY_STYLE = null;
		clearHTML();
		body.style = '';
	}

	function initGame() {
		game.field = {};

		game.field = createElement({
			element: 'div',
			height: FIELD_HEIGHT,
			width: FIELD_WIDTH,
			className: 'game-field',
			style: {
				backgroundColor: '#323232',
				margin: '10px auto',
				width: FIELD_WIDTH + 'px',
				height: FIELD_HEIGHT + 'px',
				position: 'relative',
				border: FIELD_BORDER_WIDTH + 'px solid #a7a7a7'
			},
			onmousemove: movePlayers.bind(game),
			onclick: addBall,
			appendTo: game.screen
		});

		game.rightPlayer = createPlayer('right');
		game.rightPlayer.score = createElement({
			element: 'h1',
			className: 'score-left',
			textContent: '0',
			style: {
				position: 'absolute',
				left: '30px',
				top: '45%',
				fontSize: '6em'
			},
			appendTo: body,
			value: 0
		});

		game.leftPlayer = createPlayer('left');
		game.leftPlayer.score = createElement({
			element: 'h1',
			textContent: '0',
			className: 'score-right',
			style: {
				position: 'absolute',
				right: '30px',
				top: '45%',
				fontSize: '6em'
			},
			appendTo: body,
			value: 0
		});

		game.field.balls = [];
	}

	function createPlayer(side) {
		var player = createElement({
			element: 'div',
			className: 'player',
			appendTo: game.field,
			height: PLAYER_HEIGHT,
			width: PLAYER_WIDTH,
			direction: 'down',
			style: {
				height: PLAYER_HEIGHT + 'px',
				width: PLAYER_WIDTH + 'px',
				position: 'absolute',
				backgroundColor: '#fff'
			}
		});

		if (side == 'left') {
			player.style.left = '10px';
		} else if (side == 'right') {
			player.style.right = '10px'
		}

		return player;
	}

	function movePlayers(evt) {
		var game = this,
			y = evt.clientY - evt.target.offsetTop,
			players = document.getElementsByClassName('player'),
			offset = y - (PLAYER_HEIGHT / 2),
			playerOffset = players[0].offsetTop,
			direction = undefined;

		for (var i = 0; i < game.field.balls.length; i++) {
			var ball = game.field.balls[i];
			if (ball === evt.target) {
				ball = null;
				return;
			}
		}

		if (evt.target == game.leftPlayer || evt.target == game.rightPlayer) {
			return false;
		}

		if (offset < 0) {
			offset = 0;
		} else if (((offset + PLAYER_HEIGHT) > game.field.height)) {
			offset = game.field.height - PLAYER_HEIGHT;
		}

		if (y > (playerOffset + PLAYER_HEIGHT / 2)) {
			direction = 'down';
		} else {
			direction = 'up';
		}

		for (i = 0; i < players.length; i++) {
			var player = players[i];
			player.style.top = offset + 'px';
			player.direction = direction;
		}
	}

	function createBall(x, y) {
		var newBall = document.createElementNS(svgNS, 'svg'),
			circle = document.createElementNS(svgNS, 'circle'),
			circleW = BALL_DIAMETER,
			circleH = circleW,
			radius = parseInt(circleW / 2),
			strokeW = 2,
			ballColor = '#f00',
			leftBound = game.leftPlayer.offsetLeft + game.leftPlayer.width,
			rightBound = game.rightPlayer.offsetLeft + game.rightPlayer.width / 2;

		newBall.centerX = x;
		newBall.centerY = y;
		newBall.radius = radius;
		newBall.totalRadius = radius + strokeW;

		setAttributes(newBall, {
			width: circleW,
			height: circleH
		});

		setAttributes(circle, {
			cx: (circleW / 2),
			cy: (circleH / 2),
			r: radius - strokeW,
			stroke: '#191919',
			'stroke-width': strokeW,
			fill: ballColor
		});

		if (newBall.centerY - newBall.totalRadius < 0) {
			newBall.centerY = newBall.totalRadius;
		} else if ((newBall.centerY + newBall.totalRadius) > game.field.height) {
			newBall.centerY = game.field.height - newBall.totalRadius + FIELD_BORDER_WIDTH;
		}

		if (newBall.centerX - radius < leftBound) {
			newBall.centerX = leftBound + newBall.totalRadius;
		} else if ((newBall.centerX + newBall.totalRadius) > rightBound) {
			newBall.centerX = rightBound - newBall.totalRadius;
		}

		newBall.style.position = 'absolute';
		newBall.style.left = (newBall.centerX - newBall.totalRadius) + 'px';
		newBall.style.top = (newBall.centerY - newBall.totalRadius) + 'px';

		newBall.originalX = newBall.centerX;
		newBall.originalY = newBall.centerY;

		var rA = Math.round(Math.random() * 360);
		if ((rA >= 80 && rA <= 105) || (rA >= 260 && rA <= 285)) {
			rA += 30;
		}

		newBall.angle = rA;

		newBall.move = setInterval(ballMoving.bind(newBall), 25);

		append(circle, newBall);
		append(newBall, game.field);

		return newBall;
	}

	function ballMoving() {
		var ball = this,
			nbcX = ball.centerX,
			dX = 0,
			dY = 0,
			nbcY = ball.centerY,
			speed = BALL_SPEED;

		dX = parseInt(Math.cos(toRadian(ball.angle)) * speed);
		dY = parseInt(Math.sin(toRadian(ball.angle)) * speed);

		ball.centerX += dX;
		ball.centerY += dY;
		ball.style.left = (ball.centerX - ball.totalRadius) + 'px';
		ball.style.top = (ball.centerY - ball.totalRadius) + 'px';

		if (game) {
			var ballTop = ball.centerY - ball.radius,
				ballBottom = ball.centerY + ball.totalRadius,
				ballLeft = ball.centerX - ball.totalRadius,
				ballRight = ball.centerX + ball.totalRadius,
				topBound = (ballTop <= 0),
				bottomBound = (ballBottom >= game.field.height + FIELD_BORDER_WIDTH),
				leftBound = (ballLeft <= 0),
				rightBound = (ballRight >= game.field.width + FIELD_BORDER_WIDTH),
				offsetLeft = game.leftPlayer.offsetLeft,
				offsetRight = game.rightPlayer.offsetLeft,
				offsetTop = game.leftPlayer.offsetTop,
				playerLeftX = (ballLeft <= offsetLeft + PLAYER_WIDTH),
				playerRightX = (ballRight >= offsetRight),
				playersBottom = (ballBottom <= offsetTop + PLAYER_HEIGHT && ballBottom >= offsetTop),
				playersTop = (ballTop <= offsetTop + PLAYER_HEIGHT && ballTop >= offsetTop);

			if (topBound || bottomBound || leftBound || rightBound || playerLeftX || playerRightX) {
				clearInterval(ball.move);

				if (topBound || bottomBound) {
					ball.angle = (360 - ball.angle);
				} else if (playersBottom || playersTop) {
					ball.angle = (180 - ball.angle);
					if (playerLeftX) {
						ball.centerX = offsetLeft + PLAYER_WIDTH + ball.totalRadius;
					} else if (playerRightX) {
						ball.centerX = offsetRight - ball.totalRadius;
					}
				}

				if (topBound) {
					ball.centerY = ball.totalRadius;
				} else if (bottomBound) {
					ball.centerY = game.field.height + FIELD_BORDER_WIDTH - ball.totalRadius;
				} else if (leftBound || rightBound) {
					removeBall(ball);
					ball = null;
					var player = 'leftPlayer';
					if (rightBound) {
						player = 'rightPlayer';
					}

					updateScore(player);

					return;
				}

				ball.move = setInterval(ballMoving.bind(ball), 25);
			}
		}
	}

	function removeBall(ball) {
		var index = -1;
		for (var i = 0; i < game.field.balls.length; i++) {
			if (ball === game.field.balls[i]) {
				index = i;
				break;
			}
		}

		game.field.removeChild(ball);
		game.field.balls.splice(index, 1);
	}

	function addBall(evt) {
		var X = evt.layerX,
			Y = evt.layerY;

		game.field.balls.push(createBall(X, Y));
	}

	function updateScore(player) {
		game[player].score.value++;
		game[player].score.textContent = game[player].score.value;
	}

	function setAttributes(to, attributes) {
		for (var p in attributes) {
			to.setAttribute(p, attributes[p]);
		}
	}

	function toRadian(deg) {
		return (deg * Math.PI) / 180;
	}

	function append(child, parent) {
		parent.appendChild(child);
	}

	function setStyle(to, style) {
		for (var s in style) {
			to.style[s] = style[s];
		}
	}
})();