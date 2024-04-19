
function TematicMap()
{
	this._tematic_map_win = null;
	this._class_popup_menu = null;
	this.tMap_store = null;
	this.tMap_sm = null;
	this._MapTematicoBtn = null;
	this._undo_tematic_layer = null;
	this.menu_item_undo_tematic_layer = null;
	this._is_enable = false;
}

 function color_mapa(val,p,record){
	return '<span style="background-color:#'+val+'; border-color:#000000; border-style:double;"><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></span>';
 }

TematicMap.prototype.GetName = function()
{
	return 'Mapa temático';
}

TematicMap.prototype.Enable = function()
{
	this._MapTematicoBtn.show();
	this._undo_tematic_layer.show();
	this.menu_item_undo_tematic_layer.hide();
	this.menu_item_undo_tematic_layer.setVisible(true);
	this._is_enable = true;
}

TematicMap.prototype.Disable = function()
{
	this._MapTematicoBtn.hide(false);
	this._undo_tematic_layer.hide(false);
	this.menu_item_undo_tematic_layer.hide();
	this.menu_item_undo_tematic_layer.setVisible(false);
	this._is_enable = false;
}

TematicMap.prototype.IsEnable = function()
{
	return this._is_enable;
}

TematicMap.prototype.ChangeLayerColor = function(_color, _property)
{
	var _layer = Ext.getCmp('selected_layer').getValue();
	// (-1)  -> para saber que es un layer y no una clase
	var _nom_class = Ext.getCmp('selected_class').getValue();

	BeginPaint();

	Ext.Ajax.request(
	{
		url		: 'App/LayerControl/Server/map_layers_color.php',
		method	:'POST',
		params	: {
					extent	: document.getElementById('extent').value,
					map_name: document.getElementById('map_name').value,
					color	: _color,
					layer	: _layer,
					property: _property,
					nom_class : _nom_class
					},
		callback: function (options,success,response)
				{
					var responseData = Ext.decode(response.responseText);
					mainApp.UpdateMapPanel(responseData.result);
					mainApp.UpdateMapLayerControl();
					EndPaint();
				}
	});
}
//------------------------------------------------------------
TematicMap.prototype.onDeleteClass = function()
{
	var layer_name = Ext.getCmp('selected_layer').getValue();
	var layer_class = Ext.getCmp('selected_class').getValue();
	var id_class = "class_" + layer_class + "_" + layer_name;
	var name_class = MsExt.Components.LayerControl.GetComponent().getNodeById(id_class).attributes.text;
	var _scope = this;
	Ext.MessageBox.show({
	   title:'Confirmación',
	   msg: '¿Desea eliminar la clase '+ name_class +' de la capa '+layer_name+'?',
	   buttons: Ext.MessageBox.YESNO,
	   fn: function(buttonId){if(buttonId=='yes')_scope.DeleteLayer();},
	   icon: Ext.MessageBox.QUESTION
	});
}
//------------------------------------------------------------
TematicMap.prototype.DeleteLayer = function()
{
	var _layer = Ext.getCmp('selected_layer').getValue();
	// (-1)  -> para saber que es un layer y no una clase
	var _nom_class = Ext.getCmp('selected_class').getValue();

	BeginPaint();

	Ext.Ajax.request(
	{
		url		: 'App/LayerControl/Server/map_layer_delete.php',
		method	:'POST',
		params	: { layer : _layer, nom_class : _nom_class },
		callback: function (options,success,response)
				{
					var responseData = Ext.decode(response.responseText);
					mainApp.UpdateMapPanel(responseData.result);
					mainApp.UpdateMapLayerControl();
					MsExt.Components.LayerControl.DisableTBar();
					EndPaint();
				}
	});
}

//------------------------ Deshacer mapa temático ----------------------------------------------------------------------------
TematicMap.prototype.underMT = function()
{
	var _name = Ext.getCmp('selected_layer').getValue();
	BeginPaint();

	Ext.Ajax.request(
	{
		url		: 'Plugins/TematicMap/Server/map_under_temat.php',
		method	:'POST',
		params	: { layer : _name },
		callback: function (options,success,response)
				{
					var responseData = Ext.decode(response.responseText);
					mainApp.UpdateMapPanel(responseData.result);
					mainApp.UpdateLayerControl(responseData.legend);
					//mainApp.UpdateMapLayerControl();
					EndPaint();
				}
	});
}

