/**
 * Created by pawel on 19.05.2014.
 */
var Hud =
{
    s_container: createjs.Container,
    s_tfLives: createjs.Text,
    s_tfPoints: createjs.Text,
    s_timer: createjs.Bitmap,
    s_timerMask: createjs.Shape,
    s_btnSoundOn: createjs.Sprite,
    s_btnSoundOnHelper: createjs.ButtonHelper,
    s_btnSoundOff: createjs.Sprite,
    s_btnSoundOffHelper: createjs.ButtonHelper,
    s_btnServe: createjs.Sprite,
    s_btnServeHelper: createjs.ButtonHelper,


    Init: function()
    {
        this.s_container = new createjs.Container();
        Main.s_scene.addChild(this.s_container);

        //this.s_container.mouseEnabled = false;
        //this.mouseChildren = true;

        //top left
        this.s_topLeft = new createjs.Container();
        this.s_container.addChild(this.s_topLeft);

        var panel = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        panel.gotoAndStop("info_box");

        var icon = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        icon.gotoAndStop("gumball_head");
        icon.x = 20;
        icon.y = 20;

        this.s_tfLives = new createjs.Text();
        this.s_tfLives.textAlign = "left";
        this.s_tfLives.color = "#ffffff";
        this.s_tfLives.font = getFontStyle(".hud_lives");
        this.s_tfLives.x = 115;
        this.s_tfLives.y = 20;
        FixText(this.s_tfLives);
        this.s_topLeft.addChild(panel, icon, this.s_tfLives);

        //top right
        this.s_topRight = new createjs.Container();
        this.s_container.addChild(this.s_topRight);

        var panel = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        panel.gotoAndStop("info_box");
        panel.x = 130;
        var bb = panel.getBounds();

        this.s_tfPoints = new createjs.Text();
        this.s_tfPoints.textAlign = "center";
        this.s_tfPoints.color = "#ffffff";
        this.s_tfPoints.font = getFontStyle(".hud_score");
        this.s_tfPoints.x = panel.x + (bb.width >> 1);
        this.s_tfPoints.y = 20;
        FixText(this.s_tfPoints);

        this.s_btnHelp = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        this.s_btnHelp.gotoAndStop("btn_help");
        this.s_btnHelp.cursor = "pointer";
        this.s_btnHelp.x = 0;
        this.s_btnHelp.addEventListener("click", this.OnClickHelp.bind(this));

        this.s_topRight.addChild(panel, this.s_tfPoints, this.s_btnHelp);

        //timer
        this.s_bottomRight = new createjs.Container();
        this.s_container.addChild(this.s_bottomRight);

        this.s_timerMask = new createjs.Shape();
        this.s_timerMask.graphics.beginFill("#f00").drawRect(-200, -200, 200, 200);

        this.s_timerSmall = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        this.s_timerSmall.gotoAndStop("timer_small");
        bb = this.s_timerSmall.getBounds();
        this.s_timerSmall.x = -bb.width;
        this.s_timerSmall.y = -bb.height;

        this.s_timerBig = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        this.s_timerBig.gotoAndStop("timer_big");
        bb = this.s_timerBig.getBounds();
        this.s_timerBig.x = -bb.width;
        this.s_timerBig.y = -bb.height;
        this.s_timerBig.mask = this.s_timerMask;
        this.s_bottomRight.addChild(this.s_timerSmall, this.s_timerBig);

        //
        //sound buttons
        this.s_bottomLeft = new createjs.Container();
        this.s_container.addChild(this.s_bottomLeft);

        this.s_btnSoundOn = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        this.s_btnSoundOn.gotoAndStop("sound_on");
        bb = this.s_btnSoundOn.getBounds();
        this.s_btnSoundOn.y = -bb.height;
        this.s_btnSoundOn.cursor = "pointer";
        this.s_btnSoundOn.addEventListener("click", function(e){Hud.OnClickSoundOn(e);});

        this.s_btnSoundOff = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        this.s_btnSoundOff.gotoAndStop("sound_off");
        bb = this.s_btnSoundOff.getBounds();
        this.s_btnSoundOff.y = -bb.height;
        this.s_btnSoundOff.cursor = "pointer";
        this.s_btnSoundOff.addEventListener("click", function(e){Hud.OnClickSoundOff(e);});

        this.s_btnSoundOff.visible = SoundsManager.GetMute();
        this.s_btnSoundOn.visible = !SoundsManager.GetMute();

        this.s_bottomLeft.addChild(this.s_btnSoundOff, this.s_btnSoundOn);

        //serve button
        this.s_bottomRightServe = new createjs.Container();
        this.s_container.addChild(this.s_bottomRightServe);

        // Create serve button - optimized for mobile touch
        this.s_btnServe = new createjs.Shape();
        this.s_btnServe.graphics.beginFill("#4CAF50").drawRoundRect(0, 0, 80, 40, 6);
        this.s_btnServe.graphics.beginStroke("#2E7D32").setStrokeStyle(2).drawRoundRect(0, 0, 80, 40, 6);
        this.s_btnServe.x = -100; // Position from right edge
        this.s_btnServe.y = -60; // Position from bottom edge
        this.s_btnServe.cursor = "pointer";
        
        // Add text label to the button
        this.s_btnServeText = new createjs.Text("SERVE", getFontStyle(".close"), "#ffffff");
        this.s_btnServeText.textAlign = "center";
        this.s_btnServeText.x = this.s_btnServe.x + 40; // Center of button
        this.s_btnServeText.y = this.s_btnServe.y + 20; // Center of button
        FixText(this.s_btnServeText);
        
        this.s_btnServe.addEventListener("mousedown", function(e){Hud.OnServeDown(e);});
        this.s_btnServe.addEventListener("mouseup", function(e){Hud.OnServeUp(e);});
        this.s_btnServe.addEventListener("pressup", function(e){Hud.OnServeUp(e);});

        this.s_bottomRightServe.addChild(this.s_btnServe, this.s_btnServeText);

        //
        Main.s_stage.enableMouseOver(10);
    },


    Remove: function()
    {
        Main.s_stage.removeChild(this.s_container);

        this.s_btnHelp.removeAllEventListeners("click");
        this.s_btnSoundOn.removeAllEventListeners("click");
        this.s_btnSoundOff.removeAllEventListeners("click");
        this.s_btnServe.removeAllEventListeners("mousedown");
        this.s_btnServe.removeAllEventListeners("mouseup");
        this.s_btnServe.removeAllEventListeners("pressup");
        this.s_btnSoundOn = null;
        this.s_btnSoundOff = null;
        this.s_btnServe = null;

        this.s_container.removeAllChildren();

        this.s_tfLives = null;

        Main.s_stage.enableMouseOver(0);
    },


    OnClickHelp: function(e)
    {
        ScreenGame.ShowHelp();
    },


    ShowLives: function(value)
    {
        this.s_tfLives.text = "X" + value;
    },


    ShowPoints: function(value)
    {

        this.s_tfPoints.text = Utils.FormatScore(value);
    },


    ShowTime: function(value)
    {
        this.s_timerMask.rotation = -90 * (1 - value);
    },


    OnClickSoundOn: function(e)
    {
        e.preventDefault();

        SoundsManager.Mute(true);
        this.s_btnSoundOn.visible = false;
        this.s_btnSoundOff.visible = true;
    },


    OnClickSoundOff: function(e)
    {
        e.preventDefault();

        SoundsManager.Mute(false);
        this.s_btnSoundOn.visible = true;
        this.s_btnSoundOff.visible = false;
    },


    OnServeDown: function(e)
    {
        e.preventDefault();
        
        // Call the same function as spacebar keydown
        if (ScreenGame.s_hero) {
            ScreenGame.s_hero.serveVeg();
        }
    },


    OnServeUp: function(e)
    {
        e.preventDefault();
        
        // Call the same function as spacebar keyup
        if (ScreenGame.s_hero) {
            ScreenGame.s_hero.allowServNextVeg();
        }
    },


    UpdateCanvasSize: function(width, height)
    {
        // Scale UI elements appropriately for mobile devices
        var s = Main.SCALE;
        if (Main.IsMobile() && width < height) {
            // Portrait mode on mobile - smaller UI size
            s = Math.max(Main.SCALE * 0.9, width / 800);
        } else if (Main.IsMobile()) {
            // Landscape mode on mobile
            s = Math.max(Main.SCALE * 0.95, height / 800);
        }
        
        this.s_topLeft.scaleX = this.s_topLeft.scaleY = s;

        var bb = this.s_topRight.getBounds();
        this.s_topRight.scaleX = this.s_topRight.scaleY = s;
        this.s_topRight.x = width - bb.width * s;

        this.s_bottomRight.scaleX = this.s_bottomRight.scaleY = s;
        this.s_bottomRight.x = width;
        this.s_bottomRight.y = height;

        this.s_bottomLeft.scaleX = this.s_bottomLeft.scaleY = s;
        this.s_bottomLeft.y = height;

        // Scale serve button consistently with other UI elements
        var serveScale = s;
        this.s_bottomRightServe.scaleX = this.s_bottomRightServe.scaleY = serveScale;
        this.s_bottomRightServe.x = width;
        this.s_bottomRightServe.y = height;
    },


    Lock: function()
    {
        this.s_container.mouseEnabled = false;
    },


    Unlock: function()
    {
        this.s_container.mouseEnabled = true;
    }
};