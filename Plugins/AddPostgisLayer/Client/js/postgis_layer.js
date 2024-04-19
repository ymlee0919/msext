/*
* Add Postgis Layer Plugin
*/
function PostgisLayer()
{
	this._pg_grid_layers = null;
	this._pg_layer = null;
	this._addPgLayerBtn = null;
	
	this._layer_color = '000000';
	this._border_color = '000000';
	this._current_div = '';

	this._is_enable = false;

	this.Disable = function()
	{
		Ext.getCmp('add_pg_layer_sep_id').hide();
		this._addPgLayerBtn.hide();
		Ext.getCmp('menu_add_pg_layer_id').hide();

		this._is_enable = false;
	}

	this.UpdateLabelColor = function(_color)
	{
		document.getElementById(this._current_div).style.background = '#' + _color;
		document.getElementById(this._current_div).style.color = '#' + _color;
		
		if(this._current_div == 'borde_muestra')
			this._border_color = _color;
		else
			this._layer_color = _color;
	}
	
	this.Enable = function()
	{
		Ext.getCmp('add_pg_layer_sep_id').show();
		this._addPgLayerBtn.show();
		Ext.getCmp('menu_add_pg_layer_id').show();

		this._is_enable = true;
	}

	this.IsEnable = function()
	{
		return this._is_enable;
	}

	this.GetName = function()
	{
		return 'Adicionar Capa Postgis';
	}

	this.Init = function()
	{
		var _scope = this;
		
		this._addPgLayerBtn = new Ext.Button(
		{
			id	 : 'add_postgis_layer',
			iconCls:'add_pg_layer',
			tooltip	: 'Adicionar capa desde postgis',
			handler : this.onAddPostgisLayer.createDelegate(this)
		});

		mainApp.AddTBarButton({xtype: 'tbseparator', id: 'add_pg_layer_sep_id'});
		mainApp.AddTBarButton(this._addPgLayerBtn);

		this._add_postgis_menu = [
				{text:'Adicionar capa desde postgis', id: 'menu_add_pg_layer_id', iconCls: 'add_pg_layer', handler: this.onAddPostgisLayer.createDelegate(this)}
			];

		mainApp.AddMenu('Capas',this._add_postgis_menu);

		this._pg_grid_layers = new Ext.grid.GridPanel(
		{
			title 	: 'Tablas',
			enable	: false,
			height 	: 150,
			width	: 'auto',
			store 	: new Ext.data.JsonStore(
					{
						root : 'tables',
						fields:
						[
							{name : 'table_name'},
							{name : 'geom_type'},
							{name : 'srid'}
						]
					}),
			sm		: new Ext.grid.RowSelectionModel(
						{
							singleSelect:true,
							listeners : {'rowselect' : this.onSelectRow.createDelegate()}
						}),
			columns	: [
		            {id:'table_name',header: "Tabla", width: 160, sortable: true, dataIndex: 'table_name'},
		            {header: "Geometría", width: 75, sortable: true, dataIndex: 'geom_type'},
		            {header: "SRID", width: 75, sortable: true, dataIndex: 'srid'}
		        ],
			viewConfig: { forceFit: true }

		});

		this._pg_layer = new Ext.form.FormPanel(
		{
			title : 'Adicionar capa postgis',
			frame : true,
			labelWidth : 75,
			id : 'form_pg_layer_params',
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
					name 	: 'srid',
					id 		: 'srid',
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
											id: 'host',
											allowBlank:false,
											blankText : 'Parámetro requerido',											
											emptyText : 'servidor...'
										},{
											fieldLabel: 'Puerto',
											name: 'port',
											id: 'port',
											allowBlank:false,
											blankText : 'Parámetro requerido',
											emptyText: 'puerto...'
										},{
											fieldLabel: 'Base Datos',
											name: 'dbase',
											id: 'dbase',
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
											id: 'user',
											allowBlank:false,
											blankText : 'Parámetro requerido',
											emptyText: 'usuario...'
										},{
											fieldLabel: 'Contraseña',
											name: 'pass',
											id: 'pass',											
											inputType : 'password'
										},
										{
											xtype : 'button',
											text  : 'Conectar',
											width : 50,
											align : 'rigth',											
											handler : this.onConnect.createDelegate(this)
										}
									]
								}
							]
						}
		            ]
		        },
				this._pg_grid_layers,
				{
					xtype:'fieldset',
					id 	: 'layer_data',
		            title: 'Capa',
					disabled : true,
		            collapsible: false,
		            autoHeight:true,
					bodyStyle	:'padding:5px 5px 0',
		            items :
					[
						{
							xtype: 'textfield',
							fieldLabel: 'Nombre',
							name: 'layer_name',
							id: 'layer_name',
							emptyText : 'nombre...',
							anchor :'100%'
						},
						{
							layout : 'table',
							layoutConfig:
							{
								columns: 3
							},
							items:
							[
								// Columna 1
								{layout: 'form',
									columnWidth:.3,
									items:
									[
										new Ext.form.Label({
											fieldLabel : 'Color',
											anchor :'20%'
										})
									]
								},
								// Columna 2
								{layout: 'form',
									columnWidth:.3,
									items:
									[
										{	
											xtype : 'label',
											id : 'color_muestra_layer',
											text:'Color',
											height : 70,
											style: {background : '#000000'}											
										}
									]
								},
								// Columna 3
									{layout: 'form',
									columnWidth:.4,
									items:
									[
										{
											xtype : 'button',
											id 	  : 'color_capa_btn',
											iconCls:'color_layer',
											align : 'center',
											handler : function(){
												_scope._current_div = 'color_muestra_layer';
												MsExt.Common.ColorPalette.Show(this.getPosition()[0],this.getPosition()[1] - 150, _scope._layer_color,_scope.UpdateLabelColor.createDelegate(_scope));
											}
										}
									]
								}
								
							]
						},
						{
							layout : 'table',
							layoutConfig:
							{
								columns: 3
							},
							items:
							[
								// Columna 1
								{layout: 'form',
									columnWidth:.1,
									items:
									[
										new Ext.form.Label({
											fieldLabel : 'Borde',
											anchor :'20%'
										})
									]
								},
								// Columna 2
								{layout: 'form',
									columnWidth:.3,
									items:
									[
										{	
											xtype : 'label',
											id : 'borde_muestra',
											text:'Color',
											height : 70,
											style: {background: '#000000'}
										}
									]
								},
								// Columna 3
									{layout: 'form',
									columnWidth:.4,
									items:
									[
										{
											xtype : 'button',
											id 	  : 'color_borde_btn',
											iconCls:'underline_layer',
											align : 'center',
											handler : function(){
												_scope._current_div = 'borde_muestra';
												MsExt.Common.ColorPalette.Show(this.getPosition()[0],this.getPosition()[1] - 150, _scope._border_color,_scope.UpdateLabelColor.createDelegate(_scope));
											}
										}
									]
								}
								
							]
						}
						,new Ext.Slider({
							minValue: 0,
							maxValue: 100,
							value:100,
							fieldLabel: 'Transparencia',
							id:'transp_bar_id',
							name:'transp_bar_id',
							plugins: new Ext.ux.SliderTip(),
							anchor :'70%'
							})
						
		            ]
		        }
			]
		});	
		this._is_enable = true;
	}

	this.onConnect = function()
	{
		if(!Ext.getCmp('form_pg_layer_params').getForm().isValid())
		{			
			return;
		}
		
		var _scope = this;
		
		_wait = Ext.Msg.wait('Por favor espere...','Intentando establecer conexión...');

		Ext.Ajax.request(
		{
			url		: 'Plugins/AddPostgisLayer/Server/get_connection_data.php',
			method	:'POST',
			params	: {
						host 	: Ext.getCmp('host').getValue(),
						port 	: Ext.getCmp('port').getValue(),
						user 	: Ext.getCmp('user').getValue(),
						pass 	: Ext.getCmp('pass').getValue(),
						dbase 	: Ext.getCmp('dbase').getValue()
						},
			callback: function (options,success,response)
					{
						_wait.hide();

						var responseData = Ext.decode(response.responseText)
						if(responseData.success == true)
						{
							_scope._pg_grid_layers.getStore().loadData(responseData, false);
						}
						else
						{
							msg('ERROR', responseData.message);
							_scope._pg_grid_layers.removeAll();
							Ext.getCmp('layer_data').disable();
						}
					}
		});
	}

	this.AddLayer = function()
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
						layer_name 				: Ext.getCmp('layer_name').getValue()
						},
			callback: function (options,success,response)
					{
						var responseData = Ext.decode(response.responseText);
						mainApp.UpdateMapPanel(responseData.result);
						mainApp.UpdateLayerControl(responseData.legend);
						//mainApp.UpdateMapLayerControl();

						MsExt.Common.Cache.CreateMKey(Ext.getCmp('layer_name').getValue());
						EndPaint();
					}
		});
	}

	this.onSelectRow = function(scope, index, record)
	{
		Ext.getCmp('layer_data').enable();
		Ext.getCmp('add_pg_layer_btn').enable();
		Ext.getCmp('layer_name').setValue(record.get('table_name'));

		Ext.getCmp('table_name').setValue(record.get('table_name'));
		Ext.getCmp('layer_type').setValue(record.get('geom_type'));
		Ext.getCmp('srid').setValue(record.get('srid'));
	}

	this.onAddPostgisLayer = function()
	{
		var _scope = this;
		
		var _user_win = new Ext.Window({
			title: 'Adicionar capa ...',
			closable:false,
			modal: true,
			shadow:'frame',
			width:430,
			height: 550,
			border:true,
			plain:true,
			layout: 'fit',
			items: [this._pg_layer],
			buttons:
			[
				{
					text  : 'Adicionar',
					id : 'add_pg_layer_btn',
					disabled : true,
					scope : _scope,
					handler : this.AddLayer.createDelegate(this)
				},
				{
					text: 'Cerrar',
					handler: function()
							{
								_user_win.hide();
							}
				}
			]
		});

		_user_win.show();
	}
}

var _postgis_layer_plg = new PostgisLayer();
mainApp.RegisterPlugin(_postgis_layer_plg);