TematicMap.prototype.onLayerControl_ContextMenu = function(node, eventObject)
{
	var id = node.attributes.id;
	var type = id.substr(0,5);
	if(type == 'layer')
	{
		Ext.getCmp('selected_class').setValue(-1);
		if(node.attributes.cls != 0)
		{
			if(Ext.getCmp('menu_bt_underMT'))
				Ext.getCmp('menu_bt_underMT').enable();
			Ext.getCmp('menu_bt_color').disable();
			Ext.getCmp('menu_bt_colorL').disable();
		}
		else
		{
			if(Ext.getCmp('menu_bt_underMT'))
				Ext.getCmp('menu_bt_underMT').disable();
			Ext.getCmp('menu_bt_color').enable();
			Ext.getCmp('menu_bt_colorL').enable();
		}
	}
	else if(type == 'class')
	{
		var id = node.attributes.id;
		var values = id.split('_');
		var num_class = values[1];
		Ext.getCmp('selected_class').setValue(num_class);
		Ext.getCmp('selected_layer').setValue(values[2]);
		Ext.getCmp('layer_select').setText(values[2]);

		this._class_popup_menu.showAt(eventObject.getXY());
		MsExt.Components.LayerControl.SetSelectedPath(node.parentNode.getPath('text'));
	}
}

TematicMap.prototype.onLayerControl_Click = function(node, eventObject)
{
	var id = node.attributes.id;

	var type = id.substr(0,5);
	if(type == 'layer')
	{		
		Ext.getCmp('selected_class').setValue(-1);
		if(node.isLeaf())
			Ext.getCmp('layer_select').setText(node.attributes.text);
		if(node.attributes.cls != 0)
			Ext.getCmp('menu_item_underMT').enable();
		else
			Ext.getCmp('menu_item_underMT').disable();
	}
	else if(type == 'class')
	{
		var id = node.attributes.id;
		var values = id.split('_');
		var num_class = values[1];
		Ext.getCmp('selected_class').setValue(num_class);
		Ext.getCmp('selected_layer').setValue(values[2]);
		Ext.getCmp('layer_select').setText(values[2]);
		Ext.getCmp('tb_layer_control').disable();
		MsExt.Components.LayerControl.DisableTBar();
		MsExt.Components.LayerControl.DesactivateLayerMenu();
		MsExt.Components.LayerControl.SetSelectedPath(node.parentNode.getPath('text'));
	}
}


TematicMap.prototype.ChangeClassColor = function(_color)
{
	var _selected_record = this.tMap_sm.getSelected();
	_selected_record.set('color',_color);
}

TematicMap.prototype.ShowAtributes = function(_source, _layer_name)
{
	var _scope = this;
	var pCombo = new Ext.form.ComboBox({
		id	: 'combo_field',
		typeAhead: true,
		autoWidth : true,
		fieldLabel :'Atributo',
		triggerAction: 'all',
		lazyRender: true,
		emptyText : 'Seleccione',
		editable : false,
		mode: 'local',
		store: _source
	});

	 var pGrid = new Ext.grid.GridPanel({
		id : 'values_Grid',
        store: this.tMap_store,
        columns: [
			new Ext.grid.RowNumberer(),
			{header: "Símbolo", width: 75, dataIndex: 'color', align: 'center',renderer:color_mapa},
            {id:'nombre',header: "Valor", width: 215, dataIndex: 'nombre'}
        ],
        stripeRows: true,
		sm:this.tMap_sm,
        height: 300,
        width: 332,
		enableColumnHide : false,
		listeners: {
						cellclick: function(This, row, colum, e)
							{
								if(colum == 1)
								{
									var _xPos = e.getPageX();
									var _yPos = e.getPageY();
									var _color = _scope.tMap_sm.getSelected().data.color;
									MsExt.Common.ColorPalette.Show(_xPos,_yPos, _color, _scope.ChangeClassColor.createDelegate(_scope));
								}
							}
					}
    });

	var _user_win = new Ext.Window({
		title: 'Confeccionar mapa temático',
		iconCls : 'tematic_map',
		closable:false,
		modal: true,
		shadow:'frame',
		width: 372,
		height: 530,
		border:true,
		plain:true,
		layout: 'fit',
		items: [
					new Ext.FormPanel({
			        labelWidth: 75, // label settings here cascade unless overridden
			        frame:true,
					title: 'Capa: ' + _layer_name,
			        bodyStyle:'padding:5px 5px 0',
			        //width: 350,

			        items: [
								new Ext.form.Label({html :'</br>'}),
								pCombo,
								new Ext.form.Label({html :'</br>'}),
								pGrid
							],
					buttons:
							[
								{text: 'Añadir todos',
								 iconCls	: 'bt_add_all',
								 listeners	: { 'click' : function()
														{
															if(Ext.getCmp('combo_field').getValue() != "")
																_scope.get_Values(Ext.getCmp('combo_field').getValue());
														}
											  }
								},
								{text: 'Quitar todos',
								 iconCls	: 'bt_remove_all',
								 listeners	: { 'click' : function()
														{
															_scope.tMap_store.removeAll();
															Ext.getCmp('btn_apply').disable();
														}
											  }
								},
								{text: 'Quitar',
								 iconCls	: 'bt_remove',
								 disabled	: true,
								 id:		'bt_remove_class',
								 listeners	: { 'click' : function()
														{
															var fila = _scope.tMap_sm.getSelected();
															_scope.tMap_store.remove(fila);
															_scope.tMap_store.getCount() ? Ext.getCmp('btn_apply').enable() : Ext.getCmp('btn_apply').disable();
														}
											  }
								}
							]
					})
				],
		buttons:
		[

			{id: 'btn_apply',
			 text: 'Aplicar',
			 disabled : true,
			 listeners	: { 'click' : function()
									{
										if(Ext.getCmp('combo_field').getValue() != "")
											_scope.makeMapTemat(Ext.getCmp('combo_field').getValue());
									}
						  }
			},
			{text: 'Cerrar',
				handler: function()
						{
							_scope.tMap_store.removeAll();
							_user_win.close();
							mainmap.getDisplay('map').clearLayer('drawing');
						}
			}
		]
	});

	_user_win.show();
}

