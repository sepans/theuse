<?php

	//include 'array_to_json.php';
	
//	header("Content-Type: application/json");
	
	include 'connection.php';

	$word = $_GET['keyword'];

	$one = $_GET['one'];

	if($word == null)
		$word = 'being';
	$id = $_GET['id'];
    $search_query = "SELECT id, display_title , body,
				MATCH (
				display_title, body
				)
				AGAINST (
				'$word'
				) AS score
				FROM item
				where  INSTR(body, '$word')> 0 order by score desc";
	$body_query = "SELECT id, display_title , body from item where id = $id";
	
	$query = $search_query;

	mysqli_query($con, 'SET CHARACTER SET utf8');
	$res = mysqli_query($con, $query);
	if(!$res) {
		echo 'no res';
		return;
	}
	
	$rows = array();
   
  
while($r = mysqli_fetch_assoc($res)) {
   //$rows[] = $r['title'];
   $id = $r['id'];
   $title = $r['display_title'];
   $score = $r['score'];
   $body = $r['body'];
   if($one=='one') {
    $strings = getSingleApprearence($word, $body);
   }
   else {
	$strings = getAllAppearences($word, $body);
   }
   for($i = 0; $i < count($strings) ; $i++) {
		$row = array(id => $id, title => $title, score => $score, sentence => $strings[$i]['sentence'], 
		index => $strings[$i]['index']);
		$rows[] = $row;
	}
  // if($one=='one') {
  //  break;
  // }

}

 if($one=='one') {

    $random =  rand(0,count($rows)-1);
    $rowBuffer[] = $rows[$random];
    //$rows = [];
    $rows = $rowBuffer;
    
 }

$json = json_encode($rows);

print $json;

?>


<?php
   function getAllAppearences($wordInput, $bodyInput) {
		$results = array();
		//for case insensitivity
        $word = strtolower($wordInput);
        $body = strtolower($bodyInput);
		$words = explode(" ", $body);
		$wordsOrig = explode(" ", $bodyInput);
		$keys = array_keys( $words,$word);
		for($keyCount = 0; $keyCount < count($keys) ; $keyCount++) {
			$string = "";
			$index = $keys[$keyCount];
			for ($i = $index-10; $i < $index+10; $i++) {
				$string = $string.$wordsOrig[$i]." ";
			}
			$results[] = array(index=> $keyCount, sentence=> '...'.$string.'...');
		}
		
		
		return $results;
 
		
   
   }

?>

<?php
   function getSingleApprearence($word, $body) {
		$results = array();
        $word = trim($word);
		$words = explode(" ", $body);
		$secondWord = '';
       
        if(strpos($word," ")>0) {
           // echo 'second';
           list($word,$secondWord) = split(" ",$word);
           // $secondWord = explode(" ", $word)[1];
           // $word = explode(" ", $word)[0];
        }
		$keys = array_keys( $words,$word);
		
		$keyCount = rand(0,count($keys)-1);
		//echo(count($keys).' ');
		//echo($keyCount.' ');
		//echo($keys[$keyCount].' ');

        $index = $keys[$keyCount];
        $string = "";

        for ($i = max($index-50,0); $i < $index+50; $i++) {
            $string = $string.$words[$i]." ";
        }
        //echo $string;
		$results[] = array(index=> $keyCount, sentence=> $string);
		
		/*
		for($keyCount = 0; $keyCount < count($keys) ; $keyCount++) {
			$string = "";
			$index = $keys[$keyCount];
			for ($i = $index-10; $i < $index+10; $i++) {
				$string = $string.$words[$i]." ";
			}
			$results[] = array(index=> $keyCount, sentence=> '...'.$string.'...');
		}
		
		*/
		return $results;
 
		
   
   }

?>
