function ScaleBar()
{
	this._scaleBar_win = null;

	this._scaleBar_color = '000000';

	this._scaleBar_border = '000000';

	this._is_enable = false;

	this.UpdateScaleBarColor = function(_color)
	{
		document.getElementById('color_muestra_scaleBar').style.background = '#' + _color;

		_scaleBar_plg._scaleBar_color = _color;
	}

	this.UpdateScaleBarBorder = function(_color)
	{
		document.getElementById('border_muestra_scaleBar').style.background = '#' + _color;

		_scaleBar_plg._scaleBar_border = _color;
	}

	//----------------------------------------------------------------------
	// Stores
	//----------------------------------------------------------------------
	this._scaleBar_units = new Ext.data.ArrayStore({
			fields: ['id_unit', 'unit'],
			data: [
					['MS_FEET', 'Pies'],
					['MS_INCHES', 'Pulgadas'],
					['MS_KILOMETERS', 'Kilómetros'],
					['MS_METERS', 'Metros'],
					['MS_MILES', 'Millas']
				]
	});

	this._scaleBar_position = new Ext.data.ArrayStore({
			fields: ['id_position', 'position'],
			data: [
					['MS_UL', 'Supeior Izquierda'],
					['MS_UR', 'Supeior Derecha'],
					['MS_UC', 'Supeior Centro'],
					['MS_LL', 'Inferior Izquierda '],
					['MS_LR', 'Inferior Derecha'],
					['MS_LC', 'Inferior Centro']
				]
	});
	//----------------------------------------------------------------------

	this.ShowWindowScaleBar = function(_source, _layer_name)
	{
		var _scope = this;

		var _scaleBar_win = new Ext.Window(
		{
			title: 'Barra de escala',
			iconCls : 'btn_change_scaleBar',
			collapsible : true,
			resizable : false,
			closable: false,
			modal: false,
			shadow:'frame',
			width: 260,
			//height: 450,
			autoHeight:true,
			border:true,
			plain:true,
			layout: 'fit',
			//el: 'win-space',
			items: [
						new Ext.FormPanel({
				        //labelWidth: 20, // label settings here cascade unless overridden
				        frame:true,
						autoHeight:true,
						id : 'scaleBar_form',
				        bodyStyle:'padding:5px 5px 0',
				        items: [
									{
									  xtype 		: 'combo',
									  fieldLabel	: 'Posición',
									  // labelWidth	: 30,
									  anchor 		:'100%',
									  store			: _scaleBar_plg._scaleBar_position,
									  id			:'position_scaleBar',
									  emptyText		:'- Seleccione -',
									  allowBlank 	: false,
									  blankText 	: 'Este campo es requerido',
									  editable		:false,
									  forceSelection : true,
									  displayField	:'position',
									  valueField	:'id_position',
									  triggerAction	: 'all',
									  mode			:'local'
									},
									{
									  xtype 		: 'combo',
									  fieldLabel	: 'Unidades',
									  // labelWidth	: 30,
									  anchor 		:'100%',
									  store			: _scaleBar_plg._scaleBar_units,
									  id			:'units_scaleBar',
									  emptyText		:'- Seleccione -',
									  allowBlank 	: false,
									  blankText 	: 'Este campo es requerido',
									  editable		:false,
									  forceSelection : true,
									  displayField	:'unit',
									  valueField	:'id_unit',
									  triggerAction	: 'all',
									  mode			:'local'
									},
									{
									  xtype 		: 'combo',
									  fieldLabel	: 'Intervalos',
									  width		: 40,
									  store: new Ext.data.ArrayStore({
											id: 0,
											fields: [
												'inter'
											],
											data: [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12], [13], [14], [15], [16], [17], [18], [19], [20]]
										}),
									  valueField: 'inter',
									  displayField: 'inter',
									  id			:'intervals_scaleBar',
									  allowBlank 	: false,
									  blankText 	: 'Este campo es requerido',
									  forceSelection : true,
									  triggerAction	: 'all',
									  mode			:'local'
									},
									{
									  xtype 		: 'checkbox',
									  fieldLabel	: 'Transparente',
									  //anchor 		:'100%',
									  id			:'transparent_scaleBar',
									  checked		: true
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
														id : 'color_muestra_scaleBar',
														html:'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
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
														align : 'center',
														text  : '...',
														handler : function(){
															MsExt.Common.ColorPalette.Show(this.getPosition()[0],this.getPosition()[1] - 150, _scaleBar_plg._scaleBar_color,_scaleBar_plg.UpdateScaleBarColor.createDelegate(_scope));
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
														id : 'border_muestra_scaleBar',
														html:'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
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
														text  :  '...',
														align : 'center',
														handler : function(){
															MsExt.Common.ColorPalette.Show(this.getPosition()[0],this.getPosition()[1] - 150, _scaleBar_plg._scaleBar_border,_scaleBar_plg.UpdateScaleBarBorder.createDelegate(_scope));
														}
													}
												]
											}

										]
									},

									{
									style:'margin:0 0 0 5',
									layout : 'form',
									border:false,
									items: [{
												xtype:'fieldset',
												id:'fs11',
												title: 'Tamaño (Píxeles)',
												autoHeight: true,
												border:true,
												layout:'column',
												labelAlign:'top',
												items : [{
															style:'margin:0 0 0 5',
															columnWidth : .50,
															layout : 'form',
															border:false,
															items : [
															{
																xtype: 'textfield',
																fieldLabel: 'Largo',
																width	: 50,
																id: 'width_scaleBar',
																maskRe	: /^[0-9]$/,
																allowBlank: false
															}
															]
														}, {
															style:'margin:0 0 0 20',
															columnWidth : .50,
															layout : 'form',
															border:false,
															items : [
															{
																xtype: 'textfield',
																fieldLabel: 'Alto',
																width	: 50,
																id: 'height_scaleBar',
																maskRe	: /^[0-9]$/,
																allowBlank: false
															}
															]
														 }]
											}]
									}
								]
						})
					],
			buttons:
			[
				{id: 'btn_apply',
				 text: 'Aplicar',
				 scope : this,
				 listeners	: { 'click' : function()
										{
											if(Ext.getCmp('scaleBar_form').getForm().isValid())
											{
												_scaleBar_plg.makeScaleBar(Ext.getCmp('position_scaleBar').getValue(),
																	  Ext.getCmp('units_scaleBar').getValue(),
																	  Ext.getCmp('intervals_scaleBar').getValue(),
																	  Ext.getCmp('transparent_scaleBar').getValue(),
																	  _scaleBar_plg._scaleBar_color,
																	  _scaleBar_plg._scaleBar_border,
																	  Ext.getCmp('width_scaleBar').getValue(),
																	  Ext.getCmp('height_scaleBar').getValue()
												);
											}
										}
							  }
				},
				{text: 'Cerrar',
					handler: function()
							{
								_scaleBar_win.close();
							}
				}
			]
		});
		_scaleBar_win.show();

		if(MsExt.Common.ObjectsCache.ContainsMKey('scalebar'))
		{
			var values = MsExt.Common.ObjectsCache.GetItem('scalebar');

			Ext.getCmp('position_scaleBar').setValue(values['position']);
			Ext.getCmp('units_scaleBar').setValue(values['units']);
			Ext.getCmp('intervals_scaleBar').setValue(values['intervals']);
			Ext.getCmp('transparent_scaleBar').setValue(values['transparent']);
			Ext.getCmp('width_scaleBar').setValue(values['width']);
			Ext.getCmp('height_scaleBar').setValue(values['height']);

			_scaleBar_plg.UpdateScaleBarColor(values['color']);
			_scaleBar_plg.UpdateScaleBarBorder(values['outlinecolor']);
		}
	}

	//----------------------------------------------------------------------
	this.Init = function()
	{
		this._scaleBar_menu = [
				{text:'Configurar barra de escala', id: '_scaleBar_menu_id', iconCls: 'btn_change_scaleBar', handler: this.ShowWindowScaleBar.createDelegate()}
			];

		mainApp.AddMenu('Ver',this._scaleBar_menu);

		this._is_enable = true;
	}

	this.makeScaleBar = function(_position, _units, _intervals, _transparent, _color, _color_b, _width, _height)
	{
		BeginPaint();

		Ext.Ajax.request(
		{
			url		: 'Plugins/ScaleBar/Server/map_change_scaleBar.php',
			method	:'POST',
			params	: {
						position	:_position,
						units		:_units,
						intervals	:_intervals,
						transparent	:_transparent,
						color		:_color,
						color_b		:_color_b,
						width		:_width,
						height		:_height
					  },
			callback: function (options,success,response)
					{
						var responseData = Ext.decode(response.responseText);
						mainApp.UpdateMapPanel( responseData.result );

						MsExt.Common.ObjectsCache.Insert('scalebar', 'position', _position);
						MsExt.Common.ObjectsCache.Insert('scalebar', 'units', _units);
						MsExt.Common.ObjectsCache.Insert('scalebar', 'intervals', _intervals);
						MsExt.Common.ObjectsCache.Insert('scalebar', 'transparent', _transparent);
						MsExt.Common.ObjectsCache.Insert('scalebar', 'width', _width);
						MsExt.Common.ObjectsCache.Insert('scalebar', 'height', _height);
						MsExt.Common.ObjectsCache.Insert('scalebar', 'color', _color);
						MsExt.Common.ObjectsCache.Insert('scalebar', 'outlinecolor', _color_b);

						EndPaint();
					}
		});
	}

	this.IsEnable = function()
	{
		return this._is_enable;
	}
}

var _scaleBar_plg = new ScaleBar();
_scaleBar_plg.Init();