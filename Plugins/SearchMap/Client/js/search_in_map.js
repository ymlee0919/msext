 
function Search()
{
	this._searchMapBtn = null;
	this._search_grid_map = null;
	this._search_tab = null;
	this._search_panel = null;
	
	this._is_enable = false;
	
	this.layers_store = new Ext.data.ArrayStore({
			fields: [{name: 'layer'}]
	});
		
	this.attributes_reader = new Ext.data.JsonStore({
			fields: [{name: 'type'},{name: 'name_attribute'}]
	});	

	this.attributes_store = new Ext.data.ArrayStore({
			fields: [{name: 'name_attribute'},{name: 'type'}]
	});

	this.store_search_operator = new Ext.data.ArrayStore({
	     fields: ['type', 'operator']
	});
	
	this.operator_int = [
						['=', 'Igual'],
						['!=', 'Diferente'],
						['<', 'Menor'],
						['<=', 'Menor o Igual'],
						['>', 'Mayor'],
						['>=', 'Mayor o Igual']
						];
						
	this.operator_str = [
						['=~', 'Contiene'],
						['=', 'Igual'],
						['!=', 'Diferente']
					];
	
	this.GetName = function()
	{
		return 'Búsqueda por atributos';
	}
	
	this.InitComponents = function()
	{
		var _scope = this;
		
		this._searchMapBtn = new Ext.Button(
		{
			id	 : 'search_map_btn',
			iconCls:'search_map',
			tooltip	: 'Buscar',	
			handler : this.onWinSearchMap.createDelegate(this)
		});
		
		this._search_grid_map = new Ext.grid.EditorGridPanel(
		{
			enable	: true,
			height 	: 150,
			width	: 670,
			id	:'search_grid_map',
			store 	: new Ext.data.JsonStore(
						{
							fields: 
							[
								{name: 'field', type:'string'},
								{name: 'oper', type:'string'},
								{name: 'operator', type:'string'},
								{name: 'value', type:'string'},
								{name: 'logic_operator', type:'boolean'}
							]
						}),
			sm		: new Ext.grid.RowSelectionModel(
						{	
							singleSelect:true,
							listeners : {'rowselect' : this.onSelectParamRow.createDelegate()}
						}),
			columns	: [
						{header: 'Campo', width: 120, sortable: true, dataIndex: 'field'},
						{header: 'Operador', width: 100, sortable: true, dataIndex: 'operator'},
						{header: 'Valor', width: 150, sortable: true, dataIndex: 'value'}
					  ],
			viewConfig: { forceFit: true },
			bbar : 
				[
					'->', 
					{
						xtype: 'button',
						text: 'Eliminar',
						id : 'delete_search_param_btn_id',
						disabled : true,
						scope : _scope,
						handler : _scope.onDeleteParamRowSelected.createDelegate(_scope)
					},
					' ', '-', ' ',
					{
						xtype: 'button',
						text: 'Buscar',
						id : 'search_btn_id',
						disabled : true,
						scope : _scope,
						handler : _scope.Search.createDelegate(_scope)
					}
				]
		});
			
		this._search_tab = new Ext.form.FormPanel(
		{
			title : 'Parámetros',
			frame : true,
			labelWidth : 60,
			items : 
			[
				{
					xtype:'fieldset',
					collapsible: false,
					autoHeight:true,
					width:670,
					items :
					[
						{					
						style:'margin:0 0 0 5',
						layout : 'column',
						items : [
								{
									style:'margin:0 0 0 5',
									columnWidth : 1,
									layout : 'form',
									items : [
												{
													xtype:'combo',
													id	: 'search_layer',
													name	: 'search_layer',
													typeAhead: true,
													autoWidth : true,	
													allowBlank : false,
													fieldLabel :'Capa',
													triggerAction: 'all',
													lazyRender: true,
													emptyText : 'Seleccione',
													editable : true,
													forceSelection:true,
													width : 100,
													mode: 'local',
													displayField:'layer',
													store:this.layers_store,													
													listeners : {'select' : this.onSelectLayer.createDelegate(this)}
												}						
											]
								},{
									columnWidth:1,
									border:false,
									items:
											[ new Ext.form.Label({html :'</br>'}), {xtype:'hidden',id:'search_selected', name:'search_selected', value:-1} ]
								},
								{
									style:'margin:0 0 0 5',
									columnWidth : .4,
									layout : 'form',
									items : [
												{
													xtype:'combo',
													id	: 'search_attribute',
													name:'search_attribute',
													typeAhead: true,
													autoWidth : true,	
													allowBlank : false,
													fieldLabel :'Atributo',
													triggerAction: 'all',
													lazyRender: true,
													emptyText : 'Seleccione',
													editable : true,
													forceSelection:true,
													anchor:'95%',
													mode: 'local',
													displayField:'name_attribute',
													valueField:'name_attribute',
													store:this.attributes_store,
													listeners : {'select' : this.onSelectAttributes.createDelegate(this)}											
												}						
											]
								},{
									style:'margin:0 0 0 10',
									columnWidth : .4,
									layout : 'form',
									items : [
												{
													xtype:'combo',
													id	: 'search_operator',
													name:'search_operator',
													typeAhead: true,
													autoWidth : true,	
													allowBlank : false,
													fieldLabel :'Operador',
													triggerAction: 'all',
													lazyRender: true,
													emptyText : 'Seleccione',
													editable : true,
													forceSelection:true,
													mode: 'local',
													anchor:'95%',
													displayField:'operator',
													valueField:'type',
													store:this.store_search_operator
												}
											]
								},{
									columnWidth:1,
									border:false,
									items:
											[ new Ext.form.Label({html :'</br>'}) ]
								},
								{
									style:'margin:0 0 0 5',
									columnWidth : .7,
									layout : 'form',
									items : [
												{
													xtype:'textfield',
													fieldLabel: 'Valor',
													allowBlank : false,
													name: 'search_value',
													id: 'search_value',
													emptyText: 'valor...',
													anchor:'90%'
												}
											]
								},{
									columnWidth : .085,
									layout : 'form',
									items : [
												{
													xtype : 'button',
													text  : ' + ',
													anchor : '90%',
													align : 'center',
													handler : this.AddParameterToSearch.createDelegate(this)
												}
											]
								}
							]
						}
					]
				},
				this._search_grid_map
			]
		});
		
		this._search_panel = new Ext.TabPanel(
		{
			activeTab : 0,
			plain:true,
			width: 'auto',
			height : 'auto',
			id : 'search_tab_panel_id',
			defaults:{autoScroll: true},
			items : 
			[
				this._search_tab,
				{
					id : 'search_result',
					title : 'Resultados',
					html : '<div id = "search_result_div"><b>Sin resultados....</b></div>'
				}
			]
		});
	}
	
	this.Init = function()
	{
		
		this.InitComponents();
		
		mainApp.AddTBarButton({xtype: 'tbseparator', id: 'search_sep_id'});
		mainApp.AddTBarButton(this._searchMapBtn);
		
		this._is_enable = true;
	}
	
	this.Disable = function()
	{
		Ext.getCmp('search_sep_id').hide();
		this._searchMapBtn.hide();
		
		var _plg_selection_flag = _selection_plg.IsEnable();
		var _plg_query_flag = _query_plg.IsEnable();
		
		if(!_plg_selection_flag && !_plg_query_flag)
			_clean_selection.Disable();
		
		this._is_enable = false;
	}

	this.Enable = function()
	{
		Ext.getCmp('search_sep_id').show();
		this._searchMapBtn.show();
		
		var _plg_selection_flag = _selection_plg.IsEnable();
		var _plg_query_flag = _query_plg.IsEnable();
		
		if(!_plg_selection_flag && !_plg_query_flag)
			_clean_selection.Enable();
		
		this._is_enable = true;
	}

	this.IsEnable = function()
	{
		return this._is_enable;
	}
	
	this.HighlightSearchShape = function()
	{
		BeginPaint();
		
		Ext.Ajax.request(
		{
			url		: 'Framework/Server/Core/MsExt.Selection.HighlightShape.php',
			method	:'POST',
			params	: {
						map_name: document.getElementById('map_name').value,					
						extent	: document.getElementById('extent').value,
						layer	: document.getElementById('selected_layer').value,
						shapeIndex : document.getElementById('shapeIndex').value
						},
			callback: function (options,success,response)
					{
						var responseData = Ext.decode(response.responseText);		
						mainApp.UpdateMapPanel( responseData.result);
						EndPaint();
						_clean_selection._CleanSelection.enable();
					}
		});
	}
	
	this.Locate = function()
	{
		var layer = Ext.getCmp('search_layer').getValue();
		var shapeIndex = Ext.getCmp('grid_search_info').getSelectionModel().getSelected().get('shapeindex');
		msCoreLocation.LocateShape(document.getElementById('map_name').value, document.getElementById('extent').value, layer, shapeIndex);
	}

	this.ShowFoundInfo = function(_source, _layer_name)
	{
		var _scope = this;
		var _def = _source.columns;
		_cols = _def.split(',');		

		// JsonStore
		var _store = new Ext.data.Store(
		{
			proxy: new Ext.data.PagingMemoryProxy(_source),
			reader: new Ext.data.JsonReader({
				root	: 'data',
				fields	: _cols
			})
		});
		
		_cols.pop();
		
		// Column model
		var _columns = new Array();
		for(var i = 0; i < _cols.length; i++)
			if(_cols[i] != 'shapeindex')
				_columns.push({ header : _cols[i], sortable : true, width: 50, dataIndex: _cols[i] });
		
		var _cm = new Ext.grid.ColumnModel(
					{
						columns: _columns
					});
		
		var _select_btn_id = MsExt.Common.SelectButton.GetNextBtnId();
		
		function DisableButtons()
		{
			Ext.getCmp(_select_btn_id).disable();
			Ext.getCmp('search_locate_btn').disable();
		}
		
		var pGrid = "";
		pGrid = new Ext.grid.GridPanel(
					{
						id		: 'grid_search_info',
						width	: 'auto',
						height	: 257,
						store	: _store,
						cm		: _cm,
						tbar	:
						[
							'->',
							{
								text: 'Localizar',
								id : 'search_locate_btn',
								disabled : true,
								handler: function()
										{
											_scope.Locate();
											this.disable();
										}
							}
						],
						viewConfig: {
							            forceFit:true
							        },
						sm		: new Ext.grid.RowSelectionModel(
									{
										singleSelect: false,
										listeners : { 'rowselect' : function(SelectionModel,rowIndex,r)
																		{
																			Ext.getCmp(_select_btn_id).enable();
																			if(SelectionModel.getCount() == 1) Ext.getCmp('search_locate_btn').enable();
																			else Ext.getCmp('search_locate_btn').disable();
																		}
													}
									}),
						// paging bar on the bottom
				        bbar: new Ext.PagingToolbar({
				            pageSize: 10,
				            store: _store,
				            displayInfo: true,
				            displayMsg: 'Mostrando elementos {0} - {1} de {2}',
				            emptyMsg: "No hay elementos que mostrar",
							firstText : 'Primera página',
							lastText : 'Última página',
							prevText : 'Página anterior',
							nextText : 'Página siguiente',
							refreshText : 'Refrescar página'
				        })
					});
		
		_store.load({params:{start:0, limit:10}});

		Ext.getCmp('search_tab_panel_id').activate('search_result');
		document.getElementById('search_result_div').innerHTML = "";
		pGrid.render('search_result_div');
		pGrid.getTopToolbar().add(MsExt.Common.SelectButton.GetMultiselectionButton(_layer_name, pGrid));
		pGrid.getBottomToolbar().on('change', DisableButtons.createDelegate());
		pGrid.render();
	}

	this.onSelectLayer = function(scope, record, index)
	{
		var _selected_layer = record.get('layer');
		var _attributes_reader = this.attributes_reader;
		var _attributes_store = this.attributes_store;
		
		Ext.getCmp('search_attribute').clearValue();
		Ext.getCmp('selected_layer').setValue(_selected_layer);
		
		if(!MsExt.Common.Cache.Contains(_selected_layer, 'fields') || !MsExt.Common.Cache.GetValue(_selected_layer, 'fields').ContainsKey('type'))
		{
			_wait = Ext.Msg.wait('Por favor espere...','Cargando datos...');
			Ext.Ajax.request(
			{
				url		: 'Plugins/SearchMap/Server/map_get_attributes.php',
				method	:'POST',
				params	: {
							map_name: document.getElementById('map_name').value,					
							layer	: _selected_layer
						  },
				callback: function (options,success,response)
						{
							_wait.hide();
							var responseData = Ext.decode(response.responseText);
							_attributes_reader.loadData(responseData);
							
							var _fields = new Array();
							var _types = new Array();
							
							if(!MsExt.Common.Cache.Contains(_selected_layer, 'fields'))
								MsExt.Common.Cache.Insert(_selected_layer, 'fields', new msext_HashTable());
							
							var count = _attributes_reader.getCount();
							for(var i = 0; i < count; i++)
								MsExt.Common.Cache.GetValue(_selected_layer, 'fields').Insert(_attributes_reader.getAt(i).get('name_attribute'), 'type', _attributes_reader.getAt(i).get('type'));

							_fields = MsExt.Common.Cache.GetValue(_selected_layer, 'fields').GetAllValuesOfAsArray('type');
							_attributes_store.loadData(_fields);
						}  
			});
		}
		else
		{
			var _fields = MsExt.Common.Cache.GetValue(_selected_layer, 'fields').GetAllValuesOfAsArray('type');
			this.attributes_store.loadData(_fields);
		}
	}

	this.onSelectAttributes = function(scope, index, record)
	{	
		var _layer = Ext.getCmp('search_layer').getValue();
		var _field = Ext.getCmp('search_attribute').getValue();
		
		var _type = MsExt.Common.Cache.GetValue(_layer,'fields').GetValue(_field, 'type');
		if(_type == 'numeric')
			this.store_search_operator.loadData(this.operator_int);
		  else
			this.store_search_operator.loadData(this.operator_str);
		  
	}

	this.onSelectParamRow = function(smodel, rowIndex, r)
	{
		Ext.getCmp('delete_search_param_btn_id').enable();
	}

	this.onDeleteParamRowSelected = function()
	{
		this._search_grid_map.getStore().remove(this._search_grid_map.getSelectionModel().getSelected());
		Ext.getCmp('delete_search_param_btn_id').disable();
		if(this._search_grid_map.getStore().getCount() == 0)
		{
			Ext.getCmp('search_btn_id').disable();
			Ext.getCmp('search_layer').enable();
		}
	}

	var _params_record = Ext.data.Record.create(
	[
		{name: 'field', type:'string'},
		{name: 'oper', type:'string'},
		{name: 'operator', type:'string'},
		{name: 'value', type:'string'},
		{name: 'logic_operator', type:'boolean'}
	]);

	this.AddParameterToSearch = function()
	{
		if(!this._search_tab.getForm().isValid())
		{
			msg('Error','Parámetros de búsqueda incorrectos...');
			return;
		}
		
		var _field = Ext.getCmp('search_attribute').getValue();
		var _oper = Ext.getCmp('search_operator').getValue();
		var _operator = Ext.getCmp('search_operator').getRawValue();
		var _value = Ext.getCmp('search_value').getValue();
			
		var _new_param_record = new _params_record(
		{
			field : _field,
			oper : _oper,
			operator : _operator,
			value : _value,	
			logic_operator : true
		});
		
		this._search_grid_map.getStore().add(_new_param_record);
		
		Ext.getCmp('search_btn_id').enable();
		Ext.getCmp('search_layer').disable();
	}

	this.Search = function()
	{
		_wait = Ext.Msg.wait('Por favor espere...','Buscando...');
		
		var _scope = this;
		
		var _params_count = this._search_grid_map.getStore().getCount();
		var str = '';
		var _field = '', _oper = '', _value = '';
		var _selected_layer = Ext.getCmp('search_layer').getValue();
		
		for(var i = 0; i < _params_count; i++)
		{
			_field = this._search_grid_map.getStore().getAt(i).get('field');
			_oper = this._search_grid_map.getStore().getAt(i).get('oper');
			_value = this._search_grid_map.getStore().getAt(i).get('value');
			_type = MsExt.Common.Cache.GetValue(_selected_layer,'fields').GetValue(_field, 'type');
			
			str += "<filter><field=" +_field + "/><operator="+_oper+"/><value=" +_value +"/><type="+ _type+"/>";
		}
		
		Ext.Ajax.request(
		{
			url		: 'Plugins/SearchMap/Server/map_get_search_result.php',
			method	:'POST',
			params	: {
						map_name: document.getElementById('map_name').value,
						extent	: document.getElementById('extent').value,
						layer	: _selected_layer,
						parameters : str
					  },
			callback: function (options,success,response)
					{
						_wait.hide();
						
						var responseData = Ext.decode(response.responseText);
						if(responseData.count == 0)
								msg('Informacion','La seleccion no incluye elemento alguno');
						else
							_scope.ShowFoundInfo(responseData, _selected_layer);
					}  
		});
	}

	this.onWinSearchMap = function()
	{
		this.layers_store.loadData(MsExt.Common.Cache.GetAllMasterKeysAsArray());
			
		var _search_win = null;
		if(!(_search_win = Ext.getCmp('search_win')))
		{	_search_win = new Ext.Window({
				title: 'Búsqueda...',
				id : 'search_win',
				closable:false,
				collapsible : true,
				modal: false,
				shadow:'frame',
				width:700,
				height: 400,
				border:true,
				iconCls:'search_map',
				plain:true,
				layout: 'fit',
				items: [this._search_panel],
				buttons: 
				[
					{	
						text: 'Cerrar',
						handler: function(){_search_win.hide();}
					}
				]
			});
		}
		
		_search_win.show();
	}
}

var _search_plugin = new Search();
mainApp.RegisterPlugin(_search_plugin);