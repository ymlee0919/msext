function ShowPointInfo(_source, _layer_name)
{
	var index_one = _source.indexOf('[') + 1;
	var index_two = _source.indexOf(']');
	var shape = Ext.getCmp('shapeIndex').getValue();

	var _data = (index_two != -1) ? _source.substring(index_one , index_two ) : _source;
	var s = Ext.decode(_data);
	var _btn_id = _query_plg.GetNextId();

	var pGrid = new Ext.grid.PropertyGrid({
		title: 'Capa: ' + _layer_name,
		disableSelection : true,
		source : s
	});

	mainmap.getDisplay('map').clearLayer('drawing');

	var _select_btn_id = MsExt.Common.SelectButton.GetNextBtnId();

	var _point_info_win = new Ext.Window({
		title: 'Información puntual',
		closable:false,
		collapsible : true,
		modal: false,
		shadow:'frame',
		width:300,
		height: 350,
		border:true,
		plain:true,
		layout: 'fit',
		items: [pGrid],
		buttons:
		[
			{
				text: 'Localizar',
				id : _btn_id,
				handler: function()
						{
							_query_plg.Locate(_layer_name, shape);
							this.disable();
						}
			},
			MsExt.Common.SelectButton.GetSingleselectionButton(_layer_name, shape),
			{
				text: 'Cerrar',
				handler: function(){_point_info_win.close();}
			}
		]
	});

	if(document.getElementById('shapeIndex').value == -1)
		Ext.getCmp(_btn_id).disable();

	_point_info_win.show();
}

