'use strict';

(function() {
	var menu = null,
		game = null,
		body = null,
		playerH = 100,
		playerW = 10,
		fieldW = 1000,
		fieldH = 500,
		fieldBorder = 5,
		svgNS = 'http://www.w3.org/2000/svg';

	window.onload = function() {
		body = document.body;

		setMenuScreen();
	}

	function onGameButtonClick(evt) {
		setGameScreen();
	}

	function onMenuButtonClick(evt) {
		setMenuScreen();
	}

	function onExitButtonClick(evt) {
		alert('Bye-bye!');
		clearAllMemory();
	}

	function setMenuScreen() {
		clearGameMemory();
		clearHTML();

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
		clearMenuMemory();
		clearHTML();

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
		game = null;
	}

	function clearHTML() {
		document.body.innerHTML = '';
	}

	function initGame() {
		game.field = {};

		game.field = createElement({
			element: 'div',
			height: fieldH,
			width: fieldW,
			className: 'game-field',
			style: {
				backgroundColor: '#323232',
				margin: '10px auto',
				width: fieldW + 'px',
				height: fieldH + 'px',
				position: 'relative'
			},
			onmousemove: movePlayers.bind(game),
			onclick: addBall,
			appendTo: game.screen
		});

		game.rightPlayer = createPlayer('right-player');

		game.leftPlayer = createPlayer('left-player');
		
		game.field.balls = [];
	}

	function createPlayer(position) {
		var player = createElement({
			element: 'div',
			className: 'player',
			appendTo: game.field,
			height: playerH,
			width: playerW,
			direction: 'down',
			style: {
				height: playerH + 'px',
				width: playerW + 'px'
			}
		});

		player.classList.add(position);

		return player;
	}

	function movePlayers(evt) {
		var game = this,
			y = evt.clientY - evt.target.offsetTop,
			players = document.getElementsByClassName('player'),
			offset = y - (playerH / 2),
			playerOffset = players[0].offsetTop,
			direction = undefined;

		for (var i = 0; i < game.field.balls.length; i++) {
			var ball = game.field.balls[i];
			if (ball == evt.target) {

				return false;
			}
		}

		if (evt.target == game.leftPlayer || evt.target == game.rightPlayer) {
			// console.dir(evt);
			return false;
		}

		if (offset < 0) {
			offset = 0;
		} else if (((offset + playerH) > game.field.height)) {
			offset = game.field.height - playerH;
		}

		if (y > (playerOffset + playerH / 2)) {
			direction = 'down';
		} else {
			direction = 'up';
		}

		for (var i = 0; i < players.length; i++) {
			var player = players[i];

			player.style.top = offset + 'px';
			player.direction = direction;
		}

		// console.dir(evt);
	}

	function addBall(evt) {
		var X = evt.layerX,
			Y = evt.layerY;

		game.field.balls.push(createBall(X, Y));
	}

	function createBall(x, y) {
		var newBall = document.createElementNS(svgNS, 'svg'),
			circle = document.createElementNS(svgNS, 'circle'),
			circleW = 50,
			circleH = 50,
			radius = 25,
			strokeW = 3,
			ballColor = '#f00',
			ballCenterX = (x - radius),
			ballCenterY = (y - radius),
			leftBound = game.leftPlayer.offsetLeft + game.leftPlayer.width,
			rightBound = game.rightPlayer.offsetLeft; 

		console.log(ballCenterX, ballCenterY);


		setAttributes(newBall, { width: circleW, height: circleH});

		setAttributes(circle, {
			cx: (circleW / 2),
			cy: (circleH / 2),
			r: radius - strokeW,
			stroke: '#191919',
			'stroke-width': strokeW,
			fill: ballColor
		});

		newBall.style.position = 'absolute';

		if (ballCenterY < 0) {
			ballCenterY = 0;
		} else if ((ballCenterY + radius) > game.field.height) {
			ballCenterY = game.field.height - radius
		}

		if (ballCenterX - radius < leftBound) {
			ballCenterX = leftBound;
		} else if ((ballCenterX + radius * 2) > rightBound) {
			ballCenterX = rightBound - circleW;
		}

		console.log(ballCenterX + radius, rightBound);

		newBall.style.left = ballCenterX + 'px';
		newBall.style.top = ballCenterY + 'px';

		newBall.appendChild(circle);
		game.field.appendChild(newBall);

		return newBall;
	}

	function setAttributes(to, attributes) {
		for (var p in attributes) {
			to.setAttribute(p, attributes[p]);
		}
	}
})();