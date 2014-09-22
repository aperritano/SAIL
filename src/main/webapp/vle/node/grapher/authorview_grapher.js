/**
 * Sets the GrapherNode type as an object of this view
 * 
 * TODO: rename GrapherNode
 * 
 * @constructor
 */
View.prototype.GrapherNode = {};

/*
 * Add the name of the common component that this step will use. The
 * common components will be handled by the authoring tool. You will
 * need to create div elements with the appropriate id for the
 * authoring tool to insert the component into. Any additional custom
 * authoring components specific to your step type will be written 
 * by you in the generatePage() function. You may leave the array
 * empty if you are not using any common components.
 * 
 * Here are the available common components
 * 'Prompt'
 * 'LinkTo'
 * 'StudentResponseBoxSize'
 * 'RichTextEditorToggle'
 * 'StarterSentenceAuthoring'
 * 
 * If you use a common components, you must create a div with the
 * appropriate id, here are the respective ids
 * 'promptContainer'
 * (LinkTo does not require a div)
 * 'studentResponseBoxSizeContainer'
 * 'richTextEditorToggleContainer'
 * 'starterSentenceAuthoringContainer'
 * 
 * 
 * TODO: rename GrapherNode
 */
View.prototype.GrapherNode.commonComponents = ['StudentResponseBoxSize', 'StarterSentenceAuthoring', 'Prompt', 'LinkTo'];

/**
 * Generates the authoring page. This function will create the authoring
 * components such as textareas, radio buttons, check boxes, etc. that
 * authors will use to author the step. For example if the step has a
 * text prompt that the student will read, this function will create
 * a textarea that will allow the author to type the text that the
 * student will see. You will also need to populate the textarea with
 * the pre-existing prompt if the step has been authored before.
 * 
 * TODO: rename GrapherNode
 */
