
Map.prototype.query_by_point = function(aDisplay) {
  this.selectionPoint(aDisplay, _query_plg.QueryByPoint);
  this.getDisplay(aDisplay).docObj.style.cursor = "help";
};

Information.prototype.QueryByPoint = function()
{	
	if(document.getElementById('selected_layer').value == 0)
	{
		msg('Error','Por favor, seleccione la capa que desea consultar');
		mainmap.getDisplay('map').clearLayer('drawing');
		return;
	}

	_wait = Ext.Msg.wait('Por favor espere...','Buscando...');
	
	var pto = Ext.getCmp('selection_coords').getValue().split(' ');
	_x = pto[0];
	_y = pto[1];

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

Information.prototype.onQueryByPoint = function()
{
	mainApp.UnToggleMapButtons();
	mainApp.UnToggleTBarButtons();
	this._qByPointBtn.toggle(true);
	
	mainmap.query_by_point('map');
	_last_fn = 'mainmap.query_by_point';
}