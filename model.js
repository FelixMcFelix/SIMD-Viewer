/*window.Model = {
	data: {
		referendum: [[]],
		simd: [[]]
	},
	
	//0 = map, 1 = scatter, 2 = bar
	visualisation: 0,

	//Array of bools, each entry corresponds to a selected (or unselected) row.
	masterSelections: [],
	subSelections: [],

	//Object storing our selection and display models.
	comparison: {
		//0 = name, 1 = var1, 2 = var2
		sortBy: 0,
		//How to know what data sets should be normalised:
		normal1: false,
		normal2: false,
		//Store the names of our desired variables here for now.
		var1: "",
		var2: "",
		var1dat: [],
		var2dat: [],
		//[0] and [1] are min and max for var1, [1] and [2] are min and max for var2
		colours: []
	}
}*/
window.Model = new (function(){
	this.data = {
		referendum: [[]],
		simd: [[]]
	}

	this.visualisation = 0;
	this.comparison = {
		//0 = name, 1 = var1, 2 = var2
		sortBy: 0,
		//How to know what data sets should be normalised:
		normal1: false,
		normal2: false,
		//Store the names of our desired variables here for now.
		var1: "",
		var2: "",
		var1dat: [],
		var2dat: [],
		//[0] and [1] are min and max for var1, [1] and [2] are min and max for var2
		colours: []
	}

	this.masterSelections = [];
	this.subSelections = [];

	//Use the publisher-subscriber abstraction to simulate event behaviour.
	var subscribers = {
		select: [],
		unselect: [],
		hover: [],
		unhover: [],
		dataChange: [],
		change: []
	}

	this.select = function(id){
		notifyAll("select");
		notifyAll("change");
	}

	this.unselect = function(id){
		notifyAll("unselect");
		notifyAll("change");
	}

	this.hover = function(id){
		notifyAll("hover");
		notifyAll("change");
	}

	this.unhover = function(){
		notifyAll("unhover");
		notifyAll("change");
	}

	this.broadcastDataChange = function(){
		notifyAll("dataChange");
		notifyAll("change");
	}

	addListener = function(event, function){
		subscribers[event].push(function);
	}

	notifyAll = function(event){
		for(int i=0; i<subscribers[event].length; i++){
			subscribers[event][i]();
		}
	}
}
)()

window.Consituency = function(name, refRow, simdRow, ){

}