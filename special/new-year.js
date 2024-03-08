const EXPLOSION_TIME = 100;
const EXPLOSION_SIZE = 100;
const NUM_PARTICLES = 12;
const SPEED = 2;
let OVERRIDE_ROCKETS = false;

function HSVtoRGB(h, s, v) {
	var r, g, b, i, f, p, q, t;
	if (arguments.length === 1) {
		s = h.s, v = h.v, h = h.h;
	}
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}

	return "rgb(" + (r * 255) + "," + (g * 255) + "," + (b * 255) + ")";
}

const canvas = document.getElementById("fireworks-canvas");
const updateSize = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

let rockets = [];
let rocketsAreFiring = false;

updateSize();
window.onresize = updateSize;

const ctx = canvas.getContext("2d");

window.addEventListener("keyup", e => {
	if (e.key == 'h') {
		canvas.style.display = canvas.style.display == 'none' ? null : 'none';
	}
});

setInterval(() => {
	const theTime = new Date();
	if (!OVERRIDE_ROCKETS && (theTime.getDate() != 1 || theTime.getMonth() != 0 || theTime.getHours() != 0)) {
		rockets = [];
		rocketsAreFiring = false;
		return;
	}

	rocketsAreFiring = true;
	rockets.push({ x: Math.random() * canvas.width, y: canvas.height, life: (Math.random() * 0.75 + 0.25) * canvas.height, color: HSVtoRGB(Math.random(), 1, 1) });
}, 300);

setInterval(() => {
	if (!rocketsAreFiring) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		return;
	}

	ctx.fillStyle = "#000044ff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	rockets.forEach(rocket => {
		rocket.life -= SPEED;

		if (rocket.life <= EXPLOSION_TIME) {
			if (rocket.life <= 0) {
				rockets.splice(rockets.indexOf(rocket), 1);
				return;
			}

			const explosionTime = 1 - (rocket.life / EXPLOSION_TIME);
			const size = explosionTime * EXPLOSION_SIZE;

			for (let i = 0; i < NUM_PARTICLES; i++) {
				const angle = i / NUM_PARTICLES * Math.PI * 2;
				const px = Math.cos(angle) * size;
				const py = Math.sin(angle) * size;

				ctx.fillStyle = rocket.color;
				ctx.beginPath();
				ctx.arc(rocket.x + px, rocket.y + py, 5, 0, Math.PI * 2, true);
				ctx.fill();
			}
		} else {
			rocket.y -= SPEED;
			ctx.fillStyle = "black";
			ctx.fillRect(rocket.x - 5, rocket.y - 5, 10, 10);
		}

	});

	const theTime = new Date();
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.font = "bold 50px Comic Mono";
	ctx.fillText("Happy new year! 🥳", canvas.width / 2, canvas.height / 2);
	ctx.font = "bold 100px Comic Mono";
	ctx.fillText(theTime.getHours().toString().padStart(2, '0') + ":" + theTime.getMinutes().toString().padStart(2, '0') + ":" + theTime.getSeconds().toString().padStart(2, '0'), canvas.width / 2, canvas.height / 2 - 150);

	ctx.font = "bold 10px Comic Mono";
	ctx.fillStyle = "#0000ff";
	ctx.textAlign = "left";
	ctx.fillText("Press 'h' to hide", 10, canvas.height - 10);
}, 10);
