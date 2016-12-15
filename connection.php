<?php

$con = mysql_connect('127.0.0.1', 'root', 'letmein11')
    or die('Could not connect: ' . mysql_error());

mysql_select_db('theuse') or die('Could not select database');

?>