


<?php 

require 'markov_core.php';

  $content = $_GET['content'];
  $order = $_GET['order'];
  $length = $_GET["length"]!=null ? $_GET["length"] : 200;	
  $begining = $_GET["begining"]!=null ? $_GET["begining"] : null;


  
  if($order==null) {
  	$order = 5;
  }
  //$length = 200;
  
  
  $markov_table = generate_markov_table($content, $order);
  $markov = generate_markov_text($length, $markov_table, $order,$begining);
  
//    $markov = generate_markov_text($length, $markov_table, $order,$begining);

  //$markov_split = split('\.',$markov); 
  echo $markov; 

    ?>
