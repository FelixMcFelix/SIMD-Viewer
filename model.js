window.Model = new (function(){
	var t = this;

	/**
	* Storage space for initial parsed csv data.
	*/
	t.data = {
		referendum: [[]],
		simd: [[]]
	}

	t.visualisation = 0;
	t.comparison = {
		//0 = name, 1 = var1, 2 = var2
		sortBy: 1,
		//How to know what data sets should be normalised:
		normal1: false,
		normal2: false,
		//Store the names of our desired variables here for now.
		var1: "",
		var2: ""
	}

	t.masterSelections = [];
	t.subSelections = [];

	//Use the publisher-subscriber abstraction to simulate event behaviour.
	var subscribers = {
		select: [],
		unselect: [],
		hover: [],
		unhover: [],
		dataChange: [],
		change: []
	}

	var removeQueue = [];

	//Space to access constituency daa via multiple means.
	t.constituencies = {};
	t.constituenciesArray = [];

	/**
	* Adds a single constituency element to
	* both storage mechanisms.
	*/
	t.addConstituency = function(constObj){
		constObj.id = t.constituenciesArray.length;

		t.constituencies[constObj.name] = constObj;
		t.constituenciesArray.push(constObj);
	}

	//EVENTS
	/**
	* These methods trigger events, manipulating the data as
	* expected while causing notifaication to all subscribers of
	* those events.
	*/
	t.select = function(id){
		t.constituenciesArray[id].selected = true;

		notifyAll("select");
		notifyAll("change");
	}

	t.selectAll = function() {
		for (var i=0; i<t.constituenciesArray.length; i++) {
			t.constituenciesArray[i].selected = true;
		}

		notifyAll("select");
		notifyAll("change");
	}

	t.unselect = function(id){
		t.constituenciesArray[id].selected = false;

		notifyAll("unselect");
		notifyAll("change");
	}

	t.unselectAll = function(){
		for (var i=0; i<t.constituenciesArray.length; i++) {
			t.constituenciesArray[i].selected = false;
		}

		notifyAll("unselect");
		notifyAll("change");
	}

	t.hover = function(id){
		t.constituenciesArray[id].hover = true;

		notifyAll("hover");
		notifyAll("change");
	}

	t.unhover = function(){
		for(var i=0; i<t.constituenciesArray.length; i++){t.constituenciesArray[i].hover = false;}

		notifyAll("unhover");
		notifyAll("change");
	}

	t.broadcastDataChange = function(){
		//Obtain column numbers.
		var col1 = parseInt(Model.comparison.var1.replace(/\D/g,''));
		var col2 = parseInt(Model.comparison.var2.replace(/\D/g,''));

		//Use our setting to propagate the data changes.
		for(var i=0; i<t.constituenciesArray.length; i++){
			var constObj = t.constituenciesArray[i];
			//Change x and y as necessary.
			//Detect what we are even doing.
			if(Model.comparison.var1.charAt(0) == "r"){
				constObj.x = toNumber(constObj.allRef[col1]);
			} else{
				constObj.x = toNumber(constObj.allSIMD[col1]);
			}

			if(Model.comparison.var2.charAt(0) == "r"){
				constObj.y = toNumber(constObj.allRef[col2]);
			} else{
				constObj.y = toNumber(constObj.allSIMD[col2]);
			}
		
		}

		//Execute normalisation if we need to.
		if(t.comparison.normal1 || t.comparison.normal2) normalise();

		notifyAll("dataChange");
		notifyAll("change");
	}

	/**
	* Scales data of all Constituency Objects.
	* If norm boxes are ticked, it scales the data
	* between 0 and 1 on that column. If the boxes
	* are not ticked, then change nothing.
	*/
	var normalise = function(){
		var maxX,minX,maxY,minY;

		//Retrieve min and max values.
		for(var i=0; i<t.constituenciesArray.length; i++){
			constObj = t.constituenciesArray[i];
			if(i==0){
				maxX = minX = constObj.x;
				maxY = minY = constObj.y;
			} else{
				maxX = constObj.x>maxX ? constObj.x : maxX;
				maxY = constObj.y>maxY ? constObj.y : maxY;
				minX = constObj.x<minX ? constObj.x : minX;
				minY = constObj.y<minY ? constObj.y : minY;
			}
		}

		//Now normalise relative to these values.
		for(var i=0; i<t.constituenciesArray.length; i++){
			constObj = t.constituenciesArray[i];
			if(t.comparison.normal1){
				constObj.x = (constObj.x-minX)/(maxX-minX);
			}
			if(t.comparison.normal2){
				constObj.y = (constObj.y-minY)/(maxY-minY);
			}
		}

	}

	//SUBSCRIPTION
	/**
	* Set of subscription management functions for our
	* event handling framework. Add a function pointer
	* to the list of subscribes for an event, or remove it.
	*/
	t.addSelectListener = function(func){
		addListener("select", func);
	}
	t.addHoverListener = function(func){
		addListener("hover", func);
	}
	t.addUnselectListener = function(func){
		addListener("unselect", func);
	}
	t.addUnhoverListener = function(func){
		addListener("unhover", func);
	}
	t.addDataChangeListener = function(func){
		addListener("dataChange", func);
	}
	t.addChangeListener = function(func){
		addListener("change", func);
	}

	t.removeChangeListener = function(func) {
		queueRemoveListener("change", func)
	}

	var addListener = function(event, func){
		subscribers[event].push(func);
	}

	function queueRemoveListener(event, func) {
		removeQueue.push({event:event, func:func});
	}

	function removeListener(event, func) {
		subscribers[event].splice(subscribers[event].indexOf(func), 1);
	}

	//PUBLISHING
	/**
	* Key component of our custom event framework.
	* For a given event, executes all functions
	* awaiting execution on a given signal.
	*
	* Iterates over the removeQueue to determine
	* which listeners are no longer lisening.
	*/
	var notifyAll = function(event){
		for(var i=0; i<subscribers[event].length; i++){
			subscribers[event][i]();
		}
		for(var i=0; i<removeQueue.length; i++) {
			removeListener(removeQueue[i].event, removeQueue[i].func)
		}
		removeQueue = [];
	}
}
)()

/**
* Constituency class, used to store a constituency.
* Stores the data rows from each file, id is generated
* programmatically later. x and y are preinitialised
* to hold the values of the default select box columns.
*/
window.Constituency = function(name, refRow, simdRow){
	this.id = 0;
	this.name = name;
	this.allRef = refRow;
	this.allSIMD = simdRow;

	this.x = toNumber(this.allRef[1]);
	this.y = toNumber(this.allRef[1]);

	this.selected = true;
	this.hover = false;
}

/**
* toNumber method, used to strip excess punctuation
* from numbers and convert them to numerical representation
*/
window.toNumber = function(num){
	if(typeof num == "string"){
		num = num.replace(",","");
		num = num.replace(" ","");
	}
	return Number(num, 10);
}