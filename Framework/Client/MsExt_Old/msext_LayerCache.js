//----------------------------------------------------------------------
function Index_Of(_array, _item)
{
	for(var i = 0; i < _array.length; i++)
		if(	_array[i].GetName() == _item )
			return i;

	return -1;
}
//----------------------------------------------------------------------
function Index_OfItem(_array, pos, _item)
{
	for(var i = 0; i < _array.length; i++)
		if(	_array[i][pos] == _item )
			return i;

	return -1;
}
//----------------------------------------------------------------------

//----------------------------------------------------------------------
// FieldCache class
//----------------------------------------------------------------------
function FieldCache(FieldName)
{
	this._name = FieldName;
	this._type = "unknown";
	this._have_colors = false;
	
	this._values = new Array();
	this.Index_OfItem = Index_OfItem;
}
//----------------------------------------------------------------------
FieldCache.prototype.SetType = function(FieldType)
{
	this._type = FieldType;
}
//----------------------------------------------------------------------
FieldCache.prototype.SetValues = function(ListValue)
{
	var _is_numeric = true;
	
	for(var i = 0; i < ListValue.length; i++)
	{
		this._values[i] = ["000000",ListValue[i]];
		if(isNaN(ListValue[i]))
			_is_numeric = false;
	}
	
	this._type = (_is_numeric) ? 'numeric' : 'string';
}
//----------------------------------------------------------------------
// Each item is [[color][value]]
FieldCache.prototype.SetColorByValues = function(Color_ValueList)
{
	var _is_numeric = true;
	
	for(var i = 0; i < Color_ValueList.length; i++)
	{
		this._values[i] = Color_ValueList[i];		
		if(isNaN(Color_ValueList[i][1]))
			_is_numeric = false;
	}
	
	this._type = (_is_numeric) ? 'numeric' : 'string';
	this._have_colors = true;
}

//----------------------------------------------------------------------
// Each item is [[color][value]]
FieldCache.prototype.UpdateColorByValues = function(Color_ValueList)
{
	var _index = 0;
	for(var i = 0; i < Color_ValueList.length; i++)
	{
		_index = this.Index_OfItem(this._values, 1, Color_ValueList[i][1]);
		if(_index != -1)
			this._values[_index][0] = Color_ValueList[i][0];
			
		if(isNaN(Color_ValueList[i][1]))
			_is_numeric = false;
	}
	
	this._type = (_is_numeric) ? 'numeric' : 'string';
	this._have_colors = true;
}
//----------------------------------------------------------------------
FieldCache.prototype.GetName = function()
{
	return this._name;
}
//----------------------------------------------------------------------
FieldCache.prototype.GetType = function()
{
	return this._type;
}
//----------------------------------------------------------------------
FieldCache.prototype.GetValues = function()
{
	if(this._values.length == 0)
		return this._values;
	
	var _result = new Array;
	for(var i = 0; i < this._values.length; i++)
		_result.push(this._values[i][1]);
	
	return _result;
}
//----------------------------------------------------------------------
FieldCache.prototype.GetValuesByColor = function()
{
	return this._values;
}
//----------------------------------------------------------------------
FieldCache.prototype.GetDeepCopy = function()
{
	var _new_values = new Array();
	
	if(this._values.length != 0)
		for(var i = 0; i < this._values.length; i++)
			_new_values.push([this._values[i][0],this._values[i][1]]);
		
	var _field_cache = new FieldCache(this._name);
	_field_cache.SetType(this._type);
	_field_cache.SetColorByValues(_new_values);
	
	return _field_cache;
}
//----------------------------------------------------------------------
FieldCache.prototype.HaveColor = function()
{
	return this._have_colors;
}
//----------------------------------------------------------------------
FieldCache.prototype.Destroy = function()
{
	for(var i = 0; i < this._values.length; i++)
		this._values.pop();
	
	if(this._have_colors)
		for(var i = 0; i < this._values.length; i++)
			this._colors.pop();
		
	this._values = null;
	this._colors = null;
	
	this._name = null;
	this._type = null;
	this._have_colors = null;
}

//----------------------------------------------------------------------
// LayerCache class 
//----------------------------------------------------------------------

