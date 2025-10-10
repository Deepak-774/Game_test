// Clean index-based selection system
var carOptions = ['BMW', 'FORD', 'LAMBORGHINI', 'PAGANI'];
var roadOptions = ['CANYON', 'CITY', 'DESERT', 'PRAIRIE', 'ICEFIELD', 'BRIDGE'];
var selectedCarIndex = 0;   // Default is BMW
var selectedRoadIndex = 0;  // Default is CANYON
var selectionConfirmed = false; // Flag to stop timer actions on click
var CAR_TIMEOUT_ID = null;
var ROAD_TIMEOUT_ID = null;

// Legacy compatibility - derived from index-based system
var selectedCarName = carOptions[selectedCarIndex];
var selectedRoadName = roadOptions[selectedRoadIndex];

var ytOptionLayer = (function () {
	function ytOptionLayer () {
		var s = this;
		LExtends(s, LSprite, []);

		s.carIndex = 0; // Default to first car
		s.placeIndex = 0; // Default to first place
		s.currentStep = 1; // 1 = car selection, 2 = road selection
		s.carTimer = null;
		
		// UNIVERSAL CLEANUP FUNCTIONS - Equivalent to document.querySelectorAll().forEach()
		
		// UNFORGIVING CLEANUP - Resets ALL visual properties regardless of how they were applied
		s.removeAllCarHighlights = function() {
			console.log("=== UNFORGIVING CAR CLEANUP: Destroying ALL highlights (default + clicked) ===");
			if (!s.carOptionLayer) {
				console.error("Car container not available for cleanup");
				return;
			}
			
			var totalCars = s.carOptionLayer.numChildren;
			for (var i = 0; i < totalCars; i++) {
				var carBtn = s.carOptionLayer.getChildAt(i);
				if (carBtn) {
					console.log("UNFORGIVING RESET: Processing car button", i, "- FORCING to dark gray state");
					
					// STEP 1: NUCLEAR DESTRUCTION of ALL visual properties
					carBtn.filters = null;
					carBtn.filters = [];
					carBtn.alpha = 0.85; // Force normal transparency
					carBtn.scaleX = 1.0;  // Reset any scaling
					carBtn.scaleY = 1.0;  // Reset any scaling
					carBtn.rotation = 0;  // Reset any rotation
					
					// STEP 2: FORCE LButton to NORMAL state (handles both default and clicked highlights)
					try {
						var lButton = carBtn.getChildAt(0);
						if (lButton) {
							console.log("UNFORGIVING: Forcing LButton", i, "to normal state");
							
							// MULTIPLE approaches to force normal state
							if (typeof lButton.out === 'function') {
								lButton.out(); // Force to normal state
							}
							if (typeof lButton.mouseOut === 'function') {
								lButton.mouseOut(); // Alternative method
							}
							
							// Force button properties
							if (lButton.buttonMode !== undefined) {
								lButton.buttonMode = false;
							}
							if (lButton.useHandCursor !== undefined) {
								lButton.useHandCursor = false;
							}
							
							// Force visual properties on LButton itself
							lButton.alpha = 0.85;
							lButton.filters = null;
							lButton.filters = [];
						}
					} catch (ex) {
						console.log("LButton force reset error for car", i, ":", ex.message);
					}
					
					// STEP 3: UNFORGIVING TEXT RESET - Reset ALL text in ALL layers
					try {
						var lButton = carBtn.getChildAt(0);
						if (lButton && lButton.getChildAt) {
							console.log("UNFORGIVING TEXT RESET: Car", i, "- resetting ALL text layers");
							
							// Reset text in BOTH normal and over layers (covers default + clicked states)
							for (var layerIndex = 0; layerIndex < 2; layerIndex++) {
								var buttonLayer = lButton.getChildAt(layerIndex);
								if (buttonLayer && buttonLayer.getChildAt) {
									// Check ALL children in the layer for text
									for (var childIndex = 0; childIndex < buttonLayer.numChildren; childIndex++) {
										var child = buttonLayer.getChildAt(childIndex);
										
										// If this child has text properties, reset them
										if (child && child.color !== undefined) {
											console.log("UNFORGIVING: Resetting text at layer", layerIndex, "child", childIndex);
											child.color = "white";
											child.filters = null;
											child.filters = [new LDropShadowFilter(null, null, "rgba(255,255,255,0.5)", 8)];
										}
										
										// If this child is a container, check its children too
										if (child && child.getChildAt && child.numChildren > 0) {
											for (var subIndex = 0; subIndex < child.numChildren; subIndex++) {
												var subChild = child.getChildAt(subIndex);
												if (subChild && subChild.color !== undefined) {
													console.log("UNFORGIVING: Resetting nested text at layer", layerIndex, "child", childIndex, "sub", subIndex);
													subChild.color = "white";
													subChild.filters = null;
													subChild.filters = [new LDropShadowFilter(null, null, "rgba(255,255,255,0.5)", 8)];
												}
											}
										}
									}
								}
							}
						}
					} catch (ex) {
						console.log("Unforgiving text reset error for car", i, ":", ex.message);
					}
					
					console.log("UNFORGIVING RESET COMPLETE: Car", i, "- ALL highlights destroyed, forced to dark gray");
				}
			}
			console.log("=== UNFORGIVING CAR CLEANUP COMPLETE - Default + Clicked highlights destroyed ===");
		};
		
		// UNFORGIVING CLEANUP - Resets ALL visual properties regardless of how they were applied
		s.removeAllRoadHighlights = function() {
			console.log("=== UNFORGIVING ROAD CLEANUP: Destroying ALL highlights (default + clicked) ===");
			if (!s.placeOptionLayer) {
				console.error("Road container not available for cleanup");
				return;
			}
			
			var totalRoads = s.placeOptionLayer.numChildren;
			for (var i = 0; i < totalRoads; i++) {
				var roadBtn = s.placeOptionLayer.getChildAt(i);
				if (roadBtn) {
					console.log("UNFORGIVING RESET: Processing road button", i, "- FORCING to dark gray state");
					
					// STEP 1: NUCLEAR DESTRUCTION of ALL visual properties
					roadBtn.filters = null;
					roadBtn.filters = [];
					roadBtn.alpha = 0.85; // Force normal transparency
					roadBtn.scaleX = 1.0;  // Reset any scaling
					roadBtn.scaleY = 1.0;  // Reset any scaling
					roadBtn.rotation = 0;  // Reset any rotation
					
					// STEP 2: FORCE LButton to NORMAL state (handles both default and clicked highlights)
					try {
						var lButton = roadBtn.getChildAt(0);
						if (lButton) {
							console.log("UNFORGIVING: Forcing LButton", i, "to normal state");
							
							// MULTIPLE approaches to force normal state
							if (typeof lButton.out === 'function') {
								lButton.out(); // Force to normal state
							}
							if (typeof lButton.mouseOut === 'function') {
								lButton.mouseOut(); // Alternative method
							}
							
							// Force button properties
							if (lButton.buttonMode !== undefined) {
								lButton.buttonMode = false;
							}
							if (lButton.useHandCursor !== undefined) {
								lButton.useHandCursor = false;
							}
							
							// Force visual properties on LButton itself
							lButton.alpha = 0.85;
							lButton.filters = null;
							lButton.filters = [];
						}
					} catch (ex) {
						console.log("LButton force reset error for road", i, ":", ex.message);
					}
					
					// STEP 3: UNFORGIVING TEXT RESET - Reset ALL text in ALL layers
					try {
						var lButton = roadBtn.getChildAt(0);
						if (lButton && lButton.getChildAt) {
							console.log("UNFORGIVING TEXT RESET: Road", i, "- resetting ALL text layers");
							
							// Reset text in BOTH normal and over layers (covers default + clicked states)
							for (var layerIndex = 0; layerIndex < 2; layerIndex++) {
								var buttonLayer = lButton.getChildAt(layerIndex);
								if (buttonLayer && buttonLayer.getChildAt) {
									// Check ALL children in the layer for text
									for (var childIndex = 0; childIndex < buttonLayer.numChildren; childIndex++) {
										var child = buttonLayer.getChildAt(childIndex);
										
										// If this child has text properties, reset them
										if (child && child.color !== undefined) {
											console.log("UNFORGIVING: Resetting text at layer", layerIndex, "child", childIndex);
											child.color = "white";
											child.filters = null;
											child.filters = [new LDropShadowFilter(null, null, "rgba(255,255,255,0.5)", 8)];
										}
										
										// If this child is a container, check its children too
										if (child && child.getChildAt && child.numChildren > 0) {
											for (var subIndex = 0; subIndex < child.numChildren; subIndex++) {
												var subChild = child.getChildAt(subIndex);
												if (subChild && subChild.color !== undefined) {
													console.log("UNFORGIVING: Resetting nested text at layer", layerIndex, "child", childIndex, "sub", subIndex);
													subChild.color = "white";
													subChild.filters = null;
													subChild.filters = [new LDropShadowFilter(null, null, "rgba(255,255,255,0.5)", 8)];
												}
											}
										}
									}
								}
							}
						}
					} catch (ex) {
						console.log("Unforgiving text reset error for road", i, ":", ex.message);
					}
					
					console.log("UNFORGIVING RESET COMPLETE: Road", i, "- ALL highlights destroyed, forced to dark gray");
				}
			}
			console.log("=== UNFORGIVING ROAD CLEANUP COMPLETE - Default + Clicked highlights destroyed ===");
		};
		s.roadTimer = null;
		s.carCountdown = 5;
		s.roadCountdown = 5;

		s.carInfoList = [
			{name : "BMW", data : 0},
			{name : "FORD", data : 1},
			{name : "LAMBORGHINI", data : 2},
			{name : "PAGANI", data : 4}
		];

		s.placeInfoList = [
			{name : "CANYON", data : "street_canyon"},
			{name : "CITY", data : "street_city"},
			{name : "DESERT", data : "street_desert"},
			{name : "PRAIRIE", data : "street_grass"},
			{name : "ICEFIELD", data : "street_snow"},
			{name : "BRIDGE", data : "street_water"}
		];

		var backgroundBmp = new LBitmap(dataList["default_menu_background"]);
		backgroundBmp.scaleX = LGlobal.width / backgroundBmp.getWidth();
		backgroundBmp.scaleY = LGlobal.height / backgroundBmp.getHeight();
		s.addChild(backgroundBmp);

		s.carOptionLayer = new LSprite();
		s.addChild(s.carOptionLayer);

		s.placeOptionLayer = new LSprite();
		s.addChild(s.placeOptionLayer);

		// Timer display layers
		s.timerLayer = new LSprite();
		s.addChild(s.timerLayer);

		// Start with car selection immediately
		s.addCarOption();
	}

	ytOptionLayer.prototype.addCarOption = function () {
		var s = this, carInfoList = s.carInfoList;

		// Clear any existing timers
		s.clearTimers();

		// Add countdown timer display
		s.addCarTimer();

		var carBmpd = dataList["menu_car_icons"].clone();
		carBmpd.setProperties(0, 0, carBmpd.width / 2, carBmpd.height / 6);

		for (var k = 0; k < carInfoList.length; k++) {
			var o = carInfoList[k];

			var contentLayer = new LSprite();

			var cBmpd = carBmpd.clone();
			cBmpd.setCoordinate(0, o.data * carBmpd.height);
			var iconBmp = new LBitmap(cBmpd);
			iconBmp.scaleX = iconBmp.scaleY = 0.5;
			contentLayer.addChild(iconBmp);

			var txt = new LTextField();
			txt.text = o.name;
			txt.size = 13;
			txt.color = "white"; // All cars start with white text
			txt.weight = "bold";
			txt.filters = [new LDropShadowFilter(null, null, "white", 15)];
			txt.x = iconBmp.getWidth() + 5;
			txt.y = (iconBmp.getHeight() - txt.getHeight()) / 2;
			contentLayer.addChild(txt);

			contentLayer.x = 20;

			var btn = new ytButton(2, [contentLayer, null, "middle"], [0.85, 0.9]);
			btn.index = k;
			btn.y = k * (btn.getHeight() + 10);
			s.carOptionLayer.addChild(btn);

			// Set normal appearance for all cars initially
			btn.alpha = 0.85;
			btn.filters = [];

			btn.addEventListener(LMouseEvent.MOUSE_UP, function (e) {
				var clickedIndex = e.currentTarget.index;
				
				console.log("=== CAR BUTTON CLICKED ===");
				console.log("Clicked Index:", clickedIndex);
				console.log("Total car buttons:", s.carOptionLayer.numChildren);
				
				// STEP 1: SURGICAL CLEANUP - Destroy ALL gold from other buttons
				console.log("=== SURGICAL CAR SELECTION: Starting complete cleanup ===");
				s.removeAllCarHighlights();
				
				// STEP 2: SURGICAL GOLD APPLICATION - Force clicked button to gold state
				console.log("STEP 2: SURGICAL GOLD APPLICATION to car button", clickedIndex);
				var clickedBtn = e.currentTarget;
				
				// Update the selection variable (to keep the game flow intact)
				selectedCarIndex = clickedIndex;
				selectedCarName = carOptions[selectedCarIndex];
				s.carIndex = clickedIndex;
				
				// SURGICAL GOLD STATE APPLICATION
				try {
					// STEP 2A: Force LButton to "over" state (this shows the gold background)
					var lButton = clickedBtn.getChildAt(0);
					if (lButton) {
						console.log("SURGICAL GOLD: Forcing LButton to over state");
						
						// Force button to show "over" state (gold background)
						if (typeof lButton.over === 'function') {
							lButton.over(); // This should show the gold background
						}
						
						// Additional state forcing
						if (lButton.buttonMode !== undefined) {
							lButton.buttonMode = true; // Enable button mode
						}
						
						// Force visual update
						if (typeof lButton.updateContext === 'function') {
							lButton.updateContext();
						}
					}
					
					// STEP 2B: Apply additional gold glow filter to container
					clickedBtn.alpha = 1.0; // Full opacity for selected state
					clickedBtn.filters = [
						new LDropShadowFilter(null, null, "#ffcc00", 25), // Strong gold glow
						new LDropShadowFilter(null, null, "#f0a500", 15)  // Inner gold glow
					];
					
					console.log("SURGICAL GOLD: LButton over state applied + glow filters added");
					
				} catch (ex) {
					console.log("SURGICAL GOLD APPLICATION ERROR:", ex.message);
				}
				
				// STEP 2C: SURGICAL TEXT GOLD APPLICATION
				try {
					var lButton = clickedBtn.getChildAt(0);
					if (lButton && lButton.getChildAt) {
						// Apply gold text to BOTH normal and over layers for safety
						for (var layerIndex = 0; layerIndex < 2; layerIndex++) {
							var buttonLayer = lButton.getChildAt(layerIndex);
							if (buttonLayer && buttonLayer.getChildAt) {
								var contentLayer = buttonLayer.getChildAt(1);
								if (contentLayer && contentLayer.getChildAt) {
									var textField = contentLayer.getChildAt(1);
									if (textField && textField.color !== undefined) {
										console.log("SURGICAL GOLD TEXT: Car", clickedIndex, "layer", layerIndex, "- setting to gold");
										textField.color = "#FFFF00"; // Bright yellow text
										textField.filters = [
											new LDropShadowFilter(null, null, "#ffcc00", 15), // Gold text glow
											new LDropShadowFilter(null, null, "#f0a500", 8)   // Inner glow
										];
									}
								}
							}
						}
					}
				} catch (ex) {
					console.log("SURGICAL GOLD TEXT ERROR:", ex.message);
				}
				
				console.log("Gold highlight applied to button", clickedIndex);
				
				// STEP 3: Set confirmation flag
				selectionConfirmed = true;
				
				console.log("Car selected:", selectedCarName, "at index:", selectedCarIndex);
				console.log("Selection confirmed, timer continues...");
				console.log("=== CAR SELECTION COMPLETE ===");
				
				// CRITICAL: Do NOT call clearTimeout() or transitionToRoadScreen()
				// Timer must continue to show remaining time
				// Only timeout action will advance the screen
			});
		}

		s.carOptionLayer.x = (LGlobal.width - s.carOptionLayer.getWidth()) * 0.5;
		s.carOptionLayer.y = (LGlobal.height - s.carOptionLayer.getHeight()) * 0.5;

		// Apply default highlighting to first car after all buttons are created
		s.updateCarVisualSelection(0);
		
		// Start 5-second countdown for car selection
		s.startCarTimer();
	};

	ytOptionLayer.prototype.addPlaceOption = function () {
		var s = this, placeInfoList = s.placeInfoList;

		// Clear car selection display
		s.carOptionLayer.removeAllChild();
		s.currentStep = 2;

		// Add countdown timer display for road selection
		s.addRoadTimer();

		for (var k = 0; k < placeInfoList.length; k++) {
			var o = placeInfoList[k];

			var contentLayer = new LSprite();

			var cBmpd = dataList[o.data].clone();
			cBmpd.setProperties(0, 0, cBmpd.width, cBmpd.width);
			var iconBmp = new LBitmap(cBmpd);
			iconBmp.scaleX = iconBmp.scaleY = 0.08;
			contentLayer.addChild(iconBmp);

			var txt = new LTextField();
			txt.text = o.name;
			txt.size = 15;
			txt.color = "white"; // All roads start with white text
			txt.weight = "bold";
			txt.filters = [new LDropShadowFilter(null, null, "white", 15)];
			txt.x = iconBmp.getWidth() + 20;
			txt.y = (iconBmp.getHeight() - txt.getHeight()) / 2;
			contentLayer.addChild(txt);

			contentLayer.x = 20;

			var btn = new ytButton(2, [contentLayer, null, "middle"], [0.6, 0.6]);
			btn.index = k;
			btn.y = k * (btn.getHeight() + 10);
			s.placeOptionLayer.addChild(btn);

			// Set normal appearance for all roads initially
			btn.alpha = 0.85;
			btn.filters = [];

			btn.addEventListener(LMouseEvent.MOUSE_UP, function (e) {
				var clickedIndex = e.currentTarget.index;
				
				console.log("=== ROAD BUTTON CLICKED ===");
				console.log("Clicked Index:", clickedIndex);
				console.log("Total road buttons:", s.placeOptionLayer.numChildren);
				
				// STEP 1: SURGICAL CLEANUP - Destroy ALL gold from other buttons
				console.log("=== SURGICAL ROAD SELECTION: Starting complete cleanup ===");
				s.removeAllRoadHighlights();
				
				// STEP 2: SURGICAL GOLD APPLICATION - Force clicked button to gold state
				console.log("STEP 2: SURGICAL GOLD APPLICATION to road button", clickedIndex);
				var clickedBtn = e.currentTarget;
				
				// Update the selection variable (to keep the game flow intact)
				selectedRoadIndex = clickedIndex;
				selectedRoadName = roadOptions[selectedRoadIndex];
				s.placeIndex = clickedIndex;
				
				// SURGICAL GOLD STATE APPLICATION
				try {
					// STEP 2A: Force LButton to "over" state (this shows the gold background)
					var lButton = clickedBtn.getChildAt(0);
					if (lButton) {
						console.log("SURGICAL GOLD: Forcing LButton to over state");
						
						// Force button to show "over" state (gold background)
						if (typeof lButton.over === 'function') {
							lButton.over(); // This should show the gold background
						}
						
						// Additional state forcing
						if (lButton.buttonMode !== undefined) {
							lButton.buttonMode = true; // Enable button mode
						}
						
						// Force visual update
						if (typeof lButton.updateContext === 'function') {
							lButton.updateContext();
						}
					}
					
					// STEP 2B: Apply additional gold glow filter to container
					clickedBtn.alpha = 1.0; // Full opacity for selected state
					clickedBtn.filters = [
						new LDropShadowFilter(null, null, "#ffcc00", 25), // Strong gold glow
						new LDropShadowFilter(null, null, "#f0a500", 15)  // Inner gold glow
					];
					
					console.log("SURGICAL GOLD: LButton over state applied + glow filters added");
					
				} catch (ex) {
					console.log("SURGICAL GOLD APPLICATION ERROR:", ex.message);
				}
				
				// STEP 2C: SURGICAL TEXT GOLD APPLICATION
				try {
					var lButton = clickedBtn.getChildAt(0);
					if (lButton && lButton.getChildAt) {
						// Apply gold text to BOTH normal and over layers for safety
						for (var layerIndex = 0; layerIndex < 2; layerIndex++) {
							var buttonLayer = lButton.getChildAt(layerIndex);
							if (buttonLayer && buttonLayer.getChildAt) {
								var contentLayer = buttonLayer.getChildAt(1);
								if (contentLayer && contentLayer.getChildAt) {
									var textField = contentLayer.getChildAt(1);
									if (textField && textField.color !== undefined) {
										console.log("SURGICAL GOLD TEXT: Road", clickedIndex, "layer", layerIndex, "- setting to gold");
										textField.color = "#FFFF00"; // Bright yellow text
										textField.filters = [
											new LDropShadowFilter(null, null, "#ffcc00", 15), // Gold text glow
											new LDropShadowFilter(null, null, "#f0a500", 8)   // Inner glow
										];
									}
								}
							}
						}
					}
				} catch (ex) {
					console.log("SURGICAL GOLD TEXT ERROR:", ex.message);
				}
				
				console.log("Gold highlight applied to road button", clickedIndex);
				
				// STEP 3: Set confirmation flag
				selectionConfirmed = true;
				
				console.log("Road selected:", selectedRoadName, "at index:", selectedRoadIndex);
				console.log("Selection confirmed, timer continues...");
				console.log("=== ROAD SELECTION COMPLETE ===");
				
				// CRITICAL: Do NOT call clearTimeout() or startGame()
				// Timer must continue to show remaining time
				// Only timeout action will start the game
			});
		}

		s.placeOptionLayer.x = (LGlobal.width - s.placeOptionLayer.getWidth()) * 0.5;
		s.placeOptionLayer.y = (LGlobal.height - s.placeOptionLayer.getHeight()) * 0.5;

		// Apply default highlighting to first road after all buttons are created
		s.updateRoadVisualSelection(0);
		
		// Start 5-second countdown for road selection
		s.startRoadTimer();
	};

	// Timer management functions
	ytOptionLayer.prototype.clearTimers = function () {
		var s = this;
		// Clear global timer IDs
		if (CAR_TIMEOUT_ID) {
			clearInterval(CAR_TIMEOUT_ID);
			CAR_TIMEOUT_ID = null;
		}
		if (ROAD_TIMEOUT_ID) {
			clearInterval(ROAD_TIMEOUT_ID);
			ROAD_TIMEOUT_ID = null;
		}
		s.timerLayer.removeAllChild();
	};

	ytOptionLayer.prototype.addCarTimer = function () {
		var s = this;
		s.carCountdown = 5;
		
		s.carTimerText = new LTextField();
		s.carTimerText.text = "Auto-selecting in " + s.carCountdown + "s";
		s.carTimerText.size = 18;
		s.carTimerText.color = "#00ffff"; // Bright cyan for visibility
		s.carTimerText.weight = "bold";
		s.carTimerText.filters = [
			new LDropShadowFilter(null, null, "rgba(0,0,0,0.8)", 5), // Dark background
			new LDropShadowFilter(null, null, "#00ffff", 15) // Cyan glow
		];
		s.carTimerText.x = (LGlobal.width - s.carTimerText.getWidth()) * 0.5;
		s.carTimerText.y = 30; // Position at TOP to avoid overlap
		s.timerLayer.addChild(s.carTimerText);
	};

	ytOptionLayer.prototype.addRoadTimer = function () {
		var s = this;
		s.roadCountdown = 5;
		
		s.roadTimerText = new LTextField();
		s.roadTimerText.text = "Starting race in " + s.roadCountdown + "s";
		s.roadTimerText.size = 18;
		s.roadTimerText.color = "#ffff00"; // Bright yellow for visibility
		s.roadTimerText.weight = "bold";
		s.roadTimerText.filters = [
			new LDropShadowFilter(null, null, "rgba(0,0,0,0.8)", 5), // Dark background
			new LDropShadowFilter(null, null, "#ffff00", 15) // Yellow glow
		];
		s.roadTimerText.x = (LGlobal.width - s.roadTimerText.getWidth()) * 0.5;
		s.roadTimerText.y = 30; // Position at TOP to avoid overlap
		s.timerLayer.addChild(s.roadTimerText);
	};

	ytOptionLayer.prototype.startCarTimer = function () {
		var s = this;
		// Use global CAR_TIMEOUT_ID
		CAR_TIMEOUT_ID = setInterval(function () {
			s.carCountdown--;
			s.carTimerText.text = "Auto-selecting in " + s.carCountdown + "s";
			s.carTimerText.x = (LGlobal.width - s.carTimerText.getWidth()) * 0.5;
			
			if (s.carCountdown <= 0) {
				clearInterval(CAR_TIMEOUT_ID);
				CAR_TIMEOUT_ID = null;
				
				console.log("Car timer expired - advancing to road selection");
				
				// ONLY timeout action calls transitionToRoadScreen and starts ROAD_TIMEOUT_ID
				s.transitionToRoadScreen();
			}
		}, 1000);
	};

	ytOptionLayer.prototype.startRoadTimer = function () {
		var s = this;
		// Use global ROAD_TIMEOUT_ID
		ROAD_TIMEOUT_ID = setInterval(function () {
			s.roadCountdown--;
			s.roadTimerText.text = "Starting race in " + s.roadCountdown + "s";
			s.roadTimerText.x = (LGlobal.width - s.roadTimerText.getWidth()) * 0.5;
			
			if (s.roadCountdown <= 0) {
				clearInterval(ROAD_TIMEOUT_ID);
				ROAD_TIMEOUT_ID = null;
				
				console.log("Road timer expired - starting game with:", selectedCarName, selectedRoadName);
				
				// ONLY timeout action calls startGame
				s.startGameWithSelections();
			}
		}, 1000);
	};

	// Visual state management for car selection - ENFORCED UNIVERSAL DE-SELECTION
	ytOptionLayer.prototype.updateCarVisualSelection = function (selectedIndex) {
		var s = this;
		
		console.log("=== updateCarVisualSelection ===");
		console.log("Selected index:", selectedIndex);
		console.log("Total car buttons:", s.carOptionLayer.numChildren);
		
		// STEP 1: CRITICAL UNIVERSAL DE-SELECTION - Find ALL car buttons and remove highlight
		// Using parent container approach: equivalent to document.querySelectorAll('#car-list-container > *')
		console.log("STEP 1: Universal de-selection of ALL cars (visual function)");
		console.log("Car container has", s.carOptionLayer.numChildren, "children");
		
		// UNIVERSAL CLEANUP: Target ALL children in the car container
		var totalCarButtons = s.carOptionLayer.numChildren;
		for (var i = 0; i < totalCarButtons; i++) {
			var carBtn = s.carOptionLayer.getChildAt(i);
			
			if (!carBtn) {
				console.log("Warning: Visual car button", i, "is null/undefined");
				continue;
			}
			
			// FORCE reset to normal state (equivalent to removing .selected-item class)
			carBtn.alpha = 0.85;
			
			// COMPLETE filter removal - multiple approaches for safety
			if (carBtn.filters) {
				carBtn.filters.length = 0; // Clear array
			}
			carBtn.filters = null; // Complete removal
			carBtn.filters = []; // Ensure empty array
			
			// FORCE reset text to normal white - enhanced safety
			try {
				var contentLayer = null;
				var textField = null;
				
				// Enhanced navigation through nested structure
				if (carBtn.getChildAt && typeof carBtn.getChildAt === 'function') {
					contentLayer = carBtn.getChildAt(0);
					if (contentLayer && contentLayer.getChildAt && typeof contentLayer.getChildAt === 'function') {
						textField = contentLayer.getChildAt(1);
						if (textField && textField.color !== undefined) {
							// FORCE text reset
							textField.color = "white";
							
							// COMPLETE text filter removal
							if (textField.filters) {
								textField.filters.length = 0; // Clear array
							}
							textField.filters = null; // Complete removal
							textField.filters = [new LDropShadowFilter(null, null, "rgba(255,255,255,0.5)", 8)];
						}
					}
				}
			} catch (ex) {
				console.log("Visual text reset error for button", i, ":", ex.message);
			}
		}
		console.log("Visual universal de-selection complete - processed", totalCarButtons, "car buttons");
		
		// STEP 2: Apply highlight to ONLY the selected car
		if (selectedIndex >= 0 && selectedIndex < s.carOptionLayer.numChildren) {
			console.log("STEP 2: Applying highlight to car", selectedIndex);
			var selectedBtn = s.carOptionLayer.getChildAt(selectedIndex);
			
			// Force highlight application
			selectedBtn.alpha = 1.0;
			selectedBtn.filters = null; // Clear first
			selectedBtn.filters = [
				new LDropShadowFilter(null, null, "#ffcc00", 20), // Gold glow
				new LDropShadowFilter(null, null, "#f0a500", 15)  // Inner gold glow
			];
			
			// Force text color to gold
			try {
				if (selectedBtn.getChildAt && selectedBtn.getChildAt(0)) {
					var contentLayer = selectedBtn.getChildAt(0);
					if (contentLayer && contentLayer.getChildAt && contentLayer.getChildAt(1)) {
						var textField = contentLayer.getChildAt(1);
						if (textField && textField.color) {
							textField.color = "#ffcc00"; // Gold text
							textField.filters = null; // Clear first
							textField.filters = [
								new LDropShadowFilter(null, null, "#ffcc00", 20), // Gold text glow
								new LDropShadowFilter(null, null, "#f0a500", 10)  // Inner glow
							];
						}
					}
				}
			} catch (ex) {
				console.log("Visual text highlight error:", ex.message);
			}
			
			console.log("Car", selectedIndex, "highlighted with enforced universal de-selection");
		}
		console.log("=== updateCarVisualSelection COMPLETE ===");
	};

	// Visual state management for road selection - ENFORCED UNIVERSAL DE-SELECTION
	ytOptionLayer.prototype.updateRoadVisualSelection = function (selectedIndex) {
		var s = this;
		
		console.log("=== updateRoadVisualSelection ===");
		console.log("Selected index:", selectedIndex);
		console.log("Total road buttons:", s.placeOptionLayer.numChildren);
		
		// STEP 1: CRITICAL UNIVERSAL DE-SELECTION - Find ALL road buttons and remove highlight
		// Using parent container approach: equivalent to document.querySelectorAll('#road-list-container > *')
		console.log("STEP 1: Universal de-selection of ALL roads (visual function)");
		console.log("Road container has", s.placeOptionLayer.numChildren, "children");
		
		// UNIVERSAL CLEANUP: Target ALL children in the road container
		var totalRoadButtons = s.placeOptionLayer.numChildren;
		for (var i = 0; i < totalRoadButtons; i++) {
			var roadBtn = s.placeOptionLayer.getChildAt(i);
			
			if (!roadBtn) {
				console.log("Warning: Visual road button", i, "is null/undefined");
				continue;
			}
			
			// FORCE reset to normal state (equivalent to removing .selected-item class)
			roadBtn.alpha = 0.85;
			
			// COMPLETE filter removal - multiple approaches for safety
			if (roadBtn.filters) {
				roadBtn.filters.length = 0; // Clear array
			}
			roadBtn.filters = null; // Complete removal
			roadBtn.filters = []; // Ensure empty array
			
			// FORCE reset text to normal white - enhanced safety
			try {
				var contentLayer = null;
				var textField = null;
				
				// Enhanced navigation through nested structure
				if (roadBtn.getChildAt && typeof roadBtn.getChildAt === 'function') {
					contentLayer = roadBtn.getChildAt(0);
					if (contentLayer && contentLayer.getChildAt && typeof contentLayer.getChildAt === 'function') {
						textField = contentLayer.getChildAt(1);
						if (textField && textField.color !== undefined) {
							// FORCE text reset
							textField.color = "white";
							
							// COMPLETE text filter removal
							if (textField.filters) {
								textField.filters.length = 0; // Clear array
							}
							textField.filters = null; // Complete removal
							textField.filters = [new LDropShadowFilter(null, null, "rgba(255,255,255,0.5)", 8)];
						}
					}
				}
			} catch (ex) {
				console.log("Visual text reset error for road button", i, ":", ex.message);
			}
		}
		console.log("Visual universal de-selection complete - processed", totalRoadButtons, "road buttons");
		
		// STEP 2: Apply highlight to ONLY the selected road
		if (selectedIndex >= 0 && selectedIndex < s.placeOptionLayer.numChildren) {
			console.log("STEP 2: Applying highlight to road", selectedIndex);
			var selectedBtn = s.placeOptionLayer.getChildAt(selectedIndex);
			
			// Force highlight application
			selectedBtn.alpha = 1.0;
			selectedBtn.filters = null; // Clear first
			selectedBtn.filters = [
				new LDropShadowFilter(null, null, "#ffcc00", 20), // Gold glow
				new LDropShadowFilter(null, null, "#f0a500", 15)  // Inner gold glow
			];
			
			// Force text color to gold
			try {
				if (selectedBtn.getChildAt && selectedBtn.getChildAt(0)) {
					var contentLayer = selectedBtn.getChildAt(0);
					if (contentLayer && contentLayer.getChildAt && contentLayer.getChildAt(1)) {
						var textField = contentLayer.getChildAt(1);
						if (textField && textField.color) {
							textField.color = "#ffcc00"; // Gold text
							textField.filters = null; // Clear first
							textField.filters = [
								new LDropShadowFilter(null, null, "#ffcc00", 20), // Gold text glow
								new LDropShadowFilter(null, null, "#f0a500", 10)  // Inner glow
							];
						}
					}
				}
			} catch (ex) {
				console.log("Visual text highlight error:", ex.message);
			}
			
			console.log("Road", selectedIndex, "highlighted with enforced universal de-selection");
		}
		console.log("=== updateRoadVisualSelection COMPLETE ===");
	};

	// Transition to road screen (ONLY called by CAR_TIMEOUT_ID expiration)
	ytOptionLayer.prototype.transitionToRoadScreen = function () {
		var s = this;
		// Clear any remaining car timer
		if (CAR_TIMEOUT_ID) {
			clearInterval(CAR_TIMEOUT_ID);
			CAR_TIMEOUT_ID = null;
		}
		s.timerLayer.removeAllChild();
		
		console.log("Transitioning to road selection with car:", selectedCarName);
		
		// Reset selection flag for road selection
		selectionConfirmed = false;
		
		// Proceed to road selection and start ROAD_TIMEOUT_ID
		s.addPlaceOption();
	};

	// Start game with final selections (ONLY called by ROAD_TIMEOUT_ID expiration)
	ytOptionLayer.prototype.startGameWithSelections = function () {
		var s = this;
		
		console.log("=== ROAD TIMEOUT ACTION - STARTING GAME ===");
		console.log("Selected car:", selectedCarName, "at index:", selectedCarIndex);
		console.log("Selected road:", selectedRoadName, "at index:", selectedRoadIndex);
		
		// 1. Clear any remaining road timer
		if (ROAD_TIMEOUT_ID) {
			clearInterval(ROAD_TIMEOUT_ID);
			ROAD_TIMEOUT_ID = null;
		}
		
		// 2. Ensure UI Removal - Hide Road Selection UI
		s.timerLayer.removeAllChild();
		console.log("Road Selection UI removed");
		
		// 3. Ensure canvas/container visibility
		var canvas = document.querySelector('canvas');
		if (canvas) {
			canvas.style.display = 'block';
			canvas.style.visibility = 'visible';
			console.log("Canvas visibility ensured");
		}
		
		var container = document.getElementById('mylegend');
		if (container) {
			container.style.display = 'block';
			container.style.visibility = 'visible';
			console.log("Container visibility ensured");
		}
		
		// 4. Convert selections to game-compatible format
		// Car parameter: use the data value from carInfoList
		var carIndex = s.carInfoList[selectedCarIndex].data;
		
		// Road parameter: use the data value from placeInfoList  
		var roadData = s.placeInfoList[selectedRoadIndex].data;
		
		console.log("Final game parameters - Car Index:", carIndex, "Road Data:", roadData);
		console.log("Car info:", s.carInfoList[selectedCarIndex]);
		console.log("Road info:", s.placeInfoList[selectedRoadIndex]);
		
		// 5. Ensure music continues playing
		musicManager.play();
		
		// 6. Remove selection interface completely
		s.remove();
		console.log("Selection interface removed");
		
		// 7. CRITICAL: Start the game with confirmed variables
		console.log("Calling addGameInterface with:", carIndex, roadData);
		addGameInterface(carIndex, roadData);
		
		console.log("=== GAME START SEQUENCE COMPLETE ===");
	};



	return ytOptionLayer;
})();