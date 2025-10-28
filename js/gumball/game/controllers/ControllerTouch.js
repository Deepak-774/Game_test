/**
 * Created by pawel on 08.05.2014.
 */
var ControllerTouch =
{
    s_hero: Hero,
    s_startX: 0,
    s_startY: 0,
    s_startTime: 0,
    s_isSwipe: false,


    Init: function(hero, scope)
    {
        this.s_hero = hero;
        this.s_scope = scope;

        createjs.Touch.enable(Main.s_stage, true);

        this.s_scope.addEventListener("mousedown", function(e){ControllerTouch.HandleMouseDown(e);});
        this.s_scope.addEventListener("pressmove", function(e){ControllerTouch.HandleMouseMove(e);});
        this.s_scope.addEventListener("pressup", function(e){ControllerTouch.HandleMouseUp(e);});
    },


    HandleMouseDown: function(e)
    {
        e.preventDefault();

        // Store initial touch position and time for swipe detection
        this.s_startX = e.stageX;
        this.s_startY = e.stageY;
        this.s_startTime = Date.now();
        this.s_isSwipe = false;

        // Don't call tryMoveTo immediately - wait to see if it's a swipe
    },


    HandleMouseMove: function(e)
    {
        e.preventDefault();
        
        var deltaX = e.stageX - this.s_startX;
        var deltaY = e.stageY - this.s_startY;
        var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // If moved more than 30 pixels, consider it a swipe
        if (distance > 30) {
            this.s_isSwipe = true;
        }
    },


    HandleMouseUp: function(e)
    {
        e.preventDefault();
        
        var deltaX = e.stageX - this.s_startX;
        var deltaY = e.stageY - this.s_startY;
        var deltaTime = Date.now() - this.s_startTime;
        
        if (this.s_isSwipe && deltaTime < 500) {
            // Process swipe gestures
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe - move for longer duration
                if (deltaX > 30) {
                    // Swipe right - move character right
                    this.s_hero.startGoRight();
                    setTimeout(function() { ControllerTouch.s_hero.stopGoRight(); }, 500);
                } else if (deltaX < -30) {
                    // Swipe left - move character left
                    this.s_hero.startGoLeft();
                    setTimeout(function() { ControllerTouch.s_hero.stopGoLeft(); }, 500);
                }
            } else {
                // Vertical swipe - move between tables
                if (deltaY > 30) {
                    // Swipe down
                    this.s_hero.startGoDown();
                    setTimeout(function() { ControllerTouch.s_hero.stopGoDown(); }, 300);
                } else if (deltaY < -30) {
                    // Swipe up
                    this.s_hero.startGoUp();
                    setTimeout(function() { ControllerTouch.s_hero.stopGoUp(); }, 300);
                }
            }
        } else if (!this.s_isSwipe) {
            // If it wasn't a swipe, treat it as a tap-to-move
            this.s_hero.tryMoveTo(e.stageX, e.stageY);
        }
    },


    Clear: function()
    {
        createjs.Touch.disable(Main.s_stage);

        this.s_scope.removeAllEventListeners("mousedown");
        this.s_scope.removeAllEventListeners("pressmove");
        this.s_scope.removeAllEventListeners("pressup");
    }
};

