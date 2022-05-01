// ==UserScript==
// @name         Moodle Questions Logger
// @namespace    http://cringe-studios.com/
// @version      1.0
// @description  Advanced cheat tools
// @author       MrLetsplay, JDobeshow
// @match        https://*/mod/quiz/attempt.php*
// @icon         https://nsfw.cringe-studios.com/sus.png
// @grant        none
// ==/UserScript==

function saveQuestion() {
	let form = document.getElementById("responseform");
	let qText = form.getElementsByClassName("qtext")[0];
	if(qText.getElementsByTagName("select").length > 0) {
		// Fixes bug in Chrome
		let clone = form.cloneNode(true);
		let selects;
		while((selects = clone.getElementsByClassName("qtext")[0].getElementsByTagName("select")).length > 0) {
			let span = document.createElement("span");
			span.innerText = "___";
			selects[0].parentElement.replaceChild(span, selects[0]);
		}
		qText = clone.getElementsByClassName("qtext")[0];
		console.log(qText);
	}

	let question = qText.innerText;
	let answers = [];
	let type = "unknown";

	for(let select of form.getElementsByClassName("qtext")[0].getElementsByTagName("select")) {
		type = "Lückentext";
		let a = [];
		for(let op of select.children) {
			a.push(op.innerText);
		}
		answers.push(a);
	}

	let answersEl = form.getElementsByClassName("answer")[0];
	if(answersEl) {
		if(answersEl.tagName == "TABLE") {
			answers = {};
			type = "Zuordnung";
			for(let tr of answersEl.getElementsByTagName("tr")) {
				let tx = tr.children[0].getElementsByTagName("p")[0].innerText;
				let s = tr.children[1].getElementsByTagName("select")[0];
				let ops = [];
				for(let j = 0; j < s.options.length; j++) {
					ops.push(s.options[j].innerText);
				}
				answers[tx] = ops;
			}
		}else {
			let isMultiple = false;
			for(let a of answersEl.children) {
				let input = a.getElementsByTagName("input")[0];
				if(input.type == "hidden") input = a.getElementsByTagName("input")[1];
				if(input.type == "checkbox") isMultiple = true;

				let aEl = a.getElementsByTagName("p")[0];
				if(!aEl) aEl = a.getElementsByTagName("label")[0];
				if(!aEl) aEl = a.getElementsByClassName("answernumber")[0].nextElementSibling;
				answers.push(aEl.innerText);
			}
			type = isMultiple ? "Multiple choice (mehrfach)" : "Multiple choice (einzeln)";
		}
	}

	let xhr = new XMLHttpRequest();

	xhr.open("POST", "https://cringe-studios.com/lzk/add-question.php");
	xhr.setRequestHeader("Content-Type", "application/json");

	let obj = {
		question: question,
		answers: answers,
		type: type
	}

	console.log(obj);
	xhr.send(JSON.stringify(obj));
}

(function() {
	'use strict';

	saveQuestion();
})();