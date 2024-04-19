Map.prototype.select_by_polyline = function(aDisplay) {
  this.resetMapEventHandlers();
  this.setCurrentLayer('drawing');
  this.getDisplay(aDisplay).setTool('draw.line');

  this.onNewFeature = function(aFeature) {
      this.onToolUnset();
  };
  this.onFeatureInput = this.onFeatureChange = function(aFeature) {
    fillForm(aFeature);
	_selection_plg.SelectByPolyline(aFeature.getWKT());
  };
  this.onToolUnset = function() {
    this.getDisplay(aDisplay).clearLayer('drawing');
    this.onCancel();
  };
  this.onCancel = function() {
    emptyForm();
  };
};

Selection.prototype.SelectByPolyline = function(WKT_string)
{
	if(document.getElementById('selected_layer').value == 0)
	{
		msg('Error','Por favor, seleccione una capa');
		mainmap.getDisplay('map').clearLayer('drawing');
		return;
	}

	BeginPaint();
	var _layer_name = document.getElementById('selected_layer').value;

	Ext.Ajax.request(
	{
		url		: 'Plugins/Select/Server/selection_functions.php',
		method	:'POST',
		params	: {
					map_name: document.getElementById('map_name').value,
					polygon	: WKT_string,
					layer	: document.getElementById('selected_layer').value,
					extent	: document.getElementById('extent').value
				  },
		callback: function (options,success,response)
				{
					var responseData = Ext.decode(response.responseText);
					if(responseData.action == 'add')
					{
						mainApp.UpdateMapPanel( responseData.result);
						_clean_selection._CleanSelection.enable();
						Ext.getCmp('unmark_selection_menu').enable();

						MsExt.Core.Selection.ClearSelectionOfLayer(_layer_name);
						MsExt.Core.Selection.CreateSelectionOfLayer(_layer_name, responseData.list );
					}
					else if(responseData.action == 'clear')
					{
						mainApp.UpdateMapPanel( responseData.result);
						_clean_selection._CleanSelection.disable();
						Ext.getCmp('unmark_selection_menu').disable();

						MsExt.Core.Selection.ClearSelectionOfLayer(_layer_name);
					}
					else
						mainmap.getDisplay('map').clearLayer('drawing');
					EndPaint();
				}
	});
}

Selection.prototype.onSelectByPolyline = function()
{
	mainApp.UnToggleMapButtons();
	mainApp.UnToggleTBarButtons();
	this._SelectPolylineBtn.toggle(true);

	mainmap.select_by_polyline('map');
	_last_fn = 'mainmap.select_by_polyline';
}
