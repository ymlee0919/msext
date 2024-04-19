
Map.prototype.query_by_bbox = function(aDisplay) {
  this.selectionBox(aDisplay, _query_plg.QueryByRect);
  this.getDisplay(aDisplay).docObj.style.cursor = "help";
};

Information.prototype.QueryByRect = function()
{
	if(document.getElementById('selected_layer').value == 0)
	{
		msg('Error','Por favor, seleccione la capa que desea consultar');
		mainmap.getDisplay('map').clearLayer('drawing');
		return;
	}

	_wait = Ext.Msg.wait('Por favor espere...','Buscando...');
	var rect = Ext.getCmp('selection_coords').getValue().split(' ');
	
	// Query a point
	if(rect[0] == rect[2] && rect[1] == rect[3])
	{
		var _x = rect[4];
		var _y = rect[5];
			
		Ext.Ajax.request(
		{
			url		: 'Plugins/Query/Server/query_by_point.php',
			method	:'POST',
			params	: {
						map_name: document.getElementById('map_name').value,
						mapa_x 	: _x,
						mapa_y	: _y,
						extent	: document.getElementById('extent').value,
						layer	: document.getElementById('selected_layer').value
						},
			callback: function (options,success,response)
					{
						_wait.hide();
						Ext.getCmp('shapeIndex').setValue(Ext.decode(response.responseText).shapeindex);
						ShowPointInfo(response.responseText, document.getElementById('selected_layer').value);
					}
		});
	}
	// Query a rectangle
	else
	{
		Ext.Ajax.request(
		{
			url		: 'Plugins/Query/Server/query_by_rect.php',
			method	:'POST',
			params	: {
						map_name: document.getElementById('map_name').value,
						query_rect	: document.getElementById('selection_coords').value,
						layer	: document.getElementById('selected_layer').value
						},
			callback: function (options,success,response)
					{
						_wait.hide();
						var responseData = Ext.decode(response.responseText);
						if(responseData.count == 0)
							msg('Información','La selección no incluye elemento alguno');
						else
							ShowShapeInfo(responseData, document.getElementById('selected_layer').value);
					}  
		});
	}
}

Information.prototype.onQueryByRect = function()
{
	mainApp.UnToggleMapButtons();
	mainApp.UnToggleTBarButtons();
	this._qByRectBtn.toggle(true);
	
	mainmap.query_by_bbox('map');
	_last_fn = 'mainmap.query_by_bbox';
}