function ShowShapeInfo(_source, _layer_name)
{
	var _scope = this;
	var _def = _source.columns;
	_cols = _def.split(',');

	// Column model
	var _columns = new Array();
	for(var i = 0; i < _cols.length; i++)
	  if(i == _cols.length - 1)
		_columns.push({ header : _cols[i], sortable : true, width: 50, dataIndex: _cols[i], hidden: true});
	  else if(_cols[i] == 'length')
		_columns.push({ header : 'Perímetro', sortable : true, width: 50, dataIndex: _cols[i] });
	  else if(_cols[i] == 'area')
		_columns.push({ header : 'Área', sortable : true, width: 50, dataIndex: _cols[i] });
	  else
		_columns.push({ header : _cols[i], sortable : true, width: 50, dataIndex: _cols[i] });

	var _cm = new Ext.grid.ColumnModel(
	{
		columns: _columns
	});

	// JsonStore
	var _store = new Ext.data.Store(
	{
		proxy: new Ext.data.PagingMemoryProxy(_source),
		reader: new Ext.data.JsonReader({
			root	: 'data',
			fields	: _cols
		})
	});

	var _btn_id = _query_plg.GetNextId();
	var _select_btn_id = MsExt.Common.SelectButton.GetNextBtnId();

	var pGrid = new Ext.grid.GridPanel(
				{
					title	: 'Información',
					width	:600,
					height	:320,
					store	: _store,
					cm		: _cm,
					viewConfig: {
						            forceFit:true
						        },
					sm		: new Ext.grid.RowSelectionModel(
								{
									singleSelect: false,
									listeners : { 'rowselect' : function(SelectionModel,rowIndex,r)
																{
																	Ext.getCmp(_select_btn_id).enable();
																	if(SelectionModel.getCount() == 1) Ext.getCmp(_btn_id).enable();
																	else Ext.getCmp(_btn_id).disable();
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

	mainmap.getDisplay('map').clearLayer('drawing');

	var _info_win = new Ext.Window({
		title: 'Información',
		collapsible : true,
		closable:false,
		modal: false,
		shadow:'frame',
		width: 620,
		height: 370,
		border:true,
		plain:true,
		layout: 'fit',
		items: [pGrid],
		buttons:
		[
			{
				text: 'Localizar',
				id : _btn_id,
				disabled : true,
				handler: function()
						{
							_query_plg.LocateSelectedRow(pGrid);
							this.disable();
						}
			},
			MsExt.Common.SelectButton.GetMultiselectionButton(_layer_name, pGrid),
			{
				text: 'Cerrar',
				handler: function()
						{
							_info_win.close();
						}
			}
		]
	});

	_info_win.show();
}


function Information()
{
	this._qByPointBtn = null;
	this._qByCircleBtn = null;
	this._qByPolyBtn = null;
	this._qByRectBtn = null;
	this._btn_id = 1;

	this._is_enable = false;

	this.GetName = function()
	{
		return 'Información';
	}

	this.InitComponents = function()
	{
		this._qByPointBtn = new Ext.Button(
		{
			id	 : 'qByPoint',
			iconCls:'query_point',
			tooltip	: 'Información puntual',
			disabled : true,
			handler : this.onQueryByPoint.createDelegate(this)
		});

		this._qByCircleBtn = new Ext.Button(
		{
			id	 : 'qByCircle',
			iconCls:'query_circle',
			tooltip	: 'Información por círculo',
			disabled : true,
			handler : this.onQueryByCircle.createDelegate(this)
		});

		this._qByPolyBtn = new Ext.Button(
		{
			id	 : 'qByPly',
			iconCls:'query_poly',
			tooltip	: 'Información por polígono',
			disabled : true,
			handler : this.onQueryByPoly.createDelegate(this)
		});

		this._qByRectBtn = new Ext.Button(
		{
			id	 : 'qByRect',
			iconCls:'query_rect',
			tooltip	: 'Información por rectángulo',
			disabled : true,
			handler : this.onQueryByRect.createDelegate(this)
		});
	}

	this.Init = function()
	{
		this.InitComponents();

		var _menu_info = [
			{text:'Información puntual', id: 'query_point_item_menu', iconCls: 'query_point', handler: this.onQueryByPoint.createDelegate(this), disabled : true},
			{text:'Información por círculo', id: 'query_circle_item_menu', iconCls: 'query_circle', handler: this.onQueryByCircle.createDelegate(this), disabled : true},
			{text:'Información por polígono', id: 'query_poly_item_menu', iconCls: 'query_poly', handler: this.onQueryByPoly.createDelegate(this), disabled : true},
			{text:'Información por rectángulo', id: 'query_rect_item_menu', iconCls: 'query_rect', handler: this.onQueryByRect.createDelegate(this), disabled : true}
		];

		mainApp.AddTBarButton({xtype: 'tbseparator', id: 'query_sep_id'});
		mainApp.AddTBarButton(this._qByPointBtn);
		mainApp.AddTBarButton(this._qByCircleBtn);
		mainApp.AddTBarButton(this._qByPolyBtn);
		mainApp.AddTBarButton(this._qByRectBtn);

		mainApp.AddMenu('Información',_menu_info);

		mainApp.AddHiddenField('shapeIndex','shapeIndex',-1);
		mainApp.AddHiddenField('row_index','row_index',-1);
		
		var _select_layer = function(node, eventObject)
		{
			var id = node.attributes.id;
			var type = id.substr(0,5);
			if(type == 'layer')
			{
				this._qByPointBtn.enable();
				this._qByCircleBtn.enable();
				this._qByPolyBtn.enable();
				this._qByRectBtn.enable();
				
				Ext.getCmp('query_point_item_menu').enable();
				Ext.getCmp('query_circle_item_menu').enable();
				Ext.getCmp('query_poly_item_menu').enable();
				Ext.getCmp('query_rect_item_menu').enable();
			}
			else
			{
				this._qByPointBtn.disable();
				this._qByCircleBtn.disable();
				this._qByPolyBtn.disable();
				this._qByRectBtn.disable();
				
				Ext.getCmp('query_point_item_menu').disable();
				Ext.getCmp('query_circle_item_menu').disable();
				Ext.getCmp('query_poly_item_menu').disable();
				Ext.getCmp('query_rect_item_menu').disable();
			}
		};
		
		MsExt.Components.LayerControl.EnqueueOnClickHandler(_select_layer, this);
		MsExt.Components.LayerControl.EnqueueRigthClickHandler(_select_layer, this);

		this._is_enable = true;
	}

	this.Enable = function()
	{
		Ext.getCmp('query_sep_id').show();
		this._qByPointBtn.show();
		this._qByCircleBtn.show();
		this._qByPolyBtn.show();
		this._qByRectBtn.show();
		Ext.getCmp('menu_Información_id').show();

		var _plg_selection_flag = _selection_plg.IsEnable();
		var _plg_search_flag = _search_plugin.IsEnable();

		if(!_plg_selection_flag && !_plg_search_flag)
			_clean_selection.Enable();

		this._is_enable = true;
	}

	this.Disable = function()
	{
		Ext.getCmp('query_sep_id').hide();
		this._qByPointBtn.hide();
		this._qByCircleBtn.hide();
		this._qByPolyBtn.hide();
		this._qByRectBtn.hide();
		Ext.getCmp('menu_Información_id').hide();

		var _plg_selection_flag = _selection_plg.IsEnable();
		var _plg_search_flag = _search_plugin.IsEnable();

		if(!_plg_selection_flag && !_plg_search_flag)
			_clean_selection.Disable();

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

	this.Locate = function(LayerName, ShapeIndex)
	{
		var _width = document.getElementById('map').style.width;
		var _height = document.getElementById('map').style.height;

		_width = (_width.substring(0,_width.length-2));
		_height = (_height.substring(0,_height.length-2));

		BeginPaint();

		Ext.Ajax.request(
		{
			url		: 'Framework/Server/Core/MsExt.Location.LocateShape.php',
			method	:'POST',
			params	: {
						map_name	: document.getElementById('map_name').value,
						shapeIndex	: ShapeIndex,
						layer		: LayerName
						},
			callback: function (options,success,response)
					{
						var responseData = Ext.decode(response.responseText);
						mainApp.UpdateMapPanel(responseData.result);

						// Mostrar
						document.getElementById('marker_img').style.left = _width/2 - 32;
						document.getElementById('marker_img').style.top = _height/2 - 32;
						document.getElementById('marker_img').style.visibility = 'visible';
						document.getElementById('marker_img').style.position = 'absolute';

						EndPaint();
					}
		});
	}

	this.LocateSelectedRow = function(GridPanel)
	{
		var _width = document.getElementById('map').style.width;
		var _height = document.getElementById('map').style.height;

		_width = (_width.substring(0,_width.length-2));
		_height = (_height.substring(0,_height.length-2));

		var _shape = GridPanel.getSelectionModel().getSelected().get('shapeindex');

		BeginPaint();

		Ext.Ajax.request(
		{
			url		: 'Framework/Server/Core/MsExt.Location.LocateShape.php',
			method	:'POST',
			params	: {
						map_name	: document.getElementById('map_name').value,
						shapeIndex	: _shape,
						layer		: document.getElementById('selected_layer').value,
						extent  : document.getElementById('extent').value
						},
			callback: function (options,success,response)
					{
						var responseData = Ext.decode(response.responseText);
						mainApp.UpdateMapPanel(responseData.result);

						// Mostrar
						document.getElementById('marker_img').style.left = _width/2 - 32;
						document.getElementById('marker_img').style.top = _height/2 - 32;
						document.getElementById('marker_img').style.visibility = 'visible';
						document.getElementById('marker_img').style.position = 'absolute';

						EndPaint();
					}
		});
	}

	this.SelectShapes = function(_grid)
	{
		var _shapes = new Array();

		var _selected_rows = _grid.getSelectionModel().getSelections();
		for(var i = 0; i < _selected_rows.length; i++)
			_shapes.push(_selected_rows[i].get('shapeindex'));

		MsExt.Core.Selection.SelectShapes(document.getElementById('map_name').value,
											document.getElementById('extent').value,
											document.getElementById('selected_layer').value,
											_shapes);
	}

	this.HighlightQueryShape = function()
	{
		BeginPaint();

		Ext.Ajax.request(
		{
			url		: 'Framework/Server/Core/MsExt.Selection.HighlightShape.php',
			//url		: 'Core/Server/highlight_shape.php',
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

	this.HighlightQueryLayerAll = function(Indexs)
	{
		BeginPaint();

		Ext.Ajax.request(
		{
			url		: 'Framework/Server/Core/MsExt.Selection.HighlightShape.php',
			//url		: 'Core/Server/highlight_shape.php',
			method	:'POST',
			params	: {
						map_name: document.getElementById('map_name').value,
						extent	: document.getElementById('extent').value,
						layer	: document.getElementById('selected_layer').value,
						shapeIndex : -1,
						all_shapeIndex : Indexs
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
}

var _query_plg = new Information();
mainApp.RegisterPlugin(_query_plg);