View.prototype.GrapherNode.generatePage = function(view){
	this.view = view;
	this.content = this.view.activeContent.getContentJSON();
	
	var xLabel = '';
	if(this.content.graphParams.xlabel != null) {
		xLabel = this.content.graphParams.xlabel;
	}

	if(this.content.graphParams.xUnits != null) {
		xUnits = this.content.graphParams.xUnits;
	}
	
	var xMin = '';
	if(this.content.graphParams.xmin != null) {
		xMin = this.content.graphParams.xmin;
	}
	
	var xMax = '';
	if(this.content.graphParams.xmax != null) {
		xMax = this.content.graphParams.xmax;
	}
	
	var yLabel = '';
	if(this.content.graphParams.ylabel != null) {
		yLabel = this.content.graphParams.ylabel;
	}

	if(this.content.graphParams.yUnits != null) {
		yUnits = this.content.graphParams.yUnits;
	}
	
	var yMin = '';
	if(this.content.graphParams.ymin != null) {
		yMin = this.content.graphParams.ymin;
	}
	
	var yMax = '';
	if(this.content.graphParams.ymax != null) {
		yMax = this.content.graphParams.ymax;
	}
	
	var parent = document.getElementById('dynamicParent');
	
	//wipe out old
	parent.removeChild(document.getElementById('dynamicPage'));
	
	//create new
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	var promptText = document.createTextNode("Prompt for Student:");
	var linesText = document.createTextNode("Size of Student Response Box (# rows):");
	var richTextEditorText = document.createTextNode("Use Rich Text Editor");
	
	pageDiv.appendChild(promptText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createElement(document, 'div', {id: 'promptContainer'}));
	pageDiv.appendChild(createBreak());
	
	//get the graph title value
	var graphTitleValue = "";
	if(this.content.graphTitle != null) {
		graphTitleValue = this.content.graphTitle;
	}
	
	//create the graph title input
	var graphTitleText = document.createTextNode("Graph Title:");
	var graphTitleInput = createElement(document, 'input', {type: 'input', id: 'graphTitleInput', name: 'graphTitleInput', value: graphTitleValue, size: 60, onchange: 'eventManager.fire("grapherUpdateGraphTitle")'});
	
	//insert the graph title input
	pageDiv.appendChild(graphTitleText);
	pageDiv.appendChild(graphTitleInput);
	pageDiv.appendChild(createBreak());
	
	// set dimensions of graph
	var graphDimsText = document.createTextNode("Set width and height of graph element (leave blank for default):");
	var width = typeof this.content.graphParams.width !== "undefined" ? this.content.graphParams.width : "";
	var widthText = document.createTextNode('Width: ');
	var widthInput = createElement(document, 'input', {type: 'input', id: 'widthInput', name: 'widthInput', value: width, size:1, onchange: 'eventManager.fire("grapherUpdateWidth")'});
	var height = typeof this.content.graphParams.height !== "undefined" ? this.content.graphParams.height : "";
	var heightText = document.createTextNode('Height: ');
	var heightInput = createElement(document, 'input', {type: 'input', id: 'heightInput', name: 'heightInput', value: height, size:1, onchange: 'eventManager.fire("grapherUpdateHeight")'});
	
	//insert the x axis graph parameters
	pageDiv.appendChild(graphDimsText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(widthText);
	pageDiv.appendChild(widthInput);
	pageDiv.appendChild(heightText);
	pageDiv.appendChild(heightInput);
	pageDiv.appendChild(createBreak());
	
	//create the x axis authoring elements
	var xAxisText = document.createTextNode('X Axis Name: ');
	var xAxisInput = createElement(document, 'input', {type: 'input', id: 'xAxisNameInput', name: 'xAxisNameInput', value: xLabel, size:5, onchange: 'eventManager.fire("grapherUpdateXAxisName")'});
	var xUnitsText = document.createTextNode('X Axis Units: ');
	var xUnitsInput = createElement(document, 'input', {type: 'input', id: 'xUnitsInput', name: 'xLabelInput', value: xUnits, size:5, onchange: 'eventManager.fire("grapherUpdateXUnits")'});
	var xMinText = document.createTextNode('Min X: ');
	var xMinInput = createElement(document, 'input', {type: 'input', id: 'xMinInput', name: 'xMinInput', value: xMin, size:1, onchange: 'eventManager.fire("grapherUpdateXMin")'});
	var xMaxText = document.createTextNode('Max X: ');
	var xMaxInput = createElement(document, 'input', {type: 'input', id: 'xMaxInput', name: 'xMaxInput', value: xMax, size:1, onchange: 'eventManager.fire("grapherUpdateXMax")'});
	
	//insert the x axis graph parameters
	pageDiv.appendChild(xAxisText);
	pageDiv.appendChild(xAxisInput);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(xUnitsText);
	pageDiv.appendChild(xUnitsInput);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(xMinText);
	pageDiv.appendChild(xMinInput);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(xMaxText);
	pageDiv.appendChild(xMaxInput);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	
	//create the y axis authoring elements
	var yAxisText = document.createTextNode('Y Axis Name: ');
	var yAxisInput = createElement(document, 'input', {type: 'input', id: 'yAxisNameInput', name: 'yAxisNameInput', value: yLabel, size:5, onchange: 'eventManager.fire("grapherUpdateYAxisName")'});
	var yUnitsText = document.createTextNode('Y Axis Units: ');
	var yUnitsInput = createElement(document, 'input', {type: 'input', id: 'yUnitsInput', name: 'yLabelInput', value: yUnits, size:5, onchange: 'eventManager.fire("grapherUpdateYUnits")'});
	var yMinText = document.createTextNode('Min Y: ');
	var yMinInput = createElement(document, 'input', {type: 'input', id: 'yMinInput', name: 'yMinInput', value: yMin, size:1, onchange: 'eventManager.fire("grapherUpdateYMin")'});
	var yMaxText = document.createTextNode('Max Y: ');
	var yMaxInput = createElement(document, 'input', {type: 'input', id: 'yMaxInput', name: 'yMaxInput', value: yMax, size:1, onchange: 'eventManager.fire("grapherUpdateYMax")'});
	
	//insert the y axis graph parameters
	pageDiv.appendChild(yAxisText);
	pageDiv.appendChild(yAxisInput);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(yUnitsText);
	pageDiv.appendChild(yUnitsInput);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(yMinText);
	pageDiv.appendChild(yMinInput);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(yMaxText);
	pageDiv.appendChild(yMaxInput);
	pageDiv.appendChild(createBreak());
	
	//create the check box to allow the student to change the axis limits
	var allowUpdateAxisRangeCheckBox = createElement(document, 'input', {id: 'allowUpdateAxisRangeCheckBox', type: 'checkbox', onclick: 'eventManager.fire("grapherUpdateAllowUpdateAxisRange")'});
	var allowUpdateAxisRangeText = document.createTextNode("Allow Student to Change Axis Limits");
	//populate the allow student to change axis limit check box
	if(this.content.graphParams.allowUpdateAxisRange) {
		allowUpdateAxisRangeCheckBox.checked = true;
	}
	
	//insert the allow student to change axis limit check box
	pageDiv.appendChild(allowUpdateAxisRangeCheckBox);
	pageDiv.appendChild(allowUpdateAxisRangeText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	
	// everything below will be added to its own div
	var predictionDiv = this.predictionDiv = createElement(document, 'div', {id: 'predictionDiv', style:'background-color:#eef;'});
	var predictionDivTitle = createElement(document, 'h2', {id: 'predictionDivTitle'});
	predictionDivTitle.appendChild(document.createTextNode("Construction Settings"));
	
	//create the check box to enable create prediction
	var enableCreatePredictionCheckBox = createElement(document, 'input', {id: 'enableCreatePredictionCheckBox', type: 'checkbox', onclick: 'eventManager.fire("grapherUpdateEnableCreatePrediction")'});
	var enableCreatePredictionText = document.createTextNode("Enable Create Prediction");
		
	// variables to make prediction easier - jv
	var easyPredictionCheckBox = createElement(document, 'input', {id: 'easyPredictionCheckBox', type: 'checkbox', onclick: 'eventManager.fire("grapherUpdateEasyPrediction")'});
	var easyPredictionText = document.createTextNode('Use easy prediction settings');
		
	pageDiv.appendChild(predictionDiv);
	predictionDiv.appendChild(predictionDivTitle);
	predictionDiv.appendChild(enableCreatePredictionCheckBox);
	predictionDiv.appendChild(enableCreatePredictionText);
	predictionDiv.appendChild(createBreak());
	predictionDiv.appendChild(easyPredictionCheckBox);
	predictionDiv.appendChild(easyPredictionText);
	predictionDiv.appendChild(createBreak());
	
	// in authoring you can add multiple series. Each series has a label, color, and a set of predefined data (which could be empty, of course)	
	if (typeof this.content.seriesLabels === "undefined" || this.content.seriesLabels === null){
		this.content.seriesLabels = [""];
	} 

	if (typeof this.content.seriesColors === "undefined" || this.content.seriesColors === null){
		this.content.seriesColors = [""];
	} 
	
	if (typeof this.content.seriesData === "undefined" || this.content.seriesData === null){
		this.content.seriesData = [];
	}
	this.seriesDivs = [];
	this.pointsDivs = [];
	
	var allSeriesDiv = createElement(document, 'div', {id: 'allSeriesDiv'});
	predictionDiv.appendChild(allSeriesDiv);
	
	for (var index = 0; index < this.content.seriesLabels.length; index++){
		var seriesDiv = createElement(document, 'div', {id: 'seriesDiv-'+index, style:'border-style:solid;border-radius:10px;border-color:#444;border-width:1px;padding-left: 5px;'});
		this.seriesDivs.push(seriesDiv);
		
		var seriesLabelText = document.createTextNode('Series Name:');
		var seriesLabel = createElement(document, 'input', {type: 'input', id: 'seriesLabelInput-'+index, name: 'seriesLabelInput-'+index, value: this.content.seriesLabels[index], size:10, onchange: 'eventManager.fire("grapherUpdateSeriesLabel", '+index+')'});
		
		var seriesColorText = document.createTextNode('Color:');
		var seriesColor = createElement(document, 'input', {type: 'input', id: 'seriesColorInput-'+index, name: 'seriesColorInput-'+index, value: this.content.seriesColors[index], size:10, onchange: 'eventManager.fire("grapherUpdateSeriesColor", '+index+')'});
		
		// put points on its own div
		var pointsDiv = createElement(document, 'span', {id: 'pointsDiv-'+index, style:'background-color:#efe;'});
		this.pointsDivs.push(pointsDiv);
		
		// this series should have an associated data structure of the form
		// [{label:"name", color:"blue", showPoint:true, showLines:true, {x:[0,1,2], y:[4,5,6], fixed:[0,0,1]}, {...}]
		if (index < this.content.seriesData.length && typeof this.content.seriesData[index].points !== "undefined" && this.content.seriesData[index].points.length > 0 ){
			for (var pindex = 0; pindex < this.content.seriesData[index].points.length; pindex++){
				var openingParens = document.createTextNode('(');
				var seriesX = createElement(document, 'input', {type: 'input', id: 'seriesXInput-'+index+"-"+pindex, name: 'seriesXInput-'+index+"-"+pindex, value: this.content.seriesData[index].points[pindex].x, size:1, onchange: 'eventManager.fire("grapherUpdateSeriesX", ['+index+","+pindex+'])'});
				var seriesY = createElement(document, 'input', {type: 'input', id: 'seriesYInput-'+index+"-"+pindex, name: 'seriesYInput-'+index+"-"+pindex, value: this.content.seriesData[index].points[pindex].y, size:1, onchange: 'eventManager.fire("grapherUpdateSeriesY", ['+index+","+pindex+'])'});
				var seriesFixed = createElement(document, 'input', {type: 'input', id: 'seriesFixedInput-'+index+"-"+pindex, name: 'seriesFixedInput-'+index+"-"+pindex, value: this.content.seriesData[index].points[pindex].fixed, size:1, onchange: 'eventManager.fire("grapherUpdateSeriesFixed", ['+index+","+pindex+'])'});
				var closeParens = document.createTextNode(') ');
				pointsDiv.appendChild(openingParens);
				pointsDiv.appendChild(seriesX);
				pointsDiv.appendChild(seriesY);
				pointsDiv.appendChild(seriesFixed);
				pointsDiv.appendChild(closeParens);
			}
		} else if (index >= this.content.seriesData.length || typeof this.content.seriesData[index].points === "undefined"){
			// create seriesData if it doesn't exist
			this.content.seriesData[index] = {id:"", color:"", showLines:true, showPoints:true, editable:true, points:[]};
		}
				
		// place a button for "new point" here
		var newPointButton = createElement(document, 'input', {type: 'button', id: 'newCustomPoint-'+index, name: 'newCustomPoint-'+index, value: 'New Point (x, y, fixed)', onclick: 'eventManager.fire("grapherNewCustomPoint", '+index+')'});
		// add options for series
		var showPointsCheckBox = createElement(document, 'input', {id: 'showPointsCheckBox-'+index, type: 'checkbox', onclick: 'eventManager.fire("grapherUpdateShowPoints", '+index+')'});
		if (this.content.seriesData[index].showPoints){ showPointsCheckBox.checked = true; } else {showPointsCheckBox.checked = false;}
		var showPointsText = document.createTextNode("Show points");
		var showLinesCheckBox = createElement(document, 'input', {id: 'showLinesCheckBox-'+index, type: 'checkbox', onclick: 'eventManager.fire("grapherUpdateShowLines", '+index+')'});
		if (this.content.seriesData[index].showLines){ showLinesCheckBox.checked = true; } else {showLinesCheckBox.checked = false;}
		var showLinesText = document.createTextNode("Show lines");
		var editableSeriesCheckBox = createElement(document, 'input', {id: 'editableSeriesCheckBox-'+index, type: 'checkbox', onclick: 'eventManager.fire("grapherUpdateEditableSeries", '+index+')'});
		if (this.content.seriesData[index].editable){ editableSeriesCheckBox.checked = true; } else {editableSeriesCheckBox.checked = false;}
		var editableSeriesText = document.createTextNode("Editable");
		
		allSeriesDiv.appendChild(seriesDiv);
		seriesDiv.appendChild(seriesLabelText);
		seriesDiv.appendChild(seriesLabel);
		seriesDiv.appendChild(seriesColorText);
		seriesDiv.appendChild(seriesColor);
		seriesDiv.appendChild(createBreak());
		seriesDiv.appendChild(pointsDiv);
		seriesDiv.appendChild(newPointButton);
		seriesDiv.appendChild(createBreak());
		seriesDiv.appendChild(showPointsCheckBox);
		seriesDiv.appendChild(showPointsText);
		seriesDiv.appendChild(showLinesCheckBox);
		seriesDiv.appendChild(showLinesText);
		seriesDiv.appendChild(editableSeriesCheckBox);
		seriesDiv.appendChild(editableSeriesText);
		seriesDiv.appendChild(createBreak());
		allSeriesDiv.appendChild(createBreak());
	}
	
	// new series button below all series
	var newSeriesButton = createElement(document, 'input', {type: 'button', id: 'newCustomSeriesButton', name: 'newCustomSeriesButton', value: 'New Series', onclick: 'eventManager.fire("grapherNewCustomSeries")'});
	
	predictionDiv.appendChild(newSeriesButton);

	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	
	//populate the create prediction check box
	if(this.content.createPrediction) {
		enableCreatePredictionCheckBox.checked = true;
	}
	
	//populate the easy prediction checkbox
	if(this.content.enableEasyPrediction) {
		easyPredictionCheckBox.checked = true;
		this.updateEasyPrediction(true);
	} else {
		this.updateEasyPrediction(false);
	}

	//populate the easy prediction checkbox
	if(this.content.useCustomSeries) {
		customSeriesCheckBox.checked = true;
	}
	
	//create the check box to require prediction before enter
	var requirePredictionBeforeEnterCheckBox = createElement(document, 'input', {id: 'requirePredictionBeforeEnterCheckBox', type: 'checkbox', onclick: 'eventManager.fire("grapherUpdateRequirePredictionBeforeEnter")'});
	var requirePredictionBeforeEnterText = document.createTextNode('Require Prediction Before Enter (You must specify a "Show Previous Work" step for this to work)');
	
	//insert the create prediction and enable sensor checkboxes
	pageDiv.appendChild(requirePredictionBeforeEnterCheckBox);
	pageDiv.appendChild(requirePredictionBeforeEnterText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	
	//populate the require prediction before enter checkbox
	if(this.content.requirePredictionBeforeEnter) {
		requirePredictionBeforeEnterCheckBox.checked = true;
	}
	
	//create the check box to allow the student to change the axis limits
	var allowAnnotationsCheckBox = createElement(document, 'input', {id: 'allowAnnotationsCheckBox', type: 'checkbox', onclick: 'eventManager.fire("grapherUpdateAllowAnnotations")'});
	var allowAnnotationsText = document.createTextNode("Allow Student to Annotate Points");
	
	//insert the allow student to change axis limit check box
	pageDiv.appendChild(allowAnnotationsCheckBox);
	pageDiv.appendChild(allowAnnotationsText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	
	//populate the allow student to change axis limit check box
	if(this.content.allowAnnotations) {
		allowAnnotationsCheckBox.checked = true;
	}
	
	//create the show graph options elements
	var showGraphOptionsText = document.createTextNode(' Show Graph Options');
	var showGraphOptionsCheckBox = createElement(document, 'input', {type: 'checkbox', id: 'showGraphOptions', onclick: 'eventManager.fire("grapherUpdateShowGraphOptions")'});
	
	//create the show velocity check box
	var showVelocityCheckBox = createElement(document, 'input', {type: 'checkbox', id: 'showVelocityCheckBox', onclick: 'eventManager.fire("grapherUpdateShowVelocity")'});
	var showVelocityText = document.createTextNode('Show Velocity ("Show Graph Options" must be checked)');
	
	//create the show acceleration check box
	var showAccelerationCheckBox = createElement(document, 'input', {type: 'checkbox', id: 'showAccelerationCheckBox', onclick: 'eventManager.fire("grapherUpdateShowAcceleration")'});
	var showAccelerationText = document.createTextNode('Show Acceleration ("Show Graph Options" must be checked)');
	
	//insert the show graph options
	pageDiv.appendChild(showGraphOptionsText);
	pageDiv.appendChild(showGraphOptionsCheckBox);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(showVelocityCheckBox);
	pageDiv.appendChild(showVelocityText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(showAccelerationCheckBox);
	pageDiv.appendChild(showAccelerationText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	
	//populate the show velocity checkbox from the content
	if(this.content.showVelocity) {
		showVelocityCheckBox.checked = true;
	}

	//populate the show accerlation checkbox from the content	
	if(this.content.showAcceleration) {
		showAccelerationCheckBox.checked = true;
	}
	
	pageDiv.appendChild(createElement(document, 'div', {id: 'studentResponseBoxSizeContainer'}));
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	//pageDiv.appendChild(createElement(document, 'div', {id: 'richTextEditorToggleContainer'}));
	//pageDiv.appendChild(createBreak());
	//pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createElement(document, 'div', {id: 'starterSentenceAuthoringContainer'}));
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());

	//display any additional text entry areas for peer/teacher review if necessary
	if(this.view.activeNode.peerReview) {
		pageDiv.appendChild(this.generatePeerReview(this.view.activeNode.peerReview));
		pageDiv.appendChild(createBreak());
		pageDiv.appendChild(createBreak());		
	} else if(this.view.activeNode.teacherReview) {
		pageDiv.appendChild(this.generateTeacherReview(this.view.activeNode.teacherReview));
		pageDiv.appendChild(createBreak());
		pageDiv.appendChild(createBreak());
	}

	//populate the checkbox if necessary
	if(this.content.showGraphOptions) {
		showGraphOptionsCheckBox.checked = true;
	}

	parent.appendChild(pageDiv);
};

/**
 * Get the array of common components which is an array with
 * string elements being the name of the common component
 * 
 * TODO: rename GrapherNode
 */
View.prototype.GrapherNode.getCommonComponents = function() {
	return this.commonComponents;
};

/**
 * Generates and returns the lines element for the html
 * and set the value from the content.
 */
View.prototype.GrapherNode.generateLines = function(){
	return createElement(document, 'input', {type: 'text', id: 'linesInput', value: this.content.assessmentItem.interaction.expectedLines, onkeyup: 'eventManager.fire("openResponseLinesChanged")'});
};


/**
 * Generates the starter sentence input options for this open response
 */
View.prototype.GrapherNode.generateStarter = function(){
	//create div for starterSentence options
	var starterDiv = createElement(document, 'div', {id: 'starterDiv'});
	
	//create starter sentence options
	var noStarterInput = createElement(document, 'input', {type: 'radio', name: 'starterRadio', onclick: 'eventManager.fire("openResponseStarterOptionChanged")', value: '0'});
	var starterOnClickInput = createElement(document, 'input', {type: 'radio', name: 'starterRadio', onclick: 'eventManager.fire("openResponseStarterOptionChanged")', value: '1'});
	var starterImmediatelyInput = createElement(document, 'input', {type: 'radio', name: 'starterRadio', onclick: 'eventManager.fire("openResponseStarterOptionChanged")', value: '2'});
	var starterSentenceInput = createElement(document, 'textarea', {id: 'starterSentenceInput', cols: '60', rows: '4', wrap: 'soft', onchange: 'eventManager.fire("openResponseStarterSentenceUpdated")'});
	var noStarterInputText = document.createTextNode('Do not use starter sentence');
	var starterOnClickInputText = document.createTextNode('Starter sentence available upon request');
	var starterImmediatelyInputText = document.createTextNode('Starter sentence shows immediately');
	var starterSentenceText = document.createTextNode('Starter sentence: ');
	
	starterDiv.appendChild(noStarterInput);
	starterDiv.appendChild(noStarterInputText);
	starterDiv.appendChild(createBreak());
	starterDiv.appendChild(starterOnClickInput);
	starterDiv.appendChild(starterOnClickInputText);
	starterDiv.appendChild(createBreak());
	starterDiv.appendChild(starterImmediatelyInput);
	starterDiv.appendChild(starterImmediatelyInputText);
	starterDiv.appendChild(createBreak());
	starterDiv.appendChild(starterSentenceText);
	starterDiv.appendChild(starterSentenceInput);
	
	//set value of textarea
	starterSentenceInput.value = this.content.starterSentence.sentence;
	
	//set appropriate radio button and enable/disable textarea
	var displayOption = this.content.starterSentence.display;
	
	if(displayOption=='0'){
		starterSentenceInput.disabled = true;
		noStarterInput.checked = true;
	} else if(displayOption=='1'){
		starterOnClickInput.checked = true;
	} else if(displayOption=='2'){
		starterImmediatelyInput.checked = true;
	};
	
	return starterDiv;
};

/**
 * Create a div the will display text areas for peer review attributes if necessary
 */
View.prototype.GrapherNode.generatePeerReview = function(peerReviewType) {
	var peerReviewDiv = createElement(document, 'div', {id: 'peerReviewDiv'});
	
	if(peerReviewType == 'start') {
		//do nothing
	} else if(peerReviewType == 'annotate') {
		//create the label and text area for the percentage trigger
		var peerReviewPercentageTriggerText = document.createTextNode('Enter the percentage of the class needed to open this step: ');
		var peerReviewPercentageTrigger = createElement(document, 'input', {type: 'text', id: 'peerReviewOpenPercentageTriggerInput', value: this.content.openPercentageTrigger, onkeyup: 'eventManager.fire("openResponsePeerReviewPercentageTriggerUpdated")'});

		//add the label and text area to the div that we will return
		peerReviewDiv.appendChild(peerReviewPercentageTriggerText);
		peerReviewDiv.appendChild(peerReviewPercentageTrigger);
		peerReviewDiv.appendChild(createBreak());
		
		//create the label and text area for the number trigger
		var peerReviewNumberTriggerText = document.createTextNode('Enter the number of students in the class needed to open this step: ');
		var peerReviewNumberTrigger = createElement(document, 'input', {type: 'text', id: 'peerReviewOpenNumberTriggerInput', value: this.content.openNumberTrigger, onkeyup: 'eventManager.fire("openResponsePeerReviewNumberTriggerUpdated")'});

		//add the label and text area to the div that we will return
		peerReviewDiv.appendChild(peerReviewNumberTriggerText);
		peerReviewDiv.appendChild(peerReviewNumberTrigger);
		peerReviewDiv.appendChild(createBreak());
		
		//create label and text area for the authored work
		var peerReviewAuthoredWorkText = document.createTextNode('Enter the canned work: ');
		var peerReviewAuthoredWorkInput = createElement(document, 'textarea', {id: 'peerReviewAuthoredWorkInput', cols: '60', rows: '4', wrap: 'soft', onchange: 'eventManager.fire("openResponsePeerReviewAuthoredWorkUpdated")'});
		
		//add the label and text area to the div that we will return
		peerReviewDiv.appendChild(peerReviewAuthoredWorkText);
		peerReviewDiv.appendChild(peerReviewAuthoredWorkInput);
		
		//set any previously set values for the authoredWork
		peerReviewAuthoredWorkInput.value = this.content.authoredWork;
	} else if(peerReviewType == 'revise') {
		//create label and text area
		var peerReviewAuthoredReviewText = document.createTextNode('Enter the canned review: ');
		var peerReviewAuthoredReviewInput = createElement(document, 'textarea', {id: 'peerReviewAuthoredReviewInput', cols: '60', rows: '4', wrap: 'soft', onchange: 'eventManager.fire("openResponsePeerReviewAuthoredReviewUpdated")'});
		
		//add the label and text area to the div that we will return
		peerReviewDiv.appendChild(peerReviewAuthoredReviewText);
		peerReviewDiv.appendChild(peerReviewAuthoredReviewInput);
		
		//set any previously set values for the authoredWork
		peerReviewAuthoredReviewInput.value = this.content.authoredReview;
	}
	
	return peerReviewDiv;
};

/**
 * Create a div the will display text areas for teacher review attributes if necessary
 */
View.prototype.GrapherNode.generateTeacherReview = function(peerReviewType) {
	var peerReviewDiv = createElement(document, 'div', {id: 'peerReviewDiv'});
	
	if(peerReviewType == 'start') {
		//do nothing
	} else if(peerReviewType == 'annotate') {
		//create label and text area
		var peerReviewAuthoreWorkText = document.createTextNode('Enter the canned work: ');
		var peerReviewAuthoredWorkInput = createElement(document, 'textarea', {id: 'peerReviewAuthoredWorkInput', cols: '60', rows: '4', wrap: 'soft', onchange: 'eventManager.fire("openResponsePeerReviewAuthoredWorkUpdated")'});
		
		//add the label and text area to the div that we will return
		peerReviewDiv.appendChild(peerReviewAuthoreWorkText);
		peerReviewDiv.appendChild(peerReviewAuthoredWorkInput);
		
		//set any previously set values for the authoredWork
		peerReviewAuthoredWorkInput.value = this.content.authoredWork;
	} else if(peerReviewType == 'revise') {
		//do nothing
	}
	
	return peerReviewDiv;
};

/**
 * Updates this content when the starter sentence option has changed.
 */
View.prototype.GrapherNode.starterChanged = function(){
	var options = document.getElementsByName('starterRadio');
	var optionVal;
	
	/* get the checked option and update the content's starter sentence attribute */
	for(var q=0;q<options.length;q++){
		if(options[q].checked){
			this.content.starterSentence.display = options[q].value;
			if(options[q].value=='0'){
				document.getElementById('starterSentenceInput').disabled = true;
			} else {
				document.getElementById('starterSentenceInput').disabled = false;
			};
		};
	};
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates content with text in starter sentence textarea
 */
View.prototype.GrapherNode.starterUpdated = function(){
	/* update content */
	this.content.starterSentence.sentence = document.getElementById('starterSentenceInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Generates and returns an HTML Input Element of type checkbox 
 * used to determine whether a rich text editor should be used.
 */
View.prototype.GrapherNode.generateRichText = function(){
	var richTextChoice = createElement(document, 'input', {id: 'richTextChoice', type: 'checkbox', onclick: 'eventManager.fire("openResponseUpdateRichText")'});
	
	/* set whether this input is checked */
	richTextChoice.checked = this.content.isRichTextEditorAllowed;
	
	//disable the checkbox if the step is for a peer/teacher review sequence
	if(this.view.activeNode.peerReview || this.view.activeNode.teacherReview) {
		richTextChoice.disabled = true;
	}
	
	return richTextChoice;
};

/**
 * Updates the richtext option in the content and updates the preview page.
 */
View.prototype.GrapherNode.updateRichText = function(){
	this.content.isRichTextEditorAllowed = document.getElementById('richTextChoice').checked;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 * 
 * TODO: rename GrapherNode
 */
View.prototype.GrapherNode.updateContent = function(){
	/* update content object */
	this.view.activeContent.setContent(this.content);
};

/**
 * Updates the content with the value from the textarea
 */
View.prototype.GrapherNode.peerReviewAuthoredWorkUpdated = function(){
	this.content.authoredWork = document.getElementById('peerReviewAuthoredWorkInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the content with the value from the text input
 */
View.prototype.GrapherNode.peerReviewPercentageTriggerUpdated = function(){
	this.content.openPercentageTrigger = document.getElementById('peerReviewOpenPercentageTriggerInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the content with the value from the text input
 */
View.prototype.GrapherNode.peerReviewNumberTriggerUpdated = function(){
	this.content.openNumberTrigger = document.getElementById('peerReviewOpenNumberTriggerInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the content with the value from the textarea
 */
View.prototype.GrapherNode.peerReviewAuthoredReviewUpdated = function(){
	this.content.authoredReview = document.getElementById('peerReviewAuthoredReviewInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Populate the authoring textarea where the user types the prompt that
 * the student will read
 * 
 * TODO: rename GrapherNode
 */
View.prototype.GrapherNode.populatePrompt = function() {
	//get the prompt from the content and set it into the authoring textarea
	$('#promptInput').val(this.content.prompt);
};

/**
 * Updates the content's prompt to match that of what the user input
 */
View.prototype.GrapherNode.updatePrompt = function(){
	/* update content */
	var content = this.view.getRichTextContent('promptInput');
	
	this.content.prompt = content;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

View.prototype.GrapherNode.populateStudentResponseBoxSize = function() {
	$('#studentResponseBoxSizeInput').val(this.content.expectedLines);
};

/**
 * Updates the number of line elements for this open response to that
 * input by the user.
 */
View.prototype.GrapherNode.updateStudentResponseBoxSize = function(){
	/* update content */
	this.content.expectedLines = document.getElementById('studentResponseBoxSizeInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

View.prototype.GrapherNode.populateRichTextEditorToggle = function() {
	$('#richTextEditorToggleInput').attr('checked', this.content.isRichTextEditorAllowed);
};

View.prototype.GrapherNode.updateRichTextEditorToggle = function(){
	/* update content */
	this.content.isRichTextEditorAllowed = document.getElementById('richTextEditorToggleInput').checked;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

View.prototype.GrapherNode.populateStarterSentenceAuthoring = function() {
	var displayOption = this.content.starterSentence.display;
	
	$('input[name=starterRadio]').each(function() {
		if($(this).val() == displayOption) {
			$(this).attr('checked', true);
		}
	});
	
	if(displayOption == 2) {
		$('#starterSentenceAuthoringInput').val(this.content.starterSentence.sentence);		
	}
};

View.prototype.GrapherNode.updateStarterSentenceAuthoring = function(){
	/* update content */
	this.content.starterSentence.display = $('input[name=starterRadio]:checked').val();
	
	this.content.starterSentence.sentence = $('#starterSentenceAuthoringInput').val();
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the width of the 
 */
View.prototype.GrapherNode.updateWidth = function() {
	//get the x units and set it into the graph params
	this.content.graphParams.width = parseFloat($('#widthInput').val());
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the x label to the content
 */
View.prototype.GrapherNode.updateHeight = function() {
	//get the x units and set it into the graph params
	this.content.graphParams.height = parseFloat($('#heightInput').val());
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the x label to the content
 */
View.prototype.GrapherNode.updateXAxisName = function() {
	//get the x units and set it into the graph params
	this.content.graphParams.xlabel = $('#xAxisNameInput').val();
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the x units to the content
 */
View.prototype.GrapherNode.updateXUnits = function() {
	//get the x units and set it into the graph params
	this.content.graphParams.xUnits = $('#xUnitsInput').val();
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the min x value to the content
 */
View.prototype.GrapherNode.updateXMin = function() {
	//get the value the author input for the min x value
	var xMin = $('#xMinInput').val();
	
	if(xMin == null || xMin == '') {
		//if the author entered nothing we will set it to null
		xMin = null;
	}
	
	//get the x min and set it into the graph params
	this.content.graphParams.xmin = xMin;
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the max x value to the content
 */
View.prototype.GrapherNode.updateXMax = function() {
	//get the value the author input for the max x value
	var xMax = $('#xMaxInput').val();
	
	if(xMax == null || xMax == '') {
		//if the author entered nothing we will set it to null
		xMax = null;
	}
	
	//get the x max and set it into the graph params
	this.content.graphParams.xmax = xMax;
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the y label to the content
 */
View.prototype.GrapherNode.updateYAxisName = function() {
	//get the x units and set it into the graph params
	this.content.graphParams.ylabel = $('#yAxisNameInput').val();
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the y units to the content
 */
View.prototype.GrapherNode.updateYUnits = function() {
	//get the x units and set it into the graph params
	this.content.graphParams.yUnits = $('#yUnitsInput').val();
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the min y value to the content
 */
View.prototype.GrapherNode.updateYMin = function() {
	//get the value the author input for the min y value
	var yMin = $('#yMinInput').val();
	
	if(yMin == null || yMin == '') {
		//if the author entered nothing we will set it to null
		yMin = null;
	}
	
	//get the y units and set it into the graph params
	this.content.graphParams.ymin = yMin;
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the max y value to the content
 */
View.prototype.GrapherNode.updateYMax = function() {
	//get the value the author input for the max y value
	var yMax = $('#yMaxInput').val();
	
	if(yMax == null || yMax == '') {
		//if the author entered nothing we will set it to null
		yMax = null;
	}
	
	//get the y units and set it into the graph params
	this.content.graphParams.ymax = yMax;
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save whether to show the graph options
 */
View.prototype.GrapherNode.updateShowGraphOptions = function() {
	//get the value of the checkbox
	this.content.showGraphOptions = this.isChecked($('#showGraphOptions').attr('checked'));
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the createPrediction field to the content
 */
View.prototype.GrapherNode.updateEnableCreatePrediction = function() {
	//get the value of the checkbox
	this.content.createPrediction = this.isChecked($('#enableCreatePredictionCheckBox').attr('checked'));
	
	//get whether the checkbox is checked or not
	var checked = $('#enableCreatePredictionCheckBox').attr('checked');

	if(checked == 'checked') {
		//checkbox is checked
		$('#predictionDiv').show();
	} else {
		//checkbox is not checked
		// set all child checkboxes to false
		$('#easyPredictionCheckBox').attr('checked', false);
		this.updateEasyPrediction();
		$('#predictionDiv').hide();
	}
		
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the show velocity field
 */
View.prototype.GrapherNode.updateShowVelocity = function() {
	//get the value of the checkbox
	this.content.showVelocity = this.isChecked($('#showVelocityCheckBox').attr('checked'));
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the show acceleration field 
 */
View.prototype.GrapherNode.updateShowAcceleration = function() {
	//get the value of the checkbox
	this.content.showAcceleration = this.isChecked($('#showAccelerationCheckBox').attr('checked'));
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the require prediction before enter field
 */
View.prototype.GrapherNode.updateRequirePredictionBeforeEnter = function() {
	//get the value of the checkbox
	this.content.requirePredictionBeforeEnter = this.isChecked($('#requirePredictionBeforeEnterCheckBox').attr('checked'));
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the graph title
 */
View.prototype.GrapherNode.updateGraphTitle = function() {
	//get the value of the graph title
	this.content.graphTitle = $('#graphTitleInput').val();
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Update the easy prediction options
 */
View.prototype.GrapherNode.updateEasyPrediction = function(overrideBoolean) {
	//these options all make it easier to plot
	this.content.enableEasyPrediction = typeof overrideBoolean === "undefined" ? this.isChecked($('#easyPredictionCheckBox').attr('checked')) : overrideBoolean;
	this.content.graphParams.easyClickExtremes = typeof overrideBoolean === "undefined" ? this.isChecked($('#easyPredictionCheckBox').attr('checked')) : overrideBoolean;
	this.content.graphParams.coordsFollowMouse = typeof overrideBoolean === "undefined" ? this.isChecked($('#easyPredictionCheckBox').attr('checked')) : overrideBoolean;
	this.content.graphParams.allowNonFunctionalData = typeof overrideBoolean === "undefined" ? this.isChecked($('#easyPredictionCheckBox').attr('checked')) : overrideBoolean;
	this.content.allowDragPoint = typeof overrideBoolean === "undefined" ? this.isChecked($('#easyPredictionCheckBox').attr('checked')) : overrideBoolean;
	this.content.allowDragDraw = typeof overrideBoolean === "undefined" ? !(this.isChecked($('#easyPredictionCheckBox').attr('checked'))) : !overrideBoolean;
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Update the custom series options
 */
View.prototype.GrapherNode.newCustomSeries = function() {
	
	var index = 0;
	if (this.content.seriesLabels == null){
		this.content.seriesLabels = [];
	} else {
		index = this.content.seriesLabels.length;
	}
	
	var seriesDiv = createElement(document, 'div', {id: 'seriesDiv-'+index, style:'border-style:solid;border-radius:10px;border-color:#444;border-width:1px;padding-left: 5px;'});
	this.seriesDivs.push(seriesDiv);
		
	var seriesLabelText = document.createTextNode('Series Name:');
	var seriesLabel = createElement(document, 'input', {type: 'input', id: 'seriesLabelInput-'+index, name: 'seriesLabelInput-'+index, value: "", size:10, onchange: 'eventManager.fire("grapherUpdateSeriesLabel", '+index+')'});
	this.content.seriesLabels.push("");

	var seriesColorText = document.createTextNode('Color:');
	var seriesColor = createElement(document, 'input', {type: 'input', id: 'seriesColorInput-'+index, name: 'seriesColorInput-'+index, value: "", size:10, onchange: 'eventManager.fire("grapherUpdateSeriesColor", '+index+')'});
	this.content.seriesColors.push("");

	if (typeof this.content.seriesData === "undefined" || this.content.seriesData == null) this.content.seriesData = [];
	this.content.seriesData.push({id:"", color:"", showLines:true, showPoints:true, editable:true, points:[]})
	
	
	// put points on its own div
	var pointsDiv = createElement(document, 'span', {id: 'pointsDiv-'+index, span:'background-color:#efe;'});
	this.pointsDivs.push(pointsDiv);	
	
	// add options for series
	// place a button for "new point" here
	var newPointButton = createElement(document, 'input', {type: 'button', id: 'newCustomPoint-'+index, name: 'newCustomPoint-'+index, value: 'New Point (x, y, fixed)', onclick: 'eventManager.fire("grapherNewCustomPoint", '+index+')'});
	var showPointsCheckBox = createElement(document, 'input', {id: 'showPointsCheckBox-'+index, type: 'checkbox', onclick: 'eventManager.fire("grapherUpdateShowPoints", '+index+')'});
	if(this.content.seriesData[index].showPoints) showPointsCheckBox.checked = true;
	var showPointsText = document.createTextNode("Show points");
	var showLinesCheckBox = createElement(document, 'input', {id: 'showLinesCheckBox-'+index, type: 'checkbox', onclick: 'eventManager.fire("grapherUpdateShowLines", '+index+')'});
	if(this.content.seriesData[index].showLines) showLinesCheckBox.checked = true;
	var showLinesText = document.createTextNode("Show lines");
	var editableSeriesCheckBox = createElement(document, 'input', {id: 'editableSeriesCheckBox-'+index, type: 'checkbox', onclick: 'eventManager.fire("grapherUpdateEditableSeries", '+index+')'});
	if(this.content.seriesData[index].editable) editableSeriesCheckBox.checked = true;
	var editableSeriesText = document.createTextNode("Editable");
	
	allSeriesDiv.appendChild(seriesDiv);
	seriesDiv.appendChild(seriesLabelText);
	seriesDiv.appendChild(seriesLabel);
	seriesDiv.appendChild(seriesColorText);
	seriesDiv.appendChild(seriesColor);
	seriesDiv.appendChild(createBreak());
	seriesDiv.appendChild(pointsDiv);
	seriesDiv.appendChild(newPointButton);
	seriesDiv.appendChild(createBreak());
	seriesDiv.appendChild(showPointsCheckBox);
	seriesDiv.appendChild(showPointsText);
	seriesDiv.appendChild(showLinesCheckBox);
	seriesDiv.appendChild(showLinesText);
	seriesDiv.appendChild(editableSeriesCheckBox);
	seriesDiv.appendChild(editableSeriesText);
	seriesDiv.appendChild(createBreak());
	allSeriesDiv.appendChild(createBreak());
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Create inputs for a new point for this series
 */
View.prototype.GrapherNode.newCustomPoint = function(index) {
	
	// put points on its own div
	var pointsDiv = this.pointsDivs[index];
	
	var pindex = this.content.seriesData[index].points.length;
	var openingParens = document.createTextNode('(');
	// add a new point with default values
	this.content.seriesData[index].points.push({x:0, y:0, fixed:0});
	var seriesX = createElement(document, 'input', {type: 'input', id: 'seriesXInput-'+index+"-"+pindex, name: 'seriesXInput-'+index+"-"+pindex, value: this.content.seriesData[index].points[pindex].x, size:1, onchange: 'eventManager.fire("grapherUpdateSeriesX", ['+index+","+pindex+'])'});
	var seriesY = createElement(document, 'input', {type: 'input', id: 'seriesYInput-'+index+"-"+pindex, name: 'seriesYInput-'+index+"-"+pindex, value: this.content.seriesData[index].points[pindex].y, size:1, onchange: 'eventManager.fire("grapherUpdateSeriesY", ['+index+","+pindex+'])'});
	var seriesFixed = createElement(document, 'input', {type: 'input', id: 'seriesFixedInput-'+index+"-"+pindex, name: 'seriesFixedInput-'+index+"-"+pindex, value: this.content.seriesData[index].points[pindex].fixed, size:1, onchange: 'eventManager.fire("grapherUpdateSeriesFixed", ['+index+","+pindex+'])'});
	var closeParens = document.createTextNode(') ');
	pointsDiv.appendChild(openingParens);
	pointsDiv.appendChild(seriesX);
	pointsDiv.appendChild(seriesY);
	pointsDiv.appendChild(seriesFixed);
	pointsDiv.appendChild(closeParens);
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Update the custom series label
 */
View.prototype.GrapherNode.updateSeriesLabel = function(index) {
	
	this.content.seriesLabels[index] = $('#seriesLabelInput-'+index).attr('value');
	this.content.seriesData[index].id = this.content.seriesLabels[index];
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Update the custom series 
 */
View.prototype.GrapherNode.updateSeriesColor = function(index) {
	
	this.content.seriesColors[index] = $('#seriesColorInput-'+index).attr('value');
	this.content.seriesData[index].color = this.content.seriesColors[index];
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Update the a point's x value associated with a specific label
 */
View.prototype.GrapherNode.updateSeriesX = function(index, pindex) {
	
	this.content.seriesData[index].points[pindex].x = parseFloat($('#seriesXInput-'+index+'-'+pindex).attr('value'));
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Update the a point's y value associated with a specific label
 */
View.prototype.GrapherNode.updateSeriesY = function(index, pindex) {
	
	this.content.seriesData[index].points[pindex].y = parseFloat($('#seriesYInput-'+index+'-'+pindex).attr('value'));
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Update the a point's "fixed" value associated with a specific label
 */
View.prototype.GrapherNode.updateSeriesFixed = function(index, pindex) {
	this.content.seriesData[index].points[pindex].fixed = parseInt($('#seriesFixedInput-'+index+'-'+pindex).attr('value'));
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Update whether we are showing points for this series
 */
View.prototype.GrapherNode.updateShowPoints = function(index) {
	
	this.content.seriesData[index].showPoints = this.isChecked($('#showPointsCheckBox-'+index).attr('checked'));
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Update whether we are showing points for this series
 */
View.prototype.GrapherNode.updateShowLines = function(index) {
	
	this.content.seriesData[index].showLines = this.isChecked($('#showLinesCheckBox-'+index).attr('checked'));
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Update whether we are showing points for this series
 */
View.prototype.GrapherNode.updateEditableSeries = function(index) {
	
	this.content.seriesData[index].editable = this.isChecked($('#editableSeriesCheckBox-'+index).attr('checked'));
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Update the allow update axis range value
 */
View.prototype.GrapherNode.updateAllowUpdateAxisRange = function() {
	//get the value of the allow update axis range and set it into the content
	this.content.graphParams.allowUpdateAxisRange = this.isChecked($('#allowUpdateAxisRangeCheckBox').attr('checked'));
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Update the allow update axis range value
 */
View.prototype.GrapherNode.updateAllowAnnotations = function() {
	//get the value of the allow update axis range and set it into the content
	this.content.allowAnnotations = this.isChecked($('#allowAnnotationsCheckBox').attr('checked'));
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Determine if the value is checked or not
 * @param the string 'checked' or the value null
 * @return true if the value is 'checked'
 */
View.prototype.GrapherNode.isChecked = function(value) {
	var checked = false;
	
	//check if the value is the string 'checked' or boolean value true
	if(value == 'checked' || value == true) {
		checked = true;
	} else {
		checked = false;
	}
	
	return checked;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/grapher/authorview_grapher.js');
};