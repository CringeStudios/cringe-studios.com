<?php

$userAgent = $_SERVER['HTTP_USER_AGENT'];
// file_put_contents("uwu.txt", $userAgent);
if(strpos($userAgent, "Discordbot") || strpos($userAgent, "Mac OS") || strpos($userAgent, "Steam")) {
	// uwu
	header("Content-Type: image/png");
	echo file_get_contents("Ecchi2.png");
}else {
	// Normal cringo
	header("Location: https://www.youtube.com/watch?v=dQw4w9WgXcQ");
}
