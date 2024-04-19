
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
				{text:'Información puntual', iconCls: 'query_point', handler: this.onUpdateByPoint.createDelegate()}
			];

		mainApp.AddTBarButton({xtype: 'tbseparator', id: 'uplayer_sep_id'});
		mainApp.AddTBarButton(this._upLayerBtn);
		
		mainApp.AddMenu('Actualizar',_menu_up);

		//mainApp.AddHiddenField('shapeIndex','shapeIndex',-1);
		//mainApp.AddHiddenField('row_index','row_index',-1);

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

	this.GetNextId = function()
	{
		return 'win_btn_' + (this._btn_id++);
	}
	
	this.UpFieldLayer = function(frm, layer)
	{
		if(frm.getForm().isValid())
		frm.getForm().submit({
			url:'Plugins/UpdateLayer/Server/update_layer.php',
			params:{layer: layer},
			failure: function(form, action)
			{
				if (action.result.resp == 1)
				{										
					Ext.getCmp('_up_layer_win_centro_salud').close();
				}
				
			}
		})   
	}	
}

var _update_plg = new UpdateLayer();
mainApp.RegisterPlugin(_update_plg);