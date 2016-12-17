

var mouseDown = 0;

var showTextCount=0;

var audiochannels = new Array();

var _videoPlaying = 0;

var tracksPlaying = 0;
var filterBusy = -1;
var rightFilterBusy = -1;
var leftFilterBusy = -1;	

var sampleRate = 44100;
  
var response = [];
var writeCount = 0;
  
var enableFilters = false;

var context;
 
var current_search_container = 1;

var MOBILE_QUERY = 'only screen and (min-width: 320px) and (max-width: 479px)';
var isMobile = window.matchMedia(MOBILE_QUERY).matches;


var touchstartX = 0;
var touchstartY = 0;
var touchendX = 0;
var touchendY = 0;
 
 
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


/*
if (Browser.Mozilla) {


  	var signal = new Float32Array(2048);

	var biquad=new Biquad(DSP.BPF_CONSTANT_PEAK, sampleRate);
	biquad.setFilterType(DSP.HPF);
	biquad.setF0(8822);
	biquad.setBW(1.177);
	//biquad.setS();
	biquad.setQ(86.722);
	biquad.setDbGain(-14);	

	var output = new Audio();
	var outputLeft = new Audio();
	var outputRight = new Audio();

	if ( typeof output.mozSetup === 'function' ) {
	    output.mozSetup(2, sampleRate);
	    outputLeft.mozSetup(2, sampleRate);
	    outputRight.mozSetup(2, sampleRate);
	}


}
*/


