/*
* Update Layer Plugin
*/
Map.prototype.update_by_point = function(aDisplay) {
  this.selectionPoint(aDisplay, _update_plg.UpdateByPoint.createDelegate(_update_plg));
  this.getDisplay(aDisplay).docObj.style.cursor = "crosshair";
};

function UpdateLayer()
{
	this._upLayerBtn = null;
//	this._btn_id = 1;

	this._is_enable = false;
	
	this.GetName = function()
	{
		return 'Actualizar';
	}

	this.InitComponents = function()
	{
		this._upLayerBtn = new Ext.Button(
		{
			id	 : 'upLayer',
			iconCls:'up_field_layer',
			tooltip	: 'Actualizar campos de una capa',
			handler : this.onUpdateByPoint.createDelegate(this)
		});

		
	}

	this.Init = function()
	{
		this.InitComponents();

		var _menu_up = [
				{text:'Actualizar capa', id:'menu_update_id', iconCls: 'up_field_layer', handler: this.onUpdateByPoint.createDelegate()}
			];

		mainApp.AddTBarButton({xtype: 'tbseparator', id: 'uplayer_sep_id'});
		mainApp.AddTBarButton(this._upLayerBtn);
		
		mainApp.AddMenu('Actualizar',_menu_up);

		this._is_enable = true;
	}

	this.Enable = function()
	{
		Ext.getCmp('uplayer_sep_id').show();
		this._upLayerBtn.show();
		Ext.getCmp('menu_update_id').show();

		this._is_enable = true;
	}

	this.Disable = function()
	{
		Ext.getCmp('uplayer_sep_id').hide();
		this._upLayerBtn.hide();
		Ext.getCmp('menu_update_id').hide();

		this._is_enable = false;
	}

	this.IsEnable = function()
	{
		return this._is_enable;
	}

	this.UpFieldLayer = function(_info, _gid)
	{
		
		document.getElementById('btn_update').style.display = 'block';
		Ext.getCmp('txt_update').setText('<b>Actualizado la capa...</b>');
		Ext.getCmp('_update_info_win').disable();
		Ext.Ajax.request(
		{
			url		: 'Plugins/UpdateLayer/Server/update_layer.php',
			method	:'POST',
			params	: {
						map_name: document.getElementById('map_name').value,
						layer: document.getElementById('selected_layer').value, 
						info:_info,
						gid : _gid
						},
			callback: function (options,success,response)
					{
						_wait.hide();
						responseData = Ext.decode(response.responseText);
						
						
						if(responseData.result == 1)
						 Ext.getCmp('_update_info_win').close();
						else
						{
							Ext.getCmp('txt_update').setText('&nbsp;');
							document.getElementById('btn_update').style.display = 'none';
							Ext.getCmp('_update_info_win').enable();
							msg('Error',responseData.result);
						}
						mainmap.getDisplay('map').clearLayer('drawing');
						
						
					}
		});
		  
	}
	
	this.UpdateByPoint = function()
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
		var _scope = this;

		Ext.Ajax.request(
		{
			url		: 'Plugins/UpdateLayer/Server/update_by_point.php',
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
						responseData = Ext.decode(response.responseText);
						
						if(responseData.shapeindex != -1)
						_scope.ShowInfoUpdate(response.responseText, document.getElementById('selected_layer').value, responseData.shapeindex);
						else
						msg('Error','Por favor, debe seleccionar el objetivo que desea modificar');
						
						mainmap.getDisplay('map').clearLayer('drawing');
						
					}
		});
	}
	
	this.ShowInfoUpdate = function(_source, _layer_name, _gid)
	{
		var index_one = _source.indexOf('[') + 1;
		var index_two = _source.indexOf(']');
		var shape = Ext.getCmp('shapeIndex').getValue();

		var _data = (index_two != -1) ? _source.substring(index_one , index_two ) : _source;
		var s = Ext.decode(_data);
		

		var pGridUpdate = new Ext.grid.PropertyGrid({
			title: 'Capa: ' + _layer_name,
			disableSelection : true,
			source  : s,
			bbar	: [
						{
							xtype	: 'button',
							iconCls	: 'loading',
							id		:'btn_update',
							style	: {display:'none'}
						},
						{
							xtype : 'tbtext',
							text: '&nbsp;', 
							id:'txt_update'
						}]
			

			
		});
		
		mainmap.getDisplay('map').clearLayer('drawing');
		
		var _scope = this;
		var _update_info_win = new Ext.Window({
			title: 'Actualizar Información',
			closable:false,
			id:'_update_info_win',
			collapsible : true,
			modal: false,
			shadow:'frame',
			width:300,
			height: 350,
			border:true,
			plain:true,
			layout: 'fit',
			items: [pGridUpdate],
			buttons:
			[
				{
					text: 'Actualizar',
					handler: function()
							{
								var _pgrid_data = pGridUpdate.getSource();
								var _str_data = "";
								for(key in _pgrid_data)
								  _str_data += ( _str_data ? "<__new_field>" : "") + key + "<__field_value/>" + _pgrid_data[key];
								
								_scope.UpFieldLayer(_str_data, _gid);
							}
				},
				{
					text: 'Cerrar',
					handler: function(){_update_info_win.close();}
				}
			]
		});

		_update_info_win.show();
		
	}

}

UpdateLayer.prototype.onUpdateByPoint = function()
{
	mainmap.update_by_point('map');
	_last_fn = 'mainmap.update_by_point';
	mainApp.UnToggleMapButtons();
}

var _update_plg = new UpdateLayer();
mainApp.RegisterPlugin(_update_plg);