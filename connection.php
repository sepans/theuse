<?php

$con = mysqli_connect(getenv('DB_HOST'), getenv('DB_USER'), getenv('DB_PASS'), getenv('DB_NAME'))
    or die('Could not connect: ' . mysql_error());


?>