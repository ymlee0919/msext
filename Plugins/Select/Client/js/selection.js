/*
* Selection plugin
*/

function Selection()
{
	this._SelectRectBtn = null;

	this._rect_select = null;

	this._is_enable = false;

	this.GetName = function()
	{
		return 'Selección';
	}

	this.Init = function()
	{
		// Buttons
		this._SelectPointBtn = new Ext.Button(
		{
			id	 : 'SelByPoint',
			iconCls:'selection_by_point',
			tooltip	: 'Selección por punto',
			disabled : true,
			handler : this.onSelectByPoint.createDelegate(this)
		});

		this._SelectRectBtn = new Ext.Button(
		{
			id	 : 'SelByRect',
			iconCls:'selection_by_rect',
			tooltip	: 'Selección por rectángulo',
			disabled : true,
			handler : this.onSelectByRect.createDelegate(this)
		});

		this._SelectCircleBtn = new Ext.Button(
		{
			id	 : 'SelByCircle',
			iconCls:'selection_by_circle',
			tooltip	: 'Selección por círculo',
			disabled : true,
			handler : this.onSelectByCircle.createDelegate(this)
		});

		this._SelectPolyBtn = new Ext.Button(
		{
			id	 : 'SelByPoly',
			iconCls:'selection_by_poly',
			tooltip	: 'Selección por polígono',
			disabled : true,
			handler : this.onSelectByPoly.createDelegate(this)
		});

		this._SelectPolylineBtn = new Ext.Button(
		{
			id	 : 'SelByPolyline',
			iconCls:'selection_by_polyline',
			tooltip	: 'Selección por polilínea',
			disabled : true,
			handler : this.onSelectByPolyline.createDelegate(this)
		});

		// Toolbar
		mainApp.AddTBarButton({xtype: 'tbseparator', id: 'selection_sep_id'});
		mainApp.AddTBarButton(this._SelectPointBtn);
		mainApp.AddTBarButton(this._SelectRectBtn);
		mainApp.AddTBarButton(this._SelectCircleBtn);
		mainApp.AddTBarButton(this._SelectPolyBtn);
		mainApp.AddTBarButton(this._SelectPolylineBtn);

		// Menu
		this._select_menu = [
			{id:'_select_point_item_menu_id', text:'Selección por punto', iconCls: 'selection_by_point', handler: this.onSelectByPoint.createDelegate(this), disabled : true},
			{id:'_select_rect_item_menu_id', text:'Selección por rectángulo', iconCls: 'selection_by_rect', handler: this.onSelectByRect.createDelegate(this), disabled : true},
			{id:'_select_circle_item_menu_id', text:'Selección por círculo', iconCls: 'selection_by_circle', handler: this.onSelectByCircle.createDelegate(this), disabled : true},
			{id:'_select_poly_item_menu_id', text:'Selección por polígono', iconCls: 'selection_by_poly', handler: this.onSelectByPoly.createDelegate(this), disabled : true},
			{id:'_select_polyline_item_menu_id', text:'Selección por polilínea', iconCls: 'selection_by_polyline', handler: this.onSelectByPolyline.createDelegate(this), disabled : true}
		];

		mainApp.AddMenu('Selección',this._select_menu);
		
		var _select_layer = function(node, eventObject)
		{
			var id = node.attributes.id;
			var type = id.substr(0,5);
			if(type == 'layer')
			{
				this._SelectPointBtn.enable();
				this._SelectRectBtn.enable();
				this._SelectCircleBtn.enable();
				this._SelectPolyBtn.enable();
				this._SelectPolylineBtn.enable();
				
				Ext.getCmp('_select_point_item_menu_id').enable();
				Ext.getCmp('_select_rect_item_menu_id').enable();
				Ext.getCmp('_select_circle_item_menu_id').enable();
				Ext.getCmp('_select_poly_item_menu_id').enable();
				Ext.getCmp('_select_polyline_item_menu_id').enable();
			}
			else
			{
				this._SelectPointBtn.disable();
				this._SelectRectBtn.disable();
				this._SelectCircleBtn.disable();
				this._SelectPolyBtn.disable();
				this._SelectPolylineBtn.disable();
				
				Ext.getCmp('_select_point_item_menu_id').disable();
				Ext.getCmp('_select_rect_item_menu_id').disable();
				Ext.getCmp('_select_circle_item_menu_id').disable();
				Ext.getCmp('_select_poly_item_menu_id').disable();
				Ext.getCmp('_select_polyline_item_menu_id').disable();
			}
		};
		
		MsExt.Components.LayerControl.EnqueueOnClickHandler(_select_layer, this);
		MsExt.Components.LayerControl.EnqueueRigthClickHandler(_select_layer, this);

		this._is_enable = true;
	}

	this.Disable = function()
	{
		Ext.getCmp('selection_sep_id').hide();
		this._SelectPointBtn.hide();
		this._SelectRectBtn.hide();
		this._SelectCircleBtn.hide();
		this._SelectPolyBtn.hide();
		this._SelectPolylineBtn.hide();
		
		Ext.getCmp('_select_point_item_menu_id').hide();
		Ext.getCmp('_select_rect_item_menu_id').hide();
		Ext.getCmp('_select_circle_item_menu_id').hide();
		Ext.getCmp('_select_poly_item_menu_id').hide();
		Ext.getCmp('_select_polyline_item_menu_id').hide();

		var _plg_query_flag = _query_plg.IsEnable();
		var _plg_search_flag = _search_plugin.IsEnable();

		if(!_plg_query_flag && !_plg_search_flag)
			_clean_selection.Disable();

		this._is_enable = false;
	}

	this.Enable = function()
	{
		Ext.getCmp('selection_sep_id').show();
		this._SelectPointBtn.show();
		this._SelectRectBtn.show();
		this._SelectCircleBtn.show();
		this._SelectPolyBtn.show();
		this._SelectPolylineBtn.show();
		Ext.getCmp('menu_Selección_id').show();
		Ext.getCmp('_select_point_item_menu_id').show();
		Ext.getCmp('_select_rect_item_menu_id').show();
		Ext.getCmp('_select_circle_item_menu_id').show();
		Ext.getCmp('_select_poly_item_menu_id').show();
		Ext.getCmp('_select_polyline_item_menu_id').show();

		var _plg_query_flag = _query_plg.IsEnable();
		var _plg_search_flag = _search_plugin.IsEnable();

		if(!_plg_query_flag && !_plg_search_flag)
			_clean_selection.Enable();

		this._is_enable = true;
	}

	this.IsEnable = function()
	{
		return this._is_enable;
	}
}

var _selection_plg = new Selection();
mainApp.RegisterPlugin(_selection_plg);
