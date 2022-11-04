		const restAPI = '/restFullAPI/v2';
		visibilityOfHeader = true;
	documentIsLoaded = false;

function bottomFunction(){
			if(typeof(jQuery) == "undefined"){alert('Could not Load JQuery! Resetting to default!'); documentIsLoaded = true;}
		$(document).ready(function(){
			documentIsLoaded = true;
			$("button").css("cursor", "pointer");
			$("button").css("opacity", "1.0");
		});
		$.ajax({ 
			type: 'GET',
			url: restAPI,
			success: function(data){
				let buf = document.getElementsByClassName("text_left");
				for(let i = 1; i < buf.length; i++){
					buf[i].childNodes[0].innerHTML = Object.values(data)[i-1];
				}
			}
		});
}

	function toggleHeaderVisibility(){
		if(!documentIsLoaded) return;
		document.getElementsByTagName('header')[0].style.visibility=visibilityOfHeader?'hidden':'visible';
		visibilityOfHeader = visibilityOfHeader ? false: true;
	}
	function getArticles(){
		if(!documentIsLoaded) return;
		return document.getElementsByTagName('article');
	}
	function makeArticlesInvisible(){
		if(!documentIsLoaded) return;
		var arts = getArticles();
		for(const e of arts){
			e.style.visibility='hidden';
		}
	}
	function makeArticlesVisible(){
		if(!documentIsLoaded) return;
		var arts = getArticles();
		for(const e of arts){
			e.style.visibility='visible';
		}
	}
