// Define select by point into the Map object
Map.prototype.select_by_point = function(aDisplay) {
  this.selectionPoint(aDisplay, _selection_plg.SelectByPoint);
  this.getDisplay(aDisplay).docObj.style.cursor = "default";
};

Selection.prototype.SelectByPoint = function()
{
	if(document.getElementById('selected_layer').value == 0)
	{
		msg('Error','Por favor, seleccione una capa');
		mainmap.getDisplay('map').clearLayer('drawing');
		return;
	}
	
	var pto = Ext.getCmp('selection_coords').getValue().split(' ');
	var _x = pto[0];
	var _y = pto[1];
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
					extent	: document.getElementById('extent').value,
					layer	: _layer_name
				  },
		callback: function (options,success,response)
				{
					var responseData = Ext.decode(response.responseText);
					if(responseData.action == 'add')
					{
						mainApp.UpdateMapPanel( responseData.result);
						//mainApp.UpdateMapLayerControl();
						_clean_selection._CleanSelection.enable();
						Ext.getCmp('unmark_selection_menu').enable();
						
						MsExt.Core.Selection.ClearSelectionOfLayer(_layer_name);
						MsExt.Core.Selection.CreateSelectionOfLayer(_layer_name, responseData.list );
					}
					else if(responseData.action == 'clear')
					{						
						mainApp.UpdateMapPanel( responseData.result);
						//mainApp.UpdateMapLayerControl();
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

Selection.prototype.onSelectByPoint = function()
{
	mainApp.UnToggleMapButtons();
	mainApp.UnToggleTBarButtons();
	this._SelectPointBtn.toggle(true);
	
	mainmap.select_by_point('map');
	_last_fn = 'mainmap.select_by_point';
}