function LayerCache(LayerName)
{
	this._name = LayerName;
	this._fields = new Array();
	this.Index_Of = Index_Of;
}
//----------------------------------------------------------------------
LayerCache.prototype.GetName = function()
{
	return this._name;
}
//----------------------------------------------------------------------
LayerCache.prototype.SetFields = function(FieldsList)
{
	for(var i = 0; i < FieldsList.length; i++)
		this._fields.push(new FieldCache(FieldsList[i]));
}
//----------------------------------------------------------------------
LayerCache.prototype.SetFieldValues = function(FieldName, ListValue)
{
	var _index = this.Index_Of(this._fields, FieldName);
	if(_index == -1)
		return;
		
	this._fields[_index].SetValues(ListValue);
}
//----------------------------------------------------------------------
LayerCache.prototype.SetFieldColorsByValues = function(FieldName, Color_ValueList)
{
	var _index = this.Index_Of(this._fields, FieldName);
	if(_index == -1)
		return;
		
	this._fields[_index].SetColorByValues(Color_ValueList);
}
//----------------------------------------------------------------------
LayerCache.prototype.SetFieldType = function (FieldName, FieldType)
{
	var _index = this.Index_Of(this._fields, FieldName);
	if(_index == -1)
		return;
	
	this._fields[_index].SetType(FieldType);
}
//----------------------------------------------------------------------
LayerCache.prototype.Rename = function(NewName)
{
	this._name = NewName;
}
//----------------------------------------------------------------------
LayerCache.prototype.GetFieldList = function()
{
	var _list = new Array();
	
	for(var i = 0; i < this._fields.length; i++)
		_list.push(this._fields[i].GetName());
	
	return _list;
}
//----------------------------------------------------------------------
LayerCache.prototype.GetFieldType = function(FieldName)
{
	var _index = this.Index_Of(this._fields, FieldName);
	if(_index == -1)
		return "null";
	return this._fields[_index].GetType();
}
//----------------------------------------------------------------------
LayerCache.prototype.GetFieldsByType = function(FieldName)
{
	var _result = new Array();
	for(var i = 0; i < this._fields.length; i++)
		_result.push([ this._fields[i].GetName(), this._fields[i].GetType()]);
		
	return _result;
}
//----------------------------------------------------------------------
LayerCache.prototype.GetFieldValues = function(FieldName)
{
	var _index = this.Index_Of(this._fields, FieldName);
	if(_index == -1)
		return "null";
	
	return this._fields[_index].GetValues();
}
//----------------------------------------------------------------------
LayerCache.prototype.GetFieldValuesByColor = function(FieldName)
{
	var _index = this.Index_Of(this._fields, FieldName);
	if(_index == -1)
		return "null";
	
	return this._fields[_index].GetValuesByColor();
}
//----------------------------------------------------------------------
LayerCache.prototype.GetDeepCopy = function()
{
	var _layer_cache = new LayerCache(this._name);
	for(var i = 0; i < this._fields.length; i++)
		_layer_cache._fields.push( this._fields[i].GetDeepCopy() );
	
	return _layer_cache;
}
//----------------------------------------------------------------------
LayerCache.prototype.FieldHaveColor = function(FieldName)
{
	var _index = this.Index_Of(this._fields, FieldName);
	if(_index == -1)
		return false;
	
	return this._fields[_index].HaveColor();
}
//----------------------------------------------------------------------
LayerCache.prototype.UpdateFieldColorByValues = function(FieldName, ColorList_Values)
{
	var _index = this.Index_Of(this._fields, FieldName);
	if(_index == -1)
		return;
	
	this._fields[_index].UpdateColorByValues(ColorList_Values);
}
//----------------------------------------------------------------------
LayerCache.prototype.Destroy = function()
{
	var _count = this._fields.length;
	for(var i = 0; i < _count; i++)
	{
		this._fields[i].Destroy();
		this._fields[i] = null;
	}
	
	while(_count--)
		this._fields.pop();
		
	this._fields = null;
}

