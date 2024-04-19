function msExt_CacheManager()
{
	this._store = new Array();
	
	// Create a new space por information for a layer
	this.CreateLayer = function(LayerName)
	{
		// Create the array for store layers information
		this._store[LayerName] = new Array();
	}
	
	// Delete the information of a layer and it space
	this.DeleteLayer = function(LayerName)
	{
		// Delete all items of the layer
		for(Item in this._store[LayerName])
			delete this._store[LayerName][Item];
		this._store[LayerName] = null;
		
		// Delete the layer
		delete this._store[LayerName];
	}
	
	// Clean the cache
	this.Clean = function()
	{
		// Iterate each layer
		for(LayerName in this._store)
		{
			// Delete all items of the layer
			for(Item in this._store[LayerName])
				delete this._store[LayerName][Item];
			
			this._store[LayerName] = null;
			// Delete the layer
			delete this._store[LayerName];
		}
		
		this._store = null;
		this._store = new Array();
	}
	
	this.GetItemOfLayer(LayerName, ItemKey)
	{
		return this._store[LayerName][ItemKey];
	}
	
	this.GetLayersNames = function()
	{
		var names = new Array();
		
		for(Lay in this._store)
			names.push(Lay);
		
		return names;
	}
}

MsExt.Common.CacheManager = new msExt_CacheManager();