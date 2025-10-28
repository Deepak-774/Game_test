////////////////////////////////////////////////////////////
// MOBILE
////////////////////////////////////////////////////////////
var forPortrait=true;

/*!
 * 
 * START MOBILE CHECK - This is the function that runs for mobile event
 * 
 */
function checkMobileEvent(){
	if($.browser.mobile || isTablet){
		// Enhanced orientation change handling
		$( window ).off('orientationchange').on( "orientationchange", function( event ) {
			$('#canvasHolder').hide();
			$('#rotateHolder').hide();
			
			setTimeout(function() {
				checkMobileOrientation();
				// Force canvas touch properties after orientation change
				setupCanvasTouchProperties();
			}, 1000);
		});
		
		// Also listen for resize events for better responsiveness
		$( window ).off('resize').on( "resize", function( event ) {
			setTimeout(function() {
				checkMobileOrientation();
				setupCanvasTouchProperties();
			}, 500);
		});
		
		checkMobileOrientation();
		setupCanvasTouchProperties();
	}
}

/*!
 * 
 * SETUP CANVAS TOUCH PROPERTIES - Force touch properties on canvas element
 * 
 */
function setupCanvasTouchProperties() {
	var canvas = document.getElementById("gameCanvas");
	if (canvas) {
		// Force touch properties for drag interactions
		canvas.style.touchAction = 'manipulation';
		canvas.style.webkitTouchAction = 'manipulation';
		canvas.style.msTouchAction = 'manipulation';
		canvas.style.userSelect = 'none';
		canvas.style.webkitUserSelect = 'none';
		canvas.style.webkitTouchCallout = 'none';
		canvas.style.webkitTapHighlightColor = 'transparent';
		
		// Ensure canvas receives touch events
		canvas.style.pointerEvents = 'auto';
	}
	
	// Also apply to canvas holder
	var canvasHolder = document.getElementById("canvasHolder");
	if (canvasHolder) {
		canvasHolder.style.touchAction = 'none';
		canvasHolder.style.webkitTouchAction = 'none';
		canvasHolder.style.overflow = 'hidden';
	}
}

/*!
 * 
 * MOBILE ORIENTATION CHECK - This is the function that runs to check mobile orientation
 * 
 */
function checkMobileOrientation() {
	var o = window.orientation;
	var isLandscape=false;
	
	if(window.innerWidth>window.innerHeight){
		isLandscape=true;
	}
	
	var display = false;
	if(!isLandscape){
		//Portrait
		if(forPortrait){
			display=true;
		}
	} else {
		//Landscape
		if(!forPortrait){
			display=true;
		}
	}
	
	if(!display){
		toggleRotate(true);
	}else{
		toggleRotate(false);
		
		if(loaded)
			$('#canvasHolder').show();
	}
}

/*!
 * 
 * TOGGLE ROTATE MESSAGE - This is the function that runs to display/hide rotate instruction
 * 
 */
function toggleRotate(con){
	if(con){
		$('#rotateHolder').fadeIn();
	}else{
		$('#rotateHolder').fadeOut();		
	}
}