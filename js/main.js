

var mouseDown = 0;

var showTextCount=0;

var audiochannels = new Array();

var _videoPlaying = 0;
var speakingOpen = false;

var tracksPlaying = 0;
var filterBusy = -1;
var rightFilterBusy = -1;
var leftFilterBusy = -1;	

var sampleRate = 44100;
  
var response = [];
var writeCount = 0;

var endpointCount = 0;
var highlightedWords = [];

var enableFilters = false;

var context;

var current_search_container = 1;

var MOBILE_QUERY = 'only screen and (min-width: 320px) and (max-width: 479px)';
var isMobile = window.matchMedia(MOBILE_QUERY).matches;


var touchstartX = 0;
var touchstartY = 0;
var touchendX = 0;
var touchendY = 0;

var leftPanNode, rightPanNode;
 
 
var BLUE_ENDPOINT_OPTS = { endpoint:"Rectangle",
		paintStyle:{ width:15,height: 10,  fillStyle:'#AAA' },
		isSource:true,
		connectorStyle : { strokeStyle:"#00F" },
		isTarget:true, 
		anchor: "TopCenter",
		maxConnections : 3
};

var RED_ENDPOINT_OPTS = { endpoint:"Rectangle",
		paintStyle:{ width:15,height: 10,  fillStyle:'#AAA' },
		isSource:true,
		connectorStyle : { strokeStyle:"#F00" },
		isTarget:true, 
		anchor: "TopCenter",
		maxConnections : 3
};



