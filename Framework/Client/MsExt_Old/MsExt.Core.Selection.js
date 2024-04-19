var _clean_selection = null;
//----------------------------------------------------------------------
// Function to search an element in a sortered array
//----------------------------------------------------------------------
function BinarySearch(_array, _begin, _end, _element)
{
	if(_array[_begin] == _element)
		return _begin;
	
	if(_array[_end] == _element)
		return _end;
	
	if(_end - _begin <= 1)
		return -1;
	
	var _index = Math.floor((_end + _begin) / 2);
	var _pivot = _array[_index];
	
	if(_pivot >= _element)
		return BinarySearch(_array,_begin, _index, _element);
	else
		return BinarySearch(_array,_index, _end ,_element);
}

//----------------------------------------------------------------------
function msExt_Selection()
{
	this._layers = new Array();
	this._selections = new Array();
	this.IndexOf = IndexOf;
	
	//----------------------------------------------------------------------
	this.GetLayerIndex = function(LayerName)
	{
		var _index = this.IndexOf(this._layers, LayerName);
		if(_index == -1)
		{
			_index = this._selections.length;
			this._layers.push(LayerName);
			this._selections.push(new Array());
		}
		
		return _index;
	}
	
	//----------------------------------------------------------------------
	// Select by map
	//----------------------------------------------------------------------
	this.AddSelectionToLayer = function(LayerName, ShapeList)
	{
		var _layer_index = this.GetLayerIndex(LayerName);
		var _current_item = 0;
		var _inserted_items = new Array();
		
		for(var i = 0; i < ShapeList.length; i++)
		{
			_current_item = ShapeList[i];
			
			if(BinarySearch(this._selections[_layer_index], 0, this._selections[_layer_index].length - 1, _current_item) == -1)
			{
				this._selections[_layer_index].push(_current_item);
				this._selections[_layer_index].sort();
				_inserted_items.push(_current_item);
			}
		}
		
		return _inserted_items;
	}
	
	//----------------------------------------------------------------------
	this.CreateSelectionOfLayer = function(LayerName, ShapeList)
	{
		var _layer_index = this.GetLayerIndex(LayerName);
		
		// Clear the selection
		this._selections[_layer_index] = null;
		this._selections[_layer_index] = new Array();
		
		// Crete the new selection
		for(var i = 0; i < ShapeList.length; i++)
			this._selections[_layer_index].push(ShapeList[i]);
			
		this._selections[_layer_index].sort();
	}
	
	//----------------------------------------------------------------------
	this.ClearSelectionOfLayer = function(LayerName)
	{
		var _layer_index = this.GetLayerIndex(LayerName);
		this._selections[_layer_index] = null;
		this._selections[_layer_index] = new Array();
	}
	
	//----------------------------------------------------------------------
	// Select by row
	//----------------------------------------------------------------------
	this.SelectShapes = function(MapName, MapExtent, LayerName, ShapeList)
	{
		this.CreateSelectionOfLayer(LayerName, ShapeList);
		var _shapes = ShapeList.join(',');
		
		BeginPaint();
		
		Ext.Ajax.request(
		{
			url		: 'Framework/Server/Core/MsExt.Selection.SelectShape.php',
			method	:'POST',
			params	: {
						map_name: MapName,
						extent	: MapExtent,
						layer	: LayerName,
						shapes 	: _shapes
						},
			callback: function (options,success,response)
					{
						var responseData = Ext.decode(response.responseText);
						mainApp.UpdateMapPanel( responseData.result );
						_clean_selection._CleanSelection.enable();
						EndPaint();
					}
		});
	}
	
	//----------------------------------------------------------------------
	this.AppendShapesToSelection = function(MapName, MapExtent, LayerName, ShapeList)
	{
		var _inserted_shapes = this.AddSelectionToLayer(LayerName, ShapeList);
		if(_inserted_shapes.length == 0)
			return;
		var _shapes = _inserted_shapes.join(',');
		
		BeginPaint();
		
		Ext.Ajax.request(
		{
			url		: 'Framework/Server/Core/MsExt.Selection.AppendShapes.php',
			method	:'POST',
			params	: {
						map_name: MapName,
						extent	: MapExtent,
						layer	: LayerName,
						shapes : _shapes
						},
			callback: function (options,success,response)
					{
						var responseData = Ext.decode(response.responseText);
						mainApp.UpdateMapPanel( responseData.result );
						_clean_selection._CleanSelection.enable();
						EndPaint();
					}
		});
	}
	
	//----------------------------------------------------------------------
	this.RenameLayer = function(LayerName, NewLayerName)
	{
		var _layer_index = this.GetLayerIndex(LayerName);
		this._layers[_layer_index] = NewLayerName;
	}
	
	//----------------------------------------------------------------------
	this.RemoveLayer = function(LayerName)
	{
		var _layer_index = this.GetLayerIndex(LayerName);
		
		// Delete items of the index
		this._layers[_layer_index] = null;
		this._selections[_layer_index] = null;
		
		// Move the last position to the index (swap)
		this._layers[_layer_index] = this._layers[this._layers.length - 1];
		this._selections[_layer_index] = this._selections[this._selections.length - 1];
		
		// Delete the last item
		this._layers.pop();
		this._selections.pop();
	}
	
	this.HaveSelection = function(LayerName)
	{
		var index  = this.IndexOf(this._layers, LayerName);
		if(index == -1) return false;
		if(this._selections[index].length == 0) return false;
		return true;
	}
}

MsExt.Core.Selection = new msExt_Selection();