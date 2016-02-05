'use strict';

(function() {
	var exitButton = null,
		gameButton = null,
		menuButton = null,
		currentScreen = null,
		controlBox = null;


	window.onload = function() {
		setMenuScreen();
	}

	function setMenuScreen() {
		clearGameMemory();
		clearHTML();

		currentScreen = document.createElement('div');
		currentScreen.className = 'menu-screen';

		controlBox = document.createElement('div');
		controlBox.className = 'control-box';

		exitButton = document.createElement('button');
		exitButton.textContent = 'Exit';
		exitButton.addEventListener('click', onExitButtonClick, false);

		gameButton = document.createElement('button');
		gameButton.textContent = 'Let\'s play!';
		gameButton.addEventListener('click', onGameButtonClick, false);

		controlBox.appendChild(gameButton);
		controlBox.appendChild(exitButton);
		currentScreen.appendChild(controlBox);
		appendScreen(currentScreen);
	}

	function onGameButtonClick(evt) {
		setGameScreen();
	}

	function onMenuButtonClick(evt) {
		setMenuScreen();
	}

	function onExitButtonClick(evt) {
		alert('Bye-bye!');
		clearMemory();
	}

	function setGameScreen() {
		clearMenuMemory();
		clearHTML();

		currentScreen = document.createElement('div');
		currentScreen.className = 'game-screen';

		menuButton = document.createElement('button');
		menuButton.className = 'home-btn';
		menuButton.textContent = 'Menu';
		menuButton.addEventListener('click', onMenuButtonClick, false);

		controlBox = document.createElement('div');
		controlBox.className = 'control-box';

		controlBox.appendChild(menuButton);
		currentScreen.appendChild(controlBox);

		appendScreen(currentScreen);
	}

	function append(child, parent) {
		parent.appendChild(child);
	}

	function appendScreen(scrn) {
		document.body.appendChild(scrn);
	}

	function clearFullMemory() {
		currentScreen = null;
		clearMenuMemory();
		clearGameMemory()
		clearHTML();
	}

	function clearMenuMemory() {
		exitButton = null;
		gameButton = null;
	}

	function clearGameMemory() {
		menuButton = null;
	}

	function clearHTML() {
		document.body.innerHTML = '';
	}
})();