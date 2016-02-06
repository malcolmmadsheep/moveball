'use strict';

(function() {
	var menu = null,
		game = null,
		body = null,
		playerHeight = 100,
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
			height: 500,
			width: 1000,
			className: 'game-field',
			style: {
				backgroundColor: '#323232',
				margin: '10px auto',
				width: fieldW + 'px',
				height: fieldH + 'px'
			},
			onmousemove: movePlayers,
			onclick: addBall,
			appendTo: game.screen
		});

		game.field.rightPlayer = createElement({
			element: 'div',
			className: 'player right-player',
			appendTo: game.field,
			height: playerHeight,
			direction: 'down',
			style: {
				height: playerHeight + 'px'
			}
		});

		game.field.leftPlayer = createElement({
			element: 'div',
			className: 'player left-player',
			appendTo: game.field,
			height: playerHeight,
			direction: 'down',
			style: {
				height: playerHeight + 'px'
			}
		});

		game.field.balls = [];
	}

	function movePlayers(evt) {
		var game = this,
			y = evt.clientY - evt.target.offsetTop,
			players = document.getElementsByClassName('player'),
			offset = y - (playerHeight / 2),
			playerOffset = players[0].offsetTop,
			direction = undefined;

		if (offset < 0) {
			offset = 0;
		} else if (((offset + playerHeight) > this.height)) {
			offset = this.height - playerHeight;
		}

		if (y > (playerOffset + playerHeight / 2)) {
			direction = 'down';
		} else {
			direction = 'up';
		}

		for (var i = 0; i < players.length; i++) {
			var player = players[i];

			player.style.top = offset + 'px';
			player.direction = direction;
		}

		console.dir(evt);
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
			ballCenterX = (x - circleW / 2),
			ballCenterY = (y - circleH / 2);


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

		if (ballCenterX < 0) {
			ballCenterX = 0;
		} else if ((ballCenterX + radius) > game.field.width) {
			ballCenterX = game.field.width - radius;
		}

		newBall.style.left = ballCenterX + 'px';
		newBall.style.top = ballCenterY + 'px';

		// console.log(x, y);
		
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