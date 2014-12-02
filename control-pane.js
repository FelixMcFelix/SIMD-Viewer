window.controlPane = new (function(){
	this.prepareSelects = function(){
		var sel1 = document.getElementById("box1");
		var sel2 = document.getElementById("box2");

		sel1.options.length = 0;
		sel2.options.length = 0;

		console.log(Model.data.referendum[0].length+", "+Model.data.simd[0].length);

		for(i = 0; i<Model.data.referendum[0].length+Model.data.simd[0].length; i++){
			var str;
			
			if(i<Model.data.referendum[0].length){
				str = Model.data.referendum[0][i];
				sel1.options[i] = new Option("Referendum - " + str, str, false, false);
				sel2.options[i] = new Option("Referendum - " + str, str, false, false);
			}	else{
				str = Model.data.simd[0][i-Model.data.referendum[0].length];
				sel1.options[i] = new Option("SIMD - " + str, str, false, false);
				sel2.options[i] = new Option("SIMD - " + str, str, false, false);
			}
			
		}
	}
})();