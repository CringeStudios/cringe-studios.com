// ==UserScript==
// @name         Moodle Cheats
// @namespace    http://cringe-studios.com/
// @version      1.0
// @description  Advanced cheat tools
// @author       MrLetsplay, JDobeshow
// @match        https://*/mod/quiz/attempt.php*
// @icon         https://nsfw.cringe-studios.com/grimacing.png
// @grant        none
// ==/UserScript==

var questionAnswers = null;

function normalize(text) {
	return text.replaceAll(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function msg(text) {
	let form = document.getElementById("responseform");
	let sad = document.getElementById("cheat-msg");
	if(!sad){
		sad = document.createElement("span");
		sad.id = "cheat-msg";
		sad.innerText = text;
		sad.style.color = "gray";
		let q = form.getElementsByClassName("qtext")[0];
		q.parentElement.insertBefore(sad, q);
	}else {
		sad.innerText = text;
	}
}

function insertAnswers() {
	console.log("Solve");
	let form = document.getElementById("responseform");
	let qText = form.getElementsByClassName("qtext")[0];
	if(qText.getElementsByTagName("select").length > 0) {
		// Fixes bug in Chrome
		let clone = form.cloneNode(true);
		let selects;
		while((selects = clone.getElementsByClassName("qtext")[0].getElementsByTagName("select")).length > 0) {
			selects[0].remove();
		}
		qText = clone.getElementsByClassName("qtext")[0];
	}
	let question = normalize(qText.innerText);
	let answer = questionAnswers[question];
	if(answer == null) {
		console.log("No answer for question:", question);
		msg("No answer found");
		return;
	}

	console.log("answer", answer);

	let answers = form.getElementsByClassName("answer")[0];
	if(answers != null && answers.tagName == "TABLE") { // Zuordnung
		for(let tr of answers.getElementsByTagName("tr")) {
			let ans = answer[normalize(tr.children[0].getElementsByTagName("p")[0].innerText)];
			let s = tr.children[1].getElementsByTagName("select")[0];
			for(let j = 0; j < s.options.length; j++) {
				if(normalize(s.options[j].innerText) == ans) {
					s.selectedIndex = j;
					break;
				}
			}
		}
		return;
	}

	let textAreas = form.getElementsByTagName("textarea");
	if(textAreas.length > 0) { // qtype_pmatch, essay
		let ta = textAreas[0];
		ta.value = answer;
		return;
	}

	let selects = form.getElementsByTagName("select");
	if(selects.length > 0) { // Question with placeholders
		for(let i = 0; i < selects.length; i++) {
			let ans = answer[i];
			let s = selects[i];
			for(let j = 0; j < s.options.length; j++) {
				if(normalize(s.options[j].innerText) == ans) {
					s.selectedIndex = j;
					break;
				}
			}
		}
		return;
	}

	let inputs = answers.getElementsByTagName("input");
	if(inputs.length > 0 && inputs[0].type == "text") { // Single line text
		let i = inputs[0];
		i.value = answer;
		return;
	}

	for(let a of answers.children) { // Multiple choice
		let aEl = a.getElementsByTagName("p")[0];
		if(!aEl) aEl = a.getElementsByTagName("label")[0];
		if(!aEl) aEl = a.getElementsByClassName("answernumber")[0].nextElementSibling;
		let aText = normalize(aEl.innerText);
		let input = a.getElementsByTagName("input")[0];
		if(input.type == "hidden") input = a.getElementsByTagName("input")[1];
		input.checked = answer.includes(aText);
	}
}

function loadQuestions() {
	let xhr = new XMLHttpRequest();

	xhr.open("GET", "https://cringe-studios.com/lzk/test-questions.json");
	xhr.send();

	xhr.onload = () => {
		questionAnswers = JSON.parse(xhr.responseText);
		let newQAs = {};
		for(let q in questionAnswers) {
			let ans = questionAnswers[q];
			if(typeof ans == "string") {
				newQAs[normalize(q)] = ans;
			}else {
				let newAs = Array.isArray(ans) ? [] : {};
				for(let k in ans) {
					newAs[normalize(k)] = normalize(ans[k]);
				}
				newQAs[normalize(q)] = newAs;
			}
		}
		questionAnswers = newQAs;
		console.log(questionAnswers);
	}
}

(function() {
	'use strict';

	loadQuestions();

	document.addEventListener("keydown", event => {
		if(event.key == "A") {
			if(questionAnswers == null) {
				msg("Not ready yet");
				return;
			}

			insertAnswers();
		}
	});
})();
