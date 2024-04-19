//----------------------------------------------------------------------
// msExt_FieldCache class
//----------------------------------------------------------------------
function msExt_msExt_FieldCache(FieldName)
{
	this._name = FieldName;
	this._type = "unknown";
	this._have_colors = false;
	
	this._values = new Array();
	this.Index_OfItem = Index_OfItem;
}
//----------------------------------------------------------------------
msExt_FieldCache.prototype.SetType = function(FieldType)
{
	this._type = FieldType;
}
//----------------------------------------------------------------------
msExt_FieldCache.prototype.SetValues = function(ListValue)
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
msExt_FieldCache.prototype.SetColorByValues = function(Color_ValueList)
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
msExt_FieldCache.prototype.UpdateColorByValues = function(Color_ValueList)
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
msExt_FieldCache.prototype.GetName = function()
{
	return this._name;
}
//----------------------------------------------------------------------
msExt_FieldCache.prototype.GetType = function()
{
	return this._type;
}
//----------------------------------------------------------------------
msExt_FieldCache.prototype.GetValues = function()
{
	if(this._values.length == 0)
		return this._values;
	
	var _result = new Array;
	for(var i = 0; i < this._values.length; i++)
		_result.push(this._values[i][1]);
	
	return _result;
}
//----------------------------------------------------------------------
msExt_FieldCache.prototype.GetValuesByColor = function()
{
	return this._values;
}
//----------------------------------------------------------------------
msExt_FieldCache.prototype.GetDeepCopy = function()
{
	var _new_values = new Array();
	
	if(this._values.length != 0)
		for(var i = 0; i < this._values.length; i++)
			_new_values.push([this._values[i][0],this._values[i][1]]);
		
	var _field_cache = new msExt_FieldCache(this._name);
	_field_cache.SetType(this._type);
	_field_cache.SetColorByValues(_new_values);
	
	return _field_cache;
}
//----------------------------------------------------------------------
msExt_FieldCache.prototype.HaveColor = function()
{
	return this._have_colors;
}
//----------------------------------------------------------------------
msExt_FieldCache.prototype.Destroy = function()
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
