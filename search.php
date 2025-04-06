<?php

	//include 'array_to_json.php';
	
	header("Content-Type: application/json");
	
	include 'connection.php';
	$word = $_GET['keyword'];
	$id = $_GET['id'];
    $search_query = "SELECT id, display_title ,
				MATCH (
				display_title, body
				)
				AGAINST (
				'$word'
				) AS score,
				CONCAT_WS(
				' ',
				TRIM(
					SUBSTRING_INDEX(
						SUBSTRING(body, 1, INSTR(body, '$word') - 1 ),
						' ',
						-10
					)
				),
				'$word',
				TRIM(
					SUBSTRING_INDEX(
						SUBSTRING(body, INSTR(body, '$word') + LENGTH('$word') ),
						' ',
						10
					)
				)) AS sentence
				FROM item
				where  INSTR(body, '$word')> 0 order by score desc";
	$body_query = "SELECT i.id, display_title , body, s.file_path FROM item i, segment s where i.id = $id and i.id = s.item_id";
	//if($word !=null)	
	//	$query = $search_query;
	//else if($id !=null)	
	//	$query = $body_query;

	mysqli_query('SET CHARACTER SET utf8');
	$res = mysqli_query($body_query);
   	$rows = array();
	//echo $res;
	if($r = mysql_fetch_assoc($res)) {
	    $rows[] = $r;
	}
//print $rows[0]['body'];
$json = json_encode($rows);//array_to_json($rows);

/*$badchr    = array( '\\\'', '\\\"');
       
    $json= str_replace($badchr, '', $json);
//$json = preg_replace('', '', $json);
//$json = preg_replace("", '', $json);*/
print $json;

?>
