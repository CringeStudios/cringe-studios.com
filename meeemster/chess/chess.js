// Constants
let PAWN = "pawn";
let KING = "king";
let TEXTURES = {
	pawn: {w: "amoguspawnw.png", b: "amoguspawnb.png"},
	king: {w: "amoguskingw.png", b: "amoguskingb.png"}
}

let board;
let chessfields = [];
let draggedPiece;

function getPiece(element) {
	let field = parseInt(element.getAttribute("data-field"));
	let x = field % 8;
	let y = Math.floor(field / 8);
	let pieceBlack = element.getAttribute("data-pieceBlack") == "true";
	let type = element.getAttribute("data-pieceType");
	return {
		type: type,
		field: field,
		x: x,
		y: y,
		black: pieceBlack
	}
}

function getPieceAt(x, y) {
	let field = y * 8 + x;
	if(field < 0 || field > 63) return null;
	let fieldEl = chessfields[field];
	return fieldEl.children.length == 0 ? null : getPiece(fieldEl.children[0]);
}

function startGame() {
	for(let i = 0; i < 64; i++) {
		let field = document.createElement("div");
		let x = i % 8;
		let y = Math.floor(i / 8);
		if(x % 2 == 0 ^ y % 2 == 0) {
			field.classList.add("black");
		}else {
			field.classList.add("white");
		}

		field.ondragover = function(e) {
			let piece = draggedPiece;
			if(piece == null || piece == "") return;
			let thePiece = document.getElementById(piece);
			let pieceObj = getPiece(thePiece);

			let pieceOnField = field.children.length != 0;

			switch(pieceObj.type) {
				case KING:
					if(Math.abs(x - pieceObj.x) > 1) return;
					if(Math.abs(y - pieceObj.y) > 1) return;

					for(let dx = -1; dx <= 1; dx++) {
						for(let dy = -1; dy <= 1; dy++) {
							let p = getPieceAt(x + dx, y + dy);
							if(p != null && p.type == KING && p.black != pieceObj.black) return;
						}
					}
					break;
				case PAWN:
					if(Math.abs(x - pieceObj.x) > 1) return;
					if((x - pieceObj.x == 0) == pieceOnField) return;
					if(y - pieceObj.y != (pieceObj.black ? 1 : -1)) return;
					break;
			}

			if(pieceOnField){
				let otherPieceObj = getPiece(field.children[0]);
				if(pieceObj.black != otherPieceObj.black) {
					field.style.backgroundColor = "red";
					e.preventDefault();
					return;
				}
				return;
			}

			field.style.backgroundColor = "green";
			e.preventDefault();
		}

		field.ondragleave = function(e) {
			field.style.backgroundColor = null;
		}

		field.ondrop = function(e) {
			e.preventDefault();
			let piece = draggedPiece;
			if(piece == null || piece == "") return;
			field.style.backgroundColor = null;
			let thePiece = document.getElementById(piece);
			thePiece.setAttribute("data-field", i);
			if(field.children.length != 0) field.children[0].remove();
			field.appendChild(thePiece);
		}

		board.appendChild(field);
		chessfields.push(field);
	}

	let pieces = [
		{type: PAWN, black: true},
		{type: PAWN, black: false},
		{type: KING, black: true},
		{type: KING, black: false}
	];

	for(let p of pieces) {
		let field;

		outer: while(true) {
			field = Math.floor(Math.random() * 64);
			let x = field % 8;
			let y = Math.floor(field / 8);

			if(p.type == PAWN && (p.black ? y == 0 : y == 7)) continue;
			if(chessfields[field].children.length != 0) continue;

			for(let dx = -1; dx <= 1; dx++) {
				for(let dy = -1; dy <= 1; dy++) {
					let pc = getPieceAt(x + dx, y + dy);
					if(pc != null && pc.type == KING && pc.black != p.black) continue outer;
				}
			}

			break;
		}

		let thePiece = document.createElement("img");
		thePiece.id = "cringe" + Math.random();
		thePiece.setAttribute("draggable", true);
		thePiece.src = TEXTURES[p.type][p.black ? "b" : "w"];
		thePiece.setAttribute("data-pieceType", p.type);
		thePiece.setAttribute("data-pieceBlack", p.black);
		thePiece.setAttribute("data-field", field);
		chessfields[field].appendChild(thePiece);
		thePiece.ondragstart = function(e) {
			draggedPiece = thePiece.id;
		};
	}
}

var app = angular.module("myApp", ["ngRoute"]);

app.config(function($routeProvider) {
	$routeProvider
	.when("/", {templateUrl: "chess.html"})
	.when("/one", {templateUrl: "one.html"})
	.when("/two", {templateUrl: "two.html"})
});

app.controller('ChessController', ['$scope', function($scope) {
	board = document.getElementById("chessboard");
	chessfields = [];

	startGame();
}]);

app.controller('OneController', ['$scope', function($scope) {
	$("p").click(function() {
		$(this).slideUp();
	});
}]);