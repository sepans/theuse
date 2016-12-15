<html>
<head>
	<title>chris mann</title>
		
	
	<link rel="stylesheet" href="css/chrsmnn.css" type="text/css">

	
	<style type="text/css">

	
	</style>
	<script type="text/javascript">

	<?php
		include 'connection.php';

		$sql="SELECT count(*) as cc FROM segment";

		$results = mysql_query($sql) or die(mysql_error()); 

		while($row = mysql_fetch_array($results))
		{
		  $total_segment_count = $row['cc'];
		}


	?>
	
	var presets = '<?php echo $_GET["preset"]!=null ? $_GET["preset"] : 'none' ?>';

    // Figure out what browser is being used.
    var userAgent = navigator.userAgent.toLowerCase();

    var Browser = {
        Version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        Chrome: /chrome/.test(userAgent),
        Safari: /webkit/.test(userAgent),
        Opera: /opera/.test(userAgent),
        IE: /msie/.test(userAgent) && !/opera/.test(userAgent),
        Mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent),
        Check: function() { alert(userAgent); }
    };


	var sourceFiles =[];// ['../audio/watchingwords.mp3','../audio/herestrouble.mp3','../audio/ilikethisone.mp3','../audio/justalittle.mp3'];
	var channel_max = <?php echo $total_segment_count;?>;
	

    </script>


</head>
<body style="opacity: 0;">
	<div id="container">
	    <div class="hint-box-container">
    	    <div id="hint-box"></div>
    	</div>
		<div id="dot-box">
			<a class='hp' href="#" onclick="$('#download-list').toggle();return false;"><span id="headphones">for headphones</span></a>
			<ul class="tracks">
			
			
<?php 



$sql="SELECT * FROM item where display=1 order by id";

$results = mysql_query($sql) or die(mysql_error()); 

