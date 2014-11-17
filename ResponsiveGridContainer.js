define(["dojo/_base/lang","dojo/_base/declare", "dojo/dom-class", "dojo/dom-construct", 
		"dojo/_base/array", "dojo/dom-prop", "dojo/dom-style", "dijit/_WidgetBase", "dijit/layout/_LayoutWidget","dojo/domReady!"],
function(lang,declare, domClass, domConstruct, arrayUtil, domProp, domStyle, _WidgetBase, _LayoutWidget){

// summary:
	// A container that lays out its child widgets in a responsive grid layout.
	// description:
	// The ResponsiveGridContainer lays out child widgets in a responsive grid layout.
	// Each widget can specify a "label" or a "title" parameter.
	// The number of columns is configured using the "cols" attribute.
	// example:
	// <div dojoType="dijitx.ResponsiveContainer" cols="3>
	// <div dojoType="dijit.form.TextInput" value="John" label="First Name:"></div>
	// <div dojoType="dijit.form.CheckBox" label="Is Student?:"></div>
	// <div dojoType="dojox.form.DateTextBox" label="Date Of Birth:"></div>
	// </div>
var ResponsiveGridContainer = declare("ResponsiveGridContainer", _LayoutWidget, {

	// Specifies the number of columns in the grid layout.
	cols: 1,

	// labelWidth: Number|String
	// Defines the width of a label.  If the value is a number, it is
	// treated as a pixel value.  The other valid value is a percentage,
	// e.g. "50%"
	labelWidth: "100",
	
	//showLabels: Boolean
	//True if labels should be displayed, false otherwise.
	showLabels: true,
	
	// orientation: String
	// Either "horiz" or "vert" for label orientation.
	orientation: "horiz",

	// customClass: String
	// A CSS class that will be applied to child elements.  For example, if
	// the class is "myClass", the table will have "myClass-table" applied to it,
	// each label TD will have "myClass-labelCell" applied, and each
	// widget TD will have "myClass-valueCell" applied.
	customClass: "",
	
	postCreate: function(){
		this.inherited(arguments);
		this._children = [];
	
		// If the orientation, customClass or cols attributes are changed,
		// layout the widgets again.	
		this.connect(this, "set", function(name, value){
			if(value && (name == "orientation" || name == "customClass" || name == "cols")) {
				this.layout();
			}
		});
	},

	startup: function() {
		if(this._started) {
			return;
		}
		this.inherited(arguments);
		if(this._initialized) {
			return;
		}
		var children = this.getChildren();
		if(children.length < 1) {
			return;
		}
		this._initialized = true;

		domClass.add(this.domNode, "dijitTableLayout");
		
		// Call startup on all child widgets
		arrayUtil.forEach(children, function(child){
			if(!child.started && !child._started) {
				child.startup();
			}
		});
		this.layout();
		this.resize();
	},

	resize: function(){

		// summary:
		// Resizes all children.  This widget itself
		// does not resize, as it takes up 100% of the
		// available width.
		arrayUtil.forEach(this.getChildren(), function(child){
			if(typeof child.resize == "function") {
				child.resize();
			}
		});
	},

	// summary:
	// Lays out the child widgets.
	layout: function(){
		if(!this._initialized){
			return;
		}
		var children = this.getChildren();
		var childIds = {};
		var _this = this;
		function addCustomClass(node, type, count) {
			if(_this.customClass != "") {
				var lowerCaseClass = _this.customClass+ "-" + (type || node.tagName.toLowerCase());
				domClass.add(node, lowerCaseClass);
				if(arguments.length > 2) {
					domClass.add(node, lowerCaseClass + "-" + count);
				}
			}
		}

		// Find any new children that have been added since the last layout() call
		arrayUtil.forEach(this._children, lang.hitch(this, function(child){
			childIds[child.id] = child;
		}));

		arrayUtil.forEach(children, lang.hitch(this, function(child, index){
			if(!childIds[child.id]) {
				
				// Add pre-existing children to the start of the array
				this._children.push(child);
			}
		}));

		//Create a parent container div within which new rows along with the responsive columns will be added and
		//add this parent container div to the existing domNode
		var parentDiv = domConstruct.create("div",{"class":"container"});
		this.domNode.appendChild(parentDiv);
		
		//Calculates the width of each column in percentage
		var width = Math.floor(100 / this.cols) + "%";

		//Calculates the index of each column in a responsive grid
		var colIndex = Math.floor(12 / this.cols);
		
		// Iterate over the children, adding them to the grid.
		var newRow={};
		arrayUtil.forEach(this._children, lang.hitch(this, function(child, index){
			
			//Checks if a new row should be added or not; it is added if the index is a multiple of column
			var isNewRow=!(index % this.cols);
			
			//Creates a new row depending upon the value of isNewRow
			if(isNewRow){
				newRow = domConstruct.create("div", {
					"class":"row"},
					parentDiv);
			}
			//In each row add responsive columns
			var columnRow = domConstruct.create("div",{
				"class":child.cols||("col-md-"+colIndex),
				"id":this.id+"-col-md"+index
			},newRow);

			//Within each column craete a label div and a child div			
			var maxCols = this.cols * (this.showLabels ? 2 : 1);
			var numCols = 0;
			var colspan = child.colspan || 1;
			if(colspan > 1) {
				colspan = this.showLabels ?
					Math.min(maxCols - 1, colspan * 2 -1): Math.min(maxCols, colspan);
			}

			// Create a new row if we need one
			if(numCols + colspan - 1 + (this.showLabels ? 1 : 0)>= maxCols) {
				numCols = 0;
				labelRow = domConstruct.create("div", {},columnRow);
				childRow = this.orientation == "horiz" ? labelRow : domConstruct.create("div", {}, columnRow);
			}
			var labelCell;
			
			// If labels should be visible, add them
			if(this.showLabels) {
				labelCell = domConstruct.create("div", {
					"class": "ResponsiveGridContainer-labelCell",
					style:{
						display: "Inline-block"
					}}, columnRow);

				// If the widget should take up both the label and value,
				// then just set the class on it.
				if(child.spanLabel) {
					domProp.set(labelCell, this.orientation == "vert" ? "rowspan" : "colspan", 2);
				}
				else {
				
					// Add the custom label class to the label cell
					addCustomClass(labelCell, "labelCell");
					var labelProps = {"for": child.get("id")};
					var label = domConstruct.create("label", labelProps,labelCell);
					if(Number(this.labelWidth) > -1 ||
						String(this.labelWidth).indexOf("%") > -1) {
						
						// Set the width of the label cell with either a pixel or percentage value
						domStyle.set(labelCell, "width",
							String(this.labelWidth).indexOf("%") < 0
								? this.labelWidth + "px" : this.labelWidth);
					}
					label.innerHTML = child.get("label") || child.get("title");
				}
			}
			var childCell;

			if(child.spanLabel && labelCell) {
				childCell = labelCell;
			} else {

				//To add orienation property of responsive grid container
				if(this.orientation == "horiz"){
					console.log("Horiz reached!!")
					childCell = domConstruct.create("div", {
						style:{
							display: "Inline-block"
						}
					}, columnRow);
				}
				else{
					console.log("Vert reached!!")
					childCell = domConstruct.create("div",{},columnRow);
				}
			}
			if(colspan > 1) {
				domProp.set(childCell, "colspan", colspan);
			}

			// Add the widget cell's custom class, if one exists.
			addCustomClass(childCell, "valueCell", index);
			childCell.appendChild(child.domNode);
			numCols += colspan + (this.showLabels ? 1 : 0);
		}));
		
		if(this.parentDiv)	 {
			this.parentDiv.parentNode.removeChild(this.table);
		}

		// Refresh the layout of any child widgets, allowing them to resize
		// to their new parent.
		arrayUtil.forEach(children, function(child){
			if(typeof child.layout == "function") {
				child.layout();
			}
		});
		this.resize();
	},
	
	// summary:
	// Destroys all the widgets inside this.containerNode,
	// but not this widget itself
	destroyDescendants: function(/*Boolean*/ preserveDom){
		arrayUtil.forEach(this._children, function(child){ child.destroyRecursive(preserveDom); });
	}
});

	// summary:
	// Properties to be set on children of TableContainer
ResponsiveGridContainer.ChildWidgetProperties = {
	
	// label: String
	// The label to display for a given widget
	label: "",
	
	// title: String
	// The label to display for a given widget.  This is interchangeable
	// with the 'label' parameter, as some widgets already have a use
	// for the 'label', and this can be used instead to avoid conflicts.
	title: "",
	
	// spanLabel: Boolean
	// Setting spanLabel to true makes the widget take up both the
	// label and value cells. Defaults to false.
	spanLabel: false,
	
	// colspan: Number
	// The number of columns this widget should span.
	colspan: 1,

	cols: ''
};

// Add to widget base for benefit of parser.
lang.extend(_WidgetBase, /*===== {} || =====*/ ResponsiveGridContainer.ChildWidgetProperties);

return ResponsiveGridContainer;
});
