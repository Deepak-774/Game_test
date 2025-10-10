function CInterface(iGoal){
    var _oAudioToggle;
    var _oButRestart;
    
    var _oHelpPanel=null;
    
    var _pStartPosAudio;
    var _pStartPosRestart;
    
    var _oScoreTextStroke;
    var _oScoreText;
    var _oScorePos          = {x: CANVAS_WIDTH/2-225, y: 60};
    
    var _oComboTextStroke;
    var _oComboText;
    var _oComboPos          = {x: CANVAS_WIDTH/2+50, y: 60};
    
    var _oMultiplierTextStroke;
    var _oMultiplierText;
    var _oMultiplierPos     = {x: CANVAS_WIDTH/2-225, y: 110};
    
    this._init = function(iGoal){                
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.width/2) - 10, y: (oSprite.height/2) + 10};
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
        
        _oScoreTextStroke = new createjs.Text("SCORE: 0"," 40px "+FONT, "#410701");
        _oScoreTextStroke.x = _oScorePos.x+2;
        _oScoreTextStroke.y = _oScorePos.y+2;
        _oScoreTextStroke.textAlign = "left";
        _oScoreTextStroke.textBaseline = "alphabetic";
        _oScoreTextStroke.lineWidth = 400;     
        s_oStage.addChild(_oScoreTextStroke);
                
        _oScoreText = new createjs.Text("SCORE: 0"," 40px "+FONT, "#ffb400");
        _oScoreText.x = _oScorePos.x;
        _oScoreText.y = _oScorePos.y;
        _oScoreText.textAlign = "left";
        _oScoreText.textBaseline = "alphabetic";
        _oScoreText.lineWidth = 400;     
        s_oStage.addChild(_oScoreText);
        
        // Add combo display
        _oComboTextStroke = new createjs.Text("COMBO: 0"," 30px "+FONT, "#410701");
        _oComboTextStroke.x = _oComboPos.x+2;
        _oComboTextStroke.y = _oComboPos.y+2;
        _oComboTextStroke.textAlign = "left";
        _oComboTextStroke.textBaseline = "alphabetic";
        _oComboTextStroke.lineWidth = 300;
        _oComboTextStroke.alpha = 0; // Hidden by default
        s_oStage.addChild(_oComboTextStroke);
                
        _oComboText = new createjs.Text("COMBO: 0"," 30px "+FONT, "#ff6600");
        _oComboText.x = _oComboPos.x;
        _oComboText.y = _oComboPos.y;
        _oComboText.textAlign = "left";
        _oComboText.textBaseline = "alphabetic";
        _oComboText.lineWidth = 300;
        _oComboText.alpha = 0; // Hidden by default
        s_oStage.addChild(_oComboText);
        
        // Add speed multiplier display
        _oMultiplierTextStroke = new createjs.Text("x1.0"," 25px "+FONT, "#410701");
        _oMultiplierTextStroke.x = _oMultiplierPos.x+2;
        _oMultiplierTextStroke.y = _oMultiplierPos.y+2;
        _oMultiplierTextStroke.textAlign = "left";
        _oMultiplierTextStroke.textBaseline = "alphabetic";
        _oMultiplierTextStroke.lineWidth = 200;
        s_oStage.addChild(_oMultiplierTextStroke);
                
        _oMultiplierText = new createjs.Text("x1.0"," 25px "+FONT, "#00ff00");
        _oMultiplierText.x = _oMultiplierPos.x;
        _oMultiplierText.y = _oMultiplierPos.y;
        _oMultiplierText.textAlign = "left";
        _oMultiplierText.textBaseline = "alphabetic";
        _oMultiplierText.lineWidth = 200;
        s_oStage.addChild(_oMultiplierText);
        
        // Ensure audio button is visible and properly positioned
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            if(_oAudioToggle !== null){
                _oAudioToggle.setVisible(true);
            }
        }
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.refreshScore = function(iScore, iGoal){
        _oScoreTextStroke.text = "SCORE: "+iScore;
        _oScoreText.text = "SCORE: "+iScore;
    };
    
    this.showCombo = function(iCombo){
        if(iCombo > 1){
            _oComboTextStroke.text = "COMBO: x" + iCombo;
            _oComboText.text = "COMBO: x" + iCombo;
            _oComboTextStroke.alpha = 1;
            _oComboText.alpha = 1;
            
            // Pulse effect for combo
            createjs.Tween.get(_oComboText).to({scaleX: 1.3, scaleY: 1.3}, 200, createjs.Ease.elasticOut).to({scaleX: 1, scaleY: 1}, 200);
        } else {
            _oComboTextStroke.alpha = 0;
            _oComboText.alpha = 0;
        }
    };
    
    this.updateMultiplier = function(multiplier){
        _oMultiplierTextStroke.text = "x" + multiplier.toFixed(1);
        _oMultiplierText.text = "x" + multiplier.toFixed(1);
        
        // Change color based on multiplier level
        if(multiplier >= 3){
            _oMultiplierText.color = "#ff0000"; // Red for high multiplier
        } else if(multiplier >= 2){
            _oMultiplierText.color = "#ff6600"; // Orange for medium multiplier
        } else {
            _oMultiplierText.color = "#00ff00"; // Green for normal
        }
        
        // Pulse effect when multiplier increases
        if(multiplier > 1){
            createjs.Tween.get(_oMultiplierText).to({scaleX: 1.2, scaleY: 1.2}, 150, createjs.Ease.elasticOut).to({scaleX: 1, scaleY: 1}, 150);
        }
    }
    
    this.unload = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            if(_oAudioToggle !== null){
                _oAudioToggle.unload();
                _oAudioToggle = null;
            }
        }
        
        if(_oHelpPanel!==null){
            _oHelpPanel.unload();
        }
        
        // Remove score text elements from stage
        s_oStage.removeChild(_oScoreTextStroke);
        s_oStage.removeChild(_oScoreText);
        
        s_oInterface = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            if(_oAudioToggle !== null){
                // Ensure the audio button stays in the top-right corner during gameplay
                var newX = _pStartPosAudio.x - iNewX;
                var newY = iNewY + _pStartPosAudio.y;
                
                // Make sure the button doesn't go off-screen
                newX = Math.max(50, Math.min(newX, CANVAS_WIDTH - 50));
                newY = Math.max(50, newY);
                
                _oAudioToggle.setPosition(newX, newY);
            }
        }        
        _oScoreTextStroke.y = _oScorePos.y+iNewY;
        _oScoreText.y = _oScorePos.y+iNewY;
    };

    this._onButHelpRelease = function(){
        _oHelpPanel = new CHelpPanel();
    };
    
    this.onExitFromHelp = function(){
        _oHelpPanel.unload();
    };
    
    this._onAudioToggle = function(){
        createjs.Sound.setMute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onRestart = function(){
        s_oGame.onRestart();  
    };
    
    s_oInterface = this;
    
    this._init(iGoal);
    
    return this;
}

var s_oInterface = null;