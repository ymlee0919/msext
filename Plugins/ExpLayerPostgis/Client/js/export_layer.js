/*
* Add Postgis Layer Plugin
*/
function ExportLayerPostgis()
{
	this._pg_grid_layers = null;
	this._pg_layer = null;
	this._exportLayerPostgisBtn = null;
	this._exp_layer = null;
	this._exp_win = null;
	
	this._is_enable = false;

	this.Disable = function()
	{
		//Ext.getCmp('export_layer_sep_id').hide();
		this._exportLayerPostgisBtn.hide();
		Ext.getCmp('menu_export_layer_id').hide();

		this._is_enable = false;
	}

	this.Enable = function()
	{
		//Ext.getCmp('export_layer_sep_id').show();
		this._exportLayerPostgisBtn.show();
		Ext.getCmp('menu_export_layer_id').show();

		this._is_enable = true;
	}

	this.IsEnable = function()
	{
		return this._is_enable;
	}

	this.GetName = function()
	{
		return 'Exportar Capa Postgis';
	}

	this.Init = function()
	{
		var _scope = this;
		
		this._exportLayerPostgisBtn = new Ext.Button(
		{
			id	 : 'export_postgis_layer',
			iconCls:'exp_pg_layer',
			tooltip	: 'Exportar capa a postgis',
			disabled : false,
			handler : this.onExportLayerPostgis.createDelegate(this)
		});

		//mainApp.AddTBarButton({xtype: 'tbseparator', id: 'export_layer_sep_id'});
		mainApp.AddTBarButton(this._exportLayerPostgisBtn);

		this._convert_layer_menu = [
				{text:'Exportar capa a postgis', disabled : true, id: 'menu_export_layer_id', iconCls: 'exp_pg_layer', handler: this.onExportLayerPostgis.createDelegate(this)}
			];

		mainApp.AddMenu('Capas',this._convert_layer_menu);

		this._exp_layer = new Ext.form.FormPanel(
		{
			title : 'Exportar capa a postgis',
			frame : true,
			labelWidth : 75,
			id : 'form_exp_layer_params',
			items :
			[
				{
					xtype 	: 'hidden',
					name 	: 'table_name',
					id 		: 'table_name',
					value 	: 0
				},
				{
					xtype 	: 'hidden',
					name 	: 'layer_type',
					id 		: 'layer_type',
					value 	: 0
				},
				{
					xtype 	: 'hidden',
					name 	: 'name_table',
					id 		: 'name_table_exp',
					value 	: 0
				},
				{
		            xtype:'fieldset',
		            title: 'Conección',
		            collapsible: false,
		            autoHeight:true,
		            items :
					[
						{
							layout : 'column',
							items:
							[
								{layout: 'form',
									columnWidth:.5,
									defaults: { anchor :'90%'},
									defaultType: 'textfield',
									items:
									[
										{
											fieldLabel: 'Servidor',
											name: 'host',
											id: 'host_exp',
											allowBlank:false,
											blankText : 'Parámetro requerido',											
											emptyText : 'servidor...'
										},{
											fieldLabel: 'Puerto',
											name: 'port',
											id: 'port_exp',
											allowBlank:false,
											blankText : 'Parámetro requerido',
											emptyText: 'puerto...'
										},{
											fieldLabel: 'Base Datos',
											name: 'dbase',
											id: 'dbase_exp',
											allowBlank:false,
											blankText : 'Parámetro requerido',
											emptyText: 'base datos...'
										}
									]
								},
								{layout: 'form',
									columnWidth:.5,
									defaults: { anchor :'90%'},
									defaultType: 'textfield',
									items:
									[
										{
											fieldLabel: 'Usuario',
											name: 'user',
											id: 'user_exp',
											allowBlank:false,
											blankText : 'Parámetro requerido',
											emptyText: 'usuario...'
										},{
											fieldLabel: 'Contraseña',
											name: 'pass',
											id: 'pass_exp',											
											inputType : 'password'
										},{
											fieldLabel: 'Esquema',
											name: 'schema',
											id: 'schema_exp',										
											allowBlank:false,
											blankText : 'Parámetro requerido',
											emptyText: 'esquema...'
											
										}									]
								}
							]
						}
		            ]
		        }
			]
		});
		
		this._exp_win = new Ext.Window(
		{
			title: 'Exportar capa ...',
			closable:false,
			id:'_exp_win',
			iconCls: 'exp_pg_layer',
			modal: true,
			shadow:'frame',
			width:430,
			height: 220,
			border:true,
			plain:true,
			layout: 'fit',
			items: [this._exp_layer],
			buttons:
			[
				{
					text  : 'Exportar',
					id : 'exp_pg_layer_btn',
					scope : _scope,
					handler : _scope.onExportLayer.createDelegate(_scope)
				},
				{
					text: 'Cerrar',
					handler: function()
							{									
								_scope._exp_win.hide();
							}
				}
			]
		});
		
		this._is_enable = true;
	}

	this.onExportLayer = function()
	{
		if(!Ext.getCmp('form_exp_layer_params').getForm().isValid())
		{			
			return;
		}
		
		var _scope = this;
		
		_wait = Ext.Msg.wait('Por favor espere...','Exportando capa...');

		Ext.Ajax.request(
		{
			url		: 'Plugins/ExpLayerPostgis/Server/export_layer.php',
			method	:'POST',
			params	: {
						host 	: Ext.getCmp('host_exp').getValue(),
						port 	: Ext.getCmp('port_exp').getValue(),
						user 	: Ext.getCmp('user_exp').getValue(),
						pass 	: Ext.getCmp('pass_exp').getValue(),
						dbase 	: Ext.getCmp('dbase_exp').getValue(),
						schema	: Ext.getCmp('schema_exp').getValue(),
						table	: Ext.getCmp('name_table_exp').getValue(),
						map_name: document.getElementById('map_name').value,
						layer	: document.getElementById('selected_layer').value
						},
			callback: function (options,success,response)
					{
						_wait.hide();

						var responseData = Ext.decode(response.responseText)
						if(responseData.success == true)
						{
							Ext.getCmp('_exp_win').hide();																					
						}
						else
						{
							msg('ERROR', responseData.message);							
						}
					}
		});
	}

	/*this.AddLayer = function()
	{
		if(Ext.getCmp('layer_tree').getNodeById('layer_'+Ext.getCmp('layer_name').getValue()))
		{
			Show_Message('No pueden existir dos capas con el mismo nombre', 'Error', 'error');
			return;
		}
		
		BeginPaint();

		Ext.Ajax.request(
		{
			url		: 'Plugins/AddPostgisLayer/Server/add_pg_layer.php',
			method	:'POST',
			params	: {
						host 	: Ext.getCmp('host').getValue(),
						port 	: Ext.getCmp('port').getValue(),
						user 	: Ext.getCmp('user').getValue(),
						pass 	: Ext.getCmp('pass').getValue(),
						dbase 	: Ext.getCmp('dbase').getValue(),

						table_name 	: Ext.getCmp('table_name').getValue(),
						layer_type 	: Ext.getCmp('layer_type').getValue(),
						srid 		: Ext.getCmp('srid').getValue(),

						layer_color 			: this._layer_color,
						layer_outline_color 	: this._border_color,
						layer_transparency		: Ext.getCmp('transp_bar_id').getValue(),
						layer_name 				: Ext.getCmp('layer_name').getValue(),

						map_name: document.getElementById('map_name').value,
						extent	: document.getElementById('extent').value
						},
			callback: function (options,success,response)
					{
						var responseData = Ext.decode(response.responseText);
						mainApp.UpdateMapPanel(responseData.result);
						mainApp.UpdateMapLayerControl();

						MsExt.Common.CacheManager.AddLayer(Ext.getCmp('layer_name').getValue());
						EndPaint();
					}
		});
	}*/

	this.onExportLayerPostgis = function()
	{
		var _scope = this;
		Ext.MessageBox.prompt('Entrada', 'Introduzca el nombre de la tabla crear', function(btn, text)
		{
		    if (btn == 'ok' && text != '')
			{		
				Ext.getCmp('name_table_exp').setValue(text);
				_scope._exp_win.show();
			}
		});
	}
	
}

var _postgis_layer_convert_plg = new ExportLayerPostgis();
mainApp.RegisterPlugin(_postgis_layer_convert_plg);