window.controlPane = new (function(){
	var custom1num, custom2num, store;

	this.prepareSelects = function(){
		var sel1 = document.getElementById("box1");
		var sel2 = document.getElementById("box2");

		var check1 = document.getElementById("normVar1");
		var check2 = document.getElementById("normVar2");

		var rad0 = document.getElementById("var0sort");
		var rad1 = document.getElementById("var1sort");
		var rad2 = document.getElementById("var2sort");

		sel1.options.length = 0;
		sel2.options.length = 0;

		for(i = 0, intInd = 0; i<Model.data.referendum[0].length+Model.data.simd[0].length; i++){
			var str;
			var simdStart = Model.data.referendum[0].length;
			var simdInd = i-simdStart;
			
			if(i<simdStart && i!=0){
				str = Model.data.referendum[0][i];
				sel1.options[intInd] = new Option("Referendum - " + str, "ref"+i, false, false);
				sel2.options[intInd] = new Option("Referendum - " + str, "ref"+i, false, false);
				intInd++;
			}	else if(i>simdStart){
				str = Model.data.simd[0][simdInd];
				sel1.options[intInd] = new Option("SIMD - " + str, "simd"+simdInd, false, false);
				sel2.options[intInd] = new Option("SIMD - " + str, "simd"+simdInd, false, false);
				intInd++;
			}
		}

		//Match initial model state to initial selectorbox state.
		Model.comparison.var1 = "ref1";
		Model.comparison.var2 = "ref1";

		//Set the 'onchange' property of these boxes now.
		sel1.onchange = changedSelectEvt;
		sel2.onchange = changedSelectEvt;

		//Set the 'onchenge' property of the checkboxes now.
		check1.onchange = changedCheckboxEvt;
		check2.onchange = changedCheckboxEvt;

		//Set the 'onchenge' property of the radio buttons now.
		rad0.onchange = changedRadioEvt;
		rad1.onchange = changedRadioEvt;
		rad2.onchange = changedRadioEvt;

		//FORCE INITIAL STATES
		check1.checked = false;
		check2.checked = false;
		rad0.checked = false;
		rad1.checked = true;
		rad2.checked = false;
	}

	changedSelectEvt = function(){
		//Determine which box changed, set the value
		//on the model and then broadcast to all
		//the model's data listeners.
		var caller = this.id;
		switch(caller){
			case "box1":
				Model.comparison.var1 = this.value;
				break;
			case "box2":
				Model.comparison.var2 = this.value;
				break;
		}
		Model.broadcastDataChange();
	}

	changedCheckboxEvt = function(){
		//Again, determine which box changed, set the value
		//on the model and then broadcast to all
		//the model's data listeners.
		var caller = this.id;
		switch(caller){
			case "normVar1":
				Model.comparison.normal1 = this.checked;
				break;
			case "normVar2":
				Model.comparison.normal2 = this.checked;
				break;
		}
		Model.broadcastDataChange();
	}

	changedRadioEvt = function(){
		//Determine which radio changed, set the value
		//on the model and then broadcast to all
		//the model's data listeners.
		var caller = this.id;
		switch(caller){
			case "var0sort":
				Model.comparison.sortBy = 0;
				break;
			case "var1sort":
				Model.comparison.sortBy = 1;
				break;
			case "var2sort":
				Model.comparison.sortBy = 2;
				break;
		}
		Model.broadcastDataChange();
	}
})();