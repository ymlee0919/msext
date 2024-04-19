function LabeledLayer()
{
	this._labeledLayerBtn = null;

	this._labeled_Layer_win = null;

	this._labeled_color = '000000';

	this._is_enable = false;
	
	this._labeled_popup_menu = null;

	this.GetName = function()
	{
		return 'Etiquetado';
	}

	this.UpdateLabelColor = function(_color)
	{
		document.getElementById('color_muestra_labeled').style.background = '#' + _color;
		this._labeled_color = _color;
	}

	//----------------------------------------------------------------------
	// Stores
	//----------------------------------------------------------------------
	this._store_size = new Ext.data.ArrayStore({
			fields: ['id_size', 'size'],
			data: [
					['MS_TINY', 'TINY'],
					['MS_SMALL', 'SMALL'],
					['MS_MEDIUM', 'MEDIUM'],
					['MS_LARGE', 'LARGE'],
					['MS_GIANT', 'GIANT']
				]
	});

	this._store_position = new Ext.data.ArrayStore({
			fields: ['id_position', 'position'],
			data: [
					['MS_AUTO', 'Automática'],
					['MS_UL', 'Supeior Izquierda'],
					['MS_UR', 'Supeior Derecha'],
					['MS_UC', 'Supeior Centro'],
					['MS_LL', 'Inferior Izquierda '],
					['MS_LR', 'Inferior Derecha'],
					['MS_LC', 'Inferior Centro'],
					['MS_CL', 'Centro Izquierda'],
					['MS_CR', 'Centro Derecha'],
					['MS_CC', 'Centro']
				]
	});
	//----------------------------------------------------------------------

	this.underLabeled = function()
	{
		var _name = Ext.getCmp('selected_layer').getValue();
		BeginPaint();

		Ext.Ajax.request(
		{
			url		: 'Plugins/LabeledLayer/Server/map_under_labeled.php',
			method	:'POST',
			params	: {	layer : _name },
			callback: function (options,success,response)
					{
						var responseData = Ext.decode(response.responseText);
						mainApp.UpdateMapPanel(responseData.result);
						mainApp.UpdateLayerControl(responseData.legend);
						//mainApp.UpdateMapLayerControl();
						MsExt.Common.Cache.DeleteItem(_name,'label');
						EndPaint();
					}
		});
	}
	
	this.ShowWindowLabeled = function(_source, _layer_name)
	{
		var _scope = this;

		var _labeled_Layer_win = new Ext.Window(
		{
			title: 'Etiquetas',
			iconCls : 'btn_labeled',
			collapsible : true,
			resizable : false,
			closable: false,
			modal: true,
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
						title: 'Capa: ' + _layer_name,
						id : 'labeled_layer_form',
				        bodyStyle:'padding:5px 5px 0',
				        items: [
									{
									  xtype 		: 'combo',
									  fieldLabel	: 'Atributo',
									  // labelWidth	: 30,
									  anchor 		:'100%',
									  store			: _source,
									  id			:'field_labeled',
									  emptyText		:'- Seleccione -',
									  allowBlank 	: false,
									  blankText 	: 'Este campo es requerido',
									  editable		:false,
									  forceSelection : true,
									  triggerAction	: 'all',
									  mode			:'local'
									},
									{
									  xtype 		: 'combo',
									  fieldLabel	: 'Tamaño',
									  // labelWidth	: 30,
									  anchor 		:'100%',
									  store			: this._store_size,
									  id			:'size_labeled',	
									  emptyText		:'- Seleccione -',
									  allowBlank 	: false,
									  blankText 	: 'Este campo es requerido',
									  editable		:false,
									  forceSelection : true,									  
									  displayField	:'size',
									  valueField	:'id_size',									  
									  triggerAction	: 'all',
									  mode			:'local'
									},
									{
									  xtype 		: 'combo',
									  fieldLabel	: 'Posición',
									  // labelWidth	: 30,
									  anchor 		:'100%',
									  store			: this._store_position,
									  id			:'position_labeled',
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
														id : 'color_muestra_labeled',
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
														id 	  : 'color_labeled_btn',
														iconCls:'btn_labeled_color',
														align : 'center',
														handler : function(){
															MsExt.Common.ColorPalette.Show(this.getPosition()[0],this.getPosition()[1] - 150, _scope._labeled_color,_scope.UpdateLabelColor.createDelegate(_scope));
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
											columns: 2
										},
										items:
										[
											// Columna 1
											{layout: 'form',
												columnWidth:.1,
												items:
												[
													new Ext.form.Label({
														fieldLabel : 'Transparencia',
														anchor :'40%'
													})
												]
											},
											// Columna 2
											{layout: 'form',
												columnWidth:.3,
												items:
												[
													new Ext.Slider({
														id : 'transparency_labeled',
														width: 100,
														value	: 100,
														increment: 10,
														minValue: 0,
														maxValue: 100,
														plugins: new Ext.ux.SliderTip()
													})
												]
											}
										]
									},
									{
							            xtype:'fieldset',
							            title: 'Opciones avanzadas',
							            collapsible: true,
							            collapsed: true,
							            autoHeight:true,
							            defaults: {width: '100%'},
										defaultType: 'checkbox',
							            items :[													
													{
														xtype: 'textfield',
														fieldLabel: 'Mínima escala',
														id: 'min_scale_labeled',
														maskRe	: /^[0-9]$/,
														//regex	: /^(([1-9][0-9]+)|[0-9]+.[0-9]+)$/,
														anchor :'80%',
														allowBlank:true,
														emptyText : '...'
													},
													{
														xtype: 'textfield',
														fieldLabel: 'Máxima escala',
														id: 'max_scale_labeled',
														maskRe	: /^[0-9]$/,
														anchor :'80%',
														allowBlank:true,														
														emptyText : '...'
													},
													{
														//Ayuda a que las etiquetas no se  generen fuera del mapa
									                    fieldLabel: 'Textos',
														boxLabel: 'Incompletos',
														id: 'partials_labeled',															
														checked : true
									                },{
														//Ayuda a que las etiquetas no se  superpongan
									                    fieldLabel: '',
														labelSeparator: '',
														boxLabel: 'Superponer',
														id: 'force_labeled'
													}
												]
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
											var _new_X = Ext.getCmp('point_X').getValue();
											var _new_Y = Ext.getCmp('point_Y').getValue();

											if(Ext.getCmp('labeled_layer_form').getForm().isValid())
											{
												_scope.makeLabeledLayer(Ext.getCmp('selected_layer').getValue(),
																	  Ext.getCmp('field_labeled').getValue(),
																	  Ext.getCmp('size_labeled').getValue(),
																	  Ext.getCmp('position_labeled').getValue(),
																	  _scope._labeled_color,
																	  Ext.getCmp('transparency_labeled').getValue(),
																	  Ext.getCmp('min_scale_labeled').getValue(),
																	  Ext.getCmp('max_scale_labeled').getValue(),
																	  Ext.getCmp('partials_labeled').getValue(),																	  
																	  Ext.getCmp('force_labeled').getValue()																	  
												);
											}
										}
							  }
				},
				{text: 'Cerrar',
					handler: function()
							{
								_labeled_Layer_win.close();
								mainmap.getDisplay('map').clearLayer('drawing');
							}
				}
			]
		});
		
		_labeled_Layer_win.show();
		
		if(MsExt.Common.Cache.Contains(Ext.getCmp('selected_layer').getValue(), 'label'))
		{
			var values = MsExt.Common.Cache.GetValue(Ext.getCmp('selected_layer').getValue(), 'label');
			
			Ext.getCmp('field_labeled').setValue(values['label_field']);
			Ext.getCmp('size_labeled').setValue(values['label_size']);
			Ext.getCmp('position_labeled').setValue(values['label_position']);
			Ext.getCmp('transparency_labeled').setValue(values['label_transparency']);
			Ext.getCmp('min_scale_labeled').setValue(values['label_min_scale']);
			Ext.getCmp('max_scale_labeled').setValue(values['label_max_scale']);
			Ext.getCmp('partials_labeled').setValue(values['label_partials']);																  
			Ext.getCmp('force_labeled').setValue(values['label_force']);
			
			this.UpdateLabelColor(values['label_color']);
		}
	}

	this.onLabel_ContextMenu = function(node, eventObject)
	{
		var id = node.attributes.id;
		var type = id.substr(1,7);
		if(type == 'labeled')
		{
			Ext.getCmp('selected_labeled').setValue(node.parentNode.attributes.text);
			Ext.getCmp('layer_select').setText(node.parentNode.attributes.text);
			Ext.getCmp('selected_layer').setValue(node.parentNode.attributes.text);
			
			this._labeled_popup_menu.showAt(eventObject.getXY());
		}
	};
	//----------------------------------------------------------------------
	this.Init = function()
	{
		var _scope = this;
		
		// Popup menu for labeled
		this._labeled_popup_menu = new Ext.menu.Menu(
		{
			id: 'labeled_popup_menu',
			style: {
				overflow: 'visible'     // For the Combo popup
			},
			items: [
					'<div align = "center"><b class="menu-title">Opciones</b></div>','-',
					{
						text: 'Eliminar etiquetado',
						iconCls: 'delete_class',
						handler : function()
						{
							var layer_name = Ext.getCmp('selected_layer').getValue();
							if(layer_name != 0)
							{
							   Ext.Msg.show({
								   title:'Confirmación',
								   msg: '¿Desea eliminar el etiquetado de la capa '+layer_name+'?',
								   buttons: Ext.Msg.YESNO,
								   fn: function(btn){if (btn == 'yes'){_scope.underLabeled();}},
								   icon: Ext.MessageBox.QUESTION
								});
							}
							else
							{
								Show_Message('Primero debe seleccionar la capa', 'Información', 'info');
							}
						}
					}]
		});
		
		
		this._labeledLayerBtn = new Ext.Button(
		{
			id	 : 'labeledLayer',
			tooltip	: 'Añadir etiquetado',
			iconCls: 'btn_labeled',
			disabled : true,
			handler : this.check.createDelegate(this)
		});

		mainApp.AddTBarButton({xtype: 'tbseparator', id: 'labeled_layer_sep_id'});
		mainApp.AddTBarButton(this._labeledLayerBtn);
		
		var _select_layer = function(node, eventObject)
		{
			var id = node.attributes.id;
			var type = id.substr(0,5);
			if(type == 'layer')
			{
				this._labeledLayerBtn.enable();
			}
			else
			{
				this._labeledLayerBtn.disable();
				MsExt.Components.LayerControl.DisableTBar();
				MsExt.Components.LayerControl.DesactivateLayerMenu();
			}
		};
		
		MsExt.Components.LayerControl.EnqueueOnClickHandler(_select_layer, this);
		MsExt.Components.LayerControl.EnqueueRigthClickHandler(_select_layer, this);
		MsExt.Components.LayerControl.EnqueueRigthClickHandler(this.onLabel_ContextMenu, this);
		
		this._is_enable = true;
	}

	this.Disable = function()
	{
		Ext.getCmp('labeled_layer_sep_id').hide();
		this._labeledLayerBtn.hide();
		this._is_enable = false;
	}

	this.Enable = function()
	{
		Ext.getCmp('labeled_layer_sep_id').show();
		this._labeledLayerBtn.show();
		this._is_enable = true;
	}

	this.IsEnable = function()
	{
		return this._is_enable;
	}


	this.check = function ()
	{
		if(document.getElementById('selected_layer').value == 0)
		{
			msg('Error','Por favor, seleccione la capa que desea etiquetar');
			return;
		}
		this._labeled_color = '000000';
		this.getFieldsLayer();
	}

	this.getFieldsLayer = function()
	{
		var _scope = this;

		var _layer = Ext.getCmp('selected_layer').getValue();

		if(_layer != 0)
		{
			if( !MsExt.Common.Cache.Contains(_layer, 'fields') )
			{
				MsExt.Common.Message.ShowMessage('Cargando datos','Por favor espere...','LoadingData');
				Ext.Ajax.request(
				{
					url		: 'Framework/Server/Core/MsExt.Information.MapFields.php',
					method	: 'POST',
					params	: {layer : _layer},
					callback: function (options,success,response)
							{
								MsExt.Common.Message.HideMessage();
								
								var _field_list = Ext.decode(response.responseText);
								_hash_fields = new msext_HashTable();
								for(var i = 0; i < _field_list.length; i++)
									_hash_fields.CreateMKey(_field_list[i]);
								MsExt.Common.Cache.Insert(_layer,'fields',_hash_fields);
								_scope.ShowWindowLabeled(_field_list, _layer);						
							}
				});
			}
			else
			{
				_fields = MsExt.Common.Cache.GetValue(_layer,'fields').GetAllMasterKeys();
				_scope.ShowWindowLabeled(_fields, _layer);
			}
		}
	}

	this.makeLabeledLayer = function(_layer, _field, _size, _position, _color, _transparency, _min_scale, _max_scale, _partials, _force)
	{
		BeginPaint();

		Ext.Ajax.request(
		{
			url		: 'Plugins/LabeledLayer/Server/map_make_labeled.php',
			method	:'POST',
			params	: {
						layer	: _layer,
						field   : _field,
						size	: _size,
						position: _position,
						color	: _color,
						transparency 	 : _transparency,
						min_scale		 : _min_scale,
						max_scale		 : _max_scale,
						partials		 : _partials,
						force			 : _force
					  },
			callback: function (options,success,response)
					{
						var responseData = Ext.decode(response.responseText);
						mainApp.UpdateMapPanel( responseData.result );
						mainApp.UpdateLayerControl(responseData.legend);
						//mainApp.UpdateMapLayerControl();

						var values = new Array();
						values['label_field'] = _field;
						values['label_size'] = _size;
						values['label_position'] = _position;
						values['label_color'] = _color;
						values['label_transparency'] = _transparency;
						values['label_min_scale'] = _min_scale;
						values['label_max_scale'] = _max_scale;
						values['label_partials'] = _partials;
						values['label_force'] = _force;
										
						MsExt.Common.Cache.Insert(_layer, 'label', values);
						EndPaint();
					}
		});
	}
}

var _labeled_layer_plg = new LabeledLayer();
mainApp.RegisterPlugin(_labeled_layer_plg);