window.Model = {
	data: {
		referendum: "",
		simd: ""
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
		//Store the names of our desired variables here for now.
		var1: "",
		var2: "",
		//[0] and [1] are min and max for var1, [1] and [2] are min and max for var2
		colours: []
	}
}