$(document).ready(function() {


    var screen_saver = ScreenSaver(window,$,sentences,{start_after_time: 17, audio_count :100});

    var screen_saver_2 = ScreenSaver(window,$,sentences,{start_after_time: 40, overlay: true, dice: $('#dice2')});     
    
    var $btn1 = $('#rew_btn_1');
    
    $btn1.parents('li.segment').append('<div class="cantquite-title">cant quite tell</div>');

    $btn1.mouseover(function(e) {
        $('.cantquite-title').css('opacity',1);
    
    });  
    $btn1.mouseout(function(e) {
        $('.cantquite-title').css('opacity',0);
    
    });  
    
    var $btn2 = $('#rew_btn_2');
    
    $btn2.parents('li.segment').append('<div class="thingsidlike-title">things i\'d like to have said</div>');
    
    $btn2.mouseover(function(e) {
        $('.thingsidlike-title').css('opacity',1);
    
    });  
    $btn2.mouseout(function(e) {
        $('.thingsidlike-title').css('opacity',0);
    
    });  

    console.log('ismobile', isMobile)
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

    }
        


	  
		
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
	  
	if (Browser.Chrome ) {
			context = new webkitAudioContext();

	}
	$('.rew_btn').each(function (index,element) {

		var elementId = $(element).attr('id');
		var id=elementId.substring(elementId.lastIndexOf('_')+1);
		$(element).draggable({
			containment: "#rew_btn_cnt"+id,
			revert: true,
			revertDuration: 10,
			drag: function(event,ui) {
				if(audiochannels[id]!=undefined) {

					percent=ui.position.left/17*100;
					$('#percent_'+id).text(percent.toFixed(0)+'%');
					$('#percent_'+id).css('opacity',1);

					var duration = audiochannels[id]['channel'].duration;

					audiochannels[id]['channel'].currentTime = duration*percent/100;
				   }	

				},
			stop: function(event,ui) {

				$('#percent_'+id).css('opacity',0);

				}

		});
			
	});
		
		
    $('.state').val('rest');
    $('.channel').val('-1');
   
    var vid6Zoom = false;
   
    $('video').click(function() {
       console.log(this.id);
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
       
        if(this.width == 427) 
            this.width= 840;
        else
            this.width = 427;
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
		        
		        $.getJSON("search_all.php?keyword="+sourceText+"&one=one", function(data1) {
		            console.log(data1);
                $.getJSON("search_all.php?keyword="+targetText+"&one=one", function(data2) {
  		            console.log(data2);
  		            
  		            $.ajax({
                        url: 'markov.php?order=5&length='+500+'&begining='+sourceText+'&content='+data1[0].sentence.substring(0,2000).trim()+' '+data2[0].sentence.substring(0,2000).trim(),
                        context: document.body
                        }).done(function(data) { 
                        
                         console.log(info.source);
                         console.log(info.source.parents('.synth').length>0);

                         generateMarkov(data,100,100,sourceText,targetText,info);
                   });								
                                    

                
                });
		        });

		        
		        //console.log(sourceText);
		        
		        
		      
		  });

  	});  //jsplumb	
      
      
	
		

	});  // ready

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
            console.log('selecttext', selection, selection.focusOffset-selection.anchorOffset>2)
            if(selection.focusOffset-selection.anchorOffset>2) {
                
                var searchResult = $(element).find('ul').length>0;
                
                var findElement = $(element).find('ul').length>0 ? 'div' : 'p';
                
              //  if(searchResult) {
                   // $(element).find('p').highlight(' '+selection);
                    $(element).find(findElement).highlight(' '+selection);
                    jsPlumb.addEndpoint($(element).find(findElement+' .highlight'),BLUE_ENDPOINT_OPTS);
                
              //  }
              //  else {
                //    $(element).find('p').highlight(' '+selection);
               //     jsPlumb.addEndpoint($(element).find('p .highlight'),BLUE_ENDPOINT_OPTS);
                
              //  }
                
                //jsPlumb.draggable($('#text-container p'));
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



    function loadedMetadata() {
		//console.log('meta loaded');
		//console.log(this);

		//console.log(this.volume);  

    	this.volume = 0;
		//console.log(this.volume);  
      // Setup a2 to be identical to a1, and play through there.  
    //  a2.mozSetup(a1.mozChannels, a1.mozSampleRate);  
    //  console.log(a1.mozChannels+" "+ a1.mozSampleRate);	

    }  
      
      // Setup shared variables

	var filterInterval = 4;
	var filterPeriod = 200;
	var filterTimeReset = true;  
	
	function audioWrittenLeft(event) {
        signal = event.frameBuffer;
		for (i = 0; i < signal.length/2; i++) {

			signal[i * 2+1] = 0;
  		}
		outputLeft.mozWriteAudio(signal);
//		console.log('.');
	
	}    

	function audioWrittenRight(event) {
        signal = event.frameBuffer;
		for (i = 0; i < signal.length/2; i++) {

			signal[i * 2] = 0;
  		}
		outputRight.mozWriteAudio(signal);
//		console.log(',');
	
	}    

	function audioWritten(event) {

        signal = event.frameBuffer;



		var timeSeconds=Math.floor(event.time);
		var timeMSeconds=Math.floor((event.time-timeSeconds)*1000);
		if(timeSeconds%filterInterval==0) {
		   if(timeMSeconds<filterPeriod) {
				
				signal = biquad.processStereo(signal);
				//console.log('filter');
				filterTimeReset=false;
				
				 for (i = 0; i < signal.length/2; i++) {
    
   					 signal[i * 2] = 0;
    //signal[i * 2 + 1] = sample * (0.5 + balance);
  				}
		   }
		   else if(filterTimeReset==false) {
	
			filterTimeReset=true;
			filterInterval=Math.round(Math.random()*5)+1;
			filterPeriod=(Math.round(Math.random()*50)+5)*10;
			randomizeFilter();
			//console.log('filter settings '+filterInterval+' '+filterPeriod);
	
		   }
		}
		output.mozWriteAudio(signal);
		writeCount++;
      }

	var filterSettings =   [{'type': DSP.HPF, 'f0': 8822, 'bw': 1.177, 'q': 86722, 'dbg': -14},
				{'type': DSP.BPF_CONSTANT_SKIRT, 'f0': 148, 'q': 16.375, 'bw': 0.945 , 'dbg': 9},
				{'type': DSP.NOTCH, 'f0': 9997, 'q': 8.935, 'bw': 7.92 , 'dbg': 21},
				{'type': DSP.BPF_CONSTANT_PEAK, 'f0': 9012, 'q': 37.476, 'bw': 0.464 , 'dbg': 29},
				{'type': DSP.NOTCH, 'f0': 6037, 'q': 11.246, 'bw': 9.845 , 'dbg': -9}



				];

	function randomizeFilter() {
		var random = Math.floor(Math.random()*filterSettings.length);
		//console.log("filter index "+random+' '+filterSettings[random]['type']);

		biquad.setFilterType(filterSettings[random]['type']);
		biquad.setF0(filterSettings[random]['f0']);
		biquad.setBW(filterSettings[random]['bw']);
		//biquad.setS();
		biquad.setQ(filterSettings[random]['q']);
		biquad.setDbGain(filterSettings[random]['dbg']);	
	}
	
	function toggleFilters(button) {
		$(button).find('.grey_button').css('background-color', enableFilters ? 'green' : 'red');
		enableFilters = !enableFilters;	
	}
	
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
    		if(!video.src)
    			video.src= '/video/'+filename;
    		
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
            

        if (Browser.Mozilla) {
           /* if(switchChannels) {   // the effect for corrections where with each pause the channel switches. starting with left
            
				audiochannels[a]['channel'].addEventListener('MozAudioAvailable', audioWrittenLeft, false);
	
				audiochannels[a]['channel'].addEventListener('loadedmetadata', loadedMetadata, false); 
				
				audiochannels[a]['panning']='left';
            
            }*/
			if(filterBusy==-1 && enableFilters && !nofilter) {
	

				audiochannels[a]['channel'].addEventListener('MozAudioAvailable', audioWritten, false);
	
				audiochannels[a]['channel'].addEventListener('loadedmetadata', loadedMetadata, false);  	
				
				filterBusy= a;
				
			} else if(leftFilterBusy == -1 /* && !switchChannels*/ && tracksPlaying>0 && !nofilter) {



				audiochannels[a]['channel'].addEventListener('MozAudioAvailable', audioWrittenLeft, false);
	
				audiochannels[a]['channel'].addEventListener('loadedmetadata', loadedMetadata, false); 
					 
				leftFilterBusy = a;	
			
			
			} else if(rightFilterBusy == -1 /* && !switchChannels*/ && tracksPlaying>1 && !nofilter) {
			

				audiochannels[a]['channel'].addEventListener('MozAudioAvailable', audioWrittenRight, false);
	
				audiochannels[a]['channel'].addEventListener('loadedmetadata', loadedMetadata, false);  
					 
				rightFilterBusy = a;	
			
			} 
			else {
			    console.log('no effect');
			}
		}
						
		audiochannels[a]['finished'] = -1;							
		
		var sourceFileLookupIndex = a;

		// for dunno and youknow randomly play one of the tracks
		/*
		if(a===46) {
			sourceFileLookupIndex = sourceFileLookupIndex + Math.round(Math.random() * 70)
		}
		else if (a===116) {
			sourceFileLookupIndex = sourceFileLookupIndex + Math.round(Math.random() * 99)
		}
		*/
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
	

	
	
	function playTrack(link,index, itemId, itemSegmentCount) {
	    
	    // for making an exception for theintro.
	    if(itemId===96 && itemSegmentCount===0) {
	        $('#vid6-container').toggle();
	        playvideo('vid6','theintro.webm',$('#grey_btn_0').parent()); 
	    
	        return;
	    }
	    else if(itemId===96 && itemSegmentCount===1) {
	        var state=$('#state1').val();
	        if(state==='rest'){
	            loadText(3328);
	        }
	        return;
	    }
	    else if(itemId===96 && itemSegmentCount===2) {
	        var state=$('#state2').val();
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
	    

		
		var state=$('#state'+index).val();
		
		var trackId = 'track'+index;
		//console.log(trackId);
		var audio=document.getElementById(trackId);
		if(state=='rest') {
			$(link).css('background-color','red');
			$(link).parent().css('z-index', 10);
			$(link).parent().css('position', 'relative');

			audiochannels[index]['channel'].play();
			$('#state'+index).val('play');
		} 
		else if (state=='play') {
			$(link).css('background-color','green');

			if(audiochannels[index]['channel'].ended==false) {
			    tracksPlaying--;
			}

			audiochannels[index]['channel'].pause();
			
			$('#state'+index).val('pause');

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
		        
		        /*audiochannels[index]['channel'].addEventListener("load",function() {
		            console.log('set currentTime to '+currentTime);
                    this.currentTime = currentTime; 
                });*/

		        audiochannels[index]['channel'].addEventListener("loadedmetadata",function() {
                    this.currentTime = currentTime; 
                });
                
		        //audiochannels[index]['channel'].position= currentTime;
		        
		    	//var panning = audiochannels[index]['panning'];

		       /* if(panning=='left') {
    		        audiochannels[index]['channel'].removeEventListener('MozAudioAvailable',audioWrittenLeft,false);
	    	        audiochannels[index]['channel'].addEventListener('MozAudioAvailable', audioWrittenRight, false);
	    	        audiochannels[index]['panning']='right';
	    	    }
		        if(panning=='right') {
    		        audiochannels[index]['channel'].removeEventListener('MozAudioAvailable',audioWrittenRight,false);
	    	        audiochannels[index]['channel'].addEventListener('MozAudioAvailable', audioWrittenLeft, false);
	    	        audiochannels[index]['panning']='left';
	    	    }
				audiochannels[index]['channel'].addEventListener('loadedmetadata', loadedMetadata, false); 
				*/ 

		    }

			tracksPlaying++;

			$(link).css('background-color','red');
			audiochannels[index]['channel'].play();
			$('#state'+index).val('play');
			
		}

		return false;
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
                showText($('#hint-box'), 'doubleclick any two words and drag one to the other', 0, 50,0);
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
            

            console.log(text_container.find('p .single-word'));
            console.log(jsPlumb);
            
            if(showTextCount==0) {
                showText($('#hint-box'), 'doubleclick any two words and drag one to the other', 0, 50,0);
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
    	 
    	 var red = info.source.parents('.synth').length>0;
    	 
    	 textCont = red ? textCont.substring(0,textCont.lastIndexOf('.')+1) : textCont.substring(0,textCont.indexOf('.')+1);
    	 
    	 var synth_class = red ? 'synth red_synth' : 'synth blue_synth';
                             
         

    	 
									
          var blueGrid = openWindow(x,y,2000, 200, 200 ,textCont ,  '',synth_class,true);	
         /*
          var height = blueGrid.window.getContainer().find('.red_text_cont').height();
          blueGrid.window.resize(WINDOW_WIDTH,height+40);	
         // '.window_frame'
          $(blueGrid.window.getContainer()).find('.window_frame').height(height+30);
          
          $(blueGrid.window.getContainer()).find('.window_frame').highlight(sourceWord);
          $(blueGrid.window.getContainer()).find('.window_frame').highlight(targetWord);
          
          jsPlumb.addEndpoint($("#"+blueGrid.window.getContainer().attr('id')+" .highlight"), GREEN_ENDPOINT_OPTS);

          jsPlumb.draggable(blueGrid.window.getContainer());


        //  blueTexts[info.source]=blueGrid;
        */
	
	}
	
    var synthCount = 0;	
	
		function openWindow(x,y,z, width, height , content ,  title, containerClassName,resizable) {
		    
		    $('#container').append('<div class="'+containerClassName+'" id="synth'+synthCount+'"><div class="handle"></div><span></span></div>');
		    showText($('#synth'+synthCount+' span'),content.trim(),0,100,0);
		    $('#synth'+synthCount).css('top',100+Math.random()*400);
		    $('#synth'+synthCount).css('left',400+Math.random()*250);
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