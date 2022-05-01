<?php
	$post = json_decode(file_get_contents('php://input'), true);
	$question = $post["question"];
	$answers = $post["answers"];
	$type = $post["type"];
	var_dump($post);
	if(!isset($question) || !isset($answers) || !isset($type)) {
		echo "question and answers are null";
		die();
	}
	
	$qs = json_decode(file_get_contents("questions-log.json"), true);
	$qs[$question] = array("type" => $type, "answers" => $answers);
	file_put_contents("questions-log.json", json_encode($qs, JSON_PRETTY_PRINT));
	echo "Success";
?>