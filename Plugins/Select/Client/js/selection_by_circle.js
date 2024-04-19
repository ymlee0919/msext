Map.prototype.select_by_circle = function(aDisplay) {
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
	_selection_plg.SelectByCircle();
  };
  this.onToolUnset = function() {
    this.getDisplay(aDisplay).clearLayer('drawing');
    this.onCancel();
  };
  this.onCancel = function() {
    emptyForm();
  };
};

Selection.prototype.SelectByCircle = function()
{
	if(document.getElementById('selected_layer').value == 0)
	{
		msg('Error','Por favor, seleccione una capa');
		mainmap.getDisplay('map').clearLayer('drawing');
		return;
	}

	var info = Ext.getCmp('selection_coords').getValue().split(';');
	var pto = info[0].split(',');
	var _x = pto[0];
	var _y = pto[1];
	var _radius = info[1];
	var _layer_name = document.getElementById('selected_layer').value;

	BeginPaint();

	Ext.Ajax.request(
	{
		url		: 'Plugins/Select/Server/selection_functions.php',
		method	:'POST',
		params	: {
					map_name: document.getElementById('map_name').value,
					mapa_x 	: _x,
					mapa_y	: _y,
					radius	: _radius,
					extent	: document.getElementById('extent').value,
					layer	: document.getElementById('selected_layer').value
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
					else 
					{
						if(responseData.action == 'clear')
						{
							mainApp.UpdateMapPanel( responseData.result);
							_clean_selection._CleanSelection.disable();
							Ext.getCmp('unmark_selection_menu').disable();

							MsExt.Core.Selection.ClearSelectionOfLayer(_layer_name);
						}
						else
							mainmap.getDisplay('map').clearLayer('drawing');
					}
					EndPaint();
				}
	});
}

Selection.prototype.onSelectByCircle = function()
{
	mainApp.UnToggleMapButtons();
	mainApp.UnToggleTBarButtons();
	this._SelectCircleBtn.toggle(true);
	
	mainmap.select_by_circle('map');
	_last_fn = 'mainmap.select_by_circle';
}