<?php

$con = mysql_connect('', '', '')
    or die('Could not connect: ' . mysql_error());

mysql_select_db('theuse') or die('Could not select database');

?>