//$json_text = json_encode($results);
$content = '';
$item_count = 0;
$segment_count = 0;
while($row = mysql_fetch_array($results))
 {
  $title = $row['title'];
  $display_title = $row['display_title'];
  $words = $row['words'];
  $body = $row['body'];
  $item_id = $row['id'];
  



  
  
  	
  

  ?>
  
				<li class="item">
					<h3><a href="#" onclick="loadText('<?php echo $item_id; ?>')"><span class="title" id="title<?php echo $item_id; ?>"><?php echo $display_title; ?></span><span class="words"><?php echo $words; ?> words</span></a></h3>
					<div id="<?php echo $title; ?>Body" style="display: none" class="item_body">
						<p><?php echo $display_title; ?></p>
						<?php /* echo $body */?>
					</div>
					<ul class="buttons">
<?php

			$segment_sql="SELECT * FROM segment where item_id=".$item_id;

			$segment_results = mysql_query($segment_sql) or die(mysql_error()); 

			while($row = mysql_fetch_array($segment_results))
			{
				$audio_path = $row['file_path'];
		
?>
						<li class="segment">
							
							<span class="percent_box" id="percent_<?php echo $segment_count; ?>"></span>
							<span id="rew_btn_cnt<?php echo $segment_count; ?>" class="rew">
								<span class="rew_btn" id="rew_btn_<?php echo $segment_count; ?>" onclick="playTrack($('#grey_btn_<?php echo $segment_count; ?>'),<?php echo $segment_count; ?>);"></span>
							</span>
							<!--<a class="button" id="grey_btn_<?php echo $segment_count; ?>" href="#" >&nbsp;</a>-->
							<span class="grey_button"  id="grey_btn_<?php echo $segment_count; ?>"></span>
							<input type="hidden" id="state<?php echo $segment_count; ?>" class="state" value="rest"/>
							<input type="hidden" id="channel<?php echo $segment_count; ?>" class="channel" value="-1"/>
							<script type="text/javascript">
								if(Browser.Safari && !Browser.Chrome) {
									<?php $mp3path = str_replace(".ogg",".mp3",$audio_path); 
									   $mp3path = str_replace("ogg","audio",$mp3path);
									?>
									sourceFiles.push('<?php echo $mp3path; ?>');
								} 
								else {
									sourceFiles.push('<?php echo $audio_path; ?>');
								}
								
							</script>
						</li> 
  <?php
				$segment_count++;
			}
	?>
				</ul>
			</li>  

	<?php
	$item_count++;
  }
  ?>

			<li class="chrsmnn">
				<h3><a href="#" onclick="return false"><span class="title">chris mann</span><span class="words">c@theuse.info</span></a></h3>
				<ul class="buttons"><li><span class="grey_button" id="mute_video"></span></li></ul>
			</li>
		</ul>
		</div>
		<div id="text-box">
			<input type="text" class="search-input" onkeyup="if (event.keyCode == 13) {search(this.value,1);}"/>
			<div class="text-dragable-cnt" id="text-dragable-cnt"><div id="text-container" class="text-container"></div></div>
		</div>
		<div id="second-text-box">
			<input type="text" class="search-input" onkeyup="if (event.keyCode == 13) {search(this.value,2);}"/>
			<div class="text-dragable-cnt" id="text-dragable-cnt2"><div id="second-text-container" class="text-container"></div></div>
		</div>

		<div id="third-text-box">
			<input type="text" class="search-input" onkeyup="if (event.keyCode == 13) {search(this.value,3);}"/>
			<div class="text-dragable-cnt" id="text-dragable-cnt3"><div id="third-text-container" class="text-container"></div></div>
		</div>


	<div id="control-dots" class="side_btns">
		
		<a href="http://itunes.apple.com/us/app/the-use/id407969043?mt" target="_blank"><span>app</span><div class="grey_button"></div></a>
		<a  href="#" onclick="toggleFilters(this)" ><span>filters</span><div class="grey_button"></div></a>
		<a  id=""><span>&nbsp;</span><div class="grey_button"></div></a>
		<a  href="#" onclick="setupVoice(this)" ><span>voice</span><div class="grey_button"></div></a>
	</div>
	<video id="vid1"></video>
	<video id="vid2"></video>
	<video id="vid3"></video>
	<video id="vid4"></video>
	<video id="vid5"></video>
	<div id="vid6-container">
    	<video id="vid6"></video>
    </div>
	<div id="pencil-container">
    	<video loop id="pencil" src="/video/pencil2.webm"></video>
    </div>
	
	
	<div id="video-dots" class="side_btns">
		<a  href="#" onclick="playvideo('vid1','noitsatest.ogg',this); return false;" id=""><span>no thats a test</span><div class="grey_button"></div></a>
		<a  href="#" onclick="playvideo('vid2','howwouldyouknow.webm',this); return false;" id=""><span>how would you know it was on?</span><div class="grey_button"></div></a>
		<a  href="#" onclick="playvideo('vid3','theartofthediff.ogg',this); return false;" id=""><span>the art of the diff</span><div class="grey_button"></div></a>
		<a  href="#" onclick="playvideo('vid4','itsatrick.webm',this); return false;" id=""><span>its a trick, right?</span><div class="grey_button"></div></a>
		<a  href="#" onclick="playvideo('vid5','the60mbvid1.webm',this); return false;" id=""><span>maybe if you hit it hard</span><div class="grey_button"></div></a>
	
	</div>
	
	<div id='dice1'></div>
	<div id='dice2'></div>

	</div>
	<div id="youarehere"></div>
	
	<ul id="download-list">
<?php	
	$sql="SELECT * FROM item order by id";

	$results = mysql_query($sql) or die(mysql_error()); 
	while($row = mysql_fetch_array($results))
 	{
  		$title = $row['title'];
	    $display_title = $row['display_title'];
	    $texturl = $row['text_file'];
	    $mp3url = $row['mp3_file'];
	    $flacurl = $row['flac_file'];
		?>
 		<li><h3><?php echo $display_title; ?> </h3><span class="links"><a target="_blank" href="<?php echo $texturl?>">text</a><a target="_blank" href="<?php echo $mp3url?>">mp3</a><a target="_blank" href="<?php echo $flacurl?>">flac</a></span></li>
 		
 		<?php
 
 	 }
	?>
	</ul>
	
	<script type="text/javascript" src="js/jquery-1.7.min.js"></script>
	
	<script type="text/javascript" src="js/jquery-ui-1.8.18.custom.min.js"></script>

	<script type="text/javascript" src="js/jquery.window.min.js"></script>


       <script type="text/javascript" src="js/dsp.js"></script>


	<script type="text/javascript" src="js/jquery.jsPlumb-1.3.16-all.min.js"></script>
	<script type="text/javascript" src="js/jquery.highlight-3.js"></script>
	
	<script type="text/javascript" src="js/jquery.ba-dotimeout.min.js"></script>


	<script type="text/javascript" src="js/sents.js"></script>
	<script type="text/javascript" src="js/screen_saver.js"></script>
	
	<script type="text/javascript" src="js/main.js"></script>
	
    <script>

	





	</script>
	
	<script type="text/javascript">
		var totalItems=<?php echo $item_count ?>;

	</script>
	

</body>
	
