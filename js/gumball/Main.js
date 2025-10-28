/**
 * Created by pawel on 08.05.2014.
 */
$(document).ready(function ()
{
    Utils.WaitForWebfonts(['gumball'], function(){Main.Start();});
});


var Main = {

    HEIGHT_MIN: 424,
    HEIGHT_MAX: 640,

    s_stage: createjs.Stage,
    s_assets: Array,
    s_loader: createjs.LoadQueue,
    s_inited: false,
    s_paused: false,
    s_active: false,
    s_best: 0,
    s_music: null,

    Start: function()
    {
        this.DetectDevice();
        this.SetupTracking();

        var me = this;
        this.COPY = new CopyParser(function (){me.OnLoadCopy();}, 'copy/copy.xml');
    },


    DetectDevice: function()
    {
        if (Modernizr.mq('only all and (max-width: 767px)') && Modernizr.touch)
        {
            this.s_device = 'smartphone';
        }
        else if (Modernizr.touch)
        {
            this.s_device = 'tablet';
        }
        else
        {
            this.s_device = "desktop";
        }
    },


    SetupTracking: function()
    {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//wisetrack.net/js2.php?tracking_id=' + config.wisetrack + '&country=' + config.language_code + '&device=' + this.s_device;
        head.appendChild(script);
    },


    OnLoadCopy: function()
    {
        //load assets
        this.Init();
    },


    Init: function ()
    {
        var me = this;

        //create stage
        this.s_stage = new createjs.Stage(document.getElementById("canvasGame"));
        //this.s_stage.autoClear = false;
        this.s_scene = new createjs.Container();
        this.s_stage.addChild(this.s_scene);

        //
        Navigation.ShowScreen(Navigation.SCREEN_PRELOAD);

        //resize
//        window.parent.addEventListener('resize', function(){Main.ResizeCanvas();}, false);
        window.addEventListener('resize', function(){Main.ResizeCanvas();}, false);

        //
        this.s_jsons = new Array();
        this.s_spritesheets = new Array();

        //load data and sprite sheets
        var manifest = [
            {src: "images/game/interface/logo_cn.png", id: "logo_cn"},
            {src: "images/game/interface/rainbow.png", id: "rainbow"},
            {src: "images/game/interface/gumball_logo.png", id: "gumball_logo"},
            {src: "images/game/interface/interface_bg.png", id: "interface_bg"},
            {src: "images/game/interface/instructions_1.png", id: "instr_1"},
            {src: "images/game/interface/instructions_2.png", id: "instr_2"},
            {src: "images/game/interface/instructions_3.png", id: "instr_3"},
            {src: "images/game/interface/interface.json", id: "interface"},
            {src: "images/game/background.png", id: "background"},
            {src: "images/game/bench.png", id: "bench"},
            {src: "images/game/customers.json", id: "customers"},
            {src: "images/game/food.json", id: "food"},
            {src: "images/game/money.json", id: "money"},
            {src: "images/game/hero.json", id: "hero"}
        ];

        this.s_loader = new createjs.LoadQueue(false);
        this.s_loader.setMaxConnections = 10;
        this.s_loader.loadManifest(manifest);
        this.s_loader.addEventListener("fileload", function (e)
        {
            me.HandleFileLoad(e);
        });
        this.s_loader.addEventListener("progress", function (e)
        {
            me.OnLoadFilesProgress(e);
        });
        this.s_loader.addEventListener("complete", function (e)
        {
            me.OnLoadFiles(e);
        });

        //orientation and device
        var $body = $("body");
        if (this.IsMobile())
        {
            //mobile
            $body.addClass("mobile");

            //system
            if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/iPod/i))
            {
                $body.addClass("ios");
                if (navigator.userAgent.match(/iPad/i))
                {
                    $body.addClass("ipad");
                }
                else if (window.devicePixelRatio == 1)
                {
                    $body.addClass("no_sound");
                }
            }
            else
            {
                $body.addClass("android");
            }

            //orientation
//            var mm = window.matchMedia("(orientation: portrait)");
            var mm = matchMedia("(orientation: portrait)");

            // If there are matches, we're in portrait
            if(mm.matches)
            {
                // Portrait orientation
                this.OnChangeOrientation(true);
            }
            else
            {
                // Landscape orientation
                this.OnChangeOrientation(false);
            }

            //Add a media query change listener
            mm.addListener(mmListener);

            //
            this.ResizeCanvas();
        }
        else
        {
            //desktop
            $body.addClass("desktop");

            if (navigator.userAgent.indexOf("Firefox") != -1)
            {
                $body.addClass("ff");
            }

            this.s_stage.enableMouseOver(15);

            this.ResizeCanvas();
        }
    },


    HandleFileLoad: function (e)
    {
        var id = e.item.id;
        if (e.item.type == "json" && e.result.images)
        {
            //load images from json sprite sheet
            this.s_jsons.push({id: id, result: e.result});
            for (var i = 0; i < e.result.images.length; i++)
            {
                this.s_loader.loadFile({src: e.result.images[i], id: id + "_" + i});
            }
        }
        else if (id == "logo_cn")
        {
            ScreenPreload.SetLogo();
        }
        else if (id == "rainbow")
        {
            ScreenPreload.SetRainbow();
        }
    },


    OnLoadFilesProgress: function(e)
    {
        // Enhanced progress tracking with better granularity
        const baseProgress = 0.6 * e.progress; // Reduced from 0.8 to make room for optimization phases
        ScreenPreload.SetProgress(baseProgress);
        
        // Update external loading indicator if available
        if (window.updateLoadingProgress) {
            window.updateLoadingProgress(baseProgress * 100);
        }
        
        // Log progress for debugging
        if (e.progress > 0.9) {
            console.log('Asset loading nearly complete:', Math.round(e.progress * 100) + '%');
        }
    },


    OnLoadFiles: function ()
    {
        this.s_loader.removeAllEventListeners("complete");
        this.s_loader.removeAllEventListeners("progress");
        this.s_loader.removeAllEventListeners("fileload");

        this.s_data = this.s_loader.getResult("data");

        //create sprite sheets
        for (var i = 0; i < this.s_jsons.length; i++)
        {
            this.s_spritesheets[this.s_jsons[i].id] = new createjs.SpriteSheet(this.s_jsons[i].result);
        }

        //
        if (!$("body").hasClass("no_sound"))
        {
            this.LoadSounds();
        }
        else
        {
            this.StartGame();
        }
    },


    LoadSounds: function()
    {
        var me = this;
        
        // Check if lazy loading is enabled
        if (config.lazyLoadAudio) {
            console.log('Audio lazy loading enabled - deferring until user interaction');
            this.SetupLazyAudioLoading();
            // Skip audio loading and proceed to game start
            this.StartGame();
            return;
        }
        
        // Priority-based audio loading
        var criticalSounds = [
            {id: "theme", src: "audio/gumball_theme.mp3", priority: 1},
            {id: "twinkles", src: "audio/twinkles.mp3", priority: 1}
        ];
        
        var secondarySounds = [
            {id: "walk", src: "audio/agnes_walk.mp3", priority: 2},
            {id: "fail", src: "audio/scream.mp3", priority: 2},
            {id: "money_count", src: "audio/end_money_count.mp3", priority: 2},
            {id: "pickup_candy", src: "audio/pick_up_candy.mp3", priority: 3},
            {id: "throw_veg", src: "audio/throw_veg.mp3", priority: 3},
            {id: "veg_splat", src: "audio/veg_splat.mp3", priority: 3},
            {id: "collect_veg", src: "audio/pick_up_food.mp3", priority: 3}
        ];
        
        // Load critical sounds first, then secondary
        var allSounds = criticalSounds.concat(secondarySounds);
        SoundsManager.Init(allSounds, me);
    },


    OnProgressSounds: function(e)
    {
        // Enhanced audio loading progress
        const audioProgress = 0.6 + (e.progress * 0.3); // From 60% to 90%
        ScreenPreload.SetProgress(audioProgress);
        
        // Update external loading indicator
        if (window.updateLoadingProgress) {
            window.updateLoadingProgress(audioProgress * 100);
        }
        
        console.log('Audio loading progress:', Math.round(e.progress * 100) + '%');
    },


    OnLoadSounds: function(e)
    {
        this.StartGame();
    },


    StartGame: function()
    {
        this.s_loaded = true;
        
        // Final loading phase
        ScreenPreload.SetProgress(0.95);
        if (window.updateLoadingProgress) {
            window.updateLoadingProgress(95);
        }
        
        // Optimize ticker for better performance
        createjs.Ticker.setFPS(30);
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        
        // Initialize game state
        Status.Reset();
        
        // Complete loading
        setTimeout(() => {
            ScreenPreload.SetProgress(1.0);
            if (window.updateLoadingProgress) {
                window.updateLoadingProgress(100);
            }
            
            // Hide external loading screen
            if (window.hideLoadingScreen) {
                window.hideLoadingScreen();
            }
            
            // Show game front screen
            Navigation.ShowScreen(Navigation.SCREEN_FRONT);
            
            // Trigger service worker preloading
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'PRELOAD_GAME_ASSETS'
                });
            }
            
            console.log('Game initialization complete');
        }, 100);
        
        // Rotation screen disabled - allow play in any orientation
        // if ($("body").hasClass("portrait"))
        // {
        //     Navigation.ShowRotateScreen();
        // }
    },


    SetupLazyAudioLoading: function()
    {
        var me = this;
        var audioLoaded = false;
        
        // Audio loading function
        function loadAudioAssets() {
            if (audioLoaded) return;
            audioLoaded = true;
            
            console.log('Loading audio assets on user interaction...');
            
            var sounds = [
                {id: "theme", src: "audio/gumball_theme.mp3"},
                {id: "walk", src: "audio/agnes_walk.mp3"},
                {id: "twinkles", src: "audio/twinkles.mp3"},
                {id: "pickup_candy", src: "audio/pick_up_candy.mp3"},
                {id: "throw_veg", src: "audio/throw_veg.mp3"},
                {id: "veg_splat", src: "audio/veg_splat.mp3"},
                {id: "collect_veg", src: "audio/pick_up_food.mp3"},
                {id: "fail", src: "audio/scream.mp3"},
                {id: "money_count", src: "audio/end_money_count.mp3"}
            ];
            
            // Load audio in background
            SoundsManager.Init(sounds, {
                OnProgressSounds: function(e) {
                    console.log('Background audio loading:', Math.round(e.progress * 100) + '%');
                },
                OnLoadSounds: function(e) {
                    console.log('Background audio loading complete');
                }
            });
        }
        
        // Set up event listeners for user interaction
        var interactionEvents = ['click', 'touchstart', 'keydown'];
        
        function handleUserInteraction() {
            loadAudioAssets();
            
            // Remove listeners after first interaction
            interactionEvents.forEach(function(eventType) {
                document.removeEventListener(eventType, handleUserInteraction, true);
            });
        }
        
        // Add listeners for user interaction
        interactionEvents.forEach(function(eventType) {
            document.addEventListener(eventType, handleUserInteraction, true);
        });
        
        console.log('Lazy audio loading setup complete - waiting for user interaction');
    },


    GetSpriteSheet: function(id)
    {
        return this.s_spritesheets[id];
    },


    GetImage: function(id)
    {
        return this.s_loader.getResult(id);
    },


    GetItem: function(id)
    {
        return this.s_loader.getItem(id);
    },


    IsMobile: function()
    {
        return ("ontouchstart" in document.documentElement);
    },


    ResizeCanvas: function (h)
    {
        var $body = $("body");
        var canvas = document.getElementById('canvasGame');

        //var ch = Math.max(this.HEIGHT_MIN, Math.min(this.HEIGHT_MAX, h / scale));
        //canvas.height = ch;

        if (Main.IsMobile())
        {
            this.s_pixelRatio = window.devicePixelRatio || 1;
            var width = $(window).width();
            var height;
            if (h)
            {
                height = h;
            }
            else
            {
                if ($body.hasClass("ios") && !$body.hasClass("ipad"))
                {
//                    height = Math.min(window.parent.innerHeight, $(window.parent).height());
                    height = Math.min(window.innerHeight, $(window).height());
//                    height = window.parent.innerHeight;
                }
                else
                {
                    //height = $(window.parent).height();
//                    height = Math.min(window.parent.innerHeight, $(window.parent).height());
                    height = Math.min(window.innerHeight, $(window).height());
//                    height = window.parent.innerHeight;
                }
            }

            //test
            //this.s_pixelRatio = 3;
//            width = (width > height) ? 960 : 768;
//            height = (width > height) ? 710 : 1024;

            //
            width *= this.s_pixelRatio;
            height *= this.s_pixelRatio;

            var scale;
            if (width < height)
            {
                // Portrait mode - optimize for game content
                scale = width / 640;
                canvas.width = width;
                canvas.height = Math.min(height, 1136 * scale);
                
                // If we have extra height, use it
                if (canvas.height < height) {
                    canvas.height = height;
                }
            }
            else
            {
                // Landscape mode - scale to fit screen maintaining aspect ratio
                scale = Math.min(width / 1136, height / 640);
                canvas.width = 1136 * scale;
                canvas.height = 640 * scale;
            }
            canvas.style.width = (canvas.width / this.s_pixelRatio) + "px";
            canvas.style.height = (canvas.height / this.s_pixelRatio) + "px";
            $(".game").css("width", canvas.style.width);
            $(".game").css("height", canvas.style.height);

            this.SCALE = scale;

            Navigation.UpdateCanvasSize(canvas.width, canvas.height);

            //
            positionPage();
        }
        else
        {
            var width = $(window).width();
            var height = $(window).height();
            var scale = Math.min(width / 1136, height / 640);
            canvas.width = 1136 * scale;
            canvas.height = 640 * scale;
            canvas.style.width = (canvas.width) + "px";
            canvas.style.height = (canvas.height) + "px";
            $(".game").css("width", canvas.style.width);
            $(".game").css("height", canvas.style.height);

            this.SCALE = scale;

            Navigation.UpdateCanvasSize(canvas.width, canvas.height);
        }

        this.s_stage.update();
    },


    OnChangeOrientation: function(portrait)
    {
        if (this.s_orentation != portrait)
        {
            this.s_orentation = portrait;
            var $body = $("body");
            if (portrait)
            {
                $body.removeClass("landscape");
                $body.addClass("portrait");
                if (this.s_loaded)
                {
                    this.Pause();
                }
            }
            else
            {
                $body.addClass("landscape");
                $body.removeClass("portrait");
                if (this.s_loaded)
                {
                    this.Resume();
                }
            }

            //
            positionPage();
        }
    },


    Pause: function()
    {
        this.s_paused = true;
        // Rotation screen disabled - no longer show rotate screen
        // Navigation.ShowRotateScreen();
    },


    Resume: function()
    {
        this.s_paused = false;
        // Rotation screen disabled - no longer need to hide rotate screen
        // Navigation.HideRotateScreen();
    },


    GetCanvasSize: function()
    {
        return {width: this.s_stage.canvas.width, height: this.s_stage.canvas.height};
    }
};


function mmListener(m)
{
    if(m.matches)
    {
        // Portrait orientation
        Main.OnChangeOrientation(true);
    }
    else
    {
        // Landscape orientation
        Main.OnChangeOrientation(false);
    }
}


function positionPage()
{
//    window.parent.scrollTo(0, 1);
    window.scrollTo(0, 1);
}


function getFontStyle(className)
{
    var x, sheets,classes;
    for (sheets = document.styleSheets.length-1; sheets >= 0; sheets--)
    {
        classes = document.styleSheets[sheets].rules || document.styleSheets[sheets].cssRules;
        for (x = 0; x < classes.length; x++)
        {
            if (classes[x].selectorText === className)
            {
                return  classes[x].style.font;
            }
        }
    }
    return false;
}


function FixText(text, dy)
{
    if ($("body").hasClass("ff"))
    {
        text.y += dy || parseInt(text.font) * 0.6;
    }
}