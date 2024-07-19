class Flex {

	started;
	flex;
	ball;
	startButton;
	ballPosX;
	ballPosY;

	init() {
		this.flex = document.getElementById("mrFlex");

		this.ball = document.createElement("div");
		this.ball.className = "mrFlexBall";
		this.flex.appendChild(this.ball);

		this.startButton = document.createElement("button");
		this.startButton.innerText = "Play";
		this.startButton.className = "mrFlexButton";
		this.flex.appendChild(this.startButton);

		this.startButton.onclick = () => this.start();

		console.log("Initialized");
	}

	start() {
		if(this.started) return;
		this.started = true;

		console.log(this);
		this.startButton.style.position = "fixed";
		this.startButton.style.bottom = "0px";
		this.startButton.style.width = "500px";

		this.ball.style.position = "fixed";

		let mouseX, mouseY;
		document.onmousemove = e => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		const BALL_SPEED = 5;
		let ballSpeedX = BALL_SPEED;
		let ballSpeedY = -BALL_SPEED;

		const BALL_SIZE = 50;

		let ballPosX = window.visualViewport.width / 2 - BALL_SIZE / 2;
		let ballPosY = window.visualViewport.height - BALL_SIZE - 100;

		let collidableElements = document.querySelectorAll("img");
		console.log(collidableElements);
		collidableElements.forEach(e => e.style.outline = "10px solid lime");

		setInterval(() => {
			this.startButton.style.left = (mouseX - this.startButton.clientWidth / 2) + "px";

			ballPosX += ballSpeedX;
			ballPosY += ballSpeedY;

			for(let el of collidableElements) {
				let pos = el.getBoundingClientRect();
				let x = pos.left;
				let y = pos.top;
				let w = pos.width;
				let h = pos.height;

				let xColl = ballPosX + BALL_SIZE > x && ballPosX < x + w;
				let yColl = ballPosY + BALL_SIZE > y && ballPosY < y + w;
				let prevXColl = (ballPosX - ballSpeedX) + BALL_SIZE > x && (ballPosX - ballSpeedX) < x + w;
				let prevYColl = (ballPosY - ballSpeedY) + BALL_SIZE > y && (ballPosY - ballSpeedY) < y + w;
				if(xColl && yColl) {
					let clone = document.createElement("img");
					clone.style.width = el.clientWidth + "px";
					clone.style.height = el.clientHeight + "px";
					//el.remove();
					clone.style.backgroundColor = "black";
					el.replaceWith(clone);
					if(prevYColl) ballSpeedX = -ballSpeedX;
					if(prevXColl) ballSpeedY = -ballSpeedY;
				}
			}

			let buttonPos = this.startButton.getBoundingClientRect();

			if(ballPosX <= 0 && ballSpeedX < 0) {
				ballSpeedX = -ballSpeedX;
			}

			if(ballPosY <= 0 && ballSpeedY < 0) {
				ballSpeedY = -ballSpeedY;
			}

			if(ballPosX + BALL_SIZE >= window.visualViewport.width && ballSpeedX > 0) {
				ballSpeedX = -ballSpeedX;
			}

			if(ballPosY + BALL_SIZE >= buttonPos.top && ballPosX + BALL_SIZE >= buttonPos.left && ballPosX <= buttonPos.left + buttonPos.width && ballSpeedY > 0) {

				ballSpeedY = -ballSpeedY;
			}

			if(ballPosY + BALL_SIZE >= window.visualViewport.height && ballSpeedY > 0) {
				//ballSpeedY = -ballSpeedY;
				window.location.reload();
			}

			this.ball.style.left = ballPosX + "px";
			this.ball.style.top = ballPosY + "px";
		}, 20);
	}

}

let mrFlex = new Flex();
mrFlex.init();
