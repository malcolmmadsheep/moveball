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
		svgNS = 'http://www.w3.org/2000/svg';

	window.onload = function() {
		body = document.body;
		setMenuScreen();
	}

	function onGameButtonClick(evt) {
		clearMenuMemory();
		clearHTML();
		setGameScreen();
	}

	function onMenuButtonClick(evt) {
		clearGameMemory();
		clearHTML();
		setMenuScreen();
	}

	function onExitButtonClick(evt) {
		alert('Bye-bye!');
		clearAllMemory();
	}

	function setMenuScreen() {
		menu = {};

		menu.screen = createElement({
			element: 'div',
			className: 'menu-screen',
			appendTo: body
		});

		menu.controlBox = createElement({
			element: 'div',
			className: 'control-box',
			appendTo: menu.screen
		});

		menu.title = createElement({
			element: 'h1',
			textContent: 'Moveball',
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
			appendTo: body
		});

		game.controlBox = createElement({
			element: 'div',
			className: 'control-box',
			appendTo: game.screen
		});

		game.title = createElement({
			element: 'h1',
			textContent: 'Moveball',
			appendTo: game.controlBox
		});

		game.menuButton = createElement({
			element: 'button',
			className: 'home-btn',
			textContent: 'Menu',
			onclick: onMenuButtonClick,
			appendTo: game.controlBox
		});

		initGame();
	}

	function createElement(obj) {
		var element = document.createElement(obj.element);
		for (var p in obj) {
			if (p == 'element') {
				continue;
			} else if (p == 'appendTo') {
				append(element, obj[p]);
				continue;
			} else if (p == 'style') {
				for (var s in obj[p]) {
					element.style[s] = obj[p][s];
				}

				continue;
			}
			element[p] = obj[p];
		}

		return element;
	}

	function append(child, parent) {
		parent.appendChild(child);
	}

	function clearAllMemory() {
		game = menu = null;
		clearHTML();
	}

	function clearMenuMemory() {
		menu = null;
	}

	function clearGameMemory() {
		if (game) {
			for (var i = 0; i < game.field.balls.length; i++) {
				clearInterval(game.field.balls[i].move);
			}
		}
		game = null;
	}

	function clearHTML() {
		document.body.innerHTML = '';
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
				position: 'relative'
			},
			onmousemove: movePlayers.bind(game),
			onclick: addBall,
			appendTo: game.screen
		});

		game.rightPlayer = createPlayer('right-player');
		game.rightPlayer.score = createElement({
			element: 'h1',
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

		game.leftPlayer = createPlayer('left-player');
		game.leftPlayer.score = createElement({
			element: 'h1',
			textContent: '0',
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

	function createPlayer(position) {
		var player = createElement({
			element: 'div',
			className: 'player',
			appendTo: game.field,
			height: PLAYER_HEIGHT,
			width: PLAYER_WIDTH,
			direction: 'down',
			style: {
				height: PLAYER_HEIGHT + 'px',
				width: PLAYER_WIDTH + 'px'
			}
		});

		player.classList.add(position);

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

	function addBall(evt) {
		var X = evt.layerX,
			Y = evt.layerY;

		game.field.balls.push(createBall(X, Y));
	}

	function createBall(x, y) {
		var newBall = document.createElementNS(svgNS, 'svg'),
			circle = document.createElementNS(svgNS, 'circle'),
			circleW = 30,
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

		newBall.style.position = 'absolute';


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
				} else if (playersBottom && playersTop) {
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
})();