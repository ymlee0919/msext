function LoadShapeLayer()
{
	this._LoadShapeLayerBtn = null;

	this._load_Layer_win = null;

	this._is_enable = false;

	this._layer_shape_color = '000000';
	this._border_shape_color = '000000';
	this._current_div = '';

	this.GetName = function()
	{
		return 'Cargar capa shape';
	}

	//----------------------------------------------------------------------

	this.ShowWindowLoadShape = function(_source)
	{
		var _scope = this;

		this._load_shapes_grid = new Ext.grid.GridPanel({
			enable	: true,
			height 	: 260,
			width	: 280,
			id	:'load_shapes_grid',
			store 	: new Ext.data.JsonStore({
							fields: [ {name: 'shape', type:'string'}],
							data : _source
						}),
			sm		: new Ext.grid.RowSelectionModel({
							singleSelect:true,
							listeners : {'rowselect' : function( This, rowIndex, r)
							{
								Ext.getCmp('load_shape_btn_id').enable();
								Ext.getCmp('shape_data').enable();
								Ext.getCmp('shape_name').setValue('Public-'+r.get('shape'));
							}}
						}),
			columns	: [
						{header: 'Nombre del Shape', width: 140, sortable: true, dataIndex: 'shape'}
					  ],
			viewConfig: { forceFit: true }
		});
		
		this._format_shape_layer = new Ext.form.FormPanel(
		{			
			frame : true,
			labelWidth : 75,			
			items :
			[
				{
				xtype:'fieldset',
				id 	: 'shape_data',
				title: 'Definir formato',
				disabled : true,
				collapsible: false,
				autoHeight:true,
				bodyStyle	:'padding:5px 5px 0',				
				items :
				[
					{
						xtype: 'textfield',
						fieldLabel: 'Nombre',
						name: 'shape_name',
						id: 'shape_name',
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
										id : 'color_muestra_shape',
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
										id 	  : 'color_shape_btn',
										iconCls:'color_layer',
										align : 'center',
										handler : function(){
											_scope._current_div = 'color_muestra_shape';
											MsExt.Common.ColorPalette.Show(this.getPosition()[0],this.getPosition()[1] - 150, _scope._layer_shape_color,_scope.UpdateLabelColor.createDelegate(_scope));
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
										id : 'borde_muestra_shape',
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
											_scope._current_div = 'borde_muestra_shape';
											MsExt.Common.ColorPalette.Show(this.getPosition()[0],this.getPosition()[1] - 150, _scope._border_shape_color,_scope.UpdateLabelColor.createDelegate(_scope));
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
						id:'transp_shape_id',
						name:'transp_bar_id',
						plugins: new Ext.ux.SliderTip(),
						anchor :'100%'
						})
			]}]
		});

		this._load_Layer_win = new Ext.Window({
			title: 'Seleccione el shape',
			id : 'load_shapes_win',
			closable: false,
			collapsible : false,
			modal: true,
			shadow:'frame',
			width:290,
			height: 490,
			border:true,
			plain:true,
			//layout: 'fit',
			items: [this._load_shapes_grid, this._format_shape_layer],
			buttons:
				[
					{
						text: 'Cargar',
						id : 'load_shape_btn_id',
						disabled : true,
						handler : _scope.SelectShapeLoad.createDelegate(_scope)
					},
					{
						text: 'Cancelar',
						handler: function(){_scope._load_Layer_win.close();}
					}
				]
		});

		this._load_Layer_win.show();
	}

	//----------------------------------------------------------------------
	this.Init = function()
	{
		var _scope = this;

		this._LoadShapeLayerBtn = new Ext.Button(
		{
			id	 : 'LoadShapeLayer',
			tooltip	: 'Cargar archivo shape',
			iconCls: 'layer-load-shape',
			handler : this.getShapesPublic.createDelegate(this)
		});

		mainApp.AddTBarButton(this._LoadShapeLayerBtn);
		mainApp.AddTBarButton({xtype: 'tbseparator', id: 'load_layer_sep_id'});

		this._load_shape_menu = [
				{text:'Cargar archivo shape', id: 'menu_load_shape_id', iconCls: 'layer-load-shape', handler: this.getShapesPublic.createDelegate(this)}
			];

		mainApp.AddMenu('Capas',this._load_shape_menu);

		this._is_enable = true;
	}

	this.Disable = function()
	{
		Ext.getCmp('load_layer_sep_id').hide();
		this._LoadShapeLayerBtn.hide();
		Ext.getCmp('menu_load_shape_id').hide();
		this._is_enable = false;
	}

	this.Enable = function()
	{
		Ext.getCmp('load_layer_sep_id').show();
		this._LoadShapeLayerBtn.show();
		Ext.getCmp('menu_load_shape_id').show();
		this._is_enable = true;
	}

	this.IsEnable = function()
	{
		return this._is_enable;
	}

	this.UpdateLabelColor = function(_color)
	{
		document.getElementById(this._current_div).style.background = '#' + _color;
		document.getElementById(this._current_div).style.color = '#' + _color;

		if(this._current_div == 'borde_muestra_shape')
			this._border_shape_color = _color;
		else
			this._layer_shape_color = _color;
	}

	this.getShapesPublic = function()
	{
		var _scope = this;

		_wait = Ext.Msg.wait('Por favor espere...','Leyendo directorio...');
		Ext.Ajax.request(
		{
			url		: 'Plugins/LoadShapeLayer/Server/map_explorer_public_shapes.php',
			method	: 'POST',
			callback: function (options,success,response)
					{
						var responseData = Ext.decode(response.responseText);
						_wait.hide();
						if(responseData.count != 0)
							_scope.ShowWindowLoadShape(responseData.shapes);
						else
							Show_Message('No existen archivos [.shp] disponibles', 'Información', 'info');
					}
		});
	}

	this.SelectShapeLoad = function()
	{
		var shape = Ext.getCmp('load_shapes_grid').getSelectionModel().getSelected().get('shape');
		if(Ext.getCmp('layer_tree').getNodeById('layer_'+Ext.getCmp('shape_name').getValue()))
			Show_Message('Ya existe una capa con ese nombre', 'Error', 'error');
		else
		{
			_load_shape_plg.LoadShape(shape);		
			Ext.getCmp('load_shapes_win').close();
		}
	}

	this.LoadShape = function(_shape)
	{
		BeginPaint();
		var _layer_name = Ext.getCmp('shape_name').getValue();

		Ext.Ajax.request(
		{
			url		: 'Plugins/LoadShapeLayer/Server/load_shape_in_map.php',
			method	:'POST',
			params	: {
						shape_color 			: this._layer_shape_color,
						shape_outline 			: this._border_shape_color,
						shape_transparency		: Ext.getCmp('transp_shape_id').getValue(),
						shape_name				: Ext.getCmp('shape_name').getValue(),
						shape	: _shape
					  },
			callback: function (options,success,response)
					{
						var responseData = Ext.decode(response.responseText);
						mainApp.UpdateMapPanel( responseData.result );
						mainApp.UpdateMapLayerControl();
						
						MsExt.Common.Cache.CreateMKey(_layer_name);
						EndPaint();
					}
		});
	}
}

var _load_shape_plg = new LoadShapeLayer();
mainApp.RegisterPlugin(_load_shape_plg);