//----------------------------------------------------------------------
// Controler class
//----------------------------------------------------------------------
function msExt_CacheManager()
{
	this._layers = new Array();
	this.Index_Of = Index_Of;
}
//----------------------------------------------------------------------
msExt_CacheManager.prototype.AddLayer = function(LayerName)
{
	if(this.Index_Of(this._layers,LayerName) == -1)
		this._layers.push( new LayerCache(LayerName) );
}
//----------------------------------------------------------------------
msExt_CacheManager.prototype.AddFieldList = function(LayerName, FieldsList)
{
	var _index = this.Index_Of(this._layers, LayerName);
	if(_index == -1)
		return;
	
	this._layers[_index].SetFields(FieldsList);
}
//----------------------------------------------------------------------
msExt_CacheManager.prototype.SetFieldType = function(LayerName, FieldName, Type)
{
	var _index = this.Index_Of(this._layers, LayerName);
	if(_index == -1)
		return;
		
	this._layers[_index].SetFieldType(FieldName, Type);
}
//----------------------------------------------------------------------
msExt_CacheManager.prototype.SetFieldValues = function(LayerName, FieldName, ListValue)
{
	var _index = this.Index_Of(this._layers, LayerName);
	if(_index == -1)
		return;
		
	this._layers[_index].SetFieldValues(ListValue);
}
//----------------------------------------------------------------------
msExt_CacheManager.prototype.SetFieldValuesByColor = function(LayerName, FieldName, ListValue)
{
	var _index = this.Index_Of(this._layers, LayerName);
	if(_index == -1)
		return;
		
	this._layers[_index].SetFieldColorsByValues(FieldName, ListValue);
}
//----------------------------------------------------------------------
msExt_CacheManager.prototype.DuplicateLayer = function(LayerName, NewLayerName)
{
	var _index = this.Index_Of(this._layers, LayerName);
	if(_index == -1)
		return;
		
	this._layers.push(this._layers[_index].GetDeepCopy());
	this._layers[this._layers.length - 1]._name = NewLayerName;
}
//----------------------------------------------------------------------
msExt_CacheManager.prototype.RenameLayer = function(Layer, NewLayerName)
{
	var _index = this.Index_Of(this._layers, NewLayerName);
	if(_index == -1)
		return;
		
	this._layers[_index].Rename(NewLayerName);
}
//----------------------------------------------------------------------
msExt_CacheManager.prototype.GetLayers = function()
{
	var _result = new Array();
	for(var i = 0; i < this._layers.length; i++)
		_result.push(this._layers[i].GetName());
	
	return _result;
}
//----------------------------------------------------------------------
msExt_CacheManager.prototype.GetArrayOfLayers = function()
{
	var _result = new Array();
	for(var i = 0; i < this._layers.length; i++)
		_result.push([this._layers[i].GetName()]);
	
	return _result;
}
//----------------------------------------------------------------------
msExt_CacheManager.prototype.GetFields = function(LayerName)
{
	var _index = this.Index_Of(this._layers, LayerName);
	if(_index == -1)
		return null;
		
	return this._layers[_index].GetFieldList();
}
//----------------------------------------------------------------------
msExt_CacheManager.prototype.GetFieldType = function(LayerName, FieldName)
{
	var _index = this.Index_Of(this._layers, LayerName);
	if(_index == -1)
		return null;
		
	return this._layers[_index].GetFieldType(FieldName);
}
//----------------------------------------------------------------------
msExt_CacheManager.prototype.GetFieldsByType = function(LayerName, FieldName)
{
	var _index = this.Index_Of(this._layers, LayerName);
	if(_index == -1)
		return null;
		
	return this._layers[_index].GetFieldsByType();
}
//----------------------------------------------------------------------
msExt_CacheManager.prototype.GetFieldValues = function(LayerName, FieldName)
{
	var _index = this.Index_Of(this._layers, LayerName);
	if(_index == -1)
		return null;
		
	return this._layers[_index].GetFieldValues(FieldName);
}
//----------------------------------------------------------------------
msExt_CacheManager.prototype.GetFieldValuesByColor = function(LayerName, FieldName)
{
	var _index = this.Index_Of(this._layers, LayerName);
	if(_index == -1)
		return null;
		
	return this._layers[_index].GetFieldValuesByColor(FieldName);
}
//----------------------------------------------------------------------
msExt_CacheManager.prototype.FieldHaveColor = function(LayerName, FieldName)
{
	var _index = this.Index_Of(this._layers, LayerName);
	if(_index == -1)
		return false;
	
	return this._layers[_index].FieldHaveColor(FieldName);
}
//----------------------------------------------------------------------
msExt_CacheManager.prototype.UpdateFieldColorByValues = function(LayerName, FieldName, ColorList_Values)
{
	var _index = this.Index_Of(this._layers, LayerName);
	if(_index == -1)
		return null;
		
	this._layers[_index].UpdateFieldColorByValues(FieldName, ColorList_Values);
}
//----------------------------------------------------------------------
msExt_CacheManager.prototype.RemoveLayer = function(LayerName)
{
	var _index = this.Index_Of(this._layers, LayerName);
	if(_index == -1)
		return null;
	
	this._layers[_index].Destroy();
	this._layers[_index] = null;
	this._layers.splice(_index,1);
}
//----------------------------------------------------------------------

MsExt.Common.CacheManager = new msExt_CacheManager();