$(document).ready(function() {


    var screen_saver = ScreenSaver(window,$,sentences,{start_after_time: 17, audio_count :100});

    var screen_saver_2 = ScreenSaver(window,$,sentences,{start_after_time: 40, overlay: true, dice: $('#dice2')});     
    
    addHoverToDot($($('#item-96 li .rew_btn')[1]), 'cantquite-title', 'cant quite tell') 
    addHoverToDot($($('#item-96 li .rew_btn')[2]), 'thingsidlike-title', 'things i\'d like to have said') 
    
    addHoverToDot($($('#item-95 li .rew_btn')[0]), 'speaking-title', 'speaking is difficult') 
    addHoverToDot($($('#item-95 li .rew_btn')[1]), 'goon-title', 'go on, make me') 
    addHoverToDot($($('#item-95 li .rew_btn')[2]), 'almost-title', 'this, almost') 

    $('.speaking').click(function(e) {
    	speakingOpen = !speakingOpen;
    	$(e.target).css('background-color', speakingOpen ? 'red' : '#AAA')
    	$('.speakingbox').toggle()
    })
    
    $('.control-menu-btn').click(function() {
    	$('#control-dots .menu').toggle()
    })
	

    if(isMobile) {

    	var textContainers = document.querySelectorAll('.text-container')

    	textContainers.forEach(function(containerEl) {

    		containerEl.addEventListener('touchstart', function(event) {
				touchstartX = event.touches[0].screenX;
			    touchstartY = event.touches[0].screenY;
    		})
    		containerEl.addEventListener('touchmove', function(event) {
    			touchendX = event.touches[0].screenX;
    			touchendY = event.touches[0].screenY;
    			if( touchstartX && touchendX - touchstartX > 30 ) {
    				touchstartX = null;
    				this.classList.remove('active')
    			}
    			
    		})

    	})

	    // document.getElementById('text-container').addEventListener('touchmove', function() {
	    // 	//console.log('swiped ', this)
	    // 	this.classList.remove('active')
	    // })

		//$('.text-container').on('swiperight', function() {
		//	console.log('swipe', this)
		//	this.removeClass('active')
		//})
		
		$('.segment').on('click tap', function(e) {
			/*
				for mobile safari. the click events are captured by different elements in safari
				so the onclick in the php doesn't work. this could be used instead of onclick in 
				php for chrome as well but the e.target is different in chrome and safari
			*/

			//not very elegant. the btn is the li.segment's second child
			var btn = e.target.children[1];

			playTrackPrepare(btn)
		})


    }

    //add event listener to segment gray btns
    $('.segment .grey_button').click(function(e) {
    	playTrackPrepare(e.target)
    })



    $('#mute_video').click(function() {
    	$('#vidsilent').toggle()
    	var silentvid = document.getElementById('vidsilent')
    	silentvid.play()
    	silentvid.addEventListener("timeupdate", function(){
    		if(this.currentTime >= 2) {

    			this.style.display = 'none';
    		}
    	})
    })
        


	  
		
	setTimeout(function () { $('#youarehere').show(); },1000);
	$('li.item').last().hide();
	$('body').click(function() {
	  	$('li.item').last().show();
		$('li.chrsmnn').hide();	 
		$('#youarehere').hide(); 	
	});
	  

	$('#headphones').mouseover(function() {
	  	var content = ['play loud','and for interruptions'];
	  	$(this).text(content[Math.round(Math.random()*2)]);
	});

	$('#headphones').mouseout(function() {
	  	$(this).text('for headphones');
	});
	
	var audioContext = window.AudioContext || window.webkitAudioContext;  

	context = new audioContext();

    context.createGain = context.createGain || context.createGainNode; //fallback for gain naming

    if(context.createStereoPanner) { //check if implemented

	    leftPanNode = context.createStereoPanner();
	    leftPanNode.pan.value = -1
	    leftPanNode.connect(context.destination)

	    rightPanNode = context.createStereoPanner();
	    rightPanNode.pan.value = 1
	    rightPanNode.connect(context.destination)

    }

    var dragStartX, dragElementPercent, dragElementId, maxDrag = 30, lastPercent = 0;

    [].forEach.call(document.querySelectorAll('.segment .grey_button'), function(btn) {
    	 btn.addEventListener('dragstart', function(e) {

			var elementId = e.target.id;
			dragElementId=elementId.substring(elementId.lastIndexOf('_cnt')+4);
			dragElementPercent = $('#percent_'+dragElementId)
			console.log(elementId, dragElementId, dragElementPercent)

			dragElementPercent.css('opacity', 1);

    	 	//console.log('dragstart', e)
    	 	dragStartX = e.screenX
    	 }, false);
    	 btn.addEventListener('drag', function(e) {
    	 	//console.log('drag', e)
    	 	//console.log('e.sx', e.screenX)

			var percent = Math.max(Math.min(e.screenX - dragStartX, maxDrag), 0)/maxDrag * 100

			dragElementPercent.text(percent.toFixed(0)+'%');

			//console.log('percent', percent)
			if(e.screenX > 1) {
				lastPercent = percent

			}

    	 }, false);
    	 btn.addEventListener('dragend', function(e) {

			//var percent = Math.max(Math.min(e.screenX - dragStartX, maxDrag), 0)/maxDrag * 100
			var percent = lastPercent

			var duration = audiochannels[dragElementId]['channel'].duration;
			var currentTime = duration*percent / 100;
			console.log('currentTime', audiochannels[dragElementId]['channel'].currentTime)
			console.log(duration, percent)
			console.log('new time', currentTime)

			if(audiochannels[dragElementId]['channel']) {
				audiochannels[dragElementId]['channel'].currentTime = duration*percent / 100;
			}

			dragElementPercent.css('opacity', 0);
    	 	dragStartX = 0
    	 }, false);
    })
	/*    
	$('.rew_btn').each(function (index,element) {

		var elementId = $(element).attr('id');
		var id=elementId.substring(elementId.lastIndexOf('_')+1);
		$(element).draggable({
			containment: "#rew_btn_cnt"+id,
			revert: true,
			revertDuration: 10,
			drag: function(event,ui) {
				if(audiochannels[id]!=undefined) {

					console.log('time drag')

					percent=ui.position.left/17*100;
					$('#percent_'+id).text(percent.toFixed(0)+'%');
					$('#percent_'+id).css('opacity',1);

					var duration = audiochannels[id]['channel'].duration;

					console.log(duration, percent, duration*percent/100)

					audiochannels[id]['channel'].currentTime = duration*percent/100;
				   }	

				},
			stop: function(event,ui) {

				$('#percent_'+id).css('opacity',0);

				}

		});
			
	});
	*/

		
		
    $('.state').val('rest');
    $('.channel').val('-1');
   
    var vid6Zoom = false;
   
    $('video').click(function() {
       if(this.id=='vid6') {
           // var scale = $(this).css('transform') || 'scale(1)';
            //console.log(scale, scale.indexOf('scale(2)'));
            if(vid6Zoom) {
                $(this).css('transform', 'scale(1) translateY(0)');
                vid6Zoom = false;
                
            }
            else {
                $(this).css('transform', 'scale(2) translateY(-200px)');
                vid6Zoom = true;
            
            }
            
       } 	   
       else {
       	if(isMobile) {
       		//on mobile clicking on the video closes vid
       		var vidIndex =  parseInt(this.id.replace('vid', '')) -1
       		
       		var vidBtn = $($('#video-dots .grey_button')[vidIndex])
       		vidBtn.css('background-color', 'green')

       		this.pause()
       		this.style.display = 'none'
       	}
       	else {
	        if(this.width == 427) 
	            this.width= 840;
	        else
	            this.width = 427;
	        }

       	}
       
    });
	   

  	var pageHeight = $(window).height();
	if(pageHeight<650) {
	  $('#dot-box ul.tracks .buttons li').css('margin-bottom','10px');
	  $('#video-dots').css('bottom','90px');
	}
	else if(pageHeight<670) {
	  $('#dot-box ul.tracks .buttons li').css('margin-bottom','6px');
	  $('#video-dots').css('bottom','60px');
	}
	else if(pageHeight<700) {
	  $('#dot-box ul.tracks .buttons li').css('margin-bottom','7px');
	  $('#video-dots').css('bottom','70px');
	}
	else if(pageHeight>750) {
	  $('#dot-box ul.tracks .buttons li').css('margin-bottom','10px');
	}


  
  	$('#youarehere').css('left',$(window).width()/7);
   
  	$('body').css('opacity',1);
  
  
  	$('.text-container').mouseup(function() {
       selectText(this); 
  	});	


  	$('.text-container').bind('touchend' ,function() {
       selectText(this); 
  	});	

          
    if(presets!='none') {
        applyPresets(presets);
    }


	$('.search-input').val('');
		
	
	jsPlumb.ready(function() {

		jsPlumb.Defaults.Container = $("body");
		jsPlumb.importDefaults({
		    ConnectorZIndex:4000,
		    Connector :  "Straight" ,
		  //  Endpoint : "Blank",
		    PaintStyle : { lineWidth : 1, strokeStyle : "#00F" },
				Anchors : [ "TopCenter", "BottomCenter" ]
			});
			
			jsPlumb.bind("jsPlumbConnection", function(info) {
		        
		        var sourceText = info.source.text();
		        var targetText = info.target.text();
		        //sourceText=sourceText.replace(/\W/g, '');
		        //targetText=targetText.replace(/\W/g, '');
		        console.log('source '+sourceText);
		        console.log('target '+targetText);
		        

		        queryMarkovText(sourceText, targetText, info)
		        
		        //console.log(sourceText);
		    });
		        
		        
		      
		  

  	});  //jsplumb	
      
      
	
		

	});  // ready


	function queryMarkovText(sourceText, targetText, info) {
		$.getJSON("search_all.php?keyword="+sourceText+"&one=one", function(data1) {
            $.getJSON("search_all.php?keyword="+targetText+"&one=one", function(data2) {
  		        $.ajax({
                    url: 'markov.php?order=5&length='+500+'&begining='+sourceText+'&content='+data1[0].sentence.substring(0,2000).trim()+' '+data2[0].sentence.substring(0,2000).trim(),
                    context: document.body
                    }).done(function(data) { 
                    
	                    generateMarkov(data,100,100,sourceText,targetText,info);
                	});								
                                    

                
            });
	    });
		
	}

	/*function rewind(index,e,element) {
		var posx = e.pageX - $(element)[0].offsetLeft-84;
		var posy = e.pageY - $(element)[0].offsetTop;
		console.log(mouseDown+' drag '+index+' '+posx);
		var width =  $(element)[0].offsetWidth;
		var percent = posx*100/width;
		console.log(percent+'%');
		
	}*/
	
	function selectText(element) {

            //var selection =  getSelectionHtml();//t = (document.all) ? document.selection.createRange().text : document.getSelection();
            
            var selection = t = (document.all) ? document.selection.createRange().text : document.getSelection();
            console.log('selecttext', selection, selection.focusOffset-selection.anchorOffset)
            if(selection.focusOffset-selection.anchorOffset>2) {
                
                var searchResult = $(element).find('ul').length>0;
                
                var findElement = $(element).find('ul').length>0 ? 'div' : 'p';
                
              //  if(searchResult) {

                   // $(element).find('p').highlight(' '+selection);
                    highlightedWords.push(selection.toString())

                    $(element).find(findElement).highlight(' '+selection);

                    jsPlumb.addEndpoint($(element).find(findElement+' .highlight'),BLUE_ENDPOINT_OPTS);
                	endpointCount++;

                	if(isMobile && endpointCount%2===0) {
                		console.log('CONNECT')

                		var targetText = highlightedWords[endpointCount-1]
                		var sourceText = highlightedWords[endpointCount-2]
                		console.log('source '+sourceText);
		        		console.log('target '+targetText);
		        
				        							
		                                    
		        		queryMarkovText(sourceText, targetText, null)
		               
                	}

                $('#hint-box').fadeOut();

                
         

          	}
	}
	
	function applyPresets(presets) {
		if(presets=='turb') {
			
			//enableFilters=true;
			setTimeout( function() {playTrack($('#grey_btn_0'),0);}, 18000);
			//loadText(0);
			$('#title0').text('public works');
			//setTimeout( function() {$('#text-container h3').text('public works');},1000);
			$('#text-container').append('<h3>public works</h3>');
			$('#text-container').append('<p>for any standard instrumentation (string trio or quartet, wind quintet, whatever) playing standard repertoire.<br>'+
'having chosen the piece, each player to play other than their usual instrument (first violin to play cello, for example), and play only those notes they deem necessary (because they give the player an opportunity to change their mind, because they make other notes possible, or for some other reason other than their mere existence).<br/>'+
'once begun, there should be no attempt to synchronise time.</p>');
			$('#text-container').append('<p style="margin-top: 120px;">david shively, piano. alex waterman, violin</p>');
			$('#text-container').append('<p style="margin-top: 120px;">a 2012 commission of new radio and performing arts, inc., for presentation at Issue project room and  on its turbulence web site. tt was made possible with funding from the nyc department of cultural affairs</p>');
			$('#youarehere').css('opacity','0');
			
		}
	}


      // Setup shared variables

	var filterInterval = 4;
	var filterPeriod = 200;
	var filterTimeReset = true;  

	
	function playvideo(vid,filename,button) {
		var video = document.getElementById(vid);
		if(!video.paused) {
			$(button).find('.grey_button').css('background-color','green');
			video.pause();
			$(video).hide();
		}
		else {
    		$(video).show();
    		$(button).find('.grey_button').css('background-color','red');
    		if(!video.src) {
    			console.log(Browser, Browser.Safari)
    			if(Browser.Safari) {
    				//filename = filename.replace('webm', 'mp4')
    				console.log(filename)
    			}
    			video.src= '/video/'+filename;
    			console.log(video.src)
    		}
    		video.play();
    		_videoPlaying +=1;
    		$(video).on('ended', function(){
                console.log("video ended");
                _videoPlaying -=1;
            });
    		$(video).on('pause', function(){
                console.log("paused");
                _videoPlaying -=1;
            });
		
		}
	}

	function loadTrack(a) {
	
	
		 //   var switchChannels = false; // to enforce the track to played in stereo
	
		/*    if(sourceFiles[a].indexOf('_switchChannels')>0) {
	        console.log('switchChannels');
	        switchChannels = true;
	    }*/
	    
	    // check if one of the corrupted tracks that filter could not be applied 
	    var nofilter = false;
	    if(a==7 || (a>=18 && a<=34)) {   // adding new segments (tracks) values needed to be incremented for each segment that is added
	        nofilter=true;
	    }
	
		audiochannels[a] = new Array();
		audiochannels[a]['channel'] = new Audio();

			audiochannels[a]['channel'].addEventListener("ended",function() {  // on end
                tracksPlaying--;
                $('#grey_btn_'+a).css('background-color','#AAA');
            });
            
		/*
        if (Browser.Mozilla) {
           
			if(filterBusy==-1 && enableFilters && !nofilter) {
	

				audiochannels[a]['channel'].addEventListener('MozAudioAvailable', audioWritten, false);
	
				audiochannels[a]['channel'].addEventListener('loadedmetadata', loadedMetadata, false);  	
				
				filterBusy= a;
				
			} else if(leftFilterBusy == -1  && tracksPlaying>0 && !nofilter) {



				audiochannels[a]['channel'].addEventListener('MozAudioAvailable', audioWrittenLeft, false);
	
				audiochannels[a]['channel'].addEventListener('loadedmetadata', loadedMetadata, false); 
					 
				leftFilterBusy = a;	
			
			
			} else if(rightFilterBusy == -1  && tracksPlaying>1 && !nofilter) {
			

				audiochannels[a]['channel'].addEventListener('MozAudioAvailable', audioWrittenRight, false);
	
				audiochannels[a]['channel'].addEventListener('loadedmetadata', loadedMetadata, false);  
					 
				rightFilterBusy = a;	
			
			} 
			else {
			    console.log('no effect');
			}
		}
		*/

		audiochannels[a]['channel'].addEventListener('loadedmetadata', function() {
			
			if(leftFilterBusy == -1 && tracksPlaying > 0 && leftPanNode) {

				var leftSource = context.createMediaElementSource(this)
	    		leftSource.connect(leftPanNode)
	    		leftFilterBusy = a;	

			}
			else if(rightFilterBusy == -1 && tracksPlaying > 1 && rightPanNode) {

				var rightSource = context.createMediaElementSource(this)
	    		rightSource.connect(rightPanNode)
	    		rightFilterBusy = a;	

			}
    		this.play()

		}, false);  
						
		audiochannels[a]['finished'] = -1;							
		
		var sourceFileLookupIndex = a;

		// for dunno and youknow randomly play one of the tracks
		if(a===46) {
			sourceFileLookupIndex = sourceFileLookupIndex + Math.round(Math.random() * 70)
		}
		else if (a===116) {
			sourceFileLookupIndex = sourceFileLookupIndex + Math.round(Math.random() * 99)
		}
		audiochannels[a]['channel'].src = sourceFiles[sourceFileLookupIndex];
		audiochannels[a]['channel'].load();

	}
	
	function togglePlayPencil() {
	    
	    $('#pencil-container').toggle();
	    var pencilVid = document.getElementById('pencil');
	    
	    if(!pencilVid.paused) {
	        pencilVid.pause();
	        pencilVid.style.display='none';
	    }
	    else {
	        jumpVid(pencilVid);
	        //pencilVid.play();
	        //let jump vid take car of displaying
	        //pencilVid.style.display='block';
	    }
	    
	    
	}
	

	function jumpVid(vid) {
	   
	    var location = Math.random()*vid.duration;
	    var duration = Math.random()*2000 + 500;
        var pause = Math.random() * 5000 + 15000;
        //console.log('duration', duration/1000, 'pause', pause/1000);
	    /*
	    if(Math.random()>0.5) {
	        vid.src = '/video/pencil.webm';
	    }
	    else {
	        vid.src = '/video/pencil2.webm'
	    }
	    */
	    setTimeout(function() {
	        if(!vid.paused) {
    	        jumpVid(vid);
    	        console.log('pause');
    	        vid.style.display = 'none';
    	        vid.pause();
	        }
	    }, pause + duration);

        setTimeout(function() {
    	    vid.currentTime = location;
	        console.log('play');
    	    vid.style.display = 'block';
            vid.play();
        }, pause)
	    
	    
	}
	
	function playTrackPrepare(btn) {

		var segmentCount = parseInt(btn.getAttribute('__data_segment_count'));
		var itemId =  parseInt(btn.getAttribute('__data_item_id'));
		var itemSegmentCount =  parseInt(btn.getAttribute('__data_item_segment_count'));

		playTrack(btn, segmentCount, itemId, itemSegmentCount);

	}

	
	
	function playTrack(link,index, itemId, itemSegmentCount) {

	    // for making an exception for theintro.
	    if(itemId===96 && itemSegmentCount===0) {
	        $('#vid6-container').toggle();
	        playvideo('vid6','theintro.webm',$(link).parent()); 
	    
	        return;
	    }
	    else if(itemId===96 && itemSegmentCount===1) {
	        var state= getBtnState(link)
	        if(state==='rest'){
	            loadText(3328);
	        }
	        return;
	    }
	    else if(itemId===96 && itemSegmentCount===2) {
	        var state= getBtnState(link)
	        if(state==='rest'){
    	        loadText(3330);
	        }
	        togglePlayPencil();
	    
	    }
	    //for dunno and youknow (id 3322 and 3323 loadTrack randomizes playing track)
	
		if(audiochannels[index]==undefined) {
			loadTrack(index);       // it also plays the track for the first time so tracksplaying++ needed
			tracksPlaying++;

		}
		/*var switchChannels = false;
		if(sourceFiles[index].indexOf('_switchChannels')>0) {
	        console.log('switchChanells');
	        switchChannels = true;
	    }
	    */

		//TODO make these based on itemId...
		var twinz = false;
		if(sourceFiles[index].indexOf('_twinz')>0) {
	        console.log('twinz');
	        twinz = true;
	    }
	    

		
		//var state=$('#state'+index).val();
		var state = getBtnState(link)
		
		var trackId = 'track'+index;
		//console.log(trackId);
		//var audio=document.getElementById(trackId); //not needed?!
		if(state=='rest') {
			$(link).css('background-color','red');
			$(link).parent().css('z-index', 10);
			$(link).parent().css('position', 'relative');

			//audiochannels[index]['channel'].play();
			setBtnState(link, 'play')
		} 
		else if (state=='play') {
			$(link).css('background-color','green');

			if(audiochannels[index]['channel'].ended==false) {
			    tracksPlaying--;
			}

			audiochannels[index]['channel'].pause();
			
			setBtnState(link, 'pause')

			console.log('filter release: '+filterBusy);
			if(filterBusy==index) {
				filterBusy = -1;
			}
			console.log('leftfilter release: '+leftFilterBusy);
			if(leftFilterBusy==index) {
				leftFilterBusy = -1;
			}
			console.log('rightfilter realease: '+rightFilterBusy);
			if(rightFilterBusy==index) {
				rightFilterBusy = -1;
			}

			
		}
		else if (state=='pause') {
		
		    if(twinz) {
		    
		        var currentTime= audiochannels[index]['channel'].currentTime;
		        var src = audiochannels[index]['channel'].src;
		        if(src.indexOf('_1')>0) {
    		        audiochannels[index]['channel'].src = src.replace('1','2');
    		    } else {
    		        audiochannels[index]['channel'].src = src.replace('2','1');
    		    }
		        

		        audiochannels[index]['channel'].addEventListener("loadedmetadata",function() {
		        	console.log('loadedmetadata inline callback')
                    this.currentTime = currentTime; 
                });
                

		    }

			tracksPlaying++;

			$(link).css('background-color','red');
			audiochannels[index]['channel'].play();

			setBtnState(link, 'play')
			
		}

		return false;
	}

	function getBtnState(btn) {
		return btn.getAttribute('__data_state');
	}

	function setBtnState(btn, state) {
		btn.setAttribute('__data_state', state);

	}
	
	function showBody(containerId) {
		var body = $('#'+containerId).html();
		$('#text-container').html(body);
	}


	function search(keyword,container_index)
	{
		$.getJSON("search_all.php?keyword="+keyword+"", searchCallback(container_index));
		//$(searchBox.offsetParent).find('.change_to_note').css('display','none');
 		

		
		return false;
	}
	
	function searchCallback(container_index) {
		return function(data) {
			var results = '';
			var titles = new Array();

			if(data.length==0)
				results = 'No results';
			$.each(data, function(i,item){
				var result = '';
				if($.inArray(item.title ,titles)==-1) {
					titles.push(item.title);

					////console.log(i);
					////console.log(item.id);
					result=result+'<li><a href="#" onclick="loadText('+item.id+','+((container_index%3)+1)+')">'+item.title+'</a>';
					//result=result+'<input type="hidden" class="search_result_hidden" value="'+item.id+'"/>';
					//result=result+'<input type="hidden" class="search_result_hidden_index" value="'+item.index+'"/>';
					result=result+'<div>'+item.sentence+'</div></li>';
					
				}
				else {
					result=result+'<div>'+item.sentence+'</div></li>';
					

				}
				results=results+result;
          
        });
        current_search_container = (container_index%3)+1;
		results='<ul>'+results+'</ul>';
		if(container_index==2) {
			$('#second-text-container').html(results);
			$('#second-text-container').css('top',0);
			$('#third-text-box').show();
		}
		else if(container_index==1)
		{
			$('#text-container').html(results);
			$('#text-container').css('top',0);
			$('#second-text-box').show();
			$('#text-container').highlight('therefore');

		}
		else if(container_index==3)
		{
			$('#third-text-container').html(results);
			$('#third-text-container').css('top',0);
		}
		
        if (Browser.Mozilla) {
            console.log('firefox');
            $('.text-dragable-cnt .text-container p').css('padding-right', '17px');
            $('.text-dragable-cnt .text-container ul').css('padding-right', '17px');
        }
        
        if(showTextCount==0) {
                showText($('#hint-box'), isMobile ? 
                	'select a word until it supports scare quotes. select it again. select another word til it too supports scare quotes. select it again.' :
                	'doubleclick any two words and drag one to the other', 0, 50,0);
                showTextCount++;
       }



		};
	}

	function loadText(itemId,container_index) {

		$.getJSON("search.php?id="+itemId+"", function(data) {
		    loadTextCallback(isMobile ? 1 : container_index, data)
	    });		
		return false;
	}

	function loadTextCallback(container_index, data) {
		//return function(data) {
            if(!container_index)
                container_index = current_search_container;
            
            var text_container = $('#text-container');
            if(container_index==2) { 
                text_container = $('#second-text-container');
               /* $('#second-text-container').html('<h3>'+data[0].display_title+'</h3><p>'+data[0].body+'</p>');	
                $('#second-text-container').css('top',0);*/
                $('#second-text-box').show();
                $('#third-text-box').show();

                current_search_container = 3;
            }
            else if(container_index==1) {
                
               /* $('#text-container').html('<h3>'+data[0].display_title+'</h3><p>'+data[0].body+'</p>');	
                $('#text-container').css('top',0);*/
                $('#second-text-box').show();
                current_search_container = 2;
            }
            else if(container_index==3) {
                text_container = $('#third-text-container');
                
               /* $('#third-text-container').html('<h3>'+data[0].display_title+'</h3><p>'+data[0].body+'</p>');	
                $('#third-text-container').css('top',0);*/
                $('#third-text-box').show();
                
                current_search_container = 1;

            }

    	    text_container.addClass('active')
            
            text_container.html('<h3>'+data[0].display_title+'</h3><p>'+data[0].body+'</p>');
            text_container.css('top',0);
            

            
            if(showTextCount==0) {
                showText($('#hint-box'), isMobile ? 
                	'select a word until it supports scare quotes. select it again. select another word til it too supports scare quotes. select it again.' :
                	'doubleclick any two words and drag one to the other', 0, 50,0);
                showTextCount++;
            }
            
            
            $('.text-dragable-cnt').scroll(function () {
                        $.doTimeout( 'scroll', 200, function(){
                            jsPlumb.repaintEverything();
                   });
            });

            
            // for setting the padding for scroll bar auto hide for firefox
            if (Browser.Mozilla) {
                console.log('firefox');
                $('.text-dragable-cnt .text-container p').css('padding-right', '17px');
            }

            
        //    jsPlumb.addEndpoint(text_container.find('p .single-word'),BLUE_ENDPOINT_OPTS);
        

		//};
	}
	
	function generateMarkov(data,x,y,sourceWord,targetWord,info) {
    
    	 var textCont = data;// "<div class='red_text_cont'>..."+data+"...</div>"; 
    	 
    	 var red = info && info.source.parents('.synth').length>0;
    	 
    	 textCont = red ? textCont.substring(0,textCont.lastIndexOf('.')+1) : textCont.substring(0,textCont.indexOf('.')+1);
    	 
    	 var synth_class = red ? 'synth red_synth' : 'synth blue_synth';
                             
         

    	 
									
          var blueGrid = openWindow(x,y,2000, 200, 200 ,textCont ,  '',synth_class,true);	
       
	
	}
	
    var synthCount = 0;	
	
	function openWindow(x,y,z, width, height , content ,  title, containerClassName,resizable) {
	    var xRand = isMobile ? 10 + Math.random() * 200 : 400 + Math.random() * 250 
	    var yRand = isMobile ? 10 + Math.random() * 400 : 100 + Math.random() * 400
	    $('#container').append('<div class="'+containerClassName+'" id="synth'+synthCount+'"><div class="handle"></div><span></span></div>');
	    showText($('#synth'+synthCount+' span'),content.trim(),0,100,0);
	    $('#synth'+synthCount).css('top', yRand);
	    $('#synth'+synthCount).css('left', xRand);
	    $('#synth'+synthCount).draggable({ handle: ".handle" });
	    synthCount++;
	    
	    $('.synth').mouseup(function() {
      
            console.log('synth');
            //var selection =  getSelectionHtml();//t = (document.all) ? document.selection.createRange().text : document.getSelection();
            var selection = t = (document.all) ? document.selection.createRange().text : document.getSelection();
            if(selection.focusOffset-selection.anchorOffset>2) {
                //console.log($('#second-text-box .search-input')[0].value);
                
                /*
                $('#second-text-box .search-input')[0].value=selection;
                $.getJSON("search_all.php?keyword="+selection+"", searchCallback(2));
                
                */

                $(this).highlight(' '+selection);
                jsPlumb.addEndpoint($(this).find('.highlight'),RED_ENDPOINT_OPTS);
                
                $('#hint-box').fadeOut();

               

      	 }
      });	
          


   }
   
   
