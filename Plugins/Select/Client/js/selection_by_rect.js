// Define select by rect into the Map object
Map.prototype.select_by_bbox = function(aDisplay) {
  this.selectionBox(aDisplay, _selection_plg.SelectByRect);
  this.getDisplay(aDisplay).docObj.style.cursor = "hand";
};

Selection.prototype.SelectByRect = function()
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
					query_rect	: document.getElementById('selection_coords').value,
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

Selection.prototype.onSelectByRect = function()
{
	mainApp.UnToggleMapButtons();
	mainApp.UnToggleTBarButtons();
	this._SelectRectBtn.toggle(true);
	
	mainmap.select_by_bbox('map');
	_last_fn = 'mainmap.select_by_bbox';
}