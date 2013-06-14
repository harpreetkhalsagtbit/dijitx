define(["dojo/_base/declare", "dijit/_TemplatedMixin", "dijit/_WidgetBase", "dojo/dom", "dojo/dom-construct", "dojo/on", "dojo/query"], 
	function(declare, _WidgetBase, _TemplatedMixin, dom, domConstruct, on, query){
		return declare('dijitx.widget.MultiTagBox', [_WidgetBase, _TemplatedMixin], {

			postion: 'above',
			get: function(getValueOfMultiTagBox){
				var selectedValue;
				var arrayOfValuesSelected = [];
				if(query(".selected-item").length != 0){
					var selectedValueArr = query(".selected-item");
					var selectedValueLength = selectedValueArr.length;

					for(var i=0; i<selectedValueLength; i++){
						selectedValue = selectedValueArr[i].value;
						arrayOfValuesSelected.push(selectedValue);
					}
					var stringOfValuesSelected = arrayOfValuesSelected.join(',');
					return stringOfValuesSelected;

				}
			},

			input: '',
			widgetId:'itemHolder',

			buildRendering: function(){
				var This=this;
				this.domNode = domConstruct.create('div', {
					id:'widgetHolder',
					style: 'width:242px; border: 1px solid #b5bcc7;'
				});
				this.itemHolder = domConstruct.create('div', {
					id: this.widgetId,
					style: 'background-color: whitesmoke; height: 100px; width: 242px; position: relative;'
				}, this.domNode);

			},
			_setValueAttr: function(value, setValueOfMultiTagBox){
				var This = this;

				var getUniqueIdArray = query('.selected-item')
				var getUniqueIdArrayLength = getUniqueIdArray.length;
				if(getUniqueIdArrayLength != 0){
					var uniqueIdNumberStore = [];
					for(var i=0; i<getUniqueIdArrayLength; i++){
						var getUniqueIdNumber = getUniqueIdArray[i].id.split('_')[1];
						uniqueIdNumberStore.push(getUniqueIdNumber);
					};
					var getMaxUniqueIdNumber = Math.max.apply(Math, uniqueIdNumberStore);
					var incrementedUniqueIdNumber = parseInt(getMaxUniqueIdNumber)+1;
					var selectedName = domConstruct.create('div', {
						'class':'selected-item',
						value: value,
						style: 'background-color: lightblue; height: 21px; width: 80px; float: right; margin-top: -0.5px; margin-right: 10px; position: relative;',
						id:'selected-item-id_'+incrementedUniqueIdNumber,
						innerHTML: value
					},This.widgetId);

					var destroyButton = domConstruct.create('div',{
						'class': 'itm-dstry',
						style: 'position: relative; float: right; margin-top: -6px; margin-right: 3px; font-size: 18px; cursor: pointer;',
						id: 'itm-dstry-id_'+incrementedUniqueIdNumber,
						innerHTML: '<b>x</b>'
					},selectedName);

					query(".itm-dstry").on('click',function(){
						var id = this.id.split('_')[1];
						console.log('id',id)
						var slectedNameId = dom.byId('selected-item-id_'+id);
						domConstruct.destroy(slectedNameId)
					});

				}
				else{
					var unique = 0;
					var selectedName = domConstruct.create('div', {
						'class':'selected-item',
						value: value,
						style: 'background-color: lightblue; height: 21px; width: 80px; float: right; margin-top: -0.5px; margin-right: 10px; position: relative;',
						id:'selected-item-id_'+unique,
						innerHTML: value
					},This.widgetId);

					var destroyButton = domConstruct.create('div',{
						'class': 'itm-dstry',
						style: 'position: relative; float: right; margin-top: -6px; margin-right: 3px; font-size: 18px; cursor: pointer;',
						id: 'itm-dstry-id_'+unique,
						innerHTML: '<b>x</b>'
					},selectedName);
					
					query(".itm-dstry").on('click',function(){
						var id = this.id.split('_')[1];
						console.log('id',id)
						var slectedNameId = dom.byId('selected-item-id_'+id);
						domConstruct.destroy(slectedNameId)
					});
					unique++;

			};
		},

			postCreate: function(){
				var This=this;
				this.input.placeAt(this.domNode)
				on(this.input, 'change', function(){
					if(this.value == ""){

					}
					else{
						var getUniqueIdArray = query('.selected-item')
						var getUniqueIdArrayLength = getUniqueIdArray.length;
						if(getUniqueIdArrayLength != 0){
							var uniqueIdNumberStore = [];
							for(var i=0; i<getUniqueIdArrayLength; i++){
								var getUniqueIdNumber = getUniqueIdArray[i].id.split('_')[1];
								uniqueIdNumberStore.push(getUniqueIdNumber);
							};
							var getMaxUniqueIdNumber = Math.max.apply(Math, uniqueIdNumberStore);
							var incrementedUniqueIdNumber = parseInt(getMaxUniqueIdNumber)+1;
							var selectedName = domConstruct.create('div', {
								'class':'selected-item',
								value: this.value,
								style: 'background-color: lightblue; height: 21px; width: 80px; float: right; margin-top: -0.5px; margin-right: 10px; position: relative;',
								id:'selected-item-id_'+incrementedUniqueIdNumber,
								innerHTML: this.value
							},This.widgetId);

							var destroyButton = domConstruct.create('div',{
								'class': 'itm-dstry',
								style: 'position: relative; float: right; margin-top: -6px; margin-right: 3px; font-size: 18px; cursor: pointer;',
								id: 'itm-dstry-id_'+incrementedUniqueIdNumber,
								innerHTML: '<b>x</b>'
							},selectedName);

							query(".itm-dstry").on('click',function(){
								var id = this.id.split('_')[1];
								var slectedNameId = dom.byId('selected-item-id_'+id);
								domConstruct.destroy(slectedNameId)
							});

						} 
						else{
							var unique = 0;
							var selectedName = domConstruct.create('div', {
								'class':'selected-item',
								value: this.value,
								style: 'background-color: lightblue; height: 21px; width: 80px; float: right; margin-top: -0.5px; margin-right: 10px; position: relative;',
								id:'selected-item-id_'+unique,
								innerHTML: this.value
							},This.widgetId);

							var destroyButton = domConstruct.create('div',{
								'class': 'itm-dstry',
								style: 'position: relative; float: right; margin-top: -6px; margin-right: 3px; font-size: 18px; cursor: pointer;',
								id: 'itm-dstry-id_'+unique,
								innerHTML: '<b>x</b>'
							},selectedName);

							query(".itm-dstry").on('click',function(){
								var id = this.id.split('_')[1];
								var slectedNameId = dom.byId('selected-item-id_'+id);
								domConstruct.destroy(slectedNameId)
							});
							unique++;

						};

					}
				

			});

		}
	});
});