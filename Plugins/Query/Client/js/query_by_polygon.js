
Map.prototype.query_by_polygon = function(aDisplay) {
  this.resetMapEventHandlers();
  this.setCurrentLayer('drawing');
  this.getDisplay(aDisplay).setTool('draw.poly');

  this.onNewFeature = function(aFeature) {
      this.onToolUnset();
  };
  this.onFeatureInput = this.onFeatureChange = function(aFeature) {
    fillForm(aFeature);
	_query_plg.QueryByPolygon(aFeature.getWKT());
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

Information.prototype.QueryByPolygon =  function(WKT_string)
{
	if(document.getElementById('selected_layer').value == 0)
	{
		msg('Error','Por favor, seleccione la capa que desea consultar');
		mainmap.getDisplay('map').clearLayer('drawing');
		return;
	}
	
	_wait = Ext.Msg.wait('Por favor espere...','Buscando...');
	
	Ext.Ajax.request(
	{
		url		: 'Plugins/Query/Server/query_by_polygon.php',
		method	:'POST',
		params	: {
					map_name: document.getElementById('map_name').value,
					polygon	: WKT_string,
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

Information.prototype.onQueryByPoly = function()
{
	mainApp.UnToggleMapButtons();
	mainApp.UnToggleTBarButtons();
	this._qByPolyBtn.toggle(true);
	
	mainmap.query_by_polygon('map');
	_last_fn = 'mainmap.query_by_polygon';
}