if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,'');
  };
}
 
function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
  //  alert(html);
}

    // not really used
	
var showText = function(target, message, index, interval,input) {  
 
  if (index < message.length) {
    var content =   input ? $(target).val() : $(target).text();
    input ? $(target).val(content+message[index++]) : $(target).text(content+message[index++]);
    var randomNumber = Math.floor(Math.random() * (interval)) - (interval/2);
    randomNumber = Math.random()>0.95 ? randomNumber+5*interval : randomNumber;
    //console.log(randomNumber);
    setTimeout(function () { showText(target, message, index, interval,input); }, interval+randomNumber);
  }
} 

function addHoverToDot($btn, className, title) {

    $btn.parents('li.segment').append('<div class="item-hover '+className+'">'+title+'</div>');
    $btn.mouseover(function(e) {
        $('.'+className).css('opacity',1);
    });  
    $btn.mouseout(function(e) {
        $('.'+className).css('opacity',0);
    
    });  

}


var setupVoice = function(btn) {
    $(btn).find('.grey_button').css('background-color', 'red');
    console.log('starting voice')
    var grammar = '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;'
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    var SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
    var SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent
    
    var recognition = new SpeechRecognition();
    var grammarList = new SpeechGrammarList();

    grammarList.addFromString(grammar, 1);
    recognition.grammars = grammarList;
    //recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.start();
    

    
    recognition.onresult = function(event) {
        console.log('results', event.results);
        var text = event.results[0][0].transcript;
        console.log(text)
        alert(text);

        $(btn).find('.grey_button').css('background-color', '#aaa');
      
        recognition.stop();
      //recognition.start();
    }    
}   