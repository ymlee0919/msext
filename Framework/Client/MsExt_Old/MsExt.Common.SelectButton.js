
function msExt_SelectButton()
{
	this._counter = 0;
	
	//----------------------------------------------------------------------
	// Retrive the current id of the button
	this.GetBtnId = function()
	{
		return "__select_btn_id"+(this._counter);
	}
	
	//----------------------------------------------------------------------
	// Retrive the next button id
	this.GetNextBtnId = function()
	{
		return "__select_btn_id"+(++this._counter);
	}
	
	//----------------------------------------------------------------------
	// Retrive a split button for select multiple shapes
	this.GetMultiselectionButton = function(LayerName, GridPanel)
	{
		var _current_btn_id = this.GetBtnId();
		var _btn_instance = this;
		
		var _btn = new Ext.SplitButton({	
			text: 'Seleccionar',
			id : _current_btn_id,
			disabled : true,
			handler: function()	{_btn_instance.SelectShapeList(LayerName, GridPanel);	Ext.getCmp(_current_btn_id).disable();	},
			menu :
			[
				{ text:'Seleccionar',	handler : function() {_btn_instance.SelectShapeList(LayerName, GridPanel); Ext.getCmp(_current_btn_id).disable(); } },
				{ text:'Añadir a la selección',	handler : function() {_btn_instance.AppendShapeListToSelection(LayerName, GridPanel); } }
			]
		});
		
		return _btn;
	}
	
	//----------------------------------------------------------------------
	this.GetSingleselectionButton = function(LayerName, ShapeIndex)
	{
		var _current_btn_id = this.GetBtnId();
		var _btn_instance = this;
		
		var _btn = new Ext.SplitButton(
		{	
			text: 'Seleccionar',
			id : _current_btn_id,
			handler: function()	{_btn_instance.SelectShape(LayerName, ShapeIndex);	Ext.getCmp(_current_btn_id).disable();	},
			menu :
			[
				{
					text:'Seleccionar',	handler : function() {_btn_instance.SelectShape(LayerName, ShapeIndex); Ext.getCmp(_current_btn_id).disable();	}
				},
				{
					text:'Añadir a la selección',	handler : function() {_btn_instance.AppendShapeToSelection(LayerName, ShapeIndex); this.disable();	}
				}
			]
		});
		
		return _btn;
	}
	
	//----------------------------------------------------------------------
	this.SelectShape = function(LayerName, ShapeIndex)
	{
		var _shapes = [ShapeIndex];

		MsExt.Core.Selection.SelectShapes(document.getElementById('map_name').value,
											document.getElementById('extent').value,
											LayerName,
											_shapes);
	}
	
	//----------------------------------------------------------------------
	this.AppendShapeToSelection = function(LayerName, ShapeIndex)
	{
		var _shapes = [ShapeIndex];

		MsExt.Core.Selection.AppendShapesToSelection(document.getElementById('map_name').value,
											document.getElementById('extent').value,
											LayerName,
											_shapes);
	}
	
	//----------------------------------------------------------------------
	this.SelectShapeList = function(LayerName, GridPanel)
	{
		var _shapes = new Array();

		var _selected_rows = GridPanel.getSelectionModel().getSelections();
		for(var i = 0; i < _selected_rows.length; i++)
			_shapes.push(_selected_rows[i].get('shapeindex'));

		MsExt.Core.Selection.SelectShapes(document.getElementById('map_name').value,
											document.getElementById('extent').value,
											LayerName,
											_shapes);
	}
	
	//----------------------------------------------------------------------
	this.AppendShapeListToSelection = function(LayerName, GridPanel)
	{
		var _shapes = new Array();

		var _selected_rows = GridPanel.getSelectionModel().getSelections();
		for(var i = 0; i < _selected_rows.length; i++)
			_shapes.push(_selected_rows[i].get('shapeindex'));

		MsExt.Core.Selection.AppendShapesToSelection(document.getElementById('map_name').value,
											document.getElementById('extent').value,
											LayerName,
											_shapes);
	}
}

MsExt.Common.SelectButton = new msExt_SelectButton();