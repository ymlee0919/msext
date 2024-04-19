Array.prototype.DeepClone = function()
{
	var _result = new Array();
	for(key in this)
	{
		if(typeof( this[key]) == 'object')
			_result[key] = this[key].DeepClone();
		else
			_result[key] = this[key];
	}
	
	return _result;
}

// Constructor of a HashTable
function msext_HashTable()
{
	this._hash = new Array();
}

// Create a MasterKey
msext_HashTable.prototype.CreateMKey = function(MasterKey)
{
	if( typeof( this._hash[MasterKey] ) == 'undefined')
		this._hash[MasterKey] = new Array();
}

// Delete a master key with it's content
msext_HashTable.prototype.DeleteMKey = function(MasterKey)
{
	// Delete all items of the layer
	for(Item in this._hash[MasterKey])
		delete this._hash[MasterKey][Item];

	this._hash[MasterKey] = null;

	// Delete the layer
	delete this._hash[MasterKey];
}

// Delete an item
msext_HashTable.prototype.DeleteItem = function(MasterKey, Key)
{
	if(typeof( this._hash[MasterKey] ) != 'undefined' && typeof( this._hash[MasterKey][Key] ) != 'undefined')
		delete this._hash[MasterKey][Key];
}


// Insert an item into the hash given the master key, the key and the value
msext_HashTable.prototype.Insert = function(MasterKey, Key ,Value)
{
	if( typeof( this._hash[MasterKey] ) == 'undefined')
		this._hash[MasterKey] = new Array();

	this._hash[MasterKey][Key] = Value;
}

// Insert items for a master key
msext_HashTable.prototype.InsertItems = function(MasterKey, KeyValuePairs)
{
	if( typeof( this._hash[MasterKey] ) == 'undefined')
		this._hash[MasterKey] = new Array();

	for(key in KeyValuePairs)
		this._hash[MasterKey][key] = KeyValuePairs[key];
}

// Indicate if an items existe
msext_HashTable.prototype.Contains = function(MasterKey, Key)
{
	if( typeof( this._hash[MasterKey] ) == 'undefined')
		return false;
	if( typeof( this._hash[MasterKey][Key] ) == 'undefined')
		return false;
	
	return true;
}

msext_HashTable.prototype.ContainsMKey = function(MasterKey)
{
	if( typeof( this._hash[MasterKey] ) == 'undefined')
		return false;
	return true;
}

msext_HashTable.prototype.ContainsKey = function(Key)
{
	for(MasterKey in this._hash)
		if(typeof (this._hash[MasterKey]) != 'function')
			if( typeof( this._hash[MasterKey][Key] ) == 'undefined')
				return false;
	return true;
}

// Get the array stored into the MasterKey
msext_HashTable.prototype.GetItem = function(MasterKey)
{
	return this._hash[MasterKey];
}

// Get a value given the MasterKey and the Key
msext_HashTable.prototype.GetValue = function(MasterKey, Key)
{
	return this._hash[MasterKey][Key];
}

msext_HashTable.prototype.GetAllMasterKeys = function()
{
	var keys = new Array();

	for(key in this._hash)
		if(typeof (this._hash[key]) != 'function')
			keys.push(key);
	return keys;
}

msext_HashTable.prototype.GetAllMasterKeysAsArray = function()
{
	var keys = new Array();

	for(key in this._hash)
		if(typeof (this._hash[key]) != 'function')
			keys.push([key]);
	return keys;
}

msext_HashTable.prototype.GetAllValuesOfAsArray = function(Key)
{
	var result = new Array();

	for(MasterKey in this._hash)
		if(typeof (this._hash[MasterKey]) != 'function')
			result.push([MasterKey, this._hash[MasterKey][Key]]);

	return result;
}

msext_HashTable.prototype.GetAllValuesOf = function(Key)
{
	var result = new Array();

	for(MasterKey in this._hash)
		if(typeof (this._hash[MasterKey]) != 'function')
			result.push(this._hash[MasterKey][Key]);

	return result;
}

// Clean the hash
msext_HashTable.prototype.Clean = function()
{
	// Iterate each master key
	for(MasterKey in this._hash)
	{
		// Delete all items of the master key
		for(Item in this._hash[MasterKey])
			delete this._hash[MasterKey][Item];

		this._hash[MasterKey] = null;
		// Delete the master key
		delete this._hash[MasterKey];
	}

	this._hash = null;
	this._hash = new Array();
}

msext_HashTable.prototype.DeepClone = function()
{
	var _result = new msext_HashTable();
	for(MKey in this._hash)
	{
		for(Key in this._hash[MKey])
		{
			if(typeof(this._hash[MKey][Key]) == 'object')
				_result.Insert(MKey, Key, this._hash[MKey][Key].DeepClone());
			else
				_result.Insert(MKey, Key, this._hash[MKey][Key]);
		}
	}
	
	return _result;
}

msext_HashTable.prototype.DuplicateMKey = function(MasterKey, NewMKeyName)
{
	this._hash[NewMKeyName] = this._hash[MasterKey].DeepClone();
}

msext_HashTable.prototype.RenameMKey = function(MasterKey, NewMKeyName)
{
	this._hash[NewMKeyName] = this._hash[MasterKey].DeepClone();
	this.DeleteMKey(MasterKey);
}

MsExt.Common.Cache = new msext_HashTable();
MsExt.Common.ObjectsCache = new msext_HashTable();