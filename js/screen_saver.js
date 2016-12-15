

var ScreenSaver = function(window, $,sentences,options) {
    
    var screen_saver = {},
    width = $(window).width()-200,
    height = $(window).height()-200;
    var overlay_el;
    var rolled = false;
    var player;

    var config = {
        dice : $('#dice1'),
        start_after_time : 5, //sec
        randomize_timer : 0.2, // 20 percent random, 0 for non-random
        overlay: false,
        audio_count : 0,
        change_on_click : true
    };
    
    screen_saver.roll = function(move) {
        
        if(config.overlay) {
            if(!overlay_el) {
              overlay_el = $('<div class="black_overlay"></div>').appendTo('body');
            }
            overlay_el.show();
            config.dice.css('color','#fff');
            config.dice.css('background-color','#000');
        }
        config.dice.fadeOut(50,function() {
            if(move) {
                config.dice.css('top',Math.random()*height);
                config.dice.css('left',Math.random()*width);
            }
            randomize();
        
            config.dice.fadeIn(50);
            rolled = true;
            
            if(config.change_on_click) {
                config.dice.on('click', function() {
                    if(config.overlay) {
                        overlay_el.hide();   
                    }

                    config.dice.hide(); 
                    save_screen(config.start_after_time);
                    rolled = false;
                    $('body').off('click.screensaver');
                    $('a, .buttons span, input').off('click.screensaver');
                    

                });
                $('body').on('click.screensaver', function(e) {
                    randomize();

                });
                $('a, .buttons span, input').on('click.screensaver', function(e) {
                    console.log('item');
                    e.stopPropagation();

                });
            }

        
        });
        
    
    }
    
    var randomize = function() {
            var rand = Math.round(Math.random()*(sentences.length+config.audio_count));
            console.log(rand);
            if(rand>sentences.length) {
                console.log('audio');
                config.dice.hide();
                var trackNum = rand-sentences.length;
                console.log(trackNum);
                player = new Audio();
                player.src = "/emailsongs/audio/email songs"+trackNum+".mp3";
                player.play();
            }
            else {
                if(player) {
                    player.pause();
                }
                var size = sentences[rand].length/2+30;
                config.dice.css('width',size>150 ? size*0.8 : size*1.2);
                config.dice.css('height',size);
                config.dice.text(sentences[rand]);
                config.dice.show();
            }
    }
    
    var save_screen = function(seconds) {
        var refresh,       
            intvrefresh = function() {
                clearInterval(refresh);
                refresh = setTimeout(function() {
                    console.log('_videoPlaying',_videoPlaying);
                   if(!rolled && tracksPlaying==0 && _videoPlaying==0) {
                     screen_saver.roll(false);
                   }
                }, seconds * 1000);
            };
    
        $(document).on('keypress, click, mousemove', function() { intvrefresh();  });
        intvrefresh();

    };

    

    var init = function(options) {
        for(var prop in options) {
            if(options.hasOwnProperty(prop)){
                config[prop] = options[prop];
            }
        }
        
        save_screen(config.start_after_time);
        
    }

    init(options);
    
    return screen_saver;
    
    
    

};