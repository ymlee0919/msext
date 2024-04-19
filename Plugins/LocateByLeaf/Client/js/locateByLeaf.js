
function LocateByLeaf()
{
	this._MapLocateByLeafBtn = null;

	this._locate_by_leaf_win = null;
	
	this._layout_color = '000000';

	this._is_enable = false;
	
	this.UpdateLayoutColor = function(_color)
	{
		document.getElementById('color_layout').style.background = '#' + _color;
		this._layout_color = _color;
	}

	//----------------------------------------------------------------------
	// Stores
	//----------------------------------------------------------------------
	this._store_leafs = new Ext.data.ArrayStore({
			fields: ['leaf'],
			data: [
					['3483-I-a'],
					['3483-I-b'],
					['3483-I-c'],
					['3483-I-d']
				]
	});

	this.GetName = function()
	{
		return 'Localización por hoja 25000';
	}

	this.Init = function()
	{
		var _scope = this;

		this._MapLocateByLeafBtn = new Ext.Button(
		{
			id	 : 'LocateByLeaf',
			tooltip	: 'Centrar la vista sobre una hoja 25000',
			iconCls: 'bt_locate_leaf',
			handler : this.clickPlgLeaf25000.createDelegate(this)
		});

		this._locate_by_leaf_win = new Ext.Window(
		{
			title: 'Vista sobre una hoja 25000',
			iconCls : 'bt_locate_leaf',
			collapsible : true,
			resizable : false,
			closable: false,
			modal: true,
			shadow:'frame',
			width: 250,
			height: 220,
			border:true,
			plain:true,
			layout: 'fit',
			items: [
						new Ext.FormPanel({
				        labelWidth: 100, // label settings here cascade unless overridden
				        frame:true,
						title: 'Opciones',
						id : 'point_location_form',
				        bodyStyle:'padding:5px 5px 0',
				        items: [
									{
										xtype 		: 'combo',
										fieldLabel	: 'Hoja 25000',
										anchor 		: '100%',
										store		: _scope._store_leafs,
										id			: 'leaf',
										emptyText	: '- Seleccione -',
										allowBlank 	: true,
										editable	: true,
										forceSelection 	: true,
										triggerAction	: 'all',
										valueField: 'leaf',
										displayField: 'leaf',
										mode		: 'local'
									},
									{
										xtype 		: 'checkbox',
										fieldLabel	: 'Marco Persistente',
										anchor 		: '100%',
										id			: 'persist_layout',
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
														id : 'color_layout',
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
														text  : '...',
														align : 'center',
														handler : function(){
															MsExt.Common.ColorPalette.Show(this.getPosition()[0],this.getPosition()[1] - 150, _scope._layout_color,_scope.UpdateLayoutColor.createDelegate(_scope));
														}
													}
												]
											}

										]
									}
							]
						})
					],
			buttons:
			[
				{
					id: 'btn_apply',
					text: 'Centrar',
					scope : this,
					listeners	: { 'click' : function() { _scope.LocateByLeaf(Ext.getCmp('leaf').getValue(), Ext.getCmp('persist_layout').getValue(), _scope._layout_color); } }
				},
				{
					text: 'Cerrar',
					handler: function() { _scope._locate_by_leaf_win.hide(); }
				}
			]
		});

		mainApp.AddTBarButton({xtype: 'tbseparator', id: 'locate_by_leaf_sep_id'});
		mainApp.AddTBarButton(this._MapLocateByLeafBtn);
		mainApp.AddHiddenField('leaf_25000_id','leaf_25000_id',0);

		this._is_enable = true;
	}

	this.Disable = function()
	{
		Ext.getCmp('locate_by_leaf_sep_id').hide();
		this._MapLocateByLeafBtn.hide();
		this._is_enable = false;
	}

	this.Enable = function()
	{
		Ext.getCmp('locate_by_leaf_sep_id').show();
		this._MapLocateByLeafBtn.show();
		this._is_enable = true;
	}

	this.IsEnable = function()
	{
		return this._is_enable;
	}


	this.clickPlgLeaf25000 = function ()
	{
		this._locate_by_leaf_win.show();
	}

	this.LocateByLeaf = function(_leaf, _persist, _color)
	{
		BeginPaint();

		Ext.Ajax.request(
			{
				url		: 'Plugins/LocateByLeaf/Server/map_locate_leaf.php',
				method	: 'POST',
				params	: { leaf : _leaf, persist : _persist, color : _color },
				callback: function (options,success,response)
						{
							var responseData = Ext.decode(response.responseText);
							mainApp.UpdateMapPanel(responseData.result);
							Ext.getCmp('leaf_25000_id').setValue(_leaf);
							EndPaint();
						}
			});
		}
}

var _locate_by_leaf_plg = new LocateByLeaf();
mainApp.RegisterPlugin(_locate_by_leaf_plg);