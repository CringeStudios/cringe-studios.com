let websiteScale = 1;
let OVERRIDE_APRIL_FOOLS = false;

setInterval(() => {
	const theTime = new Date();
	if (!OVERRIDE_APRIL_FOOLS && (theTime.getDate() != 1 || theTime.getMonth() != 3)) {
		document.body.style.transition = "unset";
		document.body.style.transform = "unset";
		return;
	}

	document.body.style.transition = "all linear 0.1s";
	document.body.style.transform = "scale(" + websiteScale + ")";
	websiteScale *= 0.95;
}, 100);

let oldMouseX, oldMouseY;
let oldMouseTime;

document.addEventListener("mousemove", (ev) => {
	let time = new Date().getTime();

	if(oldMouseX !== undefined || oldMouseY !== undefined) {
		let dist = Math.sqrt(Math.pow(oldMouseX - ev.x, 2) + Math.pow(oldMouseY - ev.y, 2));
		let velocity = dist / (time - oldMouseTime);
		websiteScale = Math.min(1, websiteScale * 1 + velocity/750);
	}

	oldMouseX = ev.x;
	oldMouseY = ev.y;
	oldMouseTime = time;
})
