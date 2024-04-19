Map.prototype.query_by_circle = function(aDisplay) {
  this.resetMapEventHandlers();
  this.setCurrentLayer('drawing');
  this.getDisplay(aDisplay).setTool('draw.circle');

  this.onNewFeature = function(aFeature) 
  {
      this.onToolUnset();
  };
  this.onFeatureInput = this.onFeatureChange = function(aFeature)
  {
    fillForm(aFeature);
	_query_plg.QueryByCircle();
	//CartoWeb.trigger('Query.Perform', "doSubmit()");
  };
  this.onToolUnset = function() {
    //clear the outline_poly's display layer
    this.getDisplay(aDisplay).clearLayer('drawing');
    this.onCancel();
  };
  this.onCancel = function() {
    emptyForm();
  };
};

Information.prototype.QueryByCircle = function()
{
	if(document.getElementById('selected_layer').value == 0)
	{
		msg('Error','Por favor, seleccione la capa que desea consultar');
		mainmap.getDisplay('map').clearLayer('drawing');
		return;
	}
	
	_wait = Ext.Msg.wait('Por favor espere...','Buscando...');
	
	var info = Ext.getCmp('selection_coords').getValue().split(';');
	var pto = info[0].split(',');
	var _x = pto[0];
	var _y = pto[1];
	var _radius = info[1];
	
	if(_radius == 0)
	{
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
	else
	{
		Ext.Ajax.request(
		{
			url		: 'Plugins/Query/Server/query_by_circle.php',
			method	:'POST',
			params	: {
						map_name: document.getElementById('map_name').value,
						mapa_x 	: _x,
						mapa_y	: _y,
						radius	: _radius,
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

Information.prototype.onQueryByCircle = function()
{
	mainApp.UnToggleMapButtons();
	mainApp.UnToggleTBarButtons();
	this._qByCircleBtn.toggle(true);
	
	mainmap.query_by_circle('map');
	_last_fn = 'mainmap.query_by_circle';
}