TematicMap.prototype.onMapaTemat = function()
{
	var _layer = Ext.getCmp('selected_layer').getValue();
	var _scope = this;
	if(_layer != 0)
	{
		if( !MsExt.Common.Cache.Contains(_layer, 'fields') )
		{
			MsExt.Common.Message.ShowMessage('Cargando datos','Por favor espere...','LoadingData');
			Ext.Ajax.request(
			{
				url		: 'Framework/Server/Core/MsExt.Information.MapFields.php',
				method	: 'POST',
				params	: { layer	: _layer },
				callback: function (options,success,response)
						{
							MsExt.Common.Message.HideMessage();
							
							var _field_list = Ext.decode(response.responseText);
							_hash_fields = new msext_HashTable();
							for(var i = 0; i < _field_list.length; i++)
								_hash_fields.CreateMKey(_field_list[i]);
							MsExt.Common.Cache.Insert(_layer,'fields',_hash_fields);
							_scope.ShowAtributes(_field_list, document.getElementById('selected_layer').value);
						}
			});
		}
		else
		{
			_fields = MsExt.Common.Cache.GetValue(_layer,'fields').GetAllMasterKeys();
			this.ShowAtributes(_fields, document.getElementById('selected_layer').value);
		}
	}
	else
		msg("Información", "Debe primero seleccionar una capa.");
}

TematicMap.prototype.makeMapTemat = function(_field)
{
	var _layer = Ext.getCmp('selected_layer').getValue();
	BeginPaint();

	var colors = new Array();
	var nombres = new Array();
	var colors_by_names = new Array();

	var record = new Ext.data.Record();

	for(var i = 0; i < this.tMap_store.getCount(); i++)
	{
		record = this.tMap_store.getAt(i);
		colors[i] = record.data.color;
		nombres[i] = record.data.nombre;
		colors_by_names.push([record.data.color, record.data.nombre]);
	}

	Ext.Ajax.request(
	{
		url		: 'Plugins/TematicMap/Server/map_make_temat.php',
		method	:'POST',
		params	: {
					layer	: _layer,
					field   : _field,
					colors	: Ext.encode(colors),
					nombres	: Ext.encode(nombres)
				  },
		callback: function (options,success,response)
				{
					var responseData = Ext.decode(response.responseText);
					mainApp.UpdateMapPanel(responseData.result);
					mainApp.UpdateLayerControl(responseData.legend);
					//mainApp.UpdateMapLayerControl();
					EndPaint();

					//MsExt.Common.CacheManager.UpdateFieldColorByValues(_layer, _field, colors_by_names);
				}
	});
}

//--------------------------- Función que recupera todos los valores para un determinado atributo --------------------------------------------
TematicMap.prototype.get_Values = function(_field)
{
	var _layer = Ext.getCmp('selected_layer').getValue();
	var _values = MsExt.Common.CacheManager.GetFieldValuesByColor(_layer,_field);

	var _scope  = this;
	if( !MsExt.Common.Cache.GetValue(_layer, 'fields').Contains(_field, 'values') )
	{
		MsExt.Common.Message.ShowMessage('Cargando datos','Por favor espere...','LoadingData');

		Ext.Ajax.request(
		{
			url		: 'Plugins/TematicMap/Server/map_get_values.php',
			method	:'POST',
			params	: {
						map_name: document.getElementById('map_name').value,
						layer	: _layer,
						field	: _field
					  },
			callback: function (options,success,response)
					{
						var responseData = Ext.decode(response.responseText);
						var _values = new msext_HashTable();
						for(var i = 0; i < responseData.length; i++)
						{
							_values.CreateMKey(responseData[i][0]);
							_values.Insert(responseData[i][0],'color',responseData[i][1]);
						}
						
						MsExt.Common.Cache.GetValue(_layer,'fields').Insert(_field,'values',_values);
						_scope.tMap_store.loadData(responseData);
						MsExt.Common.Message.HideMessage();
					}
		});
	}
	else
	{
		var _values = MsExt.Common.Cache.GetValue(_layer, 'fields').GetValue(_field,'values').GetAllValuesOfAsArray('color');
		this.tMap_store.loadData(_values);
	}
}

TematicMap.prototype.Init = function()
{
	var _scope = this;
	
	//----------------- Datos que muestra el grid ----------------------
	this.tMap_store = new Ext.data.ArrayStore({
	    fields: [
	       {name: 'nombre'},
		   {name: 'color'}
	    ],
		listeners: 
		{
			load: function(){
					_scope.tMap_store.getCount() ? Ext.getCmp('btn_apply').enable() : Ext.getCmp('btn_apply').disable();
				}
		}
	});

	//------------------ Atributos que se  cargan en el combo ---------
	this.tMap_sm = new Ext.grid.RowSelectionModel(
	{
		singleSelection:true,
		listeners: {
					selectionchange: function(sm)
									{
										if (sm.getCount()) {
											Ext.getCmp('bt_remove_class').enable();
										} else {
											Ext.getCmp('bt_remove_class').disable();
										}
									}
					}
	});
	// Popup menu for class
	this._class_popup_menu = new Ext.menu.Menu(
	{
		id: 'popupMenuClass',
		style: {
			overflow: 'visible'     // For the Combo popup
		},
		items: [
			'<div align = "center"><b class="menu-title">Opciones</b></div>','-',
			{
				text: 'Eliminar clase',
				iconCls: 'delete_class',
				handler : function()
				{
					_scope.onDeleteClass();
				}
			},'-',{
				id  : 'menu_class_bt_color',
				text: 'Cambiar color de la clase',
				iconCls: 'color_layer',
				 menu: {
						items: [
								new Ext.ColorPalette(
								{
									listeners: {
												select: function(cp, color){
												_scope.ChangeLayerColor(color, 'c');
											   }
											}
								}),
								{
									text : 'Transparente',
									listeners	: { 'click' : function(){_scope.ChangeLayerColor('-1-1-1', 'c');} }
								}
								]
					}

			},
			{
				id  : 'menu_class_bt_colorL',
				text: 'Cambiar color del borde',
				iconCls: 'underline_layer',
				 menu: {
						items: [
								new Ext.ColorPalette({
									listeners: {
												select: function(cp, color){
												_scope.ChangeLayerColor(color, 'b');
											   }
											}
								}),
								{
									text : 'Transparente',
									listeners	: { 'click' : function(){_scope.ChangeLayerColor('-1-1-1', 'c');} }
								}
								]
					}

			}
		]
	});
		
	this._MapTematicoBtn = new Ext.Button(
	{
		id	 : 'mapTematico',
		tooltip	: 'Construir mapa temático',
		iconCls: 'tematic_map',
		handler : this.onMapaTemat.createDelegate(this)
	});

	this._undo_tematic_layer = new Ext.menu.Item(
	{
		id  : 'menu_bt_underMT',
		text: 'Deshacer Mapa Temático',
		iconCls: 'under_tematic_map',
		listeners	: { 'click' : function(){_scope.underMT();} }
	});

	this.menu_item_undo_tematic_layer = new Ext.menu.Item(
	{
		id  : 'menu_item_underMT',
		text: 'Deshacer Mapa Temático',
		iconCls: 'under_tematic_map',
		disabled: true,
		handler	: _scope.underMT.createDelegate(_scope)
	});
	
	this._is_enable = true;
	
	MsExt.Components.LayerControl.EnqueueOnClickHandler(this.onLayerControl_Click,this);
	MsExt.Components.LayerControl.EnqueueRigthClickHandler(this.onLayerControl_ContextMenu,this);
	
	mainApp.AddButtonToLayerControl(this._MapTematicoBtn);
	mainApp.AddHiddenField('selected_class','selected_class',-1);
	mainApp.AddHiddenField('selected_labeled','selected_labeled',-1);

	MsExt.Components.LayerControl.GetPopupMenu().add('-');
	MsExt.Components.LayerControl.GetPopupMenu().add(this._undo_tematic_layer);

	mainApp.AddMenu('Capas',[this.menu_item_undo_tematic_layer]);
}

var _tematic_map_plg = new TematicMap();
mainApp.RegisterPlugin(_